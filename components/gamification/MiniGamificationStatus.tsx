'use client';

import { useState, useEffect } from 'react';
import { Star, Flame } from 'lucide-react';

interface UserStats {
  level: number;
  currentStreak: number;
  totalXP: number;
}

export default function MiniGamificationStatus() {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/gamification/stats');
        if (response.ok) {
          const data = await response.json();
          setStats({
            level: data.user.level,
            currentStreak: data.user.currentStreak,
            totalXP: data.user.totalXP,
          });
        }
      } catch (error) {
        console.error('Error fetching mini stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return null;

  return (
    <div className="flex items-center space-x-4 text-sm">
      {/* Level */}
      <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-100 to-purple-100 px-2 py-1 rounded-full">
        <Star className="w-3 h-3 text-blue-600 fill-current" />
        <span className="font-semibold text-blue-900">L{stats.level}</span>
      </div>
      
      {/* Streak */}
      {stats.currentStreak > 0 && (
        <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-100 to-red-100 px-2 py-1 rounded-full">
          <Flame className="w-3 h-3 text-orange-600" />
          <span className="font-semibold text-orange-900">{stats.currentStreak}</span>
        </div>
      )}
      
      {/* XP */}
      <div className="text-xs text-gray-600 hidden sm:block">
        {stats.totalXP.toLocaleString()} XP
      </div>
    </div>
  );
}