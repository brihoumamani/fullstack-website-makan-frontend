export const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('makan-backend.onrender.com')) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://website-makan.onrender.com';
  }
  return 'http://localhost:5000';
};

export const API_BASE = typeof window !== 'undefined' ? getApiBase() : (process.env.NEXT_PUBLIC_API_URL || 'https://website-makan.onrender.com');
