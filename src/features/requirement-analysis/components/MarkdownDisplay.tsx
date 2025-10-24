import React from 'react';

interface MarkdownDisplayProps {
    content: string;
    className?: string;
}

export default function MarkdownDisplay({ content, className = '' }: MarkdownDisplayProps) {
    // Simple markdown parser for basic formatting
    const parseMarkdown = (text: string): string => {
        if (!text) return '';

        let html = text;

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-6">$1</h1>');

        // Bold text
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');

        // Italic text
        html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-purple-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

        // Code blocks
        html = html.replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
            return `<div class="my-4">
                ${lang ? `<div class="bg-gray-800 text-gray-200 text-xs px-3 py-1 rounded-t-lg font-mono">${lang}</div>` : ''}
                <pre class="bg-gray-900 text-gray-100 p-4 ${lang ? 'rounded-b-lg' : 'rounded-lg'} overflow-x-auto">
                    <code class="font-mono text-sm">${code.trim()}</code>
                </pre>
            </div>`;
        });

        // Simple code blocks without language
        html = html.replace(/```\n([\s\S]*?)\n```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="font-mono text-sm">$1</code></pre>');

        // Lists
        html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>');
        html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1 list-decimal">$1</li>');

        // Wrap consecutive list items
        html = html.replace(/(<li.*?<\/li>(?:\s*<li.*?<\/li>)*)/gs, '<ul class="space-y-1 mb-4">$1</ul>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-purple-600 hover:text-purple-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');

        // Line breaks to paragraphs
        html = html.replace(/\n\n/g, '</p><p class="mb-4">');
        html = '<p class="mb-4">' + html + '</p>';

        // Clean up empty paragraphs
        html = html.replace(/<p class="mb-4"><\/p>/g, '');
        html = html.replace(/<p class="mb-4">(<h[1-6])/g, '$1');
        html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
        html = html.replace(/<p class="mb-4">(<pre)/g, '$1');
        html = html.replace(/(<\/pre>)<\/p>/g, '$1');
        html = html.replace(/<p class="mb-4">(<div)/g, '$1');
        html = html.replace(/(<\/div>)<\/p>/g, '$1');
        html = html.replace(/<p class="mb-4">(<ul)/g, '$1');
        html = html.replace(/(<\/ul>)<\/p>/g, '$1');

        return html;
    };

    const htmlContent = parseMarkdown(content);

    return (
        <div 
            className={`prose prose-purple max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
}
