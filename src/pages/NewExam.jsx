import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SUBJECTS, EXAM_TYPES } from '../utils/constants';
import { calculateNet } from '../utils/helpers';
import { Button, Input, Card } from '../components/ui';
import { ChevronDown, ChevronUp, Save } from 'lucide-react';

const SubjectInput = ({ subject, parentId = null, onChange, values }) => {
    const [isOpen, setIsOpen] = useState(true);

    const uniqueId = parentId ? `${parentId}.${subject.id}` : subject.id;
    const currentVal = values[uniqueId] || { correct: '', wrong: '' };
    const net = calculateNet(currentVal.correct, currentVal.wrong);

    if (subject.subSubjects) {
        return (
            <Card className="mb-4 overflow-hidden !p-0 border-l-4 border-l-primary-500">
                <div
                    className="p-4 flex items-center justify-between bg-white/5 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <h3 className="font-semibold text-lg text-white">{subject.name}</h3>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>

                {isOpen && (
                    <div className="p-4 space-y-4">
                        {subject.subSubjects.map(sub => (
                            <SubjectInput
                                key={sub.id}
                                subject={sub}
                                parentId={subject.id}
                                onChange={onChange}
                                values={values}
                            />
                        ))}
                    </div>
                )}
            </Card>
        );
    }

    return (
        <div className="mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">{subject.name}</label>
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${net >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {net} Net
                </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <Input
                    type="number"
                    placeholder="D"
                    className="text-center !px-1 bg-green-900/20 border-green-500/20 focus:ring-green-500/50"
                    value={currentVal.correct}
                    onChange={(e) => onChange(uniqueId, 'correct', e.target.value)}
                />
                <Input
                    type="number"
                    placeholder="Y"
                    className="text-center !px-1 bg-red-900/20 border-red-500/20 focus:ring-red-500/50"
                    value={currentVal.wrong}
                    onChange={(e) => onChange(uniqueId, 'wrong', e.target.value)}
                />
                <div className="flex items-center justify-center bg-white/5 rounded-xl border border-white/5 text-slate-400 text-sm">
                    {subject.questionCount - ((parseInt(currentVal.correct) || 0) + (parseInt(currentVal.wrong) || 0))} Boş
                </div>
            </div>
        </div>
    );
};

const NewExam = ({ onSave }) => {
    const [examType, setExamType] = useState(EXAM_TYPES.TYT);
    const [examName, setExamName] = useState('');
    const [results, setResults] = useState({
        [EXAM_TYPES.TYT]: {},
        [EXAM_TYPES.AYT]: {}
    });

    const handleInputChange = (id, field, value) => {
        setResults(prev => ({
            ...prev,
            [examType]: {
                ...prev[examType],
                [id]: {
                    ...prev[examType]?.[id],
                    [field]: value
                }
            }
        }));
    };

    const handleSave = () => {
        if (!examName) {
            alert('Lütfen deneme ismi giriniz.');
            return;
        }

        const examData = {
            id: Date.now(),
            date: new Date().toISOString(),
            name: examName,
            type: examType,
            results: results[examType]
        };

        onSave(examData);
    };

    return (
        <div className="pb-24 px-4 pt-[max(3rem,env(safe-area-inset-top))] max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Yeni Deneme
            </h1>

            <div className="flex p-1 bg-dark-surface rounded-xl mb-6">
                {[EXAM_TYPES.TYT, EXAM_TYPES.AYT].map((type) => (
                    <button
                        key={type}
                        onClick={() => setExamType(type)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${examType === type
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <Input
                placeholder="Deneme İsmi (Örn: Özdebir 1)"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="mb-6"
            />

            <div className="space-y-4">
                {SUBJECTS[examType].map(subject => (
                    <SubjectInput
                        key={subject.id}
                        subject={subject}
                        onChange={handleInputChange}
                        values={results[examType]}
                    />
                ))}
            </div>

            <div className="mt-8">
                <Button onClick={handleSave} className="w-full">
                    <Save size={20} />
                    Kaydet
                </Button>
            </div>
        </div>
    );
};

export default NewExam;
