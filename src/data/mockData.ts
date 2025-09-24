import { User, Customer, Debt, Payment, WorkerData } from '../types';

export const mockUser: User = {
  id: '1',
  username: 'ahmed_worker',
  role: 'worker',
  full_name: 'أحمد محمد',
  phone: '+966501234567',
  created_at: '2024-01-15',
  active: true
};

export const mockCustomers: Customer[] = [
  {
    id: '1',
    full_name: 'سارة أحمد',
    phone_number: '+966501111111',
    address: 'الرياض، حي النخيل، شارع الملك فهد',
    notes: 'عميل مميز',
    promise_to_pay_date: '2025-01-20',
    date_registered: '2024-12-01',
    blocked: false
  },
  {
    id: '2',
    full_name: 'محمد علي',
    phone_number: '+966502222222',
    address: 'جدة، حي الصفا',
    notes: '',
    promise_to_pay_date: '2025-01-18',
    date_registered: '2024-11-15',
    blocked: false
  },
  {
    id: '3',
    full_name: 'فاطمة حسن',
    phone_number: '+966503333333',
    address: 'الدمام، حي الشاطئ',
    notes: 'دفع منتظم',
    promise_to_pay_date: null,
    date_registered: '2024-10-20',
    blocked: false
  },
  {
    id: '4',
    full_name: 'عبدالله سالم',
    phone_number: '+966504444444',
    address: 'الطائف، حي الوردتين',
    notes: '',
    promise_to_pay_date: '2025-01-25',
    date_registered: '2024-09-10',
    blocked: false
  }
];

export const mockDebts: Debt[] = [
  {
    id: '1',
    customer_id: '1',
    created_by_user_id: '1',
    created_at: '2025-01-10T10:30:00Z',
    debt_amount: 250,
    note: 'أدوية ضغط الدم'
  },
  {
    id: '2',
    customer_id: '1',
    created_by_user_id: '1',
    created_at: '2025-01-12T14:15:00Z',
    debt_amount: 150,
    note: 'فيتامينات'
  },
  {
    id: '3',
    customer_id: '2',
    created_by_user_id: '1',
    created_at: '2025-01-08T09:45:00Z',
    debt_amount: 180,
    note: 'مسكنات'
  },
  {
    id: '4',
    customer_id: '3',
    created_by_user_id: '1',
    created_at: '2025-01-15T16:20:00Z',
    debt_amount: 320,
    note: 'أدوية مزمنة'
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    customer_id: '1',
    received_by_user_id: '1',
    amount: 100,
    paid_at: '2025-01-14T11:00:00Z',
    note: 'دفعة جزئية'
  },
  {
    id: '2',
    customer_id: '2',
    received_by_user_id: '1',
    amount: 180,
    paid_at: '2025-01-16T13:30:00Z',
    note: 'دفع كامل'
  }
];

export const mockWorkerData: WorkerData = {
  currentUser: mockUser,
  debts: mockDebts,
  payments: mockPayments
};