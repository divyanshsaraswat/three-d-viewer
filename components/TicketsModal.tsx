"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { 
  X, MessageSquare, Clock, ArrowLeft, Send, 
  CheckCircle2, AlertCircle, Loader2, Tag, RefreshCw, Plus
} from "lucide-react";
import { 
  getTickets, getTicketById, replyToTicket, closeTicket, createTicket,
  type Ticket, type TicketMessage, type CreateTicketPayload 
} from "@/utils/api/tickets";

const IS_DEV = process.env.NEXT_PUBLIC_EDITOR_MODE !== "prod";

interface TicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TicketsModal({ isOpen, onClose }: TicketsModalProps) {
  const { data: session } = useSession();
  const token = (session?.user as any)?.accessToken;

  // Animation States
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Data States
  const [view, setView] = useState<"list" | "chat" | "create">("list");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Chat States
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  // Create Form States
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    subject: "",
    type: "support",
    priority: "medium",
    message: ""
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // SWR for polling active chat
  const { data: polledTicket, mutate: mutateTicket } = useSWR(
    (view === "chat" && activeTicket?.ticketId && token) ? ["ticket", activeTicket.ticketId] : null,
    async ([, id]) => {
      const res = await getTicketById(token, id as string);
      if (res.success && res.data) {
        return (res.data as any).ticket || res.data;
      }
      return null;
    },
    { refreshInterval: 5000, revalidateOnFocus: true }
  );

  useEffect(() => {
    if (polledTicket && view === "chat") {
      // Prevent losing optimistic reply state by checking if local message count is higher
      setActiveTicket((prev) => {
        if (!prev) return polledTicket;
        if ((prev.messages?.length || 0) > (polledTicket.messages?.length || 0)) {
          return prev;
        }
        return polledTicket;
      });
    }
  }, [polledTicket, view]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let rafId: number;
    
    if (isOpen) {
      setShouldRender(true);
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => setIsVisible(true));
      });
      if (token && view === "list") {
        fetchTickets();
      }
    } else {
      setIsVisible(false);
      timeoutId = setTimeout(() => {
        setShouldRender(false);
        setView("list");
        setActiveTicket(null);
      }, 500); 
    }
    
    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [isOpen, token]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (view === "chat" && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTicket?.messages, view]);

  const fetchTickets = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await getTickets(token, { limit: 50 });
      if (res.success && res.data) {
        setTickets(res.data.tickets);
      }
    } catch (e) {
      if (IS_DEV) console.error("Failed to fetch tickets", e);
    } finally {
      setIsLoading(false);
    }
  };

  const openTicket = async (ticketId: string) => {
    if (!token) return;
    // Optimistically set view to show skeleton or loader
    setView("chat");
    setIsLoading(true);
    try {
      const res = await getTicketById(token, ticketId);
      if (res.success && res.data) {
        const ticketData = (res.data as any).ticket || res.data;
        setActiveTicket(ticketData);
      } else {
        setView("list"); // Revert if failed
      }
    } catch (e) {
      if (IS_DEV) console.error("Failed to open ticket", e);
      setView("list");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!token || !activeTicket || !replyText.trim()) return;
    setIsSending(true);
    try {
      const res = await replyToTicket(token, activeTicket.ticketId, { message: replyText.trim() });
      const newMessage = res.data?.message;
      if (res.success && newMessage) {
        // Optimistically append the message to the chat
        setActiveTicket((prev) => {
          if (!prev) return prev;
          const updated: Ticket = {
            ...prev,
            messages: [...(prev.messages || []), newMessage as TicketMessage],
            status: "awaiting_staff" as any
          };
          if (mutateTicket) mutateTicket(updated, false); // Update SWR cache to prevent immediate override
          return updated;
        });
        setReplyText("");
      }
    } catch (e) {
      if (IS_DEV) console.error("Failed to send reply", e);
    } finally {
      setIsSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!token || !activeTicket) return;
    const confirmClose = window.confirm("Are you sure you want to close this ticket?");
    if (!confirmClose) return;

    setIsClosing(true);
    try {
      const res = await closeTicket(token, activeTicket.ticketId);
      if (res.success) {
        setActiveTicket((prev) => prev ? { ...prev, status: "closed" } : null);
        fetchTickets(); // refresh list in background
      }
    } catch (e) {
      if (IS_DEV) console.error("Failed to close ticket", e);
    } finally {
      setIsClosing(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!token || !createForm.subject || !createForm.message) return;
    setIsCreating(true);
    try {
      const res = await createTicket(token, {
        type: createForm.type as any,
        businessType: (session?.user as any)?.businessType || "d2c",
        subject: createForm.subject,
        message: createForm.message,
        priority: createForm.priority as any
      });
      if (res.success && res.data) {
        setView("list");
        fetchTickets();
        setCreateForm({ subject: "", type: "support", priority: "medium", message: "" });
      } else {
        if (IS_DEV) console.error("Ticket creation API failed:", res.error, res);
      }
    } catch (e) {
      if (IS_DEV) console.error("Caught exception creating ticket:", e);
    } finally {
      setIsCreating(false);
    }
  };

  // Helper for Status Badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "open":
      case "awaiting_staff":
        return <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">Active</span>;
      case "awaiting_customer":
        return <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">Action Required</span>;
      case "closed":
      case "resolved":
        return <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 border border-black/10 dark:border-white/10">Closed</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5">{status}</span>;
    }
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6" style={{ perspective: '1000px' }}>
      
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-md transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-[800px] h-[85vh] flex flex-col bg-white/95 dark:bg-[#0a0a0a] backdrop-blur-3xl rounded-[24px] shadow-2xl dark:shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-black/10 dark:border-white/10 overflow-hidden transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'scale-100 translate-y-0 opacity-100 rotate-x-0' : 'scale-95 translate-y-8 opacity-0 pointer-events-none -rotate-x-2'}`}
      >
        
        {/* HEADER */}
        <div className="flex-shrink-0 flex items-center justify-between p-5 border-b border-black/5 dark:border-white/5 bg-[#f5f5f5]/80 dark:bg-[#111111]/80 backdrop-blur-md relative z-20">
          <div className="flex items-center gap-4">
            {view === "chat" || view === "create" ? (
              <button 
                onClick={() => { setView("list"); fetchTickets(); }}
                className="w-8 h-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors border border-black/5 dark:border-white/5"
              >
                <ArrowLeft size={16} />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#ccff00]/10 flex items-center justify-center">
                <MessageSquare size={16} className="text-[#8aab00] dark:text-[#ccff00]" />
              </div>
            )}
            
            <h2 className="text-[13px] font-black tracking-[0.1em] uppercase text-black/80 dark:text-white/90">
              {view === "chat" ? "Support Thread" : view === "create" ? "New Ticket" : "Manage Tickets"}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {view === "chat" && activeTicket && (
              <button
                onClick={() => openTicket(activeTicket.ticketId)}
                disabled={isLoading}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-black/60 dark:text-white/60"
                title="Refresh Chat"
              >
                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              </button>
            )}
            {view === "list" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("create")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ccff00]/10 hover:bg-[#ccff00]/20 border border-[#ccff00]/20 transition-colors text-[#8aab00] dark:text-[#ccff00] text-[10px] uppercase font-bold tracking-widest"
                >
                  <Plus size={12} /> New Ticket
                </button>
                <button
                  onClick={() => fetchTickets()}
                  disabled={isLoading}
                  className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-black/60 dark:text-white/60"
                  title="Refresh Tickets"
                >
                  <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                </button>
              </div>
            )}
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-black/50 dark:text-white"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-hidden relative flex bg-transparent">
          
          {/* LIST VIEW */}
          {view === "list" && (
            <div className="absolute inset-0 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-black/30 dark:text-white/30 space-y-4">
                  <Loader2 size={24} className="animate-spin" />
                  <p className="text-[11px] font-bold uppercase tracking-widest">Loading Tickets...</p>
                </div>
              ) : tickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex items-center justify-center mb-4 text-black/20 dark:text-white/20">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-[14px] font-bold text-black/80 dark:text-white/80 mb-1">No Active Tickets</p>
                  <p className="text-[12px] font-medium text-black/40 dark:text-white/40 max-w-[280px]">
                    You have not opened any support or sales inquiries yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((ticket) => {
                    const date = new Date(ticket.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    
                    return (
                      <div 
                        key={ticket.ticketId}
                        onClick={() => openTicket(ticket.ticketId)}
                        className="group relative cursor-pointer bg-white dark:bg-[#141414] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-4 hover:bg-black/[0.02] dark:hover:bg-[#1a1a1a] transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none"
                      >
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-[15px] text-black/90 dark:text-white/90 mb-1.5 group-hover:text-[#8aab00] dark:group-hover:text-[#ccff00] transition-colors tracking-tight line-clamp-1">
                              {ticket.subject}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase font-bold tracking-wider text-black/40 dark:text-white/40">
                              <span className="flex items-center gap-1"><Clock size={10} /> {date}</span>
                              <span className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
                              <span className="text-[#8aab00] dark:text-[#ccff00]">{ticket.ticketId}</span>
                              <span className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
                              <span>{ticket.type}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-[10px] font-black uppercase tracking-widest text-right">
                            {getStatusBadge(ticket.status)}
                          </div>
                        </div>
                        
                        {/* Preview Latest string */}
                        {ticket.latestMessage && (
                          <div className="relative pl-3 border-l-2 border-black/10 dark:border-white/10">
                            <p className="text-[13px] text-black/60 dark:text-white/60 line-clamp-1">
                              <span className="font-bold mr-1 opacity-70">
                                {ticket.latestMessage.sender === 'admin' ? 'Support:' : 'You:'}
                              </span>
                              {ticket.latestMessage.message}
                            </p>
                          </div>
                        )}
                        
                        {ticket.unreadCount && ticket.unreadCount > 0 ? (
                           <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-red-500/20">
                             {ticket.unreadCount}
                           </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* CHAT VIEW */}
          {view === "chat" && (
            <div className="absolute inset-0 flex flex-col">
              
              {/* Ticket Info Strip */}
              {activeTicket && (
                <div className="flex-shrink-0 px-5 py-3 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-[10px] font-black uppercase tracking-widest">
                      {getStatusBadge(activeTicket.status)}
                    </div>
                    <span className="text-black/30 dark:text-white/30">|</span>
                    <span className="text-[11px] font-bold text-black/60 dark:text-white/60 tracking-wide line-clamp-1 max-w-[300px]">
                      {activeTicket.subject}
                    </span>
                  </div>
                  {activeTicket.status !== "closed" && activeTicket.status !== "resolved" && (
                    <button 
                      onClick={handleCloseTicket}
                      disabled={isClosing}
                      className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20"
                    >
                      {isClosing ? 'Closing...' : 'Close Ticket'}
                    </button>
                  )}
                </div>
              )}

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 size={24} className="animate-spin text-black/30 dark:text-white/30" />
                  </div>
                ) : activeTicket?.messages?.length ? (
                  activeTicket.messages.map((msg, idx) => {
                    const isCustomer = msg.sender === 'customer';
                    const time = new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                    
                    return (
                      <div key={idx} className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/30 mb-1.5 px-1">
                          {isCustomer ? 'You' : msg.sender === 'rag' ? 'Assistant' : 'Weinix Support'} • {time}
                        </div>
                        <div 
                          className={`relative max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl whitespace-pre-wrap text-[14px] leading-relaxed shadow-sm
                            ${isCustomer 
                              ? 'bg-black dark:bg-[#ccff00] text-white dark:text-black rounded-tr-sm' 
                              : 'bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 text-black/80 dark:text-white/80 rounded-tl-sm'
                            }
                          `}
                        >
                          {msg.message}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-black/40 dark:text-white/40">
                    <Tag size={20} className="mb-2 opacity-50" />
                    <p className="text-[12px] font-medium">No messages found in this thread.</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              {activeTicket && activeTicket.status !== "closed" && activeTicket.status !== "resolved" && (
                <div className="flex-shrink-0 p-4 border-t border-black/5 dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
                  <div className="relative flex items-end gap-2 bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-xl p-2 transition-colors focus-within:border-black/30 dark:focus-within:border-white/30 focus-within:bg-black/[0.05] dark:focus-within:bg-white/[0.05]">
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full bg-transparent border-none outline-none resize-none min-h-[44px] max-h-[150px] p-2 text-[14px] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 scrollbar-thin"
                      rows={Math.min(5, Math.max(1, replyText.split('\n').length))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                    />
                    <button 
                      onClick={handleSendReply}
                      disabled={isSending || !replyText.trim()}
                      className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#8aab00] dark:bg-[#ccff00] hover:bg-[#728e00] dark:hover:bg-[#b3e600] text-white dark:text-black flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-0.5"
                    >
                      {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5 translate-y-[0.5px]" />}
                    </button>
                  </div>
                  <p className="text-[9px] text-center mt-2 font-medium tracking-wide text-black/40 dark:text-white/40">
                    Press <kbd className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-sans mx-0.5">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-sans mx-0.5">Shift + Enter</kbd> for new line
                  </p>
                </div>
              )}

              {/* Closed State Footer */}
              {activeTicket && (activeTicket.status === "closed" || activeTicket.status === "resolved") && (
                <div className="flex-shrink-0 p-4 border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-center gap-2 text-black/50 dark:text-white/50">
                   <AlertCircle size={14} />
                   <p className="text-[12px] font-bold">This ticket is closed and cannot receive new replies.</p>
                </div>
              )}
              
            </div>
          )}

          {/* CREATE VIEW */}
          {view === "create" && (
            <div className="absolute inset-0 overflow-y-auto p-5 sm:p-8 scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent flex justify-center">
              <div className="max-w-xl w-full space-y-6 pt-4">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={20} className="text-[#8aab00] dark:text-[#ccff00]" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-black/90 dark:text-white/90">Open a New Ticket</h3>
                  <p className="text-[13px] font-medium text-black/40 dark:text-white/40 mt-1">Our support team will get back to you shortly.</p>
                </div>
                
                <div className="space-y-5 bg-white xl:bg-white/50 dark:bg-[#141414] xl:dark:bg-[#141414]/50 p-6 sm:p-8 rounded-[24px] border border-black/5 dark:border-white/5 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-black/40 dark:text-white/40 pl-1">Category</label>
                      <select 
                        value={createForm.type}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-xl p-3 text-[13px] text-black dark:text-white outline-none focus:border-[#ccff00]/50 focus:bg-transparent transition-colors"
                      >
                        <option value="support">Support</option>
                        <option value="inquiry">General Inquiry</option>
                        <option value="sales">Sales</option>
                        <option value="complaint">Complaint</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-black/40 dark:text-white/40 pl-1">Priority</label>
                      <select 
                        value={createForm.priority}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-xl p-3 text-[13px] text-black dark:text-white outline-none focus:border-[#ccff00]/50 focus:bg-transparent transition-colors"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-black/40 dark:text-white/40 pl-1">Subject</label>
                    <input 
                      type="text"
                      placeholder="Briefly describe the issue..."
                      value={createForm.subject}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-xl p-3 text-[13px] text-black dark:text-white outline-none focus:border-[#ccff00]/50 focus:bg-transparent transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-black/40 dark:text-white/40 pl-1">Message</label>
                    <textarea 
                      placeholder="Provide more details..."
                      rows={5}
                      value={createForm.message}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-xl p-3 text-[13px] text-black dark:text-white outline-none focus:border-[#ccff00]/50 focus:bg-transparent transition-colors resize-none"
                    />
                  </div>
                  
                  <button
                    onClick={handleCreateTicket}
                    disabled={isCreating || !createForm.subject || !createForm.message}
                    className="w-full py-3.5 rounded-xl bg-[#ccff00] text-black font-bold uppercase tracking-widest text-[12px] hover:bg-[#b3e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#ccff00]/20"
                  >
                    {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {isCreating ? 'Submitting...' : 'Submit Ticket'}
                  </button>
                  
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
