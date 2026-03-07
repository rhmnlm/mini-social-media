import { differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears, parseISO } from "date-fns";

export function timeAgo(createdAt: string): string {
    const date = parseISO(createdAt);
    const now = new Date();

    const seconds = differenceInSeconds(now, date);
    if (seconds < 60) return `${seconds}s ago`;

    const minutes = differenceInMinutes(now, date);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = differenceInHours(now, date);
    if (hours < 24) return `${hours}h ago`;

    const days = differenceInDays(now, date);
    if (days < 7) return `${days}d ago`;

    const weeks = differenceInWeeks(now, date);
    if (weeks < 4) return `${weeks}w ago`;

    const months = differenceInMonths(now, date);
    if (months < 12) return `${months}mo ago`;

    return `${differenceInYears(now, date)}y ago`;
}
