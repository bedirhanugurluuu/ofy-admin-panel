import React, { useEffect, useState, useRef } from 'react';
import { auth } from '../../config/supabase';
import Swal from 'sweetalert2';

interface SessionManagerProps {
  children: React.ReactNode;
}

const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const [showWarning, setShowWarning] = useState(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Kullanıcı aktivitesini takip et
  const resetIdleTimer = () => {
    lastActivityRef.current = Date.now();
    
    // Mevcut timeout'ları temizle
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    
    // 55 dakika sonra uyarı göster (1 saat - 5 dakika)
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      Swal.fire({
        icon: 'warning',
        title: 'Hareketsizlik Uyarısı!',
        text: '5 dakika boyunca hiçbir aktivite tespit edilmedi. Devam etmek istiyor musunuz?',
        showCancelButton: true,
        confirmButtonText: 'Devam Et',
        cancelButtonText: 'Çıkış Yap',
        timer: 30000, // 30 saniye
        timerProgressBar: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // Kullanıcı aktif, timer'ı sıfırla
          setShowWarning(false);
          resetIdleTimer();
        } else {
          // Çıkış yap
          auth.signOut();
          window.location.href = '/admin/login';
        }
      });
    }, 55 * 60 * 1000); // 55 dakika

    // 1 saat sonra otomatik logout
    idleTimeoutRef.current = setTimeout(() => {
      Swal.fire({
        icon: 'info',
        title: 'Otomatik Çıkış',
        text: '1 saat boyunca hiçbir aktivite tespit edilmediği için güvenlik nedeniyle çıkış yapıldı.',
        timer: 3000,
        showConfirmButton: false,
      }).then(() => {
        auth.signOut();
        window.location.href = '/admin/login';
      });
    }, 60 * 60 * 1000); // 1 saat
  };

  useEffect(() => {
    // Kullanıcı aktivitelerini dinle
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleUserActivity = () => {
      resetIdleTimer();
    };

    // Event listener'ları ekle
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // İlk timer'ı başlat
    resetIdleTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
      
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, []);

  return <>{children}</>;
};

export default SessionManager;
