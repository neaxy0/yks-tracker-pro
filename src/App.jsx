import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TabBar from './components/Layout/TabBar';
import NewExam from './pages/NewExam';
import History from './pages/History';
import Analysis from './pages/Analysis';
import Dashboard from './pages/Dashboard';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [exams, setExams] = useState(() => {
        const saved = localStorage.getItem('yks_exams');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('yks_exams', JSON.stringify(exams));
    }, [exams]);

    const handleSaveExam = (newExam) => {
        setExams(prev => [newExam, ...prev]);
        setActiveTab('dashboard');
    };

    const handleDeleteExam = (examId) => {
        const updatedExams = exams.filter(exam => exam.id !== examId);
        setExams(updatedExams);
    };

    const renderPage = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard exams={exams} />;
            case 'new':
                return <NewExam onSave={handleSaveExam} />;
            case 'history':
                return <History exams={exams} onDelete={handleDeleteExam} />;
            case 'analysis':
                return <Analysis exams={exams} />;
            default:
                return <Dashboard exams={exams} />;
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-primary-500 selection:text-white">
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-dark-bg to-dark-bg pointer-events-none" />

            <main className="relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderPage()}
                    </motion.div>
                </AnimatePresence>
            </main>

            <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}

export default App;
