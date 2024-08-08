import React, { CSSProperties, MouseEvent, memo } from 'react';
import {getMonthDisplayRange, getWeeksNumbers} from '../../utils';
import { StylesType } from '../../styles';
import DayCell, { DayCellProps, DateRange } from '../DayCell';
import { FormatOptions, eachDayOfInterval, endOfDay, endOfWeek, format, isAfter, isBefore, isSameDay, isWeekend, isWithinInterval, startOfDay, startOfMonth, startOfWeek } from 'date-fns';

type MonthProps = {
  style: CSSProperties,
  styles: StylesType,
  month: Date,
  drag: {
    range: DateRange,
    disablePreview: boolean,
    status: boolean
  },
  dateOptions: FormatOptions,
  disabledDates?: Date[],
  date?: Date,
  disabledDay?: (date: Date) => boolean,
  preview?: {
    startDate: Date,
    endDate: Date
  },
  showPreview?: boolean,
  displayMode: "dateRange" | "date",
  minDate?: Date,
  maxDate?: Date,
  ranges?: DayCellProps["ranges"],
  focusedRange?: number[],
  color?: string,
  onPreviewChange?: (date?: Date) => void,
  onDragSelectionStart?: (date: Date) => void,
  onDragSelectionEnd?: (date: Date) => void,
  onDragSelectionMove?: (date: Date) => void,
  onMouseLeave?: (event: MouseEvent<HTMLDivElement>) => void,
  monthDisplayFormat: string,
  weekdayDisplayFormat: string,
  dayDisplayFormat: string,
  showWeekDays?: boolean,
  showMonthName?: boolean,
  fixedHeight?: boolean,
  dayContentRenderer?: (date: Date) => React.ReactElement
  showWeekNumbers?: boolean,
  weeksNumbersLabel?: string,
};

export default memo(function Month({
  style,
  styles,
  month,
  drag,
  dateOptions,
  disabledDates,
  disabledDay,
  preview,
  showPreview,
  date,
  displayMode,
  minDate,
  maxDate,
  ranges,
  color,
  focusedRange,
  onDragSelectionStart,
  onDragSelectionEnd,
  onDragSelectionMove,
  onMouseLeave,
  onPreviewChange,
  monthDisplayFormat,
  weekdayDisplayFormat,
  dayDisplayFormat,
  showWeekDays,
  showMonthName,
  fixedHeight,
  dayContentRenderer,
  showWeekNumbers,
                                     weeksNumbersLabel,
}: MonthProps) {

  const now = new Date();

  const minDateInternal = !!minDate && startOfDay(minDate);
  const maxDateInternal = !!maxDate && endOfDay(maxDate);

  let newMonthDisplayDate = month;

  if (maxDate && (maxDate.getFullYear() < month.getFullYear() || (maxDate.getFullYear() == month.getFullYear() && maxDate.getMonth() < month.getMonth()))) {
    newMonthDisplayDate = startOfMonth(maxDate);
  }

  const monthDisplay = getMonthDisplayRange(newMonthDisplayDate, dateOptions, fixedHeight);

  let rangesInternal = ranges;

  if (displayMode == 'dateRange' && drag.status) {
    const { startDate, endDate } = drag.range;

    rangesInternal = rangesInternal.map((range, i) => {
      if (i !== focusedRange[0]) return range;
      return {
        ...range,
        startDate,
        endDate,
      };
    });
  }

  const showPreviewInternal = showPreview && !drag.disablePreview;

  const weeksNumbers = getWeeksNumbers(monthDisplay.start, monthDisplay.end);

  return (
    <div className={styles.month} style={style}>
      {
        showMonthName ? <div className={styles.monthName}>{format(month, monthDisplayFormat, dateOptions)}</div> : null
      }
      <div className={styles.monthWrapper}>
        {showWeekNumbers && <div className={styles.weekNumbersWrapper}>
          {showWeekDays && <div className={styles.weekNumbersLabel}>{weeksNumbersLabel || 'W'}</div>}
          {
            weeksNumbers.map((weekNumber, i) => {
              return <span key={i}>{weekNumber}</span>
            })
          }
        </div>}
        <div style={{flex: 1}}>
          {
            showWeekDays ? <Weekdays styles={styles} dateOptions={dateOptions} weekdayDisplayFormat={weekdayDisplayFormat} /> : null
          }
          <div className={styles.days} onMouseLeave={onMouseLeave}>
            {
              eachDayOfInterval({ start: monthDisplay.start, end: monthDisplay.end }).map((day: Date, index: number) => {
                const isStartOfMonth = isSameDay(day, monthDisplay.startDateOfMonth);
                const isEndOfMonth = isSameDay(day, monthDisplay.endDateOfMonth);
                const isOutsideMinMax = (minDateInternal && isBefore(day, minDateInternal)) || (maxDateInternal && isAfter(day, maxDateInternal));
                const isDisabledSpecifically = disabledDates.some(disabledDate =>
                  isSameDay(disabledDate, day)
                );

                const isDisabledDay = disabledDay(day);

                return (
                  <DayCell
                    date={date}
                    dayContentRenderer={dayContentRenderer}
                    key={index}
                    onPreviewChange={onPreviewChange}
                    displayMode={displayMode}
                    color={color}
                    dayDisplayFormat={dayDisplayFormat}
                    ranges={rangesInternal}
                    day={day}
                    preview={showPreviewInternal ? preview : null}
                    isWeekend={isWeekend(day)}
                    isToday={isSameDay(day, now)}
                    isStartOfWeek={isSameDay(day, startOfWeek(day, dateOptions))}
                    isEndOfWeek={isSameDay(day, endOfWeek(day, dateOptions))}
                    isStartOfMonth={isStartOfMonth}
                    isEndOfMonth={isEndOfMonth}
                    disabled={isOutsideMinMax || isDisabledSpecifically || isDisabledDay}
                    isPassive={
                      !isWithinInterval(day, {
                        start: monthDisplay.startDateOfMonth,
                        end: monthDisplay.endDateOfMonth,
                      })
                    }
                    styles={styles}
                    onMouseDown={onDragSelectionStart}
                    onMouseUp={onDragSelectionEnd}
                    onMouseEnter={onDragSelectionMove}
                  />
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )

});

type WeekdaysProps = {
  styles: StylesType,
  dateOptions: FormatOptions,
  weekdayDisplayFormat: string
};

function Weekdays({
  styles,
  dateOptions,
  weekdayDisplayFormat
}: WeekdaysProps) {

  const now = new Date();

  return (
    <div className={styles.weekDays}>
      {
        eachDayOfInterval({
          start: startOfWeek(now, dateOptions),
          end: endOfWeek(now, dateOptions)
        }).map((day: Date, i: number) => {
          return (
            <span className={styles.weekDay} key={i}>{format(day, weekdayDisplayFormat, dateOptions)}</span>
          )
        })
      }
    </div>
  )
}