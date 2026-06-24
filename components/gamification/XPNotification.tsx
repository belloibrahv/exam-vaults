'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Zap } from 'lucide-react';

interface XPNotificationProps {
  xp: number;
  message: string;
  show: boolean;
  onHide: () => void;
}

export default function XPNotification({ xp, message, show, onHide }: XPNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-4 right-4 z-[100] bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-2xl"
        >
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Star className="w-5 h-5 fill-current" />
            </motion.div>
            <span className="font-bold">+{xp} XP</span>
            <Zap className="w-4 h-4" />
          </div>
          {message && (
            <div className="text-xs opacity-90 mt-1 text-center">{message}</div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for using XP notifications
export function useXPNotification() {
  const [notification, setNotification] = useState<{
    xp: number;
    message: string;
    show: boolean;
  }>({
    xp: 0,
    message: '',
    show: false,
  });

  const showNotification = (xp: number, message: string) => {
    setNotification({
      xp,
      message,
      show: true,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      show: false,
    }));
  };

  return {
    notification,
    showNotification,
    hideNotification,
  };
}