export interface User {
  id: string;
  username: string;
  role: 'manager' | 'worker';
  full_name: string;
  phone: string;
  created_at: string;
  active: boolean;
}

export interface Customer {
  id: string;
  full_name: string;
  phone_number: string;
  address: string;
  notes: string;
  promise_to_pay_date: string | null;
  date_registered: string;
  blocked: boolean;
}

export interface Debt {
  id: string;
  customer_id: string;
  created_by_user_id: string;
  created_at: string;
  debt_amount: number;
  note: string;
}

export interface Payment {
  id: string;
  customer_id: string;
  received_by_user_id: string;
  amount: number;
  paid_at: string;
  note: string;
}

export interface WorkerData {
  currentUser: User;
  debts: Debt[];
  payments: Payment[];
}