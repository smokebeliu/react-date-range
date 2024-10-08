import React, { CSSProperties, MouseEvent } from 'react';
import { StylesType } from '../../styles';
import { DayCellProps, DateRange } from '../DayCell';
import { FormatOptions } from 'date-fns';
type MonthProps = {
    style: CSSProperties;
    styles: StylesType;
    month: Date;
    drag: {
        range: DateRange;
        disablePreview: boolean;
        status: boolean;
    };
    dateOptions: FormatOptions;
    disabledDates?: Date[];
    date?: Date;
    disabledDay?: (date: Date) => boolean;
    preview?: {
        startDate: Date;
        endDate: Date;
    };
    showPreview?: boolean;
    displayMode: "dateRange" | "date";
    minDate?: Date;
    maxDate?: Date;
    ranges?: DayCellProps["ranges"];
    focusedRange?: number[];
    color?: string;
    onPreviewChange?: (date?: Date) => void;
    onDragSelectionStart?: (date: Date) => void;
    onDragSelectionEnd?: (date: Date) => void;
    onDragSelectionMove?: (date: Date) => void;
    onMouseLeave?: (event: MouseEvent<HTMLDivElement>) => void;
    monthDisplayFormat: string;
    weekdayDisplayFormat: string;
    dayDisplayFormat: string;
    showWeekDays?: boolean;
    showMonthName?: boolean;
    fixedHeight?: boolean;
    dayContentRenderer?: (date: Date) => React.ReactElement;
    showWeekNumbers?: boolean;
    weeksNumbersLabel?: string;
};
declare const _default: React.NamedExoticComponent<MonthProps>;
export default _default;
