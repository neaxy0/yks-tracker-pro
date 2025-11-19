import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Button = ({ children, className, variant = 'primary', ...props }) => {
    const variants = {
        primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40',
        secondary: 'bg-dark-surface text-white hover:bg-slate-600',
        outline: 'border border-primary-500/50 text-primary-400 hover:bg-primary-500/10'
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            className={cn(
                'py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export const Input = ({ label, error, className, ...props }) => (
    <div className="flex flex-col gap-1.5">
        {label && <label className="text-sm text-slate-400 ml-1">{label}</label>}
        <input
            className={cn(
                'w-full bg-dark-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-300',
                error && 'border-red-500/50 focus:ring-red-500/50',
                className
            )}
            {...props}
        />
        {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
    </div>
);

export const Card = ({ children, className, ...props }) => (
    <div
        className={cn('glass-card rounded-2xl p-5', className)}
        {...props}
    >
        {children}
    </div>
);
