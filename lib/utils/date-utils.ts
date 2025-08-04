// lib/utils/date-utils.ts

/**
 * Format a date to display in a consistent format
 * @param date Date to format
 * @param format Format string (default: 'YYYY-MM-DD')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | null | undefined,
  format: string = "YYYY-MM-DD"
): string {
  if (!date) return "N/A";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "Invalid Date";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}

/**
 * Calculate the difference between two dates in various units
 * @param date1 First date
 * @param date2 Second date (default: current date)
 * @param unit Unit of time difference
 * @returns Time difference in the specified unit
 */
export function dateDiff(
  date1: Date | string,
  date2: Date | string = new Date(),
  unit: "days" | "hours" | "minutes" | "seconds" | "milliseconds" = "days"
): number {
  const d1 = typeof date1 === "string" ? new Date(date1) : date1;
  const d2 = typeof date2 === "string" ? new Date(date2) : date2;

  const diffMs = d2.getTime() - d1.getTime();

  switch (unit) {
    case "days":
      return diffMs / (1000 * 60 * 60 * 24);
    case "hours":
      return diffMs / (1000 * 60 * 60);
    case "minutes":
      return diffMs / (1000 * 60);
    case "seconds":
      return diffMs / 1000;
    case "milliseconds":
    default:
      return diffMs;
  }
}

/**
 * Check if a date is in the past
 * @param date Date to check
 * @returns True if date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.getTime() < new Date().getTime();
}

/**
 * Check if a date is within a specified range from now
 * @param date Date to check
 * @param range Time range in days
 * @returns True if date is within range
 */
export function isDateWithinRange(date: Date | string, range: number): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffDays = Math.abs(dateDiff(d, now, "days"));
  return diffDays <= range;
}

/**
 * Format a date relative to now (e.g., "2 days ago", "in 3 hours")
 * @param date Date to format
 * @returns Formatted relative date string
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const isPast = diffMs < 0;
  const absDiffMs = Math.abs(diffMs);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  // Convert to the appropriate unit
  if (absDiffMs < 1000 * 60) {
    // Less than a minute
    return rtf.format(
      isPast ? -Math.floor(absDiffMs / 1000) : Math.floor(absDiffMs / 1000),
      "second"
    );
  } else if (absDiffMs < 1000 * 60 * 60) {
    // Less than an hour
    return rtf.format(
      isPast
        ? -Math.floor(absDiffMs / (1000 * 60))
        : Math.floor(absDiffMs / (1000 * 60)),
      "minute"
    );
  } else if (absDiffMs < 1000 * 60 * 60 * 24) {
    // Less than a day
    return rtf.format(
      isPast
        ? -Math.floor(absDiffMs / (1000 * 60 * 60))
        : Math.floor(absDiffMs / (1000 * 60 * 60)),
      "hour"
    );
  } else if (absDiffMs < 1000 * 60 * 60 * 24 * 7) {
    // Less than a week
    return rtf.format(
      isPast
        ? -Math.floor(absDiffMs / (1000 * 60 * 60 * 24))
        : Math.floor(absDiffMs / (1000 * 60 * 60 * 24)),
      "day"
    );
  } else if (absDiffMs < 1000 * 60 * 60 * 24 * 30) {
    // Less than a month
    return rtf.format(
      isPast
        ? -Math.floor(absDiffMs / (1000 * 60 * 60 * 24 * 7))
        : Math.floor(absDiffMs / (1000 * 60 * 60 * 24 * 7)),
      "week"
    );
  } else if (absDiffMs < 1000 * 60 * 60 * 24 * 365) {
    // Less than a year
    return rtf.format(
      isPast
        ? -Math.floor(absDiffMs / (1000 * 60 * 60 * 24 * 30))
        : Math.floor(absDiffMs / (1000 * 60 * 60 * 24 * 30)),
      "month"
    );
  } else {
    // More than a year
    return rtf.format(
      isPast
        ? -Math.floor(absDiffMs / (1000 * 60 * 60 * 24 * 365))
        : Math.floor(absDiffMs / (1000 * 60 * 60 * 24 * 365)),
      "year"
    );
  }
}

/**
 * Get the first and last days of a month
 * @param year Year
 * @param month Month (0-11)
 * @returns Object with first and last days of the month
 */
export function getMonthBoundaries(
  year: number,
  month: number
): { firstDay: Date; lastDay: Date } {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return { firstDay, lastDay };
}

/**
 * Calculate the next maintenance date based on a schedule
 * @param lastMaintenance Last maintenance date
 * @param schedule Maintenance schedule
 * @returns Next maintenance date
 */
export function calculateNextMaintenance(
  lastMaintenance: Date | string,
  schedule: "monthly" | "quarterly" | "biannually" | "annually"
): Date {
  const last =
    typeof lastMaintenance === "string"
      ? new Date(lastMaintenance)
      : lastMaintenance;
  const next = new Date(last);

  switch (schedule) {
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "quarterly":
      next.setMonth(next.getMonth() + 3);
      break;
    case "biannually":
      next.setMonth(next.getMonth() + 6);
      break;
    case "annually":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  return next;
}

/**
 * Group dates by time periods
 * @param dates Array of dates to group
 * @param period Grouping period
 * @returns Object with grouped dates
 */
export function groupDatesByPeriod(
  dates: (Date | string)[],
  period: "day" | "week" | "month" | "year"
): Record<string, Date[]> {
  const groups: Record<string, Date[]> = {};

  dates.forEach((d) => {
    const date = typeof d === "string" ? new Date(d) : d;
    let key: string;

    switch (period) {
      case "day":
        key = formatDate(date, "YYYY-MM-DD");
        break;
      case "week":
        // Get the first day of the week (Sunday)
        const firstDayOfWeek = new Date(date);
        const day = date.getDay();
        firstDayOfWeek.setDate(date.getDate() - day);
        key = formatDate(firstDayOfWeek, "YYYY-MM-DD");
        break;
      case "month":
        key = formatDate(date, "YYYY-MM");
        break;
      case "year":
        key = formatDate(date, "YYYY");
        break;
    }

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(date);
  });

  return groups;
}
