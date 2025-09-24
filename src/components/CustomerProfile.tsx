import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  CreditCard,
  Banknote,
  TrendingUp,
  Clock,
  Plus,
  Receipt,
  Edit,
  Trash2
} from 'lucide-react';
import { Customer, Debt, Payment } from '../types';

interface CustomerProfileProps {
  customer: Customer;
  debts: Debt[];
  payments: Payment[];
  onBack: () => void;
  onAddDebt: () => void;
  onRecordPayment: () => void;
  onUpdateDebt: (debt: Debt) => void;
  onDeleteDebt: (debtId: string) => void;
  onUpdatePayment: (payment: Payment) => void;
  onDeletePayment: (paymentId: string) => void;
}

export function CustomerProfile({
  customer,
  debts,
  payments,
  onBack,
  onAddDebt,
  onRecordPayment,
  onUpdateDebt,
  onDeleteDebt,
  onUpdatePayment,
  onDeletePayment
}: CustomerProfileProps) {
  const [selectedDebt, setSelectedDebt] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const totalDebt = debts.reduce((sum, debt) => sum + debt.debt_amount, 0);
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const outstanding = totalDebt - totalPaid;

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ر.س`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ملف العميل</h1>
              <p className="text-gray-600 mt-1">إدارة ديون ومدفوعات العميل</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Client Information Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 space-x-reverse">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{customer.full_name}</h2>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone_number}</span>
                  </div>
                  {customer.address && (
                    <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{customer.address}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>مسجل منذ: {formatDate(customer.date_registered)}</span>
                  </div>
                </div>
              </div>
            </div>
            {customer.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 font-medium">ملاحظات</p>
                <p className="text-sm text-blue-700 mt-1">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Debt Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الدين</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalDebt)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المدفوع</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalPaid)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Banknote className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المبلغ المستحق</p>
                <p className={`text-2xl font-bold mt-1 ${outstanding > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {formatCurrency(outstanding)}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${outstanding > 0 ? 'bg-orange-100' : 'bg-green-100'}`}>
                <TrendingUp className={`w-6 h-6 ${outstanding > 0 ? 'text-orange-600' : 'text-green-600'}`} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">موعد الدفع</p>
                <p className="text-lg font-bold text-blue-600 mt-1">
                  {customer.promise_to_pay_date ? formatDate(customer.promise_to_pay_date) : 'غير محدد'}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={onAddDebt}
              className="flex items-center space-x-2 space-x-reverse bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة دين</span>
            </button>
            
            <button
              onClick={onRecordPayment}
              className="flex items-center space-x-2 space-x-reverse bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Receipt className="w-5 h-5" />
              <span>تسجيل دفعة</span>
            </button>
            
            <button
              onClick={() => {
                if (selectedDebt) {
                  const debt = debts.find(d => d.id === selectedDebt);
                  if (debt) onUpdateDebt(debt);
                } else if (selectedPayment) {
                  const payment = payments.find(p => p.id === selectedPayment);
                  if (payment) onUpdatePayment(payment);
                }
              }}
              disabled={!selectedDebt && !selectedPayment}
              className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Edit className="w-5 h-5" />
              <span>تحديث</span>
            </button>
            
            <button
              onClick={() => {
                if (selectedDebt) {
                  if (confirm('هل أنت متأكد من حذف هذا الدين؟')) {
                    onDeleteDebt(selectedDebt);
                    setSelectedDebt(null);
                  }
                } else if (selectedPayment) {
                  if (confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
                    onDeletePayment(selectedPayment);
                    setSelectedPayment(null);
                  }
                }
              }}
              disabled={!selectedDebt && !selectedPayment}
              className="flex items-center space-x-2 space-x-reverse bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-5 h-5" />
              <span>حذف</span>
            </button>
          </div>
        </div>

        {/* Dual Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Debt Records Table (60% - 3 columns) */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 space-x-reverse">
              <CreditCard className="w-5 h-5 text-red-600" />
              <span>سجل الديون ({debts.length})</span>
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">المبلغ</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">التاريخ</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {debts.length > 0 ? (
                    debts.map(debt => (
                      <tr
                        key={debt.id}
                        onClick={() => setSelectedDebt(selectedDebt === debt.id ? null : debt.id)}
                        className={`border-b border-gray-100 cursor-pointer transition-colors ${
                          selectedDebt === debt.id ? 'bg-red-50 border-red-200' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-3 px-2 font-semibold text-red-600">{formatCurrency(debt.debt_amount)}</td>
                        <td className="py-3 px-2 text-sm text-gray-600">{formatDateTime(debt.created_at)}</td>
                        <td className="py-3 px-2 text-sm text-gray-700">{debt.note}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-500">
                        لا توجد ديون مسجلة
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Records Table (40% - 2 columns) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 space-x-reverse">
              <Banknote className="w-5 h-5 text-green-600" />
              <span>سجل المدفوعات ({payments.length})</span>
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">المبلغ</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">تاريخ الدفع</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? (
                    payments.map(payment => (
                      <tr
                        key={payment.id}
                        onClick={() => setSelectedPayment(selectedPayment === payment.id ? null : payment.id)}
                        className={`border-b border-gray-100 cursor-pointer transition-colors ${
                          selectedPayment === payment.id ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-3 px-2 font-semibold text-green-600">{formatCurrency(payment.amount)}</td>
                        <td className="py-3 px-2 text-sm text-gray-600">{formatDateTime(payment.paid_at)}</td>
                        <td className="py-3 px-2 text-sm text-gray-700">{payment.note}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-500">
                        لا توجد مدفوعات مسجلة
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}