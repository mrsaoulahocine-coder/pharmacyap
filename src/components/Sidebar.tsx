import React from 'react';
import { Users, BarChart3, User } from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'customers';
  onViewChange: (view: 'dashboard' | 'customers') => void;
  currentUser: {
    full_name: string;
    role: string;
  };
}

export function Sidebar({ currentView, onViewChange, currentUser }: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard' as const,
      label: 'لوحة التحكم',
      icon: BarChart3,
      description: 'الإحصائيات والملخص'
    },
    {
      id: 'customers' as const,
      label: 'العملاء',
      icon: Users,
      description: 'إدارة العملاء'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* User Info Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{currentUser.full_name}</h3>
            <p className="text-sm text-gray-600">
              {currentUser.role === 'manager' ? 'مدير' : 'موظف'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
                  <div className="text-right">
                    <div className={`font-medium ${isActive ? 'text-indigo-700' : 'text-gray-900'}`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          نظام إدارة ديون الصيدلية
        </div>
      </div>
    </div>
  );
}