import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: '', color: '' };
    
    let score = 0;
    
    // Length check
    if (pwd.length >= 8) score += 25;
    if (pwd.length >= 12) score += 10;
    
    // Character variety
    if (/[a-z]/.test(pwd)) score += 15;
    if (/[A-Z]/.test(pwd)) score += 15;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 20;
    
    // Determine label and color
    if (score < 40) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score < 60) return { score, label: 'Fair', color: 'bg-orange-500' };
    if (score < 80) return { score, label: 'Good', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = calculateStrength(password);
  
  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${strength.color} transition-all duration-300 ease-out`}
          style={{ width: `${strength.score}%` }}
        />
      </div>
      
      {/* Strength Label */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400">
          Password strength: <span className={`font-semibold ${
            strength.label === 'Weak' ? 'text-red-600 dark:text-red-400' :
            strength.label === 'Fair' ? 'text-orange-600 dark:text-orange-400' :
            strength.label === 'Good' ? 'text-yellow-600 dark:text-yellow-400' :
            'text-green-600 dark:text-green-400'
          }`}>{strength.label}</span>
        </span>
        
        {/* Requirements */}
        {strength.score < 100 && (
          <span className="text-gray-500 dark:text-gray-500 text-[10px]">
            {password.length < 8 && '8+ chars '}
            {!/[A-Z]/.test(password) && 'A-Z '}
            {!/[0-9]/.test(password) && '0-9 '}
            {!/[^a-zA-Z0-9]/.test(password) && '!@# '}
          </span>
        )}
      </div>
    </div>
  );
}
