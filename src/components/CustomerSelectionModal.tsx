import React, { useState } from 'react';
import { X, Search, User, Phone, MapPin } from 'lucide-react';
import { Customer } from '../types';

interface CustomerSelectionModalProps {
  customers: Customer[];
  onClose: () => void;
  onSelectCustomer: (customer: Customer) => void;
  title: string;
  subtitle: string;
}

export function CustomerSelectionModal({ 
  customers, 
  onClose, 
  onSelectCustomer, 
  title, 
  subtitle 
}: CustomerSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone_number.includes(searchTerm) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="البحث بالاسم أو رقم الهاتف أو العنوان..."
            />
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredCustomers.length > 0 ? (
            <div className="space-y-3">
              {filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  onClick={() => onSelectCustomer(customer)}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{customer.full_name}</h3>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Phone className="w-4 h-4" />
                          <span>{customer.phone_number}</span>
                        </div>
                        {customer.address && (
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate max-w-xs">{customer.address}</span>
                          </div>
                        )}
                      </div>
                      {customer.notes && (
                        <p className="text-xs text-blue-600 mt-1 bg-blue-50 px-2 py-1 rounded inline-block">
                          {customer.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {customer.promise_to_pay_date && (
                      <p className="text-xs text-gray-500">
                        موعد الدفع: {new Date(customer.promise_to_pay_date).toLocaleDateString('ar-SA')}
                      </p>
                    )}
                    <div className="mt-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        مسجل منذ: {new Date(customer.date_registered).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-600">
                {searchTerm ? 'لم يتم العثور على عملاء يطابقون البحث' : 'لا توجد عملاء مسجلين'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>إجمالي العملاء: {customers.length}</span>
            <span>النتائج المعروضة: {filteredCustomers.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}