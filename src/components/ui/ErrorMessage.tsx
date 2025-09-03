import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className={cn("bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800", className)}>
      <div className="flex">
        <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
        <p>{message}</p>
      </div>
    </div>
  );
}

