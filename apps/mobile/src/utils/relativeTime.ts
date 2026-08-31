import { strings } from './strings';

export function formatRelativeTime(createdAt: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(createdAt).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) {
    return strings.relativeTime.justNow;
  }
  if (minutes < 60) {
    return strings.relativeTime.minutesAgo(minutes);
  }
  if (hours < 24) {
    return strings.relativeTime.hoursAgo(hours);
  }
  if (days === 1) {
    return strings.relativeTime.yesterday;
  }
  return strings.relativeTime.daysAgo(days);
}
