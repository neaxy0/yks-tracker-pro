import { NET_CALCULATION } from './constants';

export const calculateNet = (correct, wrong) => {
    const c = parseInt(correct) || 0;
    const w = parseInt(wrong) || 0;
    // Formula: Correct * 1 - Wrong * 1.25
    const net = (c * NET_CALCULATION.CORRECT_POINTS) - (w * NET_CALCULATION.WRONG_PENALTY);
    return parseFloat(net.toFixed(2));
};

export const calculateTotalNet = (examData) => {
    let totalNet = 0;

    // Recursively calculate net for all subjects
    const traverse = (data) => {
        // Check if this object has correct/wrong fields
        if (data.correct !== undefined || data.wrong !== undefined) {
            const net = calculateNet(data.correct, data.wrong);
            totalNet += net;
        }

        // Also check for pre-calculated net field (backwards compatibility)
        if (data.net !== undefined) {
            totalNet += data.net;
        }
    };

    Object.values(examData.results || {}).forEach(traverse);
    return parseFloat(totalNet.toFixed(2));
};

export const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
};
