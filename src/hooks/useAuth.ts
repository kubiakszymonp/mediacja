'use client';

import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const password = prompt("Wprowadź hasło dostępu:");
      if (password === process.env.NEXT_PUBLIC_APP_PASSWORD) {
        setIsAuthorized(true);
      } else {
        alert("Nieprawidłowe hasło!");
        checkAuth();
      }
    };

    if (!isAuthorized) {
      checkAuth();
    }
  }, [isAuthorized]);

  return { isAuthorized };
}; 