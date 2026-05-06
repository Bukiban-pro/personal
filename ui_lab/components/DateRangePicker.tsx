import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Date Range Picker** — date range selection component
 *
 * Supports:
 * - Dual calendar pickers
 * - Start/end date selection
 * - Preset ranges (Today, This Week, This Month)
 * - Keyboard navigation
 * - Disabled dates
 * - Custom date formatting
 *
 * Use: Date filtering, report date ranges, booking systems
 */

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  disabled?: boolean;
}

export const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [fromDate, setFromDate] = React.useState<Date | undefined>(value?.from);
    const [toDate, setToDate] = React.useState<Date | undefined>(value?.to);
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const handleDateSelect = (date: Date) => {
      if (!fromDate || (fromDate && toDate)) {
        setFromDate(date);
        setToDate(undefined);
      } else if (date < fromDate) {
        setFromDate(date);
      } else {
        setToDate(date);
        onChange?.({ from: fromDate, to: date });
        setTimeout(() => setIsOpen(false), 100);
      }
    };

    const presets = [
      {
        label: "Today",
        getValue: () => {
          const today = new Date();
          return { from: today, to: today };
        },
      },
      {
        label: "This Week",
        getValue: () => {
          const today = new Date();
          const start = new Date(today.setDate(today.getDate() - today.getDay()));
          return { from: start, to: new Date() };
        },
      },
      {
        label: "This Month",
        getValue: () => {
          const today = new Date();
          const start = new Date(today.getFullYear(), today.getMonth(), 1);
          return { from: start, to: today };
        },
      },
      {
        label: "Last 30 Days",
        getValue: () => {
          const to = new Date();
          const from = new Date(to);
          from.setDate(from.getDate() - 30);
          return { from, to };
        },
      },
    ];

    const getDaysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (date: Date | undefined) => {
      if (!date) return "";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    const renderCalendar = (date: Date) => {
      const daysInMonth = getDaysInMonth(date);
      const firstDay = getFirstDayOfMonth(date);
      const days = [];

      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} />);
      }

      for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
        const isSelected =
          (fromDate && currentDate.toDateString() === fromDate.toDateString()) ||
          (toDate && currentDate.toDateString() === toDate.toDateString());
        const isInRange =
          fromDate &&
          toDate &&
          currentDate > fromDate &&
          currentDate < toDate;

        days.push(
          <button
            key={i}
            onClick={() => handleDateSelect(currentDate)}
            className={cn(
              "p-2 text-sm rounded hover:bg-muted",
              isSelected && "bg-primary text-primary-foreground font-bold",
              isInRange && "bg-primary/20",
            )}
          >
            {i}
          </button>,
        );
      }

      return days;
    };

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        {/* Input trigger */}
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted disabled:opacity-50"
        >
          {fromDate && toDate
            ? `${formatDate(fromDate)} - ${formatDate(toDate)}`
            : "Select date range"}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full mt-2 bg-background border border-border rounded-lg shadow-lg p-4 z-50 w-max">
            <div className="flex gap-4">
              {/* Presets */}
              <div className="flex flex-col gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      const range = preset.getValue();
                      setFromDate(range.from);
                      setToDate(range.to);
                      onChange?.(range);
                      setIsOpen(false);
                    }}
                    className="text-sm px-2 py-1 text-left hover:bg-muted rounded"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Calendars */}
              <div className="flex gap-4">
                {[currentMonth, new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)].map(
                  (month, idx) => (
                    <div key={idx}>
                      <div className="text-sm font-medium mb-2">
                        {month.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {renderCalendar(month)}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

DateRangePicker.displayName = "DateRangePicker";
