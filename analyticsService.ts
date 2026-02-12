
import { Customer, ChurnPredictionResult } from './types';

/**
 * Parses a CSV string into Customer objects
 */
export const parseCSV = (text: string): Customer[] => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''));
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/["']/g, ''));
    const entry: any = {};
    
    headers.forEach((header, i) => {
      entry[header] = values[i];
    });

    // Mapping logic to normalize different possible header names
    return {
      id: entry['customer id'] || entry['id'] || `C-${Math.random().toString(36).substr(2, 5)}`,
      tenure: parseInt(entry['tenure'] || entry['tenure (months)'] || 0),
      monthlyCharges: parseFloat(entry['monthly charges'] || entry['monthly'] || 0),
      totalCharges: parseFloat(entry['total charges'] || entry['total'] || 0),
      churn: (entry['churn'] || entry['churned'] || '').toLowerCase() === 'yes' || entry['churn'] === 'true',
      contract: (entry['contract type'] || entry['contract'] || 'Month-to-month') as any,
      usageGB: parseInt(entry['usage (gb)'] || entry['usage'] || 0),
      lastActivityDate: entry['last activity'] || entry['lastactivitydate'] || new Date().toISOString().split('T')[0],
      clv: parseFloat(entry['clv'] || 0) || parseFloat((parseFloat(entry['total charges'] || 0) * 0.4).toFixed(2)),
      rfmScore: parseInt(entry['rfm score'] || 0) || Math.floor(Math.random() * 5) + 1,
      segment: entry['segment'] || 'General'
    };
  });
};

/**
 * Generates dynamic trend data based on the current dataset
 */
export const generateTrendData = (data: Customer[], months: number = 6) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const results = [];

  for (let i = months - 1; i >= 0; i--) {
    const targetMonthIdx = (currentMonth - i + 12) % 12;
    // We simulate a trend based on the real data volume with some random monthly variance
    const baseValue = data.length / months;
    const variance = 0.8 + Math.random() * 0.4; // 80% to 120%
    
    results.push({
      name: monthNames[targetMonthIdx],
      active: Math.floor(data.filter(c => !c.churn).length * (1 - (i * 0.02)) * variance),
      churned: Math.floor(data.filter(c => c.churn).length / months * variance)
    });
  }
  return results;
};

export const predictChurn = (
  tenure: number, 
  monthlyCharges: number, 
  contractType: string
): ChurnPredictionResult => {
  const b0 = 0.5;
  const b1 = -0.05;
  const b2 = 0.02;
  const b3 = contractType === 'Month-to-month' ? 1.2 : -0.8;

  const z = b0 + (b1 * tenure) + (b2 * monthlyCharges) + b3;
  const probability = 1 / (1 + Math.exp(-z));

  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (probability > 0.7) riskLevel = 'High';
  else if (probability > 0.4) riskLevel = 'Medium';

  return {
    probability: Math.round(probability * 100),
    riskLevel
  };
};

export const calculateDashboardStats = (data: Customer[]) => {
  if (!data.length) return { total: 0, churnRate: '0', avgClv: '0', active: 0 };
  const total = data.length;
  const churned = data.filter(c => c.churn).length;
  const churnRate = ((churned / total) * 100).toFixed(1);
  const avgClv = (data.reduce((acc, c) => acc + c.clv, 0) / total).toFixed(2);
  const active = total - churned;

  return { total, churnRate, avgClv, active };
};

export const exportCustomersToCSV = (data: Customer[]) => {
  if (!data || data.length === 0) return;
  const headers = ['Customer ID', 'Tenure (Months)', 'Monthly Charges', 'Total Charges', 'Contract Type', 'Usage (GB)', 'Last Activity', 'CLV', 'Segment', 'Churned'];
  const csvRows = data.map(c => [c.id, c.tenure, c.monthlyCharges, c.totalCharges, `"${c.contract}"`, c.usageGB, c.lastActivityDate, c.clv, `"${c.segment}"`, c.churn ? 'Yes' : 'No'].join(','));
  const csvContent = [headers.join(','), ...csvRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `NexaTel_Export_${new Date().toISOString().split('T')[0]}.csv`);
  link.click();
};
