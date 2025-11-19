import React, { useState, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { calculateTotalNet, calculateNet } from '../utils/helpers';
import { SUBJECTS, EXAM_TYPES } from '../utils/constants';
import { Card } from '../components/ui';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Analysis = ({ exams }) => {
    const [selectedType, setSelectedType] = useState(EXAM_TYPES.TYT);
    const [selectedSubject, setSelectedSubject] = useState('total');

    const filteredExams = exams
        .filter(e => e.type === selectedType)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const availableSubjects = useMemo(() => {
        const list = [{ id: 'total', name: 'Toplam Net' }];
        const traverse = (subs, parentId = null) => {
            subs.forEach(sub => {
                const fullId = parentId ? `${parentId}.${sub.id}` : sub.id;
                list.push({ id: fullId, name: sub.name });
                if (sub.subSubjects) {
                    traverse(sub.subSubjects, sub.id);
                }
            });
        };
        traverse(SUBJECTS[selectedType]);
        return list;
    }, [selectedType]);

    const chartData = useMemo(() => {
        const labels = filteredExams.map(e => e.name);
        const dataPoints = filteredExams.map(exam => {
            if (selectedSubject === 'total') {
                return calculateTotalNet(exam);
            } else {
                // Direct match (e.g., "turkce", "matematik")
                const res = exam.results[selectedSubject];
                if (res) {
                    return calculateNet(res.correct, res.wrong);
                }

                // For parent subjects (e.g., "sosyal", "fen"), aggregate all sub-subjects
                // Keys are stored as "sosyal.tarih", "sosyal.cografya", etc.
                let total = 0;
                Object.keys(exam.results).forEach(key => {
                    if (key.startsWith(selectedSubject + '.')) {
                        const subRes = exam.results[key];
                        total += calculateNet(subRes.correct, subRes.wrong);
                    }
                });

                return total;
            }
        });

        return {
            labels,
            datasets: [
                {
                    label: availableSubjects.find(s => s.id === selectedSubject)?.name || 'Net',
                    data: dataPoints,
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#0f172a',
                    pointBorderColor: '#0ea5e9',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        };
    }, [filteredExams, selectedSubject, availableSubjects]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(14, 165, 233, 0.3)',
                borderWidth: 2,
                padding: 12,
                displayColors: true,
                callbacks: {
                    title: (items) => items[0].label,
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${label}: ${value} Net`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: 'rgba(255, 255, 255, 0.03)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 11 },
                    maxRotation: 45,
                    minRotation: 0
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.08)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 11 },
                    stepSize: 2,
                    callback: (value) => value.toFixed(1)
                },
                beginAtZero: true,
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        }
    };

    return (
        <div className="pb-24 px-4 pt-6 max-w-md mx-auto h-screen flex flex-col">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Analiz
            </h1>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                {[EXAM_TYPES.TYT, EXAM_TYPES.AYT].map((type) => (
                    <button
                        key={type}
                        onClick={() => { setSelectedType(type); setSelectedSubject('total'); }}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedType === type
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                            : 'bg-dark-surface text-slate-400 hover:text-white'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <div className="mb-6 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
                <div className="flex gap-3 min-w-max">
                    {availableSubjects.map(sub => {
                        const isSelected = selectedSubject === sub.id;
                        return (
                            <button
                                key={sub.id}
                                onClick={() => setSelectedSubject(sub.id)}
                                className={`
                                    px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 border
                                    ${isSelected
                                        ? 'bg-primary-500 text-white border-primary-400 shadow-lg shadow-primary-500/30 scale-105'
                                        : 'bg-dark-surface/50 text-slate-400 border-white/5 hover:bg-white/5 hover:border-white/10'}
                                `}
                            >
                                {sub.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            <Card className="flex-1 min-h-[300px] relative">
                {filteredExams.length < 2 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-center text-slate-500 p-6">
                        Grafik oluşturmak için en az 2 deneme girmelisiniz.
                    </div>
                ) : (
                    <Line data={chartData} options={options} />
                )}
            </Card>
        </div>
    );
};

export default Analysis;
