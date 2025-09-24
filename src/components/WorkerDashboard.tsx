import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  Banknote, 
  TrendingUp, 
  UserPlus, 
  Plus, 
  Receipt,
  Bell,
  ChevronRight,
  Phone,
  Calendar
} from 'lucide-react';
import { Customer, Debt, Payment, WorkerData } from '../types';

interface WorkerDashboardProps {
  workerData: WorkerData;
  customers: Customer[];
  debts: Debt[];
  payments: Payment[];
  onCustomerSelect: (customer: Customer) => void;
  onAddCustomer: () => void;
  onAddDebt: () => void;
  onRecordPayment: () => void;
}

export function WorkerDashboard({
  workerData,
  customers,
  debts,
  payments,
  onCustomerSelect,
  onAddCustomer,
  onAddDebt,
  onRecordPayment
}: WorkerDashboardProps) {
  const [topCustomersCount, setTopCustomersCount] = useState(3);
  const [notificationDay, setNotificationDay] = useState(0); // 0 = today, 1 = tomorrow, etc.

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

  // Get customers with outstanding amounts for ranking
  const customersWithOutstanding = customers.map(customer => {
    const customerDebts = myDebts.filter(d => d.customer_id === customer.id);
    const customerPayments = myPayments.filter(p => p.customer_id === customer.id);
    const customerOutstanding = 
      customerDebts.reduce((sum, d) => sum + d.debt_amount, 0) - 
      customerPayments.reduce((sum, p) => sum + p.amount, 0);
    
    return {
      ...customer,
      outstanding: customerOutstanding
    };
  }).filter(c => c.outstanding > 0)
    .sort((a, b) => b.outstanding - a.outstanding)
    .slice(0, topCustomersCount);

  // Get today's activities
  const today = new Date().toISOString().split('T')[0];
  const todayDebts = myDebts.filter(d => d.created_at.startsWith(today));
  const todayPayments = myPayments.filter(p => p.paid_at.startsWith(today));

  // Get notification customers (promise to pay)
  const getNotificationDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + notificationDay);
    return date.toISOString().split('T')[0];
  };

  const notificationCustomers = customersWithDebt.filter(customer => 
    customer.promise_to_pay_date === getNotificationDate()
  );

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ر.س`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                مرحباً، {workerData.currentUser.full_name}
              </h1>
              <p className="text-gray-600 mt-1">
                {new Date().toLocaleDateString('ar-SA', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="text-right">
                <p className="text-sm text-gray-600">موظف صيدلية</p>
                <p className="text-sm font-medium text-gray-900">{workerData.currentUser.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات السريعة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={onAddCustomer}
              className="flex items-center justify-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              <span>إضافة عميل</span>
            </button>
            
            <button
              onClick={onAddDebt}
              className="flex items-center justify-center space-x-2 space-x-reverse bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة دين</span>
            </button>
            
            <button
              onClick={onRecordPayment}
              className="flex items-center justify-center space-x-2 space-x-reverse bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Receipt className="w-5 h-5" />
              <span>تسجيل دفعة</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 space-x-reverse bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              <Banknote className="w-5 h-5" />
              <span>دفع جميع ديوني</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Notifications Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Bell className="w-5 h-5 text-amber-600" />
                  <h2 className="text-lg font-semibold text-gray-900">التذكيرات</h2>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={() => setNotificationDay(Math.max(0, notificationDay - 1))}
                    disabled={notificationDay === 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <span className="text-sm text-gray-600 min-w-[80px] text-center">
                    {notificationDay === 0 ? 'اليوم' : 
                     notificationDay === 1 ? 'غداً' : 
                     `بعد ${notificationDay} أيام`}
                  </span>
                  <button
                    onClick={() => setNotificationDay(notificationDay + 1)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {notificationCustomers.length > 0 ? (
                <div className="space-y-3">
                  {notificationCustomers.map(customer => {
                    const customerOutstanding = customersWithOutstanding.find(c => c.id === customer.id)?.outstanding || 0;
                    return (
                      <div
                        key={customer.id}
                        onClick={() => onCustomerSelect(customer)}
                        className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{customer.full_name}</p>
                          <p className="text-sm text-gray-600">وعد بالدفع: {formatDate(customer.promise_to_pay_date!)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-amber-700">{formatCurrency(customerOutstanding)}</p>
                          <p className="text-xs text-gray-500">مستحق</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>لا توجد مواعيد دفع لهذا اليوم</p>
                </div>
              )}
            </div>

            {/* Top Customers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">أعلى العملاء بالمبلغ المستحق</h2>
                <select
                  value={topCustomersCount}
                  onChange={(e) => setTopCustomersCount(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value={3}>3</option>
                  <option value={10}>10</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>
              
              {customersWithOutstanding.length > 0 ? (
                <div className="space-y-3">
                  {customersWithOutstanding.map((customer, index) => (
                    <div
                      key={customer.id}
                      onClick={() => onCustomerSelect(customer)}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-indigo-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{customer.full_name}</p>
                          <p className="text-sm text-gray-600">{customer.phone_number}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-semibold text-red-600">{formatCurrency(customer.outstanding)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`tel:${customer.phone_number}`);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>لا توجد ديون مستحقة</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Today's Journal */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">يومية اليوم</h2>
              
              <div className="space-y-6">
                {/* Today's Debts */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center space-x-2 space-x-reverse">
                    <CreditCard className="w-4 h-4 text-red-600" />
                    <span>الديون اليوم ({todayDebts.length})</span>
                  </h3>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {todayDebts.length > 0 ? (
                      todayDebts.map(debt => {
                        const customer = customers.find(c => c.id === debt.customer_id);
                        return (
                          <div key={debt.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{customer?.full_name}</p>
                              <p className="text-sm text-gray-600">{debt.note}</p>
                              <p className="text-xs text-gray-500">{new Date(debt.created_at).toLocaleTimeString('ar-SA')}</p>
                            </div>
                            <span className="font-semibold text-red-600">{formatCurrency(debt.debt_amount)}</span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 text-center py-4">لا توجد ديون اليوم</p>
                    )}
                  </div>
                </div>

                {/* Today's Payments */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center space-x-2 space-x-reverse">
                    <Banknote className="w-4 h-4 text-green-600" />
                    <span>المدفوعات اليوم ({todayPayments.length})</span>
                  </h3>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {todayPayments.length > 0 ? (
                      todayPayments.map(payment => {
                        const customer = customers.find(c => c.id === payment.customer_id);
                        return (
                          <div key={payment.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{customer?.full_name}</p>
                              <p className="text-sm text-gray-600">{payment.note}</p>
                              <p className="text-xs text-gray-500">{new Date(payment.paid_at).toLocaleTimeString('ar-SA')}</p>
                            </div>
                            <span className="font-semibold text-green-600">{formatCurrency(payment.amount)}</span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 text-center py-4">لا توجد مدفوعات اليوم</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">قائمة العملاء</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">الاسم</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">الهاتف</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">إجمالي الدين</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">إجمالي المدفوع</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">المستحق</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(customer => {
                      const customerDebts = myDebts.filter(d => d.customer_id === customer.id);
                      const customerPayments = myPayments.filter(p => p.customer_id === customer.id);
                      const totalDebt = customerDebts.reduce((sum, d) => sum + d.debt_amount, 0);
                      const totalPaid = customerPayments.reduce((sum, p) => sum + p.amount, 0);
                      const customerOutstanding = totalDebt - totalPaid;

                      return (
                        <tr
                          key={customer.id}
                          onClick={() => onCustomerSelect(customer)}
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-2">
                            <div>
                              <p className="font-medium text-gray-900">{customer.full_name}</p>
                              {customer.notes && (
                                <p className="text-xs text-gray-500">{customer.notes}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-sm text-gray-600">{customer.phone_number}</td>
                          <td className="py-3 px-2 text-sm font-medium text-red-600">{formatCurrency(totalDebt)}</td>
                          <td className="py-3 px-2 text-sm font-medium text-green-600">{formatCurrency(totalPaid)}</td>
                          <td className="py-3 px-2">
                            <span className={`text-sm font-semibold ${customerOutstanding > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                              {formatCurrency(customerOutstanding)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}