import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
  showNewButton?: boolean;
  newUrl?: string;
  newButtonText?: string;
  children: React.ReactNode;
}

export default function PageLayout({
  title,
  subtitle,
  showBackButton = false,
  backUrl = '',
  showNewButton = false,
  newUrl = '',
  newButtonText = 'New Item',
  children
}: PageLayoutProps) {
  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        {showBackButton && (
          <div className="flex items-center gap-4 mb-4">
            <Link
              to={backUrl}
              className="btn btn-ghost btn-sm flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-3">{title}</h1>
            {subtitle && <p className="text-lg">{subtitle}</p>}
          </div>
          
          {showNewButton && (
            <Link
              to={newUrl}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              {newButtonText}
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}

// Form Layout Component
interface FormLayoutProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
  children: React.ReactNode;
}

export function FormLayout({
  title,
  subtitle,
  showBackButton = true,
  backUrl = '',
  children
}: FormLayoutProps) {
  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        {showBackButton && (
          <div className="flex items-center gap-4 mb-4">
            <Link
              to={backUrl}
              className="btn btn-ghost btn-sm flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to List
            </Link>
          </div>
        )}
        
        <div>
          <h1 className="text-4xl font-bold mb-3">{title}</h1>
          {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-md p-8 ">
        {children}
      </div>
    </div>
  );
}

// Table Layout Component
interface TableLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function TableLayout({ title, children }: TableLayoutProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      </div>
      
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

