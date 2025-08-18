import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider: React.FC = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
                // Default options for all toasts
                duration: 4000,
                style: {
                    background: '#fff',
                    color: '#374151',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontFamily: 'Poppins, sans-serif',
                    maxWidth: '400px',
                },
                // Success toasts
                success: {
                    duration: 4000,
                    style: {
                        background: '#f0fdf4',
                        color: '#166534',
                        border: '1px solid #bbf7d0',
                    },
                    iconTheme: {
                        primary: '#16a34a',
                        secondary: '#f0fdf4',
                    },
                },
                // Error toasts
                error: {
                    duration: 5000,
                    style: {
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                    },
                    iconTheme: {
                        primary: '#dc2626',
                        secondary: '#fef2f2',
                    },
                },
                // Loading toasts
                loading: {
                    duration: Infinity,
                    style: {
                        background: '#fefce8',
                        color: '#a16207',
                        border: '1px solid #fde047',
                    },
                    iconTheme: {
                        primary: '#eab308',
                        secondary: '#fefce8',
                    },
                },
            }}
        />
    );
};

export default ToastProvider;
