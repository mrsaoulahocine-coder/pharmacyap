import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  Banknote, 
  TrendingUp, 
  UserPlus, 
  Plus, 
  Receipt,
  Search,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Eye
} from 'lucide-react';
import { Customer, Debt, Payment, WorkerData } from '../types';

interface CustomersTabProps {
  workerData: WorkerData;
  customers: Customer[];
  debts: Debt[];
  payments: Payment[];
  onCustomerSelect: (customer: Customer) => void;
  onAddCustomer: () => void;
  onAddDebt: () => void;
  onRecordPayment: () => void;
}

export function CustomersTab({
  workerData,
  customers,
  debts,
  payments,
  onCustomerSelect,
  onAddCustomer,
  onAddDebt,
  onRecordPayment
}: CustomersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate worker's statistics
  const myDebts = debts.filter(d => d.created_by_user_id === workerData.currentUser.id);
  const myPayments = payments.filter(p => p.received_by_user_id === workerData.currentUser.id);
  
  const totalDebts = myDebts.reduce((sum, debt) => sum + debt.debt_amount, 0);
  const totalPayments = myPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const outstanding = totalDebts - totalPayments;

  // Calculate customers with unpaid debts to this worker
  const customersWithDebt = customers.filter(customer => {
    const customerDebts = myDebts.filter(d => d.customer_id === customer.id);
    const customerPayments = myPayments.filter(p => p.customer_id === customer.id);
    const customerOutstanding = 
      customerDebts.reduce((sum, d) => sum + d.debt_amount, 0) - 
      customerPayments.reduce((sum, p) => sum + p.amount, 0);
    return customerOutstanding > 0;
  });

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone_number.includes(searchTerm) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} DA`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء</h1>
              <p className="text-gray-600 mt-1">عرض وإدارة جميع العملاء وحساباتهم</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">عملائي</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{customersWithDebt.length}</p>
                <p className="text-xs text-gray-500 mt-1">عملاء لديهم ديون</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الديون</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalDebts)}</p>
                <p className="text-xs text-gray-500 mt-1">الديون التي أنشأتها</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المدفوعات</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalPayments)}</p>
                <p className="text-xs text-gray-500 mt-1">المدفوعات المسجلة</p>
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
                <p className="text-xs text-gray-500 mt-1">الرصيد المتبقي</p>
              </div>
              <div className={`p-3 rounded-lg ${outstanding > 0 ? 'bg-orange-100' : 'bg-green-100'}`}>
                <TrendingUp className={`w-6 h-6 ${outstanding > 0 ? 'text-orange-600' : 'text-green-600'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={onAddCustomer}
                className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                <span>إضافة عميل</span>
              </button>
              
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
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
                placeholder="البحث بالاسم أو الهاتف أو العنوان..."
              />
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">قائمة العملاء</h2>
              <div className="text-sm text-gray-600">
                إجمالي العملاء: {customers.length} | النتائج المعروضة: {filteredCustomers.length}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">الرقم</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">الاسم</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">الهاتف</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">العنوان</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">ملاحظات</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">إجمالي الدين</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">إجمالي المدفوع</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">المستحق</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">تاريخ التسجيل</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">موعد الدفع</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, index) => {
                    const customerDebts = myDebts.filter(d => d.customer_id === customer.id);
                    const customerPayments = myPayments.filter(p => p.customer_id === customer.id);
                    const totalDebt = customerDebts.reduce((sum, d) => sum + d.debt_amount, 0);
                    const totalPaid = customerPayments.reduce((sum, p) => sum + p.amount, 0);
                    const customerOutstanding = totalDebt - totalPaid;

                    return (
                      <tr
                        key={customer.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => onCustomerSelect(customer)}
                      >
                        <td className="py-4 px-6 text-sm text-gray-900">{index + 1}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{customer.full_name}</p>
                              {customer.blocked && (
                                <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                  محظور
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{customer.phone_number}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {customer.address ? (
                            <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate max-w-xs">{customer.address}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {customer.notes ? (
                            <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                              <FileText className="w-4 h-4" />
                              <span className="truncate max-w-xs">{customer.notes}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-red-600">
                          {formatCurrency(totalDebt)}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-green-600">
                          {formatCurrency(totalPaid)}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-sm font-semibold ${customerOutstanding > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                            {formatCurrency(customerOutstanding)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(customer.date_registered)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {customer.promise_to_pay_date ? (
                            <div className="flex items-center space-x-2 space-x-reverse text-sm text-blue-600">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(customer.promise_to_pay_date)}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">غير محدد</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCustomerSelect(customer);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="عرض تفاصيل العميل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="py-12 text-center">
                      <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? 'لا توجد نتائج' : 'لا توجد عملاء'}
                      </h3>
                      <p className="text-gray-600">
                        {searchTerm 
                          ? 'لم يتم العثور على عملاء يطابقون البحث' 
                          : 'لم يتم تسجيل أي عملاء بعد'
                        }
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={onAddCustomer}
                          className="mt-4 inline-flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>إضافة أول عميل</span>
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}