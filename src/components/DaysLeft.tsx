'use client'

import { useState, useEffect } from 'react';

interface DaysLeftProps {
  dueDate: string;
}

export default function DaysLeft({ dueDate }: DaysLeftProps) {
  const [daysLeft, setDaysLeft] = useState<string>('');

  useEffect(() => {
    function calculateDaysLeft() {
      if (!dueDate) {
        setDaysLeft('');
        return;
      }
      
      const dueDateObj = new Date(dueDate + 'T23:59:59');
      const today = new Date();
      
      // Reset time to start of day for accurate day calculation
      today.setHours(0, 0, 0, 0);
      dueDateObj.setHours(0, 0, 0, 0);
      
      const diffTime = dueDateObj.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        setDaysLeft(`Passed`);
      } else if (diffDays === 0) {
        setDaysLeft('Due today');
      } else if (diffDays === 1) {
        setDaysLeft('Due tomorrow');
      } else {
        setDaysLeft(`${diffDays}`);
      }
    }

    calculateDaysLeft();
    
    // Update every hour to keep it current
    const interval = setInterval(calculateDaysLeft, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [dueDate]);

  return <span>{daysLeft}</span>;
}
