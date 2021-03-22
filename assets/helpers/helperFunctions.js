
//  Risk 
export const calculateGain = (investAmt, risk, improvements = 0) => {
    // Probability of negative 
    const negative = Math.round(Math.random() + improvements) ? 1 : -1;
    const gains = Math.floor(Math.random() * investAmt * risk);
    // Return gain
    return gains * negative;
}


