'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginModal from '@/components/LoginModal';

export default function LoginPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    router.push('/');
  };

  const handleSwitchToSignUp = () => {
    router.push('/signup');
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-900/60 overflow-hidden">
      {/* Background Image Matching Reference */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=85"
          alt="Building Background"
          className="w-full h-full object-cover blur-xs"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>

      <LoginModal
        isOpen={isOpen}
        onClose={handleClose}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
    </div>
  );
}
