import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GamificationService } from '@/lib/gamification';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as 'week' | 'month' | 'all' || 'month';
    const limit = parseInt(searchParams.get('limit') || '10');

    const leaderboard = await GamificationService.getLeaderboard(limit, period);

    // Find current user's position if not in top results
    const currentUserRank = leaderboard.findIndex(entry => entry.id === session.user.id);
    let currentUserStats = null;

    if (currentUserRank === -1) {
      // User not in top results, get their stats separately
      const allUsers = await GamificationService.getLeaderboard(1000, period);
      const userRank = allUsers.findIndex(entry => entry.id === session.user.id);
      
      if (userRank !== -1) {
        currentUserStats = {
          ...allUsers[userRank],
          rank: userRank + 1,
        };
      }
    } else {
      currentUserStats = leaderboard[currentUserRank];
    }

    return NextResponse.json({
      leaderboard,
      currentUser: currentUserStats,
      period,
      totalUsers: leaderboard.length,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}