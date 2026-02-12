
import { Customer, ContractType } from './types';
import { SEGMENTS } from './constants.tsx';

const contracts: ContractType[] = ['Month-to-month', 'One year', 'Two year'];

export const generateMockData = (count: number = 500): Customer[] => {
  const data: Customer[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const tenure = Math.floor(Math.random() * 72) + 1;
    const monthlyCharges = parseFloat((Math.random() * 100 + 20).toFixed(2));
    const totalCharges = parseFloat((tenure * monthlyCharges).toFixed(2));
    const contract = contracts[Math.floor(Math.random() * contracts.length)];
    
    // Simulate churn logic: higher monthly charges and month-to-month contract = higher churn
    const churnProb = (monthlyCharges / 120) * (contract === 'Month-to-month' ? 0.7 : 0.2);
    const churn = Math.random() < churnProb;

    const usageGB = Math.floor(Math.random() * 500) + 10;
    
    // Last activity within last 180 days
    const daysAgo = Math.floor(Math.random() * 180);
    const lastActivityDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

    // Simple segment logic for simulation
    let segment = SEGMENTS.LOYAL;
    if (tenure > 48 && totalCharges > 5000) segment = SEGMENTS.CHAMPIONS;
    else if (churn && tenure < 12) segment = SEGMENTS.LOST;
    else if (monthlyCharges > 90) segment = SEGMENTS.BIG_SPENDERS;
    else if (daysAgo > 90) segment = SEGMENTS.AT_RISK;

    data.push({
      id: `CUST-${1000 + i}`,
      tenure,
      monthlyCharges,
      totalCharges,
      churn,
      contract,
      usageGB,
      lastActivityDate,
      clv: parseFloat((totalCharges * 0.4).toFixed(2)), // Simple CLV estimate
      rfmScore: Math.floor(Math.random() * 5) + 1,
      segment
    });
  }
  return data;
};
