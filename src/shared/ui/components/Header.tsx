import React from 'react';
import NotificationCenter from './NotificationCenter';

interface HeaderProps {
    title?: string;
    showNotifications?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
    title = "NeoArts WebTools", 
    showNotifications = true 
}) => {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                                <p className="text-sm text-gray-500">Herramientas profesionales para tu negocio</p>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Notifications and User */}
                    <div className="flex items-center gap-4">
                        {/* Quick Actions */}
                        <div className="hidden md:flex items-center gap-2">
                            <a
                                href="/invoice"
                                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                                Facturar
                            </a>
                            <a
                                href="/quote"
                                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                                Cotizar
                            </a>
                        </div>

                        {/* Notification Center */}
                        {showNotifications && <NotificationCenter />}

                        {/* User Menu */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">TP</span>
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-gray-900">Tomás Parra</p>
                                <p className="text-xs text-gray-500">NEO ARTS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
