'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center justify-center p-4 text-center bg-black/80 rounded-xl border border-red-500/50 backdrop-blur-md text-red-100 w-80">
                        <AlertTriangle size={32} className="mb-2 text-red-500" />
                        <h2 className="text-lg font-bold mb-1">Load Error</h2>
                        <p className="text-xs opacity-80 mb-4 max-h-32 overflow-y-auto break-words w-full">
                            {this.state.error?.message}
                        </p>
                        <p className="text-[10px] text-neutral-400 mb-4 italic">
                            Tip: For GLTF, try using .glb (binary) files which contain all textures.
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded text-xs transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
