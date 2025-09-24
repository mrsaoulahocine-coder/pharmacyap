import React, { useState } from 'react';
import { WorkerDashboard } from './components/WorkerDashboard';
import { CustomerProfile } from './components/CustomerProfile';
import { AddCustomerModal } from './components/AddCustomerModal';
import { CustomerSelectionModal } from './components/CustomerSelectionModal';
import { AddDebtModal } from './components/AddDebtModal';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { EditDebtModal } from './components/EditDebtModal';
import { EditPaymentModal } from './components/EditPaymentModal';
import { mockWorkerData, mockCustomers } from './data/mockData';
import { Customer, Debt, Payment } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile'>('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showCustomerSelection, setShowCustomerSelection] = useState<'debt' | 'payment' | null>(null);
  const [showAddDebt, setShowAddDebt] = useState(false);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [showEditDebt, setShowEditDebt] = useState<Debt | null>(null);
  const [showEditPayment, setShowEditPayment] = useState<Payment | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [debts, setDebts] = useState<Debt[]>(mockWorkerData.debts);
  const [payments, setPayments] = useState<Payment[]>(mockWorkerData.payments);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCurrentView('profile');
  };

  const handleAddCustomer = (customerData: Omit<Customer, 'id' | 'date_registered'>) => {
    // Check for exact duplicates
    const existingCustomer = customers.find(
      c => c.phone_number === customerData.phone_number || c.full_name === customerData.full_name
    );

    if (existingCustomer) {
      alert(`Customer already exists: ${existingCustomer.full_name} - ${existingCustomer.phone_number}`);
      return;
    }

    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      date_registered: new Date().toISOString().split('T')[0]
    };

    setCustomers([...customers, newCustomer]);
    setShowAddCustomer(false);
  };

  const handleAddDebtRequest = () => {
    if (currentView === 'profile' && selectedCustomer) {
      // If on customer profile, open debt modal directly
      setShowAddDebt(true);
    } else {
      // If on dashboard, show customer selection first
      setShowCustomerSelection('debt');
    }
  };

  const handleRecordPaymentRequest = () => {
    if (currentView === 'profile' && selectedCustomer) {
      // If on customer profile, open payment modal directly
      setShowRecordPayment(true);
    } else {
      // If on dashboard, show customer selection first
      setShowCustomerSelection('payment');
    }
  };
  const handleCustomerSelectionForDebt = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSelection(null);
    setShowAddDebt(true);
  };

  const handleCustomerSelectionForPayment = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSelection(null);
    setShowRecordPayment(true);
  };

  const handleAddDebt = (debtData: { customer_id: string; amount: number; note: string }) => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      customer_id: debtData.customer_id,
      created_by_user_id: mockWorkerData.currentUser.id,
      created_at: new Date().toISOString(),
      debt_amount: debtData.amount,
      note: debtData.note
    };

    setDebts([...debts, newDebt]);
    setShowAddDebt(false);
  };

  const handleRecordPayment = (paymentData: { customer_id: string; amount: number; note: string }) => {
    const newPayment: Payment = {
      id: Date.now().toString(),
      customer_id: paymentData.customer_id,
      received_by_user_id: mockWorkerData.currentUser.id,
      amount: paymentData.amount,
      paid_at: new Date().toISOString(),
      note: paymentData.note
    };

    setPayments([...payments, newPayment]);
    setShowRecordPayment(false);
  };

  const handleUpdateDebt = (updatedDebt: Debt) => {
    setDebts(debts.map(debt => debt.id === updatedDebt.id ? updatedDebt : debt));
    setShowEditDebt(null);
  };

  const handleDeleteDebt = (debtId: string) => {
    setDebts(debts.filter(debt => debt.id !== debtId));
  };

  const handleUpdatePayment = (updatedPayment: Payment) => {
    setPayments(payments.map(payment => payment.id === updatedPayment.id ? updatedPayment : payment));
    setShowEditPayment(null);
  };

  const handleDeletePayment = (paymentId: string) => {
    setPayments(payments.filter(payment => payment.id !== paymentId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'dashboard' ? (
        <WorkerDashboard
          workerData={mockWorkerData}
          customers={customers}
          debts={debts}
          payments={payments}
          onCustomerSelect={handleCustomerSelect}
          onAddCustomer={() => setShowAddCustomer(true)}
          onAddDebt={handleAddDebtRequest}
          onRecordPayment={handleRecordPaymentRequest}
        />
      ) : (
        <CustomerProfile
          customer={selectedCustomer!}
          debts={debts.filter(d => d.customer_id === selectedCustomer?.id)}
          payments={payments.filter(p => p.customer_id === selectedCustomer?.id)}
          onBack={() => {
            setCurrentView('dashboard');
            setSelectedCustomer(null);
          }}
          onAddDebt={handleAddDebtRequest}
          onRecordPayment={handleRecordPaymentRequest}
          onUpdateDebt={(debt) => setShowEditDebt(debt)}
          onDeleteDebt={handleDeleteDebt}
          onUpdatePayment={(payment) => setShowEditPayment(payment)}
          onDeletePayment={handleDeletePayment}
        />
      )}

      {showAddCustomer && (
        <AddCustomerModal
          onClose={() => setShowAddCustomer(false)}
          onSubmit={handleAddCustomer}
        />
      )}

      {showCustomerSelection && (
        <CustomerSelectionModal
          customers={customers}
          onClose={() => setShowCustomerSelection(null)}
          onSelectCustomer={
            showCustomerSelection === 'debt' 
              ? handleCustomerSelectionForDebt 
              : handleCustomerSelectionForPayment
          }
          title={
            showCustomerSelection === 'debt' 
              ? 'اختيار عميل لإضافة دين' 
              : 'اختيار عميل لتسجيل دفعة'
          }
          subtitle={
            showCustomerSelection === 'debt'
              ? 'اختر العميل الذي تريد إضافة دين له'
              : 'اختر العميل الذي تريد تسجيل دفعة له'
          }
        />
      )}

      {showAddDebt && (
        <AddDebtModal
          customers={customers}
          selectedCustomerId={selectedCustomer?.id}
          onClose={() => setShowAddDebt(false)}
          onSubmit={handleAddDebt}
        />
      )}

      {showRecordPayment && (
        <RecordPaymentModal
          customers={customers}
          selectedCustomerId={selectedCustomer?.id}
          onClose={() => setShowRecordPayment(false)}
          onSubmit={handleRecordPayment}
        />
      )}

      {showEditDebt && (
        <EditDebtModal
          debt={showEditDebt}
          onClose={() => setShowEditDebt(null)}
          onSubmit={handleUpdateDebt}
        />
      )}

      {showEditPayment && (
        <EditPaymentModal
          payment={showEditPayment}
          onClose={() => setShowEditPayment(null)}
          onSubmit={handleUpdatePayment}
        />
      )}
    </div>
  );
}

export default App;