"use client";

import { useState } from "react";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface UseDateRangeReturn {
  dateFrom?: Date;
  dateTo?: Date;
  setDateFrom: (date?: Date) => void;
  setDateTo: (date?: Date) => void;
  clearDates: () => void;
  hasValue: boolean;
  toISO: () => { from?: string; to?: string };
}

export const useDateRange = (
  initialFrom?: Date,
  initialTo?: Date
): UseDateRangeReturn => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(initialFrom);
  const [dateTo, setDateTo] = useState<Date | undefined>(initialTo);

  const clearDates = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasValue = dateFrom !== undefined || dateTo !== undefined;

  const toISO = () => ({
    from: dateFrom?.toISOString(),
    to: dateTo?.toISOString(),
  });

  return {
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
    clearDates,
    hasValue,
    toISO,
  };
};
