import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, formatStr: string = "MMM dd, yyyy"): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, formatStr);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-secondary text-white";
    case "upcoming":
      return "bg-primary text-white";
    case "ending soon":
      return "bg-accent text-white";
    case "completed":
      return "bg-gray-500 text-white";
    default:
      return "bg-gray-700 text-white";
  }
}

export function getCategoryLabel(category: string): string {
  return category || "Uncategorized";
}

export function getFormattedValue(value: string): string {
  if (!value) return "Unknown";
  return value.startsWith("$") ? value : `$${value}`;
}

export function getTimeRemaining(endDate: Date | string): string {
  if (!endDate) return "Unknown";
  
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const now = new Date();
  
  if (end <= now) return "Ended";
  
  const diffMs = end.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays > 30) {
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
  }
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  }
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
