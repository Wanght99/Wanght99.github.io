'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { ArrowTopRightOnSquareIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { CardPageConfig } from '@/types/page';
import { useMessages } from '@/lib/i18n/useMessages';

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
    ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
    li: ({ children }: React.ComponentProps<'li'>) => <li className="mb-1">{children}</li>,
    a: ({ ...props }) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
        />
    ),
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    const messages = useMessages();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <div className={`markdown ${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl leading-relaxed`}>
                        <ReactMarkdown components={markdownComponents}>
                            {config.description}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                {config.items.map((item, index) => {
                    const isExpanded = expandedIndex === index;
                    const hasDetails = item.location || item.date || item.organizer || item.coOrganizers || item.supporting || item.presentation;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className={`bg-white dark:bg-neutral-900 ${embedded ? "p-4" : "p-6"} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
                        >
                            <div className="flex flex-col md:flex-row gap-5">
                                {item.image && (
                                    <div className="w-full md:w-48 flex-shrink-0">
                                        <div className="aspect-video md:aspect-[4/3] relative rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                            <Image
                                                src={item.image.startsWith('/') ? item.image : `/${item.image}`}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 200px"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary sm:text-justify`}>
                                            {item.title}
                                        </h3>
                                    </div>

                                    {item.subtitle && (
                                        <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium mb-3 sm:text-justify`}>
                                            {item.subtitle}
                                        </p>
                                    )}

                                    {item.content && (
                                        <div className={`markdown ${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-relaxed`}>
                                            <ReactMarkdown components={markdownComponents}>
                                                {item.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}

                                    {item.tags && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {item.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {hasDetails && (
                                        <button
                                            type="button"
                                            onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                            aria-expanded={isExpanded}
                                            aria-controls={`conference-details-${index}`}
                                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
                                        >
                                            {messages.conferences.details}
                                            <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                        </button>
                                    )}

                                    <AnimatePresence initial={false}>
                                        {isExpanded && hasDetails && (
                                            <motion.div
                                                id={`conference-details-${index}`}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <dl className="mt-4 space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-700 dark:bg-neutral-800/60">
                                                    {item.location && (
                                                        <div className="grid grid-cols-1 gap-y-1 sm:grid-cols-[8rem_1fr] sm:gap-x-3">
                                                            <dt className="font-medium text-primary">{messages.conferences.location}</dt>
                                                            <dd className="text-neutral-600 dark:text-neutral-400">{item.location}</dd>
                                                        </div>
                                                    )}
                                                    {item.date && (
                                                        <div className="grid grid-cols-1 gap-y-1 sm:grid-cols-[8rem_1fr] sm:gap-x-3">
                                                            <dt className="font-medium text-primary">{messages.conferences.date}</dt>
                                                            <dd className="text-neutral-600 dark:text-neutral-400">{item.date}</dd>
                                                        </div>
                                                    )}
                                                    {item.organizer && (
                                                        <div className="grid grid-cols-1 gap-y-1 sm:grid-cols-[8rem_1fr] sm:gap-x-3">
                                                            <dt className="font-medium text-primary">{messages.conferences.organizer}</dt>
                                                            <dd className="text-neutral-600 dark:text-neutral-400">{item.organizer}</dd>
                                                        </div>
                                                    )}
                                                    {item.coOrganizers && (
                                                        <div className="grid grid-cols-1 gap-y-1 sm:grid-cols-[8rem_1fr] sm:gap-x-3">
                                                            <dt className="font-medium text-primary">{messages.conferences.coOrganizers}</dt>
                                                            <dd className="text-neutral-600 dark:text-neutral-400">{item.coOrganizers}</dd>
                                                        </div>
                                                    )}
                                                    {item.supporting && (
                                                        <div className="grid grid-cols-1 gap-y-1 sm:grid-cols-[8rem_1fr] sm:gap-x-3">
                                                            <dt className="font-medium text-primary">{messages.conferences.supporting}</dt>
                                                            <dd className="text-neutral-600 dark:text-neutral-400">{item.supporting}</dd>
                                                        </div>
                                                    )}
                                                    {item.presentation && (
                                                        <div className="grid grid-cols-1 gap-y-1 sm:grid-cols-[8rem_1fr] sm:gap-x-3">
                                                            <dt className="font-medium text-primary">{messages.conferences.presentation}</dt>
                                                            <dd className="text-neutral-600 dark:text-neutral-400">
                                                                <span className="block sm:text-justify">{item.presentation}</span>
                                                                {item.content && (
                                                                    <span className="mt-1 block text-xs text-neutral-500 dark:text-neutral-500">{item.content}</span>
                                                                )}
                                                            </dd>
                                                        </div>
                                                    )}
                                                </dl>
                                                {item.link && (
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
                                                    >
                                                        {messages.conferences.eventPage}
                                                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                                    </a>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
