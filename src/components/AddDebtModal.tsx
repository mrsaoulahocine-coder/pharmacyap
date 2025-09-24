import React, { useState } from 'react';
import { X, CreditCard, FileText, DollarSign } from 'lucide-react';
import { Customer } from '../types';

interface AddDebtModalProps {
  customers: Customer[];
  selectedCustomerId?: string;
  onClose: () => void;
  onSubmit: (debt: { customer_id: string; amount: number; note: string }) => void;
}

export function AddDebtModal({ customers, selectedCustomerId, onClose, onSubmit }: AddDebtModalProps) {
  const [formData, setFormData] = useState({
    customer_id: selectedCustomerId || '',
    amount: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_id || !formData.amount || parseFloat(formData.amount) <= 0) {
      alert('يرجى اختيار العميل وإدخال مبلغ صحيح');
      return;
    }

    onSubmit({
      customer_id: formData.customer_id,
      amount: parseFloat(formData.amount),
      note: formData.note
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">إضافة دين جديد</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العميل *
            </label>
            <select
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
              disabled={!!selectedCustomerId}
            >
              <option value="">اختر العميل</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.full_name} - {customer.phone_number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline ml-1" />
              المبلغ (دينار جزائري) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline ml-1" />
              ملاحظات
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="وصف المنتجات أو ملاحظات إضافية"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-4 space-x-reverse pt-4">
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2 space-x-reverse"
            >
              <CreditCard className="w-5 h-5" />
              <span>إضافة الدين</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}