import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function calculateScore(correct: number, total: number): number {
  return Math.round((correct / total) * 100);
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-techvaults-red';
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-50 border-green-200';
  if (score >= 70) return 'bg-blue-50 border-blue-200';
  if (score >= 60) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
}

export function canRetakeExam(lastAttemptDate: Date | null, passed: boolean): {
  canRetake: boolean;
  message?: string;
  timeRemaining?: string;
} {
  if (!lastAttemptDate) {
    return { canRetake: true };
  }

  if (passed) {
    return { canRetake: true };
  }

  const now = new Date();
  const twoHoursLater = new Date(lastAttemptDate.getTime() + 2 * 60 * 60 * 1000);

  if (now < twoHoursLater) {
    const diff = twoHoursLater.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      canRetake: false,
      message: 'You must wait 2 hours before retaking the exam after a failed attempt.',
      timeRemaining: `${hours}h ${minutes}m remaining`,
    };
  }

  return { canRetake: true };
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
