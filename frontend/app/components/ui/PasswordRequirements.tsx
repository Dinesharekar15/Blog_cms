'use client'

interface PasswordRequirement {
  text: string;
  met: boolean;
}

interface PasswordRequirementsProps {
  password: string;
  show: boolean;
}

export default function PasswordRequirements({ password, show }: PasswordRequirementsProps) {
  const requirements: PasswordRequirement[] = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'One lowercase letter', met: /[a-z]/.test(password) },
    { text: 'One number', met: /\d/.test(password) }
  ];

  if (!show) return null;

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
      <p className="text-xs font-medium text-gray-600 mb-2">Password requirements:</p>
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              req.met ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              {req.met && (
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}