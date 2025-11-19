import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { calculateTotalNet } from '../utils/helpers';
import { Card } from '../components/ui';
import { TrendingUp, Activity, Calendar } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
);

const Dashboard = ({ exams }) => {
    // Get last 4 exams
    const lastExams = useMemo(() => {
        return [...exams]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 4)
            .reverse(); // Show in chronological order for chart
    }, [exams]);

    const averageNet = useMemo(() => {
        if (lastExams.length === 0) return 0;
        const total = lastExams.reduce((acc, curr) => acc + calculateTotalNet(curr), 0);
        return (total / lastExams.length).toFixed(2);
    }, [lastExams]);

    const chartData = useMemo(() => {
        return {
            labels: lastExams.map(e => e.name.substring(0, 10)), // Shorten names
            datasets: [
                {
                    data: lastExams.map(e => calculateTotalNet(e)),
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#0f172a',
                    pointBorderColor: '#0ea5e9',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                },
            ],
        };
    }, [lastExams]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                displayColors: false,
                callbacks: {
                    label: (context) => `Net: ${context.parsed.y}`
                }
            }
        },
        scales: {
            x: {
                display: true,
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 10 } }
            },
            y: {
                display: true,
                min: 0,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#64748b', font: { size: 10 } }
            }
        }
    };

    return (
        <div className="pb-24 px-4 pt-[max(4rem,env(safe-area-inset-top))] max-w-md mx-auto min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-1">Hoş Geldin 👋</h1>
                <p className="text-slate-400">İşte son durumun ve analizlerin.</p>
            </header>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-primary-900/50 to-dark-card border-primary-500/20">
                    <div className="flex items-center gap-2 text-primary-400 mb-2">
                        <Activity size={20} />
                        <span className="text-sm font-medium">Ortalama Net</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{averageNet}</div>
                    <div className="text-xs text-slate-500 mt-1">Son 4 Deneme</div>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/50 to-dark-card border-purple-500/20">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                        <Calendar size={20} />
                        <span className="text-sm font-medium">Toplam Deneme</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{exams.length}</div>
                    <div className="text-xs text-slate-500 mt-1">Tüm Zamanlar</div>
                </Card>
            </div>

            <Card className="mb-6 min-h-[200px] relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <TrendingUp size={18} className="text-primary-400" />
                        Performans Grafiği
                    </h3>
                </div>
                <div className="h-[150px] w-full">
                    {lastExams.length > 1 ? (
                        <Line data={chartData} options={chartOptions} />
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                            Grafik için en az 2 deneme gerekli.
                        </div>
                    )}
                </div>
            </Card>

            <div className="space-y-4">
                <h3 className="font-semibold text-white text-lg">Son Denemeler</h3>
                {lastExams.length === 0 ? (
                    <div className="text-slate-500 text-sm text-center py-4">Henüz deneme yok.</div>
                ) : (
                    lastExams.map((exam, i) => (
                        <motion.div
                            key={exam.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                <div>
                                    <div className="text-white font-medium">{exam.name}</div>
                                    <div className="text-xs text-slate-500">{new Date(exam.date).toLocaleDateString('tr-TR')}</div>
                                </div>
                                <div className="font-bold text-primary-400">
                                    {calculateTotalNet(exam)} Net
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
