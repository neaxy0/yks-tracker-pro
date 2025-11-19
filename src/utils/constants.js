export const EXAM_TYPES = {
    TYT: 'TYT',
    AYT: 'AYT'
};

export const SUBJECTS = {
    TYT: [
        { id: 'turkce', name: 'Türkçe', questionCount: 40 },
        {
            id: 'sosyal',
            name: 'Sosyal Bilimler',
            subSubjects: [
                { id: 'tarih', name: 'Tarih', questionCount: 5 },
                { id: 'cografya', name: 'Coğrafya', questionCount: 5 },
                { id: 'felsefe', name: 'Felsefe', questionCount: 5 },
                { id: 'din', name: 'Din Kültürü', questionCount: 5 }
            ]
        },
        { id: 'matematik', name: 'Temel Matematik', questionCount: 40 },
        {
            id: 'fen',
            name: 'Fen Bilimleri',
            subSubjects: [
                { id: 'fizik', name: 'Fizik', questionCount: 7 },
                { id: 'kimya', name: 'Kimya', questionCount: 7 },
                { id: 'biyoloji', name: 'Biyoloji', questionCount: 6 }
            ]
        }
    ],
    AYT: [
        { id: 'matematik', name: 'Matematik', questionCount: 40 },
        { id: 'fizik', name: 'Fizik', questionCount: 14 },
        { id: 'kimya', name: 'Kimya', questionCount: 13 },
        { id: 'biyoloji', name: 'Biyoloji', questionCount: 13 }
    ]
};

export const NET_CALCULATION = {
    CORRECT_POINTS: 1,
    WRONG_PENALTY: 0.25 // Standard YKS: 4 wrongs cancel 1 right
};
