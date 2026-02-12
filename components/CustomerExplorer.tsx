
import React from 'react';
import { Customer } from '../types';

interface Props {
  data: Customer[];
}

const CustomerExplorer: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Master Dataset</h3>
          <p className="text-sm text-slate-500">Showing {data.length} records</p>
        </div>
      </div>
      <div className="overflow-x-auto max-h-[70vh]">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-slate-100 z-10">
            <tr className="text-slate-500 text-[10px] uppercase tracking-wider font-black">
              <th className="px-6 py-4">Customer ID</th>
              <th className="px-6 py-4">Tenure</th>
              <th className="px-6 py-4">Monthly</th>
              <th className="px-6 py-4">Total Spend</th>
              <th className="px-6 py-4">Contract</th>
              <th className="px-6 py-4">Segment</th>
              <th className="px-6 py-4">Usage (GB)</th>
              <th className="px-6 py-4">Churn Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">
                  No customers found matching your criteria.
                </td>
              </tr>
            ) : (
              data.map((customer) => (
                <tr key={customer.id} className="hover:bg-teal-50/30 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-700 text-sm">{customer.id}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{customer.tenure} mo</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">${customer.monthlyCharges}</td>
                  <td className="px-6 py-4 text-slate-800 font-bold text-sm">${customer.totalCharges.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">{customer.contract}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded text-[10px] font-bold uppercase whitespace-nowrap">
                      {customer.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{customer.usageGB} GB</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${customer.churn ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {customer.churn ? 'Churned' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerExplorer;
