import { useState, useEffect } from 'react';

// Seeded random number generator for consistent mock data
const seededRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
}


export function useMentorStats(userId: string | undefined) {
    // Default stats for new users/unauthenticated
    const defaultStats = {
        sessions: 0,
        answers: 0,
        rating: 5.0,
        requests: [],
        questions: [],
    };

    if (!userId) return defaultStats;

    // Generate deterministic stats based on User ID
    const seed = userId + "stats_v1";
    const rand = () => seededRandom(seed + Math.random()); // Just simple randomization for now, but keyed to user if we wanted strict determinism we'd remove Math.random()
    // Actually, let's make it stable based on userId for demo purposes
    const stableRand = (modifier: string) => seededRandom(seed + modifier);

    const sessionCount = Math.floor(stableRand('sessions') * 50) + 1; // 1-50 sessions
    const answerCount = Math.floor(stableRand('answers') * 100) + 5;  // 5-105 answers
    const rating = (4.0 + (stableRand('rating') * 1.0)).toFixed(1);   // 4.0 - 5.0 rating

    return {
        sessions: sessionCount,
        answers: answerCount,
        rating: rating,
        requests: [
             {
                 id: 1,
                 name: stableRand('req1') > 0.5 ? "Sarah J." : "Jordan P.",
                 role: "Founder",
                 tags: ["Fintech"],
                 image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
             },
             {
                 id: 2,
                 name: stableRand('req2') > 0.5 ? "Mike T." : "Alex K.",
                 role: "Product",
                 tags: ["MedTech"],
                 image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100"
             }
        ],
        questions: [
            {
                id: 101,
                author: "Elena R.",
                time: "2h ago",
                text: "How do I validate my MVP with absolutely zero marketing budget?",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100",
                tags: ["Bootstrapping"]
            },
            {
                id: 102,
                author: "James K.",
                time: "5h ago",
                text: "Best IP strategy for early stage SaaS?",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100",
                tags: ["Legal"]
            }
        ]
    };
}
