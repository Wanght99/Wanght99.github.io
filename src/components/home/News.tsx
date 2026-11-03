'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
    date: string;
    content: string;
    image?: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{resolvedTitle}</h2>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <span className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">{item.date}</span>
                        <div className="min-w-0 flex-1">
                            <p className="prose-justify text-sm text-neutral-700">{item.content}</p>
                            {item.image && (
                                <Image
                                    src={item.image}
                                    alt={item.content}
                                    width={1295}
                                    height={1575}
                                    className="mt-3 h-auto w-full max-w-md rounded-lg border border-neutral-200"
                                    sizes="(max-width: 768px) 100vw, 448px"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
