import { TypeOption } from '@/types'
import { clsx, type ClassValue } from 'clsx'

/** Merge class names */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

/** Format Philippine Peso */
export function formatPeso(amount: number | string | undefined | null): string {
  const num = parseFloat(String(amount ?? 0)) || 0
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(num)
}

/** Today as YYYY-MM-DD */
export function today(): string {
  return new Date().toISOString().split('T')[0]
}

/** Current time as HH:MM */
export function currentTime(): string {
  return new Date().toTimeString().slice(0, 5)
}

export interface TimeOption {
  value: string
  label: string
}

/** Generate time options every 30 minutes */
export function generateTimeOptions(): TimeOption[] {
  const options: TimeOption[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      const period = h < 12 ? 'AM' : 'PM'
      options.push({
        value: `${hh}:${mm}`,
        label: `${hour12}:${mm} ${period}`,
      })
    }
  }
  return options
}

export function normalizePHMobile(value: string) {
  // remove non-digits
  let digits = value.replace(/\D/g, '');

  // remove leading 0 (e.g., 0935 → 935)
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // limit to 10 digits (PH mobile after +63)
  return digits.slice(0, 10);
};

export function formatPHMobile(value: string) {
  // remove non-digits
  let digits = value.replace(/\D/g, '');

  // remove leading 0 (e.g., 0935 → 935)
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // limit to 10 digits (PH mobile after +63)
  const trimmed = digits.slice(0, 10);

  // format: 917 804 3253
  return trimmed.replace(
    /(\d{3})(\d{3})(\d{0,4})/,
    (_, p1, p2, p3) => {
      return [p1, p2, p3].filter(Boolean).join(' ');
    }
  );
};

export function formatTimeSlot(type: TypeOption): string {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    let h = hours % 12 || 12;
    const ampm = hours >= 12 ? 'pm' : 'am';
    const m = String(minutes).padStart(2, '0');
    return `${h}:${m}${ampm}`;
  };

  return `${formatTime(type.ext.start)} - ${formatTime(type.ext.end)}`;
}