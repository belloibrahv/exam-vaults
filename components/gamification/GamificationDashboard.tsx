'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Zap,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Clock,
  BookOpen,
  Brain,
  Star,
  Crown,
  Medal,
  Flame
} from 'lucide-react';
import { format } from 'date-fns';

interface GamificationStats {
  user: {
    id: string;
    name: string;
    level: number;
    totalXP: number;
    xpForNextLevel: number;
    levelProgress: number;
    currentStreak: number;
    longestStreak: number;
  };
  dailyGoals: Array<{
    id: string;
    goalType: string;
    targetValue: number;
    currentValue: number;
    completed: boolean;
    xpEarned: number;
  }>;
  recentAchievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: string;
    xpReward: number;
    unlockedAt: string;
  }>;
  weeklyStats: {
    lessonsCompleted: number;
    quizzesCompleted: number;
    studyTimeMinutes: number;
  };
  recentActivity: Array<{
    type: string;
    title: string;
    certification: string;
    provider: string;
    completedAt: string;
    xpEarned: number;
  }>;
}

interface LeaderboardData {
  leaderboard: Array<{
    rank: number;
    id: string;
    name: string;
    totalXP: number;
    level: number;
    currentStreak: number;
    completedLessons: number;
    achievementCount: number;
  }>;
  currentUser: any;
  period: string;
}

interface GamificationDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GamificationDashboard({ isOpen, onClose }: GamificationDashboardProps) {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'leaderboard'>('overview');
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [statsRes, leaderboardRes] = await Promise.all([
        fetch('/api/gamification/stats'),
        fetch('/api/gamification/leaderboard?period=month&limit=10')
      ]);

      if (statsRes.ok && leaderboardRes.ok) {
        setStats(await statsRes.json());
        setLeaderboard(await leaderboardRes.json());
      }
    } catch (error) {
      console.error('Error fetching gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'text-gray-600 bg-gray-100';
      case 'RARE': return 'text-blue-600 bg-blue-100';
      case 'EPIC': return 'text-purple-600 bg-purple-100';
      case 'LEGENDARY': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGoalTypeIcon = (goalType: string) => {
    switch (goalType) {
      case 'LESSONS_COMPLETED': return <BookOpen className="w-4 h-4" />;
      case 'STUDY_TIME_MINUTES': return <Clock className="w-4 h-4" />;
      case 'QUIZZES_COMPLETED': return <Brain className="w-4 h-4" />;
      case 'NOTES_CREATED': return <Award className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getGoalTypeLabel = (goalType: string) => {
    switch (goalType) {
      case 'LESSONS_COMPLETED': return 'Lessons';
      case 'STUDY_TIME_MINUTES': return 'Study Time (min)';
      case 'QUIZZES_COMPLETED': return 'Quizzes';
      case 'NOTES_CREATED': return 'Notes';
      default: return goalType;
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Level & XP Progress */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Level {stats.user.level}</h3>
            <p className="opacity-90">{stats.user.totalXP.toLocaleString()} XP</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <Star className="w-8 h-8" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {stats.user.level + 1}</span>
            <span>{stats.user.levelProgress}%</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <motion.div
              className="bg-white rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${stats.user.levelProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-sm opacity-90">
            {stats.user.xpForNextLevel > 0 
              ? `${stats.user.xpForNextLevel} XP to next level` 
              : 'Max level reached!'}
          </p>
        </div>
      </div>

      {/* Streak & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <div className="p-2 bg-orange-100 rounded-full w-fit mx-auto mb-2">
            <Flame className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-900">{stats.user.currentStreak}</div>
          <div className="text-sm text-orange-700">Current Streak</div>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="p-2 bg-green-100 rounded-full w-fit mx-auto mb-2">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{stats.user.longestStreak}</div>
          <div className="text-sm text-green-700">Best Streak</div>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="p-2 bg-purple-100 rounded-full w-fit mx-auto mb-2">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">{stats.recentAchievements.length}</div>
          <div className="text-sm text-purple-700">Achievements</div>
        </div>
      </div>

      {/* Daily Goals */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Today's Goals
        </h4>
        <div className="space-y-4">
          {stats.dailyGoals.map((goal) => (
            <div key={goal.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getGoalTypeIcon(goal.goalType)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {getGoalTypeLabel(goal.goalType)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {goal.currentValue} / {goal.targetValue}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`rounded-full h-2 transition-all duration-300 ${
                      goal.completed ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` }}
                  />
                </div>
                {goal.completed ? (
                  <div className="flex items-center text-green-600">
                    <Trophy className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+{goal.xpEarned} XP</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">
                    {Math.round((goal.currentValue / goal.targetValue) * 100)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          This Week
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.weeklyStats.lessonsCompleted}</div>
            <div className="text-sm text-gray-600">Lessons</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.weeklyStats.quizzesCompleted}</div>
            <div className="text-sm text-gray-600">Quizzes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.weeklyStats.studyTimeMinutes}</div>
            <div className="text-sm text-gray-600">Minutes</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h4>
        {stats.recentAchievements.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No achievements yet. Keep learning to unlock your first achievement!
          </p>
        ) : (
          <div className="space-y-4">
            {stats.recentAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border-l-4 ${getRarityColor(achievement.rarity)}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">{achievement.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h5>
                    <p className="text-gray-600 text-sm">{achievement.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </span>
                      <span className="text-sm text-green-600 font-medium">+{achievement.xpReward} XP</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {format(new Date(achievement.unlockedAt), 'MMM dd')}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Crown className="w-5 h-5 mr-2 text-yellow-600" />
          Monthly Leaderboard
        </h4>
        
        {leaderboard && (
          <div className="space-y-3">
            {leaderboard.leaderboard.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  user.id === stats.user.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {index < 3 ? (
                      index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'
                    ) : (
                      user.rank
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600">Level {user.level}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{user.totalXP.toLocaleString()} XP</div>
                  <div className="text-sm text-gray-600">{user.currentStreak} day streak</div>
                </div>
              </div>
            ))}
            
            {leaderboard.currentUser && leaderboard.currentUser.rank > 10 && (
              <>
                <div className="border-t pt-3 mt-3">
                  <div className="text-center text-gray-500 text-sm mb-2">...</div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        {leaderboard.currentUser.rank}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{leaderboard.currentUser.name} (You)</div>
                        <div className="text-sm text-gray-600">Level {leaderboard.currentUser.level}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{leaderboard.currentUser.totalXP.toLocaleString()} XP</div>
                      <div className="text-sm text-gray-600">{leaderboard.currentUser.currentStreak} day streak</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
                <p className="text-gray-600">Track your learning journey</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 mt-6">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'achievements', label: 'Achievements', icon: Medal },
              { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'achievements' && renderAchievements()}
          {activeTab === 'leaderboard' && renderLeaderboard()}
        </div>
      </motion.div>
    </div>
  );
}