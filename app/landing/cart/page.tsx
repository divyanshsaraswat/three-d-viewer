"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useTheme } from "next-themes";

const initialCart = [
    {
        id: 1,
        name: "TRACK SUIT",
        category: "CLOTHING",
        quantity: 3,
        price: 100,
        image: "suit", // We'll render an abstract representation for modern feel
    },
    {
        id: 2,
        name: "HOODIE",
        category: "CLOTHING",
        quantity: 3,
        price: 67,
        image: "hoodie",
    },
    {
        id: 3,
        name: "GREY HOODIE",
        category: "CLOTHING",
        quantity: 2,
        price: 59,
        image: "grey_hoodie",
    }
];

export default function CartPage() {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    // State for cart
    const [cart, setCart] = useState(initialCart);
    const [promo, setPromo] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    const updateQuantity = (id: number, delta: number) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeItem = (id: number) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 5; // Flat rate shipping for example
    const total = subtotal + shipping;

    // Prevent hydration mismatch for theme-dependent colors (though we use CSS classes mostly)
    if (!mounted) return <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-500" />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-500 py-12 px-4 md:px-8 font-sans flex items-center justify-center">
            <div className="max-w-[1100px] w-full mx-auto bg-white dark:bg-[#111111] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden flex flex-col md:flex-row border border-black/5 dark:border-white/5 transition-colors duration-500">

                {/* ---------- LEFT COLUMN: SHOPPING CART ---------- */}
                <div className="flex-1 p-8 md:p-14 border-b md:border-b-0 border-black/5 dark:border-white/5">
                    <div className="flex justify-between items-end border-b border-black/10 dark:border-white/10 pb-6 mb-8">
                        <h1 className="text-3xl font-bold tracking-tighter uppercase">YOUR SHOPPING CART</h1>
                        <span className="text-xl font-bold">{totalItems} ITEMS</span>
                    </div>

                    {/* Desktop Headers */}
                    <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
                        <div className="col-span-6">ITEM INFO</div>
                        <div className="col-span-3 text-center">QUANTITY</div>
                        <div className="col-span-2 text-right">PRICE</div>
                        <div className="col-span-1 text-right">TOTAL</div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-8">
                        {cart.map((item) => (
                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                {/* Item Info */}
                                <div className="col-span-1 md:col-span-6 flex items-start gap-6">
                                    {/* Abstract Item Image Placeholder to match theme */}
                                    <div className="w-24 h-32 shrink-0 bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl flex items-center justify-center border border-black/5 dark:border-white/5 transition-colors">
                                        <div className="relative w-12 h-16 flex items-center justify-center">
                                            <div className="absolute inset-0 bg-[#ccff00] transform -skew-x-12 opacity-80 rounded-sm" />
                                            <div className="absolute inset-2 border-2 border-[#171717] mix-blend-overlay rounded-sm" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center py-2 h-full">
                                        <h3 className="font-bold text-lg leading-tight mb-1 uppercase tracking-tight">{item.name}</h3>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-widest mb-4">{item.category}</p>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-sm font-medium text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-2 self-start"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Controls: Qty */}
                                <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center">
                                    <span className="md:hidden text-xs font-bold text-gray-400 uppercase tracking-widest">Quantity</span>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="text-gray-400 hover:text-black dark:hover:text-white transition-colors p-1"
                                        >
                                            <Minus size={16} strokeWidth={3} />
                                        </button>
                                        <div className="w-10 h-10 flex items-center justify-center border border-black/10 dark:border-white/10 rounded-xl font-medium text-sm">
                                            {item.quantity}
                                        </div>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="text-gray-400 hover:text-black dark:hover:text-white transition-colors p-1"
                                        >
                                            <Plus size={16} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center">
                                    <span className="md:hidden text-xs font-bold text-gray-400 uppercase tracking-widest">Price</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">£ {item.price}</span>
                                </div>

                                {/* Total */}
                                <div className="col-span-1 md:col-span-1 flex justify-between md:justify-end items-center">
                                    <span className="md:hidden text-xs font-bold text-gray-400 uppercase tracking-widest">Total</span>
                                    <span className="text-sm font-bold tracking-wide text-black dark:text-[#ccff00]">£ {item.price * item.quantity}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {cart.length === 0 && (
                        <div className="text-center py-16 text-gray-400 font-medium tracking-wide">
                            Your shopping cart is currently empty.
                        </div>
                    )}

                    <div className="mt-12 pt-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-gray-400 hover:text-black dark:hover:text-white transition-colors group">
                            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
                            Back to shop
                        </Link>
                    </div>
                </div>

                {/* ---------- RIGHT COLUMN: ORDER SUMMARY ---------- */}
                <div className="w-full md:w-[420px] bg-gray-100 dark:bg-[#151515] p-8 md:p-14 flex flex-col border-l border-black/5 dark:border-white/5 transition-colors duration-500">
                    <h2 className="text-2xl font-bold tracking-tighter border-b border-black/10 dark:border-white/10 pb-6 mb-8 uppercase">
                        Order Summary
                    </h2>

                    <div className="flex justify-between items-center mb-8 text-sm font-medium">
                        <span className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Items {totalItems}</span>
                        <span className="font-bold tracking-wide">£ {subtotal}</span>
                    </div>

                    <div className="mb-8">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Shipping</label>
                        <div className="relative">
                            <select className="w-full p-4 bg-white dark:bg-[#1f1f1f] border border-black/5 dark:border-white/5 rounded-2xl appearance-none text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ccff00] cursor-pointer transition-shadow shadow-sm dark:shadow-none">
                                <option>Standard delivery - £ 5.00</option>
                                <option>Express delivery - £ 15.00</option>
                                <option>Next day delivery - £ 25.00</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Promo Code</label>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Enter your code"
                                value={promo}
                                onChange={(e) => setPromo(e.target.value)}
                                className="w-full p-4 bg-white dark:bg-[#1f1f1f] border border-black/5 dark:border-white/5 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ccff00] transition-shadow shadow-sm dark:shadow-none placeholder:text-gray-400"
                            />
                            <button className="bg-[#ccff00] hover:bg-[#b3e600] text-black text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-2xl transition-all shadow-[0_4px_14px_rgba(204,255,0,0.3)] hover:shadow-[0_6px_20px_rgba(204,255,0,0.4)] block w-max">
                                Apply
                            </button>
                        </div>
                    </div>

                    <div className="mt-auto border-t border-black/10 dark:border-white/10 pt-8">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-sm font-bold uppercase tracking-widest">Total</span>
                            <span className="text-2xl font-bold tracking-tight">£ {total}</span>
                        </div>

                        <button className="w-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] hover:bg-[#ccff00] dark:hover:bg-[#ccff00] hover:text-[#171717] dark:hover:text-[#171717] font-bold uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl hover:shadow-[0_8px_30px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2">
                            Checkout
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
