'use client';

import { useMemo } from 'react';
import TextType from './TextType';

export default function LoadingOverlay() {
    const loadingQuotes = [
        "Good architecture takes time. So does loading a good one. Please bear with us while we assemble your digital space.",
        "If great buildings aren’t built in a day, a detailed 3D experience probably shouldn’t be either.",
        "Behind every smooth experience is a slightly stressed rendering engine working very hard right now.",
        "We could have shown you a boring loading bar. Instead, we’re building an entire space for you.",
        "A moment please. Our pixels are currently negotiating with physics to form beautiful structures.",
        "Some people rush design. We prefer building things properly — even if it takes a few seconds longer.",
        "Think of this moment as the calm before you step into a world designed with intention.",
        "Sustainable design is about patience and precision. Your experience is loading with both.",
        "While this loads, imagine walking through a space designed exactly the way you want it.",
        "Rome wasn’t built in a day. Your 3D experience will be ready much faster though.",
        "Every great structure begins with a blueprint. This one begins with a loading screen.",
        "We’re currently arranging thousands of polygons so your imagination gets a place to live.",
        "Good design is invisible. Until you render it in 3D.",
        "While you wait, remember: the best spaces are those built thoughtfully.",
        "This pause is temporary. Good architecture lasts forever.",
        "If design was instant, architects would be out of jobs. Luckily, this takes a moment.",
        "Loading sustainable structures… because the future deserves better spaces.",
        "Our rendering engine is currently turning ideas into dimensions.",
        "Great experiences are built layer by layer. Yours is almost ready.",
        "Behind this screen, geometry is becoming architecture.",
        "A few seconds of patience for a much better perspective.",
        "While this loads, consider how much engineering goes into something that feels simple.",
        "Innovation takes a moment. Especially when it’s in 3D.",
        "We promise this is faster than building the real structure.",
        "If creativity had a loading bar, it would probably look like this.",
        "Our servers are currently assembling walls, spaces, and possibilities.",
        "Not all loading screens are wasted time. Some are the doorway to better ideas.",
        "Every polygon you see later is currently being politely placed into position.",
        "While you wait, imagine the space you wish existed. We might already be building it.",
        "The best environments are not rushed — even digital ones.",
        "A small pause now for a smoother experience ahead.",
        "The system is currently convincing thousands of pixels to behave like architecture.",
        "We’re building a digital space where ideas can actually be explored.",
        "Good design should feel effortless. Making it that way is the hard part.",
        "Rendering innovation in progress.",
        "You’re about to enter a space where imagination meets structure.",
        "Precision takes time. Even in the digital world.",
        "Somewhere inside this server, geometry is becoming design.",
        "Our processors are currently doing architectural yoga to align everything perfectly.",
        "Just a moment — your immersive experience is putting on its finishing touches.",
        "A thoughtful space deserves a thoughtful loading time.",
        "Not all waiting is wasted. Sometimes it’s preparation.",
        "Think of this as the digital equivalent of watching a building rise floor by floor.",
        "While you wait, remember that great spaces shape great ideas.",
        "Loading the architecture of possibilities.",
        "Because the future of design should be experienced, not just imagined.",
        "A moment of patience now for a better perspective later.",
        "Every great experience begins with a small pause.",
        "Turning imagination into navigable spaces.",
        "Almost there. Your next perspective is loading."
    ];

    const shuffledQuotes = useMemo(() => {
        const arr = [...loadingQuotes];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }, []);

    return (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <div className="flex flex-col items-center justify-center bg-black/80 text-white p-6 md:p-8 rounded-2xl backdrop-blur-md shadow-2xl border border-white/10 max-w-[90vw] md:max-w-xl text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-[#ccff00] border-t-transparent rounded-full animate-spin mb-4 md:mb-6" />
                <TextType
                    text={shuffledQuotes}
                    typingSpeed={30}
                    deletingSpeed={10}
                    pauseDuration={3000}
                    loop={true}
                    className="text-sm md:text-base lg:text-lg font-medium tracking-wide"
                />
            </div>
        </div>
    );
}
