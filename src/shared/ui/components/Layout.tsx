import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    breadcrumbs?: Array<{
        label: string;
        href?: string;
    }>;
}

export function PageHeader({ title, subtitle, actions, breadcrumbs }: PageHeaderProps) {
    return (
        <div className="mb-8">
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex mb-4" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index} className="inline-flex items-center">
                                {index > 0 && (
                                    <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {crumb.href ? (
                                    <a
                                        href={crumb.href}
                                        className="text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors"
                                    >
                                        {crumb.label}
                                    </a>
                                ) : (
                                    <span className="text-sm font-medium text-gray-900">
                                        {crumb.label}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            )}
            
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-lg text-gray-600">
                            {subtitle}
                        </p>
                    )}
                </div>
                
                {actions && (
                    <div className="flex items-center gap-3 ml-4">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}

interface SectionProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}

export function Section({ title, subtitle, children, actions, className = '' }: SectionProps) {
    return (
        <section className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
            {(title || subtitle || actions) && (
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                            {title && (
                                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className="text-sm text-gray-600">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        
                        {actions && (
                            <div className="flex items-center gap-2 ml-4">
                                {actions}
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <div className="p-6">
                {children}
            </div>
        </section>
    );
}

interface CardProps {
    children: React.ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export function Card({ children, padding = 'md', className = '', hover = false, onClick }: CardProps) {
    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    const baseStyles = `
        bg-white rounded-xl border border-gray-200 transition-all duration-200
        ${hover ? 'hover:shadow-md hover:border-gray-300' : 'shadow-sm'}
        ${onClick ? 'cursor-pointer' : ''}
    `;

    return (
        <div 
            className={`${baseStyles} ${paddingStyles[padding]} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="text-center py-12">
            {icon && (
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 text-gray-400">
                        {icon}
                    </div>
                </div>
            )}
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                {title}
            </h3>
            
            {description && (
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    {description}
                </p>
            )}
            
            {action && (
                <div className="flex justify-center">
                    {action}
                </div>
            )}
        </div>
    );
}
