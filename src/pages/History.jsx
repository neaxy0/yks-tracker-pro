import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate, calculateTotalNet, calculateNet } from '../utils/helpers';
import { Card } from '../components/ui';
import { ChevronRight, Calendar as CalendarIcon, List, Trash2 } from 'lucide-react';

const SwipeableExamCard = ({ exam, index, onDelete, onClick }) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (window.confirm(`"${exam.name}" denemesini silmek istediğinize emin misiniz?`)) {
            setIsDeleting(true);
            setTimeout(() => onDelete(exam.id), 300);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{
                opacity: isDeleting ? 0 : 1,
                x: isDeleting ? -300 : 0,
                height: isDeleting ? 0 : 'auto'
            }}
            transition={{ delay: isDeleting ? 0 : index * 0.05 }}
            className="relative mb-4"
        >
            {/* Delete button behind */}
            <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center">
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: isRevealed ? 1 : 0 }}
                    onClick={handleDelete}
                    className="bg-red-500 text-white rounded-xl w-16 h-16 flex items-center justify-center shadow-lg"
                >
                    <Trash2 size={24} />
                </motion.button>
            </div>

            {/* Swipeable card */}
            <motion.div
                drag="x"
                dragConstraints={{ left: -80, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(e, info) => {
                    if (info.offset.x < -40) {
                        setIsRevealed(true);
                    } else {
                        setIsRevealed(false);
                    }
                }}
                animate={{ x: isRevealed ? -80 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <Card
                    className="cursor-pointer hover:bg-white/5 transition-all group"
                    onClick={onClick}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${exam.type === 'TYT' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                    {exam.type}
                                </span>
                                <span className="text-xs text-slate-500">{formatDate(exam.date)}</span>
                            </div>
                            <h3 className="font-semibold text-white text-lg">{exam.name}</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-primary-400">
                                    {calculateTotalNet(exam)}
                                </div>
                                <div className="text-xs text-slate-500">Toplam Net</div>
                            </div>
                            <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
};

const CalendarView = ({ exams, onSelectDate }) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
    };

    const days = getDaysInMonth(currentMonth);
    const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const hasExam = (date) => {
        return exams.some(exam => {
            const examDate = new Date(exam.date);
            return examDate.getDate() === date.getDate() &&
                examDate.getMonth() === date.getMonth() &&
                examDate.getFullYear() === date.getFullYear();
        });
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-semibold text-white">
                    {currentMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-2 rounded-lg hover:bg-white/5 text-slate-400">←</button>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-2 rounded-lg hover:bg-white/5 text-slate-400">→</button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs text-slate-500 font-medium">
                {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'].map(d => <div key={d}>{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: offset }).map((_, i) => <div key={`empty-${i}`} />)}
                {days.map(date => {
                    const isExamDay = hasExam(date);
                    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();

                    return (
                        <motion.button
                            key={date.toISOString()}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onSelectDate(date)}
                            className={`
                aspect-square rounded-xl flex items-center justify-center text-sm relative
                ${isToday ? 'border border-primary-500/50 text-primary-400' : 'text-slate-300'}
                ${isExamDay ? 'bg-primary-500/20 text-primary-300 font-bold shadow-[0_0_10px_rgba(14,165,233,0.2)]' : 'hover:bg-white/5'}
              `}
                        >
                            {date.getDate()}
                            {isExamDay && <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary-400" />}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

const History = ({ exams, onDelete }) => {
    const [view, setView] = useState('list');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);

    const filteredExams = selectedDate
        ? exams.filter(exam => new Date(exam.date).toDateString() === selectedDate.toDateString())
        : exams;

    const sortedExams = [...filteredExams].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="pb-24 px-4 pt-[max(4rem,env(safe-area-inset-top))] max-w-md mx-auto min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Geçmiş
                </h1>
                <div className="flex bg-dark-surface rounded-lg p-1">
                    <button
                        onClick={() => { setView('list'); setSelectedDate(null); }}
                        className={`p-2 rounded-md transition-all ${view === 'list' ? 'bg-primary-600 text-white' : 'text-slate-400'}`}
                    >
                        <List size={20} />
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={`p-2 rounded-md transition-all ${view === 'calendar' ? 'bg-primary-600 text-white' : 'text-slate-400'}`}
                    >
                        <CalendarIcon size={20} />
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'calendar' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <CalendarView exams={exams} onSelectDate={(date) => { setSelectedDate(date); }} />
                        {selectedDate && (
                            <div className="mb-4 text-sm text-slate-400">
                                {formatDate(selectedDate.toISOString())} için sonuçlar:
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {sortedExams.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                        Henüz deneme eklenmemiş.
                    </div>
                ) : (
                    sortedExams.map((exam, index) => (
                        <SwipeableExamCard
                            key={exam.id}
                            exam={exam}
                            index={index}
                            onDelete={onDelete}
                            onClick={() => setSelectedExam(exam)}
                        />
                    ))
                )}
            </div>

            {/* Exam Detail Modal */}
            <AnimatePresence>
                {selectedExam && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedExam(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-dark-card border border-white/10 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${selectedExam.type === 'TYT' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                        {selectedExam.type}
                                    </span>
                                    <h2 className="text-2xl font-bold text-white mt-2">{selectedExam.name}</h2>
                                    <p className="text-xs text-slate-500">{formatDate(selectedExam.date)}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedExam(null)}
                                    className="text-slate-400 hover:text-white transition-colors text-xl"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 mb-6">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-primary-400">{calculateTotalNet(selectedExam)}</div>
                                    <div className="text-sm text-slate-400 mt-1">Toplam Net</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-white mb-3">Ders Detayları</h3>
                                {Object.entries(selectedExam.results || {}).map(([key, value]) => {
                                    const net = calculateNet(value.correct, value.wrong);
                                    const displayName = key.split('.').pop().charAt(0).toUpperCase() + key.split('.').pop().slice(1);

                                    return (
                                        <div key={key} className="flex items-center justify-between py-2 border-b border-white/5">
                                            <span className="text-slate-300 text-sm capitalize">{displayName}</span>
                                            <div className="flex items-center gap-4 text-xs">
                                                <span className="text-green-400">✓ {value.correct || 0}</span>
                                                <span className="text-red-400">✗ {value.wrong || 0}</span>
                                                <span className="font-bold text-primary-400 w-12 text-right">{net} Net</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default History;
