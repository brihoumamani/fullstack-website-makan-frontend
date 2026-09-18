'use client';

import Image from 'next/image';

export default function MakanLogo({
  variant = 'auto',
  className = 'h-8 w-auto',
  priority = true,
  alt = 'MAKAN'
}) {
  if (variant === 'white') {
    return (
      <img
        src="/makan-logo-white.png"
        alt={alt}
        className={`object-contain ${className}`}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  if (variant === 'dark') {
    return (
      <img
        src="/makan-logo.png"
        alt={alt}
        className={`object-contain ${className}`}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  // Auto variant (adapts to Tailwind dark: mode)
  return (
    <div className="relative inline-flex items-center">
      {/* Light Mode Logo (Black) */}
      <img
        src="/makan-logo.png"
        alt={alt}
        className={`block dark:hidden object-contain ${className}`}
        loading={priority ? 'eager' : 'lazy'}
      />
      {/* Dark Mode Logo (White) */}
      <img
        src="/makan-logo-white.png"
        alt={alt}
        className={`hidden dark:block object-contain ${className}`}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}
