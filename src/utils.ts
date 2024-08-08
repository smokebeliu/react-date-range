import classnames from 'classnames';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  addDays,
  WeekOptions, getISOWeek,
} from 'date-fns';
import { StylesType } from './styles';
import { DateRange } from './components/DayCell';

export function calcFocusDate(currentFocusedDate: Date, shownDate?: Date, date?: Date, months?: number, ranges?: DateRange[], focusedRange?: number[], displayMode?: "dateRange" | "date") {
  // find primary date according the props
  let targetInterval: DateRange;
  if (displayMode === 'dateRange') {
    const range = ranges[focusedRange[0]];
    targetInterval = {
      startDate: range?.startDate,
      endDate: range?.endDate,
    };
  } else {
    targetInterval = {
      startDate: date,
      endDate: date,
    };
  }
  targetInterval.startDate = startOfMonth(targetInterval.startDate || new Date());
  targetInterval.endDate = endOfMonth(targetInterval.endDate || targetInterval.startDate);
  const targetDate = targetInterval.startDate || targetInterval.endDate || shownDate || new Date();

  // initial focus
  if (!currentFocusedDate) return shownDate || targetDate;

  // // just return targetDate for native scrolled calendars
  // if (scroll.enabled) return targetDate;
  if (differenceInCalendarMonths(targetInterval.startDate, targetInterval.endDate) > months) {
    // don't change focused if new selection in view area
    return currentFocusedDate;
  }
  return targetDate;
}

export function findNextRangeIndex(ranges: DateRange[], currentRangeIndex = -1) {

  const nextIndex = ranges.findIndex(
    (range, i) => i > currentRangeIndex && range.autoFocus !== false && !range.disabled
  );

  if (nextIndex !== -1) return nextIndex;
  return ranges.findIndex(range => range.autoFocus !== false && !range.disabled);
}

export function getMonthDisplayRange(date: Date, dateOptions?: WeekOptions, fixedHeight?: boolean) {
  const startDateOfMonth = startOfMonth(date);
  const endDateOfMonth = endOfMonth(date);
  const startDateOfCalendar = startOfWeek(startDateOfMonth, dateOptions);
  let endDateOfCalendar = endOfWeek(endDateOfMonth, dateOptions);
  if (fixedHeight && differenceInCalendarDays(endDateOfCalendar, startDateOfCalendar) <= 34) {
    endDateOfCalendar = addDays(endDateOfCalendar, 7);
  }
  return {
    start: startDateOfCalendar,
    end: endDateOfCalendar,
    startDateOfMonth,
    endDateOfMonth,
  };
}

export function generateStyles(sources: Partial<StylesType>[]) {
  if (!sources.length) return {};
  const generatedStyles = sources
    .filter(source => Boolean(source))
    .reduce((styles, styleSource) => {
      Object.keys(styleSource).forEach(key => {
        styles[key] = classnames(styles[key], styleSource[key]);
      });
      return styles;
    }, {});
  return generatedStyles;
}

export function getWeeksNumbers(start: Date, end: Date) {
  const numbers = [];
  let current = getISOWeek(start);
  while (start < end) {
    numbers.push(current);
    start = addDays(start, 7);
    current = getISOWeek(start);
  }
  return numbers;
}