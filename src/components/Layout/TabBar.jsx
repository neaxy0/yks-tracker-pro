import React from 'react';
import { motion } from 'framer-motion';
import { History, Plus, BarChart2, Home } from 'lucide-react';

const TabBar = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'dashboard', icon: Home, label: 'Ana Sayfa' },
        { id: 'history', icon: History, label: 'Geçmiş' },
        { id: 'new', icon: Plus, label: 'Yeni', isCenter: true },
        { id: 'analysis', icon: BarChart2, label: 'Analiz' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] z-50 pointer-events-none flex justify-center">
            <div className="glass rounded-full px-6 py-3 flex items-center gap-8 pointer-events-auto shadow-2xl shadow-black/50">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;

                    return (
                        <motion.button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="relative flex flex-col items-center justify-center"
                            animate={{
                                scale: isActive ? 1.2 : 1,
                                y: isActive ? -4 : 0,
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            <div
                                className={`
                  p-3 rounded-full transition-colors duration-300
                  ${isActive
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/40'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
                            >
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            {isActive && (
                                <motion.span
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute -bottom-6 text-[10px] font-medium text-primary-400 whitespace-nowrap"
                                >
                                    {tab.label}
                                </motion.span>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default TabBar;
