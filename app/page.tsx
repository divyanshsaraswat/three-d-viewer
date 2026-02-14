import Link from 'next/link';
import { ArrowRight, Linkedin } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="h-screen w-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(50,50,50,0.2),rgba(0,0,0,0))] pointer-events-none" />

      <div className="z-10 text-center space-y-8 p-4">
        <h1 className="text-6xl font-bold tracking-tighter bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
          3D Model Viewer
        </h1>
        <p className="text-neutral-400 text-xl max-w-lg mx-auto">
          A simple, powerful way to view and inspect your 3D assets directly in the browser. Supports OBJ, FBX, GLTF, and STL.
        </p>

        <div className="flex items-center justify-center gap-4 pt-8">
          <Link
            href="/editor"
            className="group px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-all active:scale-95 flex items-center gap-2"
          >
            Launch Editor
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="https://www.linkedin.com/in/imdivyanshmv/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-neutral-800 text-white font-semibold rounded-full hover:bg-neutral-700 transition-all border border-neutral-700 flex items-center gap-2"
          >
            <Linkedin size={18} />
            Connect on LinkedIn
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 text-neutral-600 text-sm">
        Built with React Three Fiber & Next.js
      </div>
    </div>
  );
}
