'use client';

import { useState } from 'react';
import clsx from 'clsx';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      
      <div className={clsx(
        "transition-all duration-300",
        isCollapsed ? "pl-16" : "pl-64"
      )}>
        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 