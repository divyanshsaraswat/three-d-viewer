'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore, CameraBookmark } from '@/store/useStore';
import { ChevronUp, ChevronDown, Plus, Trash2, Camera, Eye, Download, Upload } from 'lucide-react';

export default function CameraBookmarks() {
    const [expanded, setExpanded] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    const bookmarks = useStore(state => state.bookmarks);
    const triggerCapture = useStore(state => state.triggerCapture);
    const removeBookmark = useStore(state => state.removeBookmark);
    const updateBookmark = useStore(state => state.updateBookmark);
    const setBookmarks = useStore(state => state.setBookmarks);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-expand when bookmarks are loaded (e.g. from switching models)
    useEffect(() => {
        if (bookmarks.length > 0) {
            setExpanded(true);
        } else {
            setExpanded(false);
        }
    }, [bookmarks.length]);

    const handleRestore = (bookmark: CameraBookmark) => {
        window.dispatchEvent(new CustomEvent('restore-bookmark', { detail: bookmark }));
    };

    const handleExport = () => {
        const data = JSON.stringify(bookmarks, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'camera-bookmarks.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (Array.isArray(json)) {
                    // Simple validation
                    const valid = json.every(b => b.id && b.position && b.rotation);
                    if (valid) {
                        setBookmarks(json);
                        alert('Bookmarks imported successfully!');
                    } else {
                        alert('Invalid bookmark file format.');
                    }
                }
            } catch (err) {
                console.error('Failed to parse bookmarks', err);
                alert('Failed to parse JSON file.');
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = '';
    };

    return (
        <div
            className={`text-white rounded-lg shadow-xl border border-white/10 transition-all duration-300 flex flex-col ${expanded ? 'h-96 w-64' : 'h-10 w-48'}`}
            style={{ backgroundColor: '#121212' }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
        >

            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-between px-3 py-2 w-full hover:bg-white/5 rounded-t-lg transition-colors"
            >
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Camera size={16} className="text-[#ccff00]" />
                    <span>Saved Views ({bookmarks.length})</span>
                </div>
                {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>

            {/* Content (only when expanded) */}
            {expanded && (
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-neutral-600">
                        {bookmarks.length === 0 ? (
                            <div className="text-center text-xs text-neutral-500 mt-8">
                                No saved views.<br />Move camera and click +
                            </div>
                        ) : (
                            bookmarks.map(b => (
                                <div key={b.id} className="group p-2 rounded border border-white/5 hover:border-[#ccff00]/30 transition-colors flex items-center justify-between" style={{ backgroundColor: '#1a1a1a' }}>
                                    {editingId === b.id ? (
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            onBlur={() => {
                                                if (editName.trim()) updateBookmark(b.id, editName.trim());
                                                setEditingId(null);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    if (editName.trim()) updateBookmark(b.id, editName.trim());
                                                    setEditingId(null);
                                                }
                                                if (e.key === 'Escape') {
                                                    setEditingId(null);
                                                }
                                            }}
                                            autoFocus
                                            className="flex-1 bg-black text-xs px-2 py-1 rounded border border-[#ccff00]/40 outline-none text-white overflow-hidden min-w-0"
                                        />
                                    ) : (
                                        <button
                                            onClick={() => handleRestore(b)}
                                            onDoubleClick={() => {
                                                setEditingId(b.id);
                                                setEditName(b.name);
                                            }}
                                            className="flex-1 text-left text-xs truncate hover:text-[#ccff00] flex items-center gap-2 overflow-hidden"
                                            title="Double click to rename"
                                        >
                                            <Eye size={12} className="opacity-50 shrink-0" />
                                            <span className="truncate">{b.name}</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => removeBookmark(b.id)}
                                        className="text-neutral-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-2 border-t border-white/5 space-y-2">
                        <button
                            onClick={triggerCapture}
                            className="w-full flex items-center justify-center gap-2 text-black py-1.5 rounded text-xs transition-colors font-medium hover:opacity-90" style={{ backgroundColor: '#ccff00' }}
                        >
                            <Plus size={14} /> Add Current View
                        </button>

                        <div className="flex gap-2">
                            <button
                                onClick={handleExport}
                                className="flex-1 flex items-center justify-center gap-2 text-neutral-300 py-1.5 rounded text-xs transition-colors border border-white/10 hover:border-[#ccff00]/30" style={{ backgroundColor: '#1a1a1a' }}
                                title="Download JSON"
                            >
                                <Download size={12} /> Save
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 flex items-center justify-center gap-2 text-neutral-300 py-1.5 rounded text-xs transition-colors border border-white/10 hover:border-[#ccff00]/30" style={{ backgroundColor: '#1a1a1a' }}
                                title="Import JSON"
                            >
                                <Upload size={12} /> Load
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImport}
                            accept=".json"
                            className="hidden"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
