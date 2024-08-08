"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Calendar;
var _react = _interopRequireDefault(require("react"));
var _dateFns = require("date-fns");
var _enUS = require("date-fns/locale/en-US");
var _utils = require("../../utils");
var _styles = _interopRequireDefault(require("../../styles"));
var _DateInput = _interopRequireDefault(require("../DateInput"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactList = _interopRequireDefault(require("react-list"));
var _Month = _interopRequireDefault(require("../Month"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function Calendar(_ref) {
  let {
    showMonthArrow = true,
    showMonthAndYearPickers = true,
    disabledDates = [],
    disabledDay = () => false,
    minDate = (0, _dateFns.addYears)(new Date(), -100),
    maxDate = (0, _dateFns.addYears)(new Date(), 20),
    date,
    onChange,
    onPreviewChange,
    onRangeFocusChange,
    classNames = {},
    locale = _enUS.enUS,
    shownDate,
    onShownDateChange,
    ranges = [],
    preview,
    dateDisplayFormat = 'MMM d, yyyy',
    monthDisplayFormat = 'MMM yyyy',
    weekdayDisplayFormat = 'E',
    weekStartsOn,
    dayDisplayFormat = 'd',
    focusedRange = [0, 0],
    dayContentRenderer,
    months = 1,
    className,
    showDateDisplay = true,
    showPreview = true,
    displayMode = 'date',
    color = '#3d91ff',
    updateRange,
    scroll = {
      enabled: false
    },
    direction = 'vertical',
    startDatePlaceholder = `Early`,
    endDatePlaceholder = `Continuous`,
    rangeColors = ['#3d91ff', '#3ecf8e', '#fed14c'],
    editableDateInputs = false,
    dragSelectionEnabled = true,
    fixedHeight = false,
    calendarFocus = 'forwards',
    preventSnapRefocus = false,
    ariaLabels = {},
    preventScrollToFocusedMonth = false,
    showWeekNumbers = false,
    weeksNumbersLabel
  } = _ref;
  const refs = _react.default.useRef({
    dateOptions: {
      locale,
      weekStartsOn
    },
    styles: (0, _utils.generateStyles)([_styles.default, classNames]),
    listSizeCache: {},
    list: null,
    scroll,
    isFirstRender: true,
    date: date,
    ranges: ranges
  });
  const [state, setState] = _react.default.useState({
    monthNames: getMonthNames(locale),
    focusedDate: (0, _utils.calcFocusDate)(null, shownDate, date, months, ranges, focusedRange, displayMode),
    drag: {
      status: false,
      range: {
        startDate: null,
        endDate: null
      },
      disablePreview: false
    },
    scrollArea: calcScrollArea(direction, months, scroll),
    preview: undefined
  });
  const updateShownDate = () => {
    const newFocus = (0, _utils.calcFocusDate)(state.focusedDate, shownDate, date, months, ranges, focusedRange, displayMode);
    focusToDate(newFocus);
  };
  _react.default.useEffect(() => {
    if (JSON.stringify(ranges) != JSON.stringify(refs.current.ranges) || date?.getTime?.() != refs.current.date?.getTime?.()) {
      refs.current.ranges = ranges;
      refs.current.date = date;
      if (!preventScrollToFocusedMonth) {
        updateShownDate();
      }
    }
    if (refs.current.dateOptions.locale != locale) {
      refs.current.dateOptions.locale = locale;
      setState(s => ({
        ...s,
        monthNames: getMonthNames(locale)
      }));
    }
    refs.current.dateOptions.weekStartsOn = weekStartsOn;
    if (JSON.stringify(refs.current.scroll) != JSON.stringify(scroll)) {
      refs.current.scroll = scroll;
      setState(s => ({
        ...s,
        scrollArea: calcScrollArea(direction, months, scroll)
      }));
    }
  }, [ranges, date, scroll, direction, months, locale, weekStartsOn]);
  _react.default.useEffect(() => {
    if (scroll.enabled) {
      focusToDate(state.focusedDate);
    }
  }, [scroll.enabled]);
  const isVertical = direction === 'vertical';
  const onDragSelectionStart = date => {
    if (dragSelectionEnabled) {
      setState({
        ...state,
        drag: {
          status: true,
          range: {
            startDate: date,
            endDate: date
          },
          disablePreview: false
        }
      });
    } else {
      onChange?.(date);
    }
  };
  const onDragSelectionEnd = date => {
    if (!dragSelectionEnabled) {
      return;
    }
    if (displayMode == 'date' || !state.drag.status) {
      onChange?.(date);
      return;
    }
    const newRange = {
      startDate: state.drag.range.startDate,
      endDate: date
    };
    if (displayMode != 'dateRange' || (0, _dateFns.isSameDay)(newRange.startDate, date)) {
      setState({
        ...state,
        drag: {
          status: false,
          range: {
            startDate: null,
            endDate: null
          },
          disablePreview: state.drag.disablePreview
        }
      });
      onChange?.(date);
    } else {
      setState({
        ...state,
        drag: {
          status: false,
          range: {
            startDate: null,
            endDate: null
          },
          disablePreview: state.drag.disablePreview
        }
      });
      updateRange?.(newRange);
    }
  };
  const onDragSelectionMove = date => {
    if (!state.drag.status || !dragSelectionEnabled) {
      return;
    }
    setState({
      ...state,
      drag: {
        status: state.drag.status,
        range: {
          startDate: state.drag.range.startDate,
          endDate: date
        },
        disablePreview: state.drag.disablePreview
      }
    });
  };
  const handleRangeFocusChange = (rangesIndex, rangeItemIndex) => {
    onRangeFocusChange?.([rangesIndex, rangeItemIndex]);
  };
  const estimateMonthSize = (index, cache) => {
    if (cache) {
      refs.current.listSizeCache = cache;
      if (cache[index]) {
        return cache[index];
      }
    }
    if (direction == 'horizontal') {
      return state.scrollArea.monthWidth;
    }
    const monthStep = (0, _dateFns.addMonths)(minDate, index);
    const {
      start,
      end
    } = (0, _utils.getMonthDisplayRange)(monthStep, refs.current.dateOptions);
    const isLongMonth = (0, _dateFns.differenceInDays)(end, start) + 1 > 7 * 5;
    return isLongMonth ? state.scrollArea.longMonthHeight : state.scrollArea.monthHeight;
  };
  const handleScroll = () => {
    const visibleMonths = refs.current.list.getVisibleRange();
    if (visibleMonths[0] === undefined) return;
    const visibleMonth = (0, _dateFns.addMonths)(minDate, visibleMonths[0] || 0);
    const isFocusedToDifferent = !(0, _dateFns.isSameMonth)(visibleMonth, state.focusedDate);
    if (isFocusedToDifferent && !refs.current.isFirstRender) {
      setState(s => ({
        ...s,
        focusedDate: visibleMonth
      }));
      onShownDateChange?.(visibleMonth);
    }
    refs.current.isFirstRender = false;
  };
  const updatePreview = val => {
    if (!val) {
      setState(s => ({
        ...s,
        preview: undefined
      }));
      return;
    }
    const preview = {
      startDate: val,
      endDate: val,
      color: color
    };
    setState(s => ({
      ...s,
      preview
    }));
  };
  const focusToDate = function (date) {
    let preventUnnecessary = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    if (!scroll.enabled) {
      if (preventUnnecessary && preventSnapRefocus) {
        const focusedDateDiff = (0, _dateFns.differenceInCalendarMonths)(date, state.focusedDate);
        const isAllowedForward = calendarFocus === 'forwards' && focusedDateDiff >= 0;
        const isAllowedBackward = calendarFocus === 'backwards' && focusedDateDiff <= 0;
        if ((isAllowedForward || isAllowedBackward) && Math.abs(focusedDateDiff) < months) {
          return;
        }
      }
      setState(s => ({
        ...s,
        focusedDate: date
      }));
      return;
    }
    const targetMonthIndex = (0, _dateFns.differenceInCalendarMonths)(date, minDate);
    const visibleMonths = refs.current.list.getVisibleRange();
    if (preventUnnecessary && visibleMonths.includes(targetMonthIndex)) return;
    refs.current.isFirstRender = true;
    refs.current.list.scrollTo(targetMonthIndex);
    setState(s => ({
      ...s,
      focusedDate: date
    }));
  };
  const changeShownDate = function (value) {
    let mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "set";
    const modeMapper = {
      monthOffset: () => (0, _dateFns.addMonths)(state.focusedDate, value),
      setMonth: () => (0, _dateFns.setMonth)(state.focusedDate, value),
      setYear: () => (0, _dateFns.setYear)(state.focusedDate, value),
      set: () => value
    };
    const newDate = (0, _dateFns.min)([(0, _dateFns.max)([modeMapper[mode](), minDate]), maxDate]);
    focusToDate(newDate, false);
    onShownDateChange?.(newDate);
  };
  const rangesInternal = ranges.map((range, i) => ({
    ...range,
    color: range.color || rangeColors[i] || color
  }));
  return /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(refs.current.styles.calendarWrapper, className),
    onMouseUp: () => {
      setState({
        ...state,
        drag: {
          status: false,
          range: {
            startDate: null,
            endDate: null
          },
          disablePreview: false
        }
      });
    },
    onMouseLeave: () => {
      setState({
        ...state,
        drag: {
          status: false,
          range: {
            startDate: null,
            endDate: null
          },
          disablePreview: false
        }
      });
    }
  }, showDateDisplay ? /*#__PURE__*/_react.default.createElement(DateDisplay, {
    onDragSelectionEnd: onDragSelectionEnd,
    handleRangeFocusChange: handleRangeFocusChange,
    dateOptions: refs.current.dateOptions,
    ariaLabels: ariaLabels,
    styles: refs.current.styles,
    startDatePlaceholder: startDatePlaceholder,
    endDatePlaceholder: endDatePlaceholder,
    editableDateInputs: editableDateInputs,
    focusedRange: focusedRange,
    color: color,
    ranges: rangesInternal,
    rangeColors: rangeColors,
    dateDisplayFormat: dateDisplayFormat
  }) : null, /*#__PURE__*/_react.default.createElement(MonthAndYear, {
    monthNames: state.monthNames,
    focusedDate: state.focusedDate,
    changeShownDate: changeShownDate,
    styles: refs.current.styles,
    showMonthAndYearPickers: showMonthAndYearPickers,
    showMonthArrow: showMonthArrow,
    minDate: minDate,
    maxDate: maxDate,
    ariaLabels: ariaLabels
  }), scroll.enabled ? /*#__PURE__*/_react.default.createElement("div", null, isVertical ? /*#__PURE__*/_react.default.createElement(Weekdays, {
    styles: refs.current.styles,
    dateOptions: refs.current.dateOptions,
    weekdayDisplayFormat: weekdayDisplayFormat
  }) : null, /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(refs.current.styles.infiniteMonths, isVertical ? refs.current.styles.monthsVertical : refs.current.styles.monthsHorizontal),
    onMouseLeave: () => onPreviewChange?.(),
    style: {
      width: typeof state.scrollArea.calendarWidth === 'string' ? state.scrollArea.calendarWidth : (state.scrollArea.calendarWidth || 0) + 11,
      height: state.scrollArea.calendarHeight + 11
    },
    onScroll: handleScroll
  }, /*#__PURE__*/_react.default.createElement(_reactList.default, {
    length: (0, _dateFns.differenceInCalendarMonths)((0, _dateFns.endOfMonth)(maxDate), (0, _dateFns.addDays)((0, _dateFns.startOfMonth)(minDate), -1)),
    type: "variable",
    ref: target => {
      refs.current.list = target;
    },
    itemSizeEstimator: estimateMonthSize,
    axis: isVertical ? 'y' : 'x',
    itemRenderer: (index, key) => {
      const monthStep = (0, _dateFns.addMonths)(minDate, index);
      return /*#__PURE__*/_react.default.createElement(_Month.default, {
        dayContentRenderer: dayContentRenderer,
        fixedHeight: fixedHeight,
        showPreview: showPreview,
        weekdayDisplayFormat: weekdayDisplayFormat,
        dayDisplayFormat: dayDisplayFormat,
        displayMode: displayMode,
        onPreviewChange: onPreviewChange || updatePreview,
        preview: preview || state.preview,
        ranges: rangesInternal,
        key: key,
        focusedRange: focusedRange,
        drag: state.drag,
        monthDisplayFormat: monthDisplayFormat,
        dateOptions: refs.current.dateOptions,
        disabledDates: disabledDates,
        disabledDay: disabledDay,
        month: monthStep,
        onDragSelectionStart: onDragSelectionStart,
        onDragSelectionEnd: onDragSelectionEnd,
        onDragSelectionMove: onDragSelectionMove,
        onMouseLeave: () => onPreviewChange?.(),
        styles: refs.current.styles,
        style: isVertical ? {
          height: estimateMonthSize(index)
        } : {
          height: state.scrollArea.monthHeight,
          width: estimateMonthSize(index)
        },
        showMonthName: true,
        showWeekDays: !isVertical,
        color: color,
        maxDate: maxDate,
        minDate: minDate,
        date: date,
        weeksNumbersLabel: weeksNumbersLabel,
        showWeekNumbers: showWeekNumbers
      });
    }
  }))) : /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(refs.current.styles.months, isVertical ? refs.current.styles.monthsVertical : refs.current.styles.monthsHorizontal)
  }, new Array(months).fill(null).map((_, i) => {
    let monthStep = (0, _dateFns.addMonths)(state.focusedDate, i);
    ;
    if (calendarFocus === 'backwards') {
      monthStep = (0, _dateFns.subMonths)(state.focusedDate, months - 1 - i);
    }
    return /*#__PURE__*/_react.default.createElement(_Month.default, {
      dayContentRenderer: dayContentRenderer,
      fixedHeight: fixedHeight,
      weekdayDisplayFormat: weekdayDisplayFormat,
      dayDisplayFormat: dayDisplayFormat,
      monthDisplayFormat: monthDisplayFormat,
      style: {},
      showPreview: showPreview,
      displayMode: displayMode,
      onPreviewChange: onPreviewChange || updatePreview,
      preview: preview || state.preview,
      ranges: rangesInternal,
      key: i,
      drag: state.drag,
      focusedRange: focusedRange,
      dateOptions: refs.current.dateOptions,
      disabledDates: disabledDates,
      disabledDay: disabledDay,
      month: monthStep,
      onDragSelectionStart: onDragSelectionStart,
      onDragSelectionEnd: onDragSelectionEnd,
      onDragSelectionMove: onDragSelectionMove,
      onMouseLeave: () => onPreviewChange?.(),
      styles: refs.current.styles,
      showWeekDays: !isVertical || i === 0,
      showMonthName: !isVertical || i > 0,
      color: color,
      maxDate: maxDate,
      minDate: minDate,
      date: date,
      weeksNumbersLabel: weeksNumbersLabel,
      showWeekNumbers: showWeekNumbers
    });
  })));
}
function MonthAndYear(_ref2) {
  let {
    styles,
    showMonthArrow,
    minDate,
    maxDate,
    ariaLabels,
    focusedDate,
    showMonthAndYearPickers,
    changeShownDate,
    monthNames
  } = _ref2;
  const upperYearLimit = maxDate.getFullYear();
  const lowerYearLimit = minDate.getFullYear();
  return /*#__PURE__*/_react.default.createElement("div", {
    onMouseUp: e => e.stopPropagation(),
    className: styles.monthAndYearWrapper
  }, showMonthArrow ? /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    className: (0, _classnames.default)(styles.nextPrevButton, styles.prevButton),
    onClick: () => changeShownDate(-1, 'monthOffset'),
    "aria-label": ariaLabels.prevButton
  }, /*#__PURE__*/_react.default.createElement("i", null)) : null, showMonthAndYearPickers ? /*#__PURE__*/_react.default.createElement("span", {
    className: styles.monthAndYearPickers
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: styles.monthPicker
  }, /*#__PURE__*/_react.default.createElement("select", {
    value: focusedDate.getMonth(),
    onChange: e => changeShownDate(Number(e.target.value), 'setMonth'),
    "aria-label": ariaLabels.monthPicker
  }, monthNames.map((monthName, i) => /*#__PURE__*/_react.default.createElement("option", {
    key: i,
    value: i
  }, monthName)))), /*#__PURE__*/_react.default.createElement("span", {
    className: styles.monthAndYearDivider
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: styles.yearPicker
  }, /*#__PURE__*/_react.default.createElement("select", {
    value: focusedDate.getFullYear(),
    onChange: e => changeShownDate(Number(e.target.value), 'setYear'),
    "aria-label": ariaLabels.yearPicker
  }, new Array(upperYearLimit - lowerYearLimit + 1).fill(upperYearLimit).map((val, i) => {
    const year = val - i;
    return /*#__PURE__*/_react.default.createElement("option", {
      key: year,
      value: year
    }, year);
  })))) : /*#__PURE__*/_react.default.createElement("span", {
    className: styles.monthAndYearPickers
  }, monthNames[focusedDate.getMonth()], " ", focusedDate.getFullYear()), showMonthArrow ? /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    className: (0, _classnames.default)(styles.nextPrevButton, styles.nextButton),
    onClick: () => changeShownDate(+1, 'monthOffset'),
    "aria-label": ariaLabels.nextButton
  }, /*#__PURE__*/_react.default.createElement("i", null)) : null);
}
function Weekdays(_ref3) {
  let {
    styles,
    dateOptions,
    weekdayDisplayFormat
  } = _ref3;
  const now = new Date();
  return /*#__PURE__*/_react.default.createElement("div", {
    className: styles.weekDays
  }, (0, _dateFns.eachDayOfInterval)({
    start: (0, _dateFns.startOfWeek)(now, dateOptions),
    end: (0, _dateFns.endOfWeek)(now, dateOptions)
  }).map((day, i) => /*#__PURE__*/_react.default.createElement("span", {
    className: styles.weekDay,
    key: i
  }, (0, _dateFns.format)(day, weekdayDisplayFormat, dateOptions))));
}
function DateDisplay(_ref4) {
  let {
    focusedRange,
    color,
    ranges,
    rangeColors,
    dateDisplayFormat,
    editableDateInputs,
    startDatePlaceholder,
    endDatePlaceholder,
    ariaLabels,
    styles,
    dateOptions,
    onDragSelectionEnd,
    handleRangeFocusChange
  } = _ref4;
  const defaultColor = rangeColors[focusedRange[0]] || color;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: styles.dateDisplayWrapper
  }, ranges.map((range, i) => {
    if (range.showDateDisplay === false || range.disabled && !range.showDateDisplay) return null;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: styles.dateDisplay,
      key: i,
      style: {
        color: range.color || defaultColor
      }
    }, /*#__PURE__*/_react.default.createElement(_DateInput.default, {
      className: (0, _classnames.default)(styles.dateDisplayItem, {
        [styles.dateDisplayItemActive]: focusedRange[0] === i && focusedRange[1] === 0
      }),
      readOnly: !editableDateInputs,
      disabled: range.disabled,
      value: range.startDate,
      placeholder: startDatePlaceholder,
      dateOptions: dateOptions,
      dateDisplayFormat: dateDisplayFormat,
      ariaLabel: ariaLabels.dateInput && ariaLabels.dateInput[range.key] && ariaLabels.dateInput[range.key].startDate,
      onChange: onDragSelectionEnd,
      onFocus: () => handleRangeFocusChange(i, 0)
    }), /*#__PURE__*/_react.default.createElement(_DateInput.default, {
      className: (0, _classnames.default)(styles.dateDisplayItem, {
        [styles.dateDisplayItemActive]: focusedRange[0] === i && focusedRange[1] === 1
      }),
      readOnly: !editableDateInputs,
      disabled: range.disabled,
      value: range.endDate,
      placeholder: endDatePlaceholder,
      dateOptions: dateOptions,
      dateDisplayFormat: dateDisplayFormat,
      ariaLabel: ariaLabels.dateInput && ariaLabels.dateInput[range.key] && ariaLabels.dateInput[range.key].endDate,
      onChange: onDragSelectionEnd,
      onFocus: () => handleRangeFocusChange(i, 1)
    }));
  }));
}
function getMonthNames(locale) {
  return [...Array(12).keys()].map(i => locale.localize.month(i));
}
function calcScrollArea(direction, months, scroll) {
  if (!scroll.enabled) return {
    enabled: false
  };
  const longMonthHeight = scroll.longMonthHeight || scroll.monthHeight;
  if (direction === 'vertical') {
    return {
      enabled: true,
      monthHeight: scroll.monthHeight || 220,
      longMonthHeight: longMonthHeight || 260,
      calendarWidth: 'auto',
      calendarHeight: (scroll.calendarHeight || longMonthHeight || 240) * months
    };
  }
  return {
    enabled: true,
    monthWidth: scroll.monthWidth || 332,
    calendarWidth: (scroll.calendarWidth || scroll.monthWidth || 332) * months,
    monthHeight: longMonthHeight || 300,
    calendarHeight: longMonthHeight || 300
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9kYXRlRm5zIiwiX2VuVVMiLCJfdXRpbHMiLCJfc3R5bGVzIiwiX0RhdGVJbnB1dCIsIl9jbGFzc25hbWVzIiwiX3JlYWN0TGlzdCIsIl9Nb250aCIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiQ2FsZW5kYXIiLCJfcmVmIiwic2hvd01vbnRoQXJyb3ciLCJzaG93TW9udGhBbmRZZWFyUGlja2VycyIsImRpc2FibGVkRGF0ZXMiLCJkaXNhYmxlZERheSIsIm1pbkRhdGUiLCJhZGRZZWFycyIsIkRhdGUiLCJtYXhEYXRlIiwiZGF0ZSIsIm9uQ2hhbmdlIiwib25QcmV2aWV3Q2hhbmdlIiwib25SYW5nZUZvY3VzQ2hhbmdlIiwiY2xhc3NOYW1lcyIsImxvY2FsZSIsImVuVVMiLCJzaG93bkRhdGUiLCJvblNob3duRGF0ZUNoYW5nZSIsInJhbmdlcyIsInByZXZpZXciLCJkYXRlRGlzcGxheUZvcm1hdCIsIm1vbnRoRGlzcGxheUZvcm1hdCIsIndlZWtkYXlEaXNwbGF5Rm9ybWF0Iiwid2Vla1N0YXJ0c09uIiwiZGF5RGlzcGxheUZvcm1hdCIsImZvY3VzZWRSYW5nZSIsImRheUNvbnRlbnRSZW5kZXJlciIsIm1vbnRocyIsImNsYXNzTmFtZSIsInNob3dEYXRlRGlzcGxheSIsInNob3dQcmV2aWV3IiwiZGlzcGxheU1vZGUiLCJjb2xvciIsInVwZGF0ZVJhbmdlIiwic2Nyb2xsIiwiZW5hYmxlZCIsImRpcmVjdGlvbiIsInN0YXJ0RGF0ZVBsYWNlaG9sZGVyIiwiZW5kRGF0ZVBsYWNlaG9sZGVyIiwicmFuZ2VDb2xvcnMiLCJlZGl0YWJsZURhdGVJbnB1dHMiLCJkcmFnU2VsZWN0aW9uRW5hYmxlZCIsImZpeGVkSGVpZ2h0IiwiY2FsZW5kYXJGb2N1cyIsInByZXZlbnRTbmFwUmVmb2N1cyIsImFyaWFMYWJlbHMiLCJwcmV2ZW50U2Nyb2xsVG9Gb2N1c2VkTW9udGgiLCJzaG93V2Vla051bWJlcnMiLCJ3ZWVrc051bWJlcnNMYWJlbCIsInJlZnMiLCJSZWFjdCIsInVzZVJlZiIsImRhdGVPcHRpb25zIiwic3R5bGVzIiwiZ2VuZXJhdGVTdHlsZXMiLCJjb3JlU3R5bGVzIiwibGlzdFNpemVDYWNoZSIsImxpc3QiLCJpc0ZpcnN0UmVuZGVyIiwic3RhdGUiLCJzZXRTdGF0ZSIsInVzZVN0YXRlIiwibW9udGhOYW1lcyIsImdldE1vbnRoTmFtZXMiLCJmb2N1c2VkRGF0ZSIsImNhbGNGb2N1c0RhdGUiLCJkcmFnIiwic3RhdHVzIiwicmFuZ2UiLCJzdGFydERhdGUiLCJlbmREYXRlIiwiZGlzYWJsZVByZXZpZXciLCJzY3JvbGxBcmVhIiwiY2FsY1Njcm9sbEFyZWEiLCJ1bmRlZmluZWQiLCJ1cGRhdGVTaG93bkRhdGUiLCJuZXdGb2N1cyIsImZvY3VzVG9EYXRlIiwidXNlRWZmZWN0IiwiSlNPTiIsInN0cmluZ2lmeSIsImN1cnJlbnQiLCJnZXRUaW1lIiwicyIsImlzVmVydGljYWwiLCJvbkRyYWdTZWxlY3Rpb25TdGFydCIsIm9uRHJhZ1NlbGVjdGlvbkVuZCIsIm5ld1JhbmdlIiwiaXNTYW1lRGF5Iiwib25EcmFnU2VsZWN0aW9uTW92ZSIsImhhbmRsZVJhbmdlRm9jdXNDaGFuZ2UiLCJyYW5nZXNJbmRleCIsInJhbmdlSXRlbUluZGV4IiwiZXN0aW1hdGVNb250aFNpemUiLCJpbmRleCIsImNhY2hlIiwibW9udGhXaWR0aCIsIm1vbnRoU3RlcCIsImFkZE1vbnRocyIsInN0YXJ0IiwiZW5kIiwiZ2V0TW9udGhEaXNwbGF5UmFuZ2UiLCJpc0xvbmdNb250aCIsImRpZmZlcmVuY2VJbkRheXMiLCJsb25nTW9udGhIZWlnaHQiLCJtb250aEhlaWdodCIsImhhbmRsZVNjcm9sbCIsInZpc2libGVNb250aHMiLCJnZXRWaXNpYmxlUmFuZ2UiLCJ2aXNpYmxlTW9udGgiLCJpc0ZvY3VzZWRUb0RpZmZlcmVudCIsImlzU2FtZU1vbnRoIiwidXBkYXRlUHJldmlldyIsInZhbCIsInByZXZlbnRVbm5lY2Vzc2FyeSIsImFyZ3VtZW50cyIsImxlbmd0aCIsImZvY3VzZWREYXRlRGlmZiIsImRpZmZlcmVuY2VJbkNhbGVuZGFyTW9udGhzIiwiaXNBbGxvd2VkRm9yd2FyZCIsImlzQWxsb3dlZEJhY2t3YXJkIiwiTWF0aCIsImFicyIsInRhcmdldE1vbnRoSW5kZXgiLCJpbmNsdWRlcyIsInNjcm9sbFRvIiwiY2hhbmdlU2hvd25EYXRlIiwidmFsdWUiLCJtb2RlIiwibW9kZU1hcHBlciIsIm1vbnRoT2Zmc2V0Iiwic2V0TW9udGgiLCJzZXRZZWFyIiwic2V0IiwibmV3RGF0ZSIsIm1pbiIsIm1heCIsInJhbmdlc0ludGVybmFsIiwibWFwIiwiaSIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc25hbWVzIiwiY2FsZW5kYXJXcmFwcGVyIiwib25Nb3VzZVVwIiwib25Nb3VzZUxlYXZlIiwiRGF0ZURpc3BsYXkiLCJNb250aEFuZFllYXIiLCJXZWVrZGF5cyIsImluZmluaXRlTW9udGhzIiwibW9udGhzVmVydGljYWwiLCJtb250aHNIb3Jpem9udGFsIiwic3R5bGUiLCJ3aWR0aCIsImNhbGVuZGFyV2lkdGgiLCJoZWlnaHQiLCJjYWxlbmRhckhlaWdodCIsIm9uU2Nyb2xsIiwiZW5kT2ZNb250aCIsImFkZERheXMiLCJzdGFydE9mTW9udGgiLCJ0eXBlIiwicmVmIiwidGFyZ2V0IiwiaXRlbVNpemVFc3RpbWF0b3IiLCJheGlzIiwiaXRlbVJlbmRlcmVyIiwia2V5IiwibW9udGgiLCJzaG93TW9udGhOYW1lIiwic2hvd1dlZWtEYXlzIiwiQXJyYXkiLCJmaWxsIiwiXyIsInN1Yk1vbnRocyIsIl9yZWYyIiwidXBwZXJZZWFyTGltaXQiLCJnZXRGdWxsWWVhciIsImxvd2VyWWVhckxpbWl0IiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIm1vbnRoQW5kWWVhcldyYXBwZXIiLCJuZXh0UHJldkJ1dHRvbiIsInByZXZCdXR0b24iLCJvbkNsaWNrIiwibW9udGhBbmRZZWFyUGlja2VycyIsIm1vbnRoUGlja2VyIiwiZ2V0TW9udGgiLCJOdW1iZXIiLCJtb250aE5hbWUiLCJtb250aEFuZFllYXJEaXZpZGVyIiwieWVhclBpY2tlciIsInllYXIiLCJuZXh0QnV0dG9uIiwiX3JlZjMiLCJub3ciLCJ3ZWVrRGF5cyIsImVhY2hEYXlPZkludGVydmFsIiwic3RhcnRPZldlZWsiLCJlbmRPZldlZWsiLCJkYXkiLCJ3ZWVrRGF5IiwiZm9ybWF0IiwiX3JlZjQiLCJkZWZhdWx0Q29sb3IiLCJkYXRlRGlzcGxheVdyYXBwZXIiLCJkaXNhYmxlZCIsImRhdGVEaXNwbGF5IiwiZGF0ZURpc3BsYXlJdGVtIiwiZGF0ZURpc3BsYXlJdGVtQWN0aXZlIiwicmVhZE9ubHkiLCJwbGFjZWhvbGRlciIsImFyaWFMYWJlbCIsImRhdGVJbnB1dCIsIm9uRm9jdXMiLCJrZXlzIiwibG9jYWxpemUiXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9DYWxlbmRhci9pbmRleC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFN0eWxlc1R5cGUgfSBmcm9tICcuLi8uLi9zdHlsZXMnO1xuaW1wb3J0IHsgQXJpYUxhYmVsc1R5cGUgfSBmcm9tICcuLi8uLi9hY2Nlc3NpYmlsaXR5JztcbmltcG9ydCB7IExvY2FsZSwgV2Vla09wdGlvbnMsIE1vbnRoIGFzIEZOU01vbnRoLCBhZGREYXlzLCBhZGRNb250aHMsIGFkZFllYXJzLCBkaWZmZXJlbmNlSW5DYWxlbmRhck1vbnRocywgZGlmZmVyZW5jZUluRGF5cywgZWFjaERheU9mSW50ZXJ2YWwsIGVuZE9mTW9udGgsIGVuZE9mV2VlaywgZm9ybWF0LCBpc1NhbWVEYXksIHN0YXJ0T2ZNb250aCwgc3RhcnRPZldlZWssIHN1Yk1vbnRocywgaXNTYW1lTW9udGgsIEZvcm1hdE9wdGlvbnMsIFBhcnNlT3B0aW9ucywgc2V0TW9udGgsIHNldFllYXIsIG1pbiwgbWF4IH0gZnJvbSAnZGF0ZS1mbnMnO1xuaW1wb3J0IHsgRGF0ZVJhbmdlIH0gZnJvbSAnLi4vRGF5Q2VsbCc7XG5pbXBvcnQgeyBlblVTIH0gZnJvbSAnZGF0ZS1mbnMvbG9jYWxlL2VuLVVTJztcbmltcG9ydCB7IGNhbGNGb2N1c0RhdGUsIGdlbmVyYXRlU3R5bGVzLCBnZXRNb250aERpc3BsYXlSYW5nZSB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCBjb3JlU3R5bGVzIGZyb20gJy4uLy4uL3N0eWxlcyc7XG5pbXBvcnQgRGF0ZUlucHV0IGZyb20gJy4uL0RhdGVJbnB1dCc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBSZWFjdExpc3QgZnJvbSAncmVhY3QtbGlzdCc7XG5pbXBvcnQgTW9udGggZnJvbSAnLi4vTW9udGgnO1xuXG5leHBvcnQgdHlwZSBDYWxlbmRhclByb3BzID0ge1xuICBzaG93TW9udGhBcnJvdz86IGJvb2xlYW4sXG4gIHNob3dNb250aEFuZFllYXJQaWNrZXJzPzogYm9vbGVhbixcbiAgZGlzYWJsZWREYXRlcz86IERhdGVbXSxcbiAgZGlzYWJsZWREYXk/OiAoZGF0ZTogRGF0ZSkgPT4gYm9vbGVhbixcbiAgbWluRGF0ZT86IERhdGUsXG4gIG1heERhdGU/OiBEYXRlLFxuICBkYXRlPzogRGF0ZSxcbiAgb25DaGFuZ2U/OiAoZGF0ZTogRGF0ZSkgPT4gdm9pZCxcbiAgb25QcmV2aWV3Q2hhbmdlPzogKGRhdGU/OiBEYXRlKSA9PiB2b2lkLFxuICBvblJhbmdlRm9jdXNDaGFuZ2U/OiAocmFuZ2U6IG51bWJlcltdKSA9PiB2b2lkLFxuICBjbGFzc05hbWVzPzogUGFydGlhbDxTdHlsZXNUeXBlPixcbiAgbG9jYWxlPzogTG9jYWxlLFxuICBzaG93bkRhdGU/OiBEYXRlLFxuICBvblNob3duRGF0ZUNoYW5nZT86IChkYXRlOiBEYXRlKSA9PiB2b2lkLFxuICByYW5nZXM/OiBEYXRlUmFuZ2VbXSxcbiAgcHJldmlldz86IHtcbiAgICBzdGFydERhdGU/OiBEYXRlLFxuICAgIGVuZERhdGU/OiBEYXRlLFxuICAgIGNvbG9yPzogc3RyaW5nXG4gIH0sXG4gIGRhdGVEaXNwbGF5Rm9ybWF0Pzogc3RyaW5nLFxuICBtb250aERpc3BsYXlGb3JtYXQ/OiBzdHJpbmcsXG4gIHdlZWtkYXlEaXNwbGF5Rm9ybWF0Pzogc3RyaW5nLFxuICB3ZWVrU3RhcnRzT24/OiBudW1iZXIsXG4gIGRheURpc3BsYXlGb3JtYXQ/OiBzdHJpbmcsXG4gIGZvY3VzZWRSYW5nZT86IG51bWJlcltdLFxuICBkYXlDb250ZW50UmVuZGVyZXI/OiAoZGF0ZTogRGF0ZSkgPT4gUmVhY3QuUmVhY3RFbGVtZW50LFxuICBpbml0aWFsRm9jdXNlZFJhbmdlPzogbnVtYmVyW10sXG4gIG1vbnRocz86IG51bWJlcixcbiAgY2xhc3NOYW1lPzogc3RyaW5nLFxuICBzaG93RGF0ZURpc3BsYXk/OiBib29sZWFuLFxuICBzaG93UHJldmlldz86IGJvb2xlYW4sXG4gIGRpc3BsYXlNb2RlPzogXCJkYXRlUmFuZ2VcIiB8IFwiZGF0ZVwiLFxuICBjb2xvcj86IHN0cmluZyxcbiAgdXBkYXRlUmFuZ2U/OiAocmFuZ2U6IERhdGVSYW5nZSkgPT4gdm9pZCxcbiAgc2Nyb2xsPzoge1xuICAgIGVuYWJsZWQ/OiBib29sZWFuLFxuICAgIG1vbnRoSGVpZ2h0PzogbnVtYmVyLFxuICAgIGxvbmdNb250aEhlaWdodD86IG51bWJlcixcbiAgICBtb250aFdpZHRoPzogbnVtYmVyLFxuICAgIGNhbGVuZGFyV2lkdGg/OiBudW1iZXIsXG4gICAgY2FsZW5kYXJIZWlnaHQ/OiBudW1iZXJcbiAgfSxcbiAgZGlyZWN0aW9uPzogJ3ZlcnRpY2FsJyB8ICdob3Jpem9udGFsJyxcbiAgc3RhcnREYXRlUGxhY2Vob2xkZXI/OiBzdHJpbmcsXG4gIGVuZERhdGVQbGFjZWhvbGRlcj86IHN0cmluZyxcbiAgcmFuZ2VDb2xvcnM/OiBzdHJpbmdbXSxcbiAgZWRpdGFibGVEYXRlSW5wdXRzPzogYm9vbGVhbixcbiAgZHJhZ1NlbGVjdGlvbkVuYWJsZWQ/OiBib29sZWFuLFxuICBmaXhlZEhlaWdodD86IGJvb2xlYW4sXG4gIGNhbGVuZGFyRm9jdXM/OiBcImZvcndhcmRzXCIgfCBcImJhY2t3YXJkc1wiLFxuICBwcmV2ZW50U25hcFJlZm9jdXM/OiBib29sZWFuLFxuICBhcmlhTGFiZWxzPzogQXJpYUxhYmVsc1R5cGUsXG4gIHByZXZlbnRTY3JvbGxUb0ZvY3VzZWRNb250aD86IGJvb2xlYW5cbiAgc2hvd1dlZWtOdW1iZXJzPzogYm9vbGVhbixcbiAgd2Vla3NOdW1iZXJzTGFiZWw/OiBzdHJpbmcsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDYWxlbmRhcih7XG4gIHNob3dNb250aEFycm93ID0gdHJ1ZSxcbiAgc2hvd01vbnRoQW5kWWVhclBpY2tlcnMgPSB0cnVlLFxuICBkaXNhYmxlZERhdGVzID0gW10sXG4gIGRpc2FibGVkRGF5ID0gKCkgPT4gZmFsc2UsXG4gIG1pbkRhdGUgPSBhZGRZZWFycyhuZXcgRGF0ZSgpLCAtMTAwKSxcbiAgbWF4RGF0ZSA9IGFkZFllYXJzKG5ldyBEYXRlKCksIDIwKSxcbiAgZGF0ZSxcbiAgb25DaGFuZ2UsXG4gIG9uUHJldmlld0NoYW5nZSxcbiAgb25SYW5nZUZvY3VzQ2hhbmdlLFxuICBjbGFzc05hbWVzID0ge30sXG4gIGxvY2FsZSA9IGVuVVMsXG4gIHNob3duRGF0ZSxcbiAgb25TaG93bkRhdGVDaGFuZ2UsXG4gIHJhbmdlcyA9IFtdLFxuICBwcmV2aWV3LFxuICBkYXRlRGlzcGxheUZvcm1hdCA9ICdNTU0gZCwgeXl5eScsXG4gIG1vbnRoRGlzcGxheUZvcm1hdCA9ICdNTU0geXl5eScsXG4gIHdlZWtkYXlEaXNwbGF5Rm9ybWF0ID0gJ0UnLFxuICB3ZWVrU3RhcnRzT24sXG4gIGRheURpc3BsYXlGb3JtYXQgPSAnZCcsXG4gIGZvY3VzZWRSYW5nZSA9IFswLCAwXSxcbiAgZGF5Q29udGVudFJlbmRlcmVyLFxuICBtb250aHMgPSAxLFxuICBjbGFzc05hbWUsXG4gIHNob3dEYXRlRGlzcGxheSA9IHRydWUsXG4gIHNob3dQcmV2aWV3ID0gdHJ1ZSxcbiAgZGlzcGxheU1vZGUgPSAnZGF0ZScsXG4gIGNvbG9yID0gJyMzZDkxZmYnLFxuICB1cGRhdGVSYW5nZSxcbiAgc2Nyb2xsID0ge1xuICAgIGVuYWJsZWQ6IGZhbHNlXG4gIH0sXG4gIGRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCcsXG4gIHN0YXJ0RGF0ZVBsYWNlaG9sZGVyID0gYEVhcmx5YCxcbiAgZW5kRGF0ZVBsYWNlaG9sZGVyID0gYENvbnRpbnVvdXNgLFxuICByYW5nZUNvbG9ycyA9IFsnIzNkOTFmZicsICcjM2VjZjhlJywgJyNmZWQxNGMnXSxcbiAgZWRpdGFibGVEYXRlSW5wdXRzID0gZmFsc2UsXG4gIGRyYWdTZWxlY3Rpb25FbmFibGVkID0gdHJ1ZSxcbiAgZml4ZWRIZWlnaHQgPSBmYWxzZSxcbiAgY2FsZW5kYXJGb2N1cyA9ICdmb3J3YXJkcycsXG4gIHByZXZlbnRTbmFwUmVmb2N1cyA9IGZhbHNlLFxuICBhcmlhTGFiZWxzID0ge30sXG4gIHByZXZlbnRTY3JvbGxUb0ZvY3VzZWRNb250aCA9IGZhbHNlLFxuICBzaG93V2Vla051bWJlcnMgPSBmYWxzZSxcbiAgd2Vla3NOdW1iZXJzTGFiZWwsXG59OiBDYWxlbmRhclByb3BzKSB7XG5cbiAgY29uc3QgcmVmcyA9IFJlYWN0LnVzZVJlZih7XG4gICAgZGF0ZU9wdGlvbnM6IHtcbiAgICAgIGxvY2FsZSxcbiAgICAgIHdlZWtTdGFydHNPblxuICAgIH0sXG4gICAgc3R5bGVzOiBnZW5lcmF0ZVN0eWxlcyhbY29yZVN0eWxlcywgY2xhc3NOYW1lc10pLFxuICAgIGxpc3RTaXplQ2FjaGU6IHt9LFxuICAgIGxpc3Q6IG51bGwsXG4gICAgc2Nyb2xsLFxuICAgIGlzRmlyc3RSZW5kZXI6IHRydWUsXG4gICAgZGF0ZTogZGF0ZSxcbiAgICByYW5nZXM6IHJhbmdlc1xuICB9KTtcblxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IFJlYWN0LnVzZVN0YXRlKHtcbiAgICBtb250aE5hbWVzOiBnZXRNb250aE5hbWVzKGxvY2FsZSksXG4gICAgZm9jdXNlZERhdGU6IGNhbGNGb2N1c0RhdGUobnVsbCwgc2hvd25EYXRlLCBkYXRlLCBtb250aHMsIHJhbmdlcywgZm9jdXNlZFJhbmdlLCBkaXNwbGF5TW9kZSksXG4gICAgZHJhZzoge1xuICAgICAgc3RhdHVzOiBmYWxzZSxcbiAgICAgIHJhbmdlOiB7IHN0YXJ0RGF0ZTogbnVsbCwgZW5kRGF0ZTogbnVsbCB9LFxuICAgICAgZGlzYWJsZVByZXZpZXc6IGZhbHNlXG4gICAgfSxcbiAgICBzY3JvbGxBcmVhOiBjYWxjU2Nyb2xsQXJlYShkaXJlY3Rpb24sIG1vbnRocywgc2Nyb2xsKSxcbiAgICBwcmV2aWV3OiB1bmRlZmluZWRcbiAgfSk7XG5cbiAgY29uc3QgdXBkYXRlU2hvd25EYXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IG5ld0ZvY3VzID0gY2FsY0ZvY3VzRGF0ZShzdGF0ZS5mb2N1c2VkRGF0ZSwgc2hvd25EYXRlLCBkYXRlLCBtb250aHMsIHJhbmdlcywgZm9jdXNlZFJhbmdlLCBkaXNwbGF5TW9kZSk7XG5cbiAgICBmb2N1c1RvRGF0ZShuZXdGb2N1cyk7XG4gIH1cblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuXG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KHJhbmdlcykgIT0gSlNPTi5zdHJpbmdpZnkocmVmcy5jdXJyZW50LnJhbmdlcykgfHwgZGF0ZT8uZ2V0VGltZT8uKCkgIT0gcmVmcy5jdXJyZW50LmRhdGU/LmdldFRpbWU/LigpKSB7XG4gICAgICByZWZzLmN1cnJlbnQucmFuZ2VzID0gcmFuZ2VzO1xuICAgICAgcmVmcy5jdXJyZW50LmRhdGUgPSBkYXRlO1xuXG4gICAgICBpZighcHJldmVudFNjcm9sbFRvRm9jdXNlZE1vbnRoKSB7XG4gICAgICAgIHVwZGF0ZVNob3duRGF0ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZWZzLmN1cnJlbnQuZGF0ZU9wdGlvbnMubG9jYWxlICE9IGxvY2FsZSkge1xuICAgICAgcmVmcy5jdXJyZW50LmRhdGVPcHRpb25zLmxvY2FsZSA9IGxvY2FsZTtcbiAgICAgIHNldFN0YXRlKHMgPT4gKHsgLi4ucywgbW9udGhOYW1lczogZ2V0TW9udGhOYW1lcyhsb2NhbGUpIH0pKTtcbiAgICB9XG5cbiAgICByZWZzLmN1cnJlbnQuZGF0ZU9wdGlvbnMud2Vla1N0YXJ0c09uID0gd2Vla1N0YXJ0c09uO1xuXG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KHJlZnMuY3VycmVudC5zY3JvbGwpICE9IEpTT04uc3RyaW5naWZ5KHNjcm9sbCkpIHtcbiAgICAgIHJlZnMuY3VycmVudC5zY3JvbGwgPSBzY3JvbGw7XG5cblxuICAgICAgc2V0U3RhdGUocyA9PiAoeyAuLi5zLCBzY3JvbGxBcmVhOiBjYWxjU2Nyb2xsQXJlYShkaXJlY3Rpb24sIG1vbnRocywgc2Nyb2xsKSB9KSk7XG4gICAgfVxuXG4gIH0sIFtyYW5nZXMsIGRhdGUsIHNjcm9sbCwgZGlyZWN0aW9uLCBtb250aHMsIGxvY2FsZSwgd2Vla1N0YXJ0c09uXSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc2Nyb2xsLmVuYWJsZWQpIHtcbiAgICAgIGZvY3VzVG9EYXRlKHN0YXRlLmZvY3VzZWREYXRlKTtcbiAgICB9XG4gIH0sIFtzY3JvbGwuZW5hYmxlZF0pO1xuXG4gIGNvbnN0IGlzVmVydGljYWwgPSBkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc7XG5cbiAgY29uc3Qgb25EcmFnU2VsZWN0aW9uU3RhcnQgPSAoZGF0ZTogRGF0ZSkgPT4ge1xuICAgIGlmIChkcmFnU2VsZWN0aW9uRW5hYmxlZCkge1xuICAgICAgc2V0U3RhdGUoeyAuLi5zdGF0ZSwgZHJhZzogeyBzdGF0dXM6IHRydWUsIHJhbmdlOiB7IHN0YXJ0RGF0ZTogZGF0ZSwgZW5kRGF0ZTogZGF0ZSB9LCBkaXNhYmxlUHJldmlldzogZmFsc2UgfSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb25DaGFuZ2U/LihkYXRlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvbkRyYWdTZWxlY3Rpb25FbmQgPSAoZGF0ZTogRGF0ZSkgPT4ge1xuICAgIGlmICghZHJhZ1NlbGVjdGlvbkVuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZGlzcGxheU1vZGUgPT0gJ2RhdGUnIHx8ICFzdGF0ZS5kcmFnLnN0YXR1cykge1xuICAgICAgb25DaGFuZ2U/LihkYXRlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdSYW5nZSA9IHtcbiAgICAgIHN0YXJ0RGF0ZTogc3RhdGUuZHJhZy5yYW5nZS5zdGFydERhdGUsXG4gICAgICBlbmREYXRlOiBkYXRlXG4gICAgfVxuXG4gICAgaWYgKGRpc3BsYXlNb2RlICE9ICdkYXRlUmFuZ2UnIHx8IGlzU2FtZURheShuZXdSYW5nZS5zdGFydERhdGUsIGRhdGUpKSB7XG4gICAgICBzZXRTdGF0ZSh7IC4uLnN0YXRlLCBkcmFnOiB7IHN0YXR1czogZmFsc2UsIHJhbmdlOiB7IHN0YXJ0RGF0ZTogbnVsbCwgZW5kRGF0ZTogbnVsbCB9LCBkaXNhYmxlUHJldmlldzogc3RhdGUuZHJhZy5kaXNhYmxlUHJldmlldyB9IH0pO1xuICAgICAgb25DaGFuZ2U/LihkYXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0U3RhdGUoeyAuLi5zdGF0ZSwgZHJhZzogeyBzdGF0dXM6IGZhbHNlLCByYW5nZTogeyBzdGFydERhdGU6IG51bGwsIGVuZERhdGU6IG51bGwgfSwgZGlzYWJsZVByZXZpZXc6IHN0YXRlLmRyYWcuZGlzYWJsZVByZXZpZXcgfSB9KTtcbiAgICAgIHVwZGF0ZVJhbmdlPy4obmV3UmFuZ2UpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9uRHJhZ1NlbGVjdGlvbk1vdmUgPSAoZGF0ZTogRGF0ZSkgPT4ge1xuICAgIGlmICghc3RhdGUuZHJhZy5zdGF0dXMgfHwgIWRyYWdTZWxlY3Rpb25FbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2V0U3RhdGUoeyAuLi5zdGF0ZSwgZHJhZzogeyBzdGF0dXM6IHN0YXRlLmRyYWcuc3RhdHVzLCByYW5nZTogeyBzdGFydERhdGU6IHN0YXRlLmRyYWcucmFuZ2Uuc3RhcnREYXRlLCBlbmREYXRlOiBkYXRlIH0sIGRpc2FibGVQcmV2aWV3OiBzdGF0ZS5kcmFnLmRpc2FibGVQcmV2aWV3IH0gfSk7XG4gIH1cblxuICBjb25zdCBoYW5kbGVSYW5nZUZvY3VzQ2hhbmdlID0gKHJhbmdlc0luZGV4OiBudW1iZXIsIHJhbmdlSXRlbUluZGV4OiBudW1iZXIpID0+IHtcbiAgICBvblJhbmdlRm9jdXNDaGFuZ2U/LihbcmFuZ2VzSW5kZXgsIHJhbmdlSXRlbUluZGV4XSk7XG4gIH1cblxuICBjb25zdCBlc3RpbWF0ZU1vbnRoU2l6ZSA9IChpbmRleDogbnVtYmVyLCBjYWNoZT86IHtbeDogc3RyaW5nXTogbnVtYmVyfSkgPT4ge1xuICAgIFxuICAgIGlmIChjYWNoZSkge1xuICAgICAgcmVmcy5jdXJyZW50Lmxpc3RTaXplQ2FjaGUgPSBjYWNoZTtcblxuICAgICAgaWYgKGNhY2hlW2luZGV4XSkge1xuICAgICAgICByZXR1cm4gY2FjaGVbaW5kZXhdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkaXJlY3Rpb24gPT0gJ2hvcml6b250YWwnKSB7XG4gICAgICByZXR1cm4gc3RhdGUuc2Nyb2xsQXJlYS5tb250aFdpZHRoO1xuICAgIH1cblxuICAgIGNvbnN0IG1vbnRoU3RlcCA9IGFkZE1vbnRocyhtaW5EYXRlLCBpbmRleCk7XG4gICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSBnZXRNb250aERpc3BsYXlSYW5nZShtb250aFN0ZXAsIHJlZnMuY3VycmVudC5kYXRlT3B0aW9ucyBhcyBXZWVrT3B0aW9ucyk7XG4gICAgY29uc3QgaXNMb25nTW9udGggPSBkaWZmZXJlbmNlSW5EYXlzKGVuZCwgc3RhcnQpICsgMSA+IDcgKiA1O1xuICAgIHJldHVybiBpc0xvbmdNb250aCA/IHN0YXRlLnNjcm9sbEFyZWEubG9uZ01vbnRoSGVpZ2h0IDogc3RhdGUuc2Nyb2xsQXJlYS5tb250aEhlaWdodDtcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZVNjcm9sbCA9ICgpID0+IHtcbiAgICBjb25zdCB2aXNpYmxlTW9udGhzID0gcmVmcy5jdXJyZW50Lmxpc3QuZ2V0VmlzaWJsZVJhbmdlKCk7XG5cbiAgICBpZiAodmlzaWJsZU1vbnRoc1swXSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICBjb25zdCB2aXNpYmxlTW9udGggPSBhZGRNb250aHMobWluRGF0ZSwgdmlzaWJsZU1vbnRoc1swXSB8fCAwKTtcbiAgICBjb25zdCBpc0ZvY3VzZWRUb0RpZmZlcmVudCA9ICFpc1NhbWVNb250aCh2aXNpYmxlTW9udGgsIHN0YXRlLmZvY3VzZWREYXRlKTtcblxuICAgIGlmIChpc0ZvY3VzZWRUb0RpZmZlcmVudCAmJiAhcmVmcy5jdXJyZW50LmlzRmlyc3RSZW5kZXIpIHtcbiAgICAgIHNldFN0YXRlKHMgPT4gKHsgLi4ucywgZm9jdXNlZERhdGU6IHZpc2libGVNb250aCB9KSk7XG4gICAgICBvblNob3duRGF0ZUNoYW5nZT8uKHZpc2libGVNb250aCk7XG4gICAgfVxuXG4gICAgcmVmcy5jdXJyZW50LmlzRmlyc3RSZW5kZXIgPSBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHVwZGF0ZVByZXZpZXcgPSAodmFsPzogRGF0ZSkgPT4ge1xuICAgIGlmICghdmFsKSB7XG4gICAgICBzZXRTdGF0ZShzID0+ICh7IC4uLnMsIHByZXZpZXc6IHVuZGVmaW5lZCB9KSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJldmlldyA9IHtcbiAgICAgIHN0YXJ0RGF0ZTogdmFsLFxuICAgICAgZW5kRGF0ZTogdmFsLFxuICAgICAgY29sb3I6IGNvbG9yXG4gICAgfVxuXG4gICAgc2V0U3RhdGUocyA9PiAoeyAuLi5zLCBwcmV2aWV3IH0pKTtcbiAgfVxuXG4gIGNvbnN0IGZvY3VzVG9EYXRlID0gKGRhdGU6IERhdGUsIHByZXZlbnRVbm5lY2Vzc2FyeSA9IHRydWUpID0+IHtcblxuICAgIGlmICghc2Nyb2xsLmVuYWJsZWQpIHtcbiAgICAgIGlmIChwcmV2ZW50VW5uZWNlc3NhcnkgJiYgcHJldmVudFNuYXBSZWZvY3VzKSB7XG4gICAgICAgIGNvbnN0IGZvY3VzZWREYXRlRGlmZiA9IGRpZmZlcmVuY2VJbkNhbGVuZGFyTW9udGhzKGRhdGUsIHN0YXRlLmZvY3VzZWREYXRlKTtcblxuICAgICAgICBjb25zdCBpc0FsbG93ZWRGb3J3YXJkID0gY2FsZW5kYXJGb2N1cyA9PT0gJ2ZvcndhcmRzJyAmJiBmb2N1c2VkRGF0ZURpZmYgPj0gMDtcbiAgICAgICAgY29uc3QgaXNBbGxvd2VkQmFja3dhcmQgPSBjYWxlbmRhckZvY3VzID09PSAnYmFja3dhcmRzJyAmJiBmb2N1c2VkRGF0ZURpZmYgPD0gMDtcbiAgICAgICAgaWYgKChpc0FsbG93ZWRGb3J3YXJkIHx8IGlzQWxsb3dlZEJhY2t3YXJkKSAmJiBNYXRoLmFicyhmb2N1c2VkRGF0ZURpZmYpIDwgbW9udGhzKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNldFN0YXRlKHMgPT4gKHsgLi4ucywgZm9jdXNlZERhdGU6IGRhdGUgfSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldE1vbnRoSW5kZXggPSBkaWZmZXJlbmNlSW5DYWxlbmRhck1vbnRocyhkYXRlLCBtaW5EYXRlKTtcbiAgICBjb25zdCB2aXNpYmxlTW9udGhzID0gcmVmcy5jdXJyZW50Lmxpc3QuZ2V0VmlzaWJsZVJhbmdlKCk7XG5cbiAgICBpZiAocHJldmVudFVubmVjZXNzYXJ5ICYmIHZpc2libGVNb250aHMuaW5jbHVkZXModGFyZ2V0TW9udGhJbmRleCkpIHJldHVybjtcblxuICAgIHJlZnMuY3VycmVudC5pc0ZpcnN0UmVuZGVyID0gdHJ1ZTtcbiAgICByZWZzLmN1cnJlbnQubGlzdC5zY3JvbGxUbyh0YXJnZXRNb250aEluZGV4KTtcbiAgICBzZXRTdGF0ZShzID0+ICh7IC4uLnMsIGZvY3VzZWREYXRlOiBkYXRlIH0pKTtcbiAgfVxuXG4gIGNvbnN0IGNoYW5nZVNob3duRGF0ZSA9ICh2YWx1ZTogbnVtYmVyLCBtb2RlOiBcInNldFwiIHwgXCJzZXRZZWFyXCIgfCBcInNldE1vbnRoXCIgfCBcIm1vbnRoT2Zmc2V0XCIgPSBcInNldFwiKSA9PiB7XG4gICAgY29uc3QgbW9kZU1hcHBlciA9IHtcbiAgICAgIG1vbnRoT2Zmc2V0OiAoKSA9PiBhZGRNb250aHMoc3RhdGUuZm9jdXNlZERhdGUsIHZhbHVlKSxcbiAgICAgIHNldE1vbnRoOiAoKSA9PiBzZXRNb250aChzdGF0ZS5mb2N1c2VkRGF0ZSwgdmFsdWUpLFxuICAgICAgc2V0WWVhcjogKCkgPT4gc2V0WWVhcihzdGF0ZS5mb2N1c2VkRGF0ZSwgdmFsdWUpLFxuICAgICAgc2V0OiAoKSA9PiB2YWx1ZSxcbiAgICB9O1xuXG4gICAgY29uc3QgbmV3RGF0ZSA9IG1pbihbbWF4KFttb2RlTWFwcGVyW21vZGVdKCksIG1pbkRhdGVdKSwgbWF4RGF0ZV0pO1xuICAgIGZvY3VzVG9EYXRlKG5ld0RhdGUsIGZhbHNlKTtcbiAgICBvblNob3duRGF0ZUNoYW5nZT8uKG5ld0RhdGUpO1xuICB9XG5cbiAgY29uc3QgcmFuZ2VzSW50ZXJuYWwgPSByYW5nZXMubWFwKChyYW5nZSwgaSkgPT4gKHtcbiAgICAuLi5yYW5nZSxcbiAgICBjb2xvcjogcmFuZ2UuY29sb3IgfHwgcmFuZ2VDb2xvcnNbaV0gfHwgY29sb3IsXG4gIH0pKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhyZWZzLmN1cnJlbnQuc3R5bGVzLmNhbGVuZGFyV3JhcHBlciwgY2xhc3NOYW1lKX1cbiAgICAgIG9uTW91c2VVcD17KCkgPT4ge1xuICAgICAgICBzZXRTdGF0ZSh7IC4uLnN0YXRlLCBkcmFnOiB7IHN0YXR1czogZmFsc2UsIHJhbmdlOiB7IHN0YXJ0RGF0ZTogbnVsbCwgZW5kRGF0ZTogbnVsbCB9LCBkaXNhYmxlUHJldmlldzogZmFsc2UgfSB9KTtcbiAgICAgIH19XG4gICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHtcbiAgICAgICAgc2V0U3RhdGUoeyAuLi5zdGF0ZSwgZHJhZzogeyBzdGF0dXM6IGZhbHNlLCByYW5nZTogeyBzdGFydERhdGU6IG51bGwsIGVuZERhdGU6IG51bGwgfSwgZGlzYWJsZVByZXZpZXc6IGZhbHNlIH0gfSk7XG4gICAgICB9fT5cbiAgICAgIHtzaG93RGF0ZURpc3BsYXkgPyA8RGF0ZURpc3BsYXkgb25EcmFnU2VsZWN0aW9uRW5kPXtvbkRyYWdTZWxlY3Rpb25FbmR9IGhhbmRsZVJhbmdlRm9jdXNDaGFuZ2U9e2hhbmRsZVJhbmdlRm9jdXNDaGFuZ2V9IGRhdGVPcHRpb25zPXtyZWZzLmN1cnJlbnQuZGF0ZU9wdGlvbnMgYXMgUGFyc2VPcHRpb25zfSBhcmlhTGFiZWxzPXthcmlhTGFiZWxzfSBzdHlsZXM9e3JlZnMuY3VycmVudC5zdHlsZXN9IHN0YXJ0RGF0ZVBsYWNlaG9sZGVyPXtzdGFydERhdGVQbGFjZWhvbGRlcn0gZW5kRGF0ZVBsYWNlaG9sZGVyPXtlbmREYXRlUGxhY2Vob2xkZXJ9IGVkaXRhYmxlRGF0ZUlucHV0cz17ZWRpdGFibGVEYXRlSW5wdXRzfSBmb2N1c2VkUmFuZ2U9e2ZvY3VzZWRSYW5nZX0gY29sb3I9e2NvbG9yfSByYW5nZXM9e3Jhbmdlc0ludGVybmFsfSByYW5nZUNvbG9ycz17cmFuZ2VDb2xvcnN9IGRhdGVEaXNwbGF5Rm9ybWF0PXtkYXRlRGlzcGxheUZvcm1hdH0gLz4gOiBudWxsfVxuICAgICAgPE1vbnRoQW5kWWVhciBtb250aE5hbWVzPXtzdGF0ZS5tb250aE5hbWVzfSBmb2N1c2VkRGF0ZT17c3RhdGUuZm9jdXNlZERhdGV9IGNoYW5nZVNob3duRGF0ZT17Y2hhbmdlU2hvd25EYXRlfSBzdHlsZXM9e3JlZnMuY3VycmVudC5zdHlsZXMgYXMgU3R5bGVzVHlwZX0gc2hvd01vbnRoQW5kWWVhclBpY2tlcnM9e3Nob3dNb250aEFuZFllYXJQaWNrZXJzfSBzaG93TW9udGhBcnJvdz17c2hvd01vbnRoQXJyb3d9IG1pbkRhdGU9e21pbkRhdGV9IG1heERhdGU9e21heERhdGV9IGFyaWFMYWJlbHM9e2FyaWFMYWJlbHN9IC8+XG4gICAgICB7c2Nyb2xsLmVuYWJsZWQgPyAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAge2lzVmVydGljYWwgPyA8V2Vla2RheXMgc3R5bGVzPXtyZWZzLmN1cnJlbnQuc3R5bGVzfSBkYXRlT3B0aW9ucz17cmVmcy5jdXJyZW50LmRhdGVPcHRpb25zfSB3ZWVrZGF5RGlzcGxheUZvcm1hdD17d2Vla2RheURpc3BsYXlGb3JtYXR9IC8+IDogbnVsbH1cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoXG4gICAgICAgICAgICAgIHJlZnMuY3VycmVudC5zdHlsZXMuaW5maW5pdGVNb250aHMsXG4gICAgICAgICAgICAgIGlzVmVydGljYWwgPyByZWZzLmN1cnJlbnQuc3R5bGVzLm1vbnRoc1ZlcnRpY2FsIDogcmVmcy5jdXJyZW50LnN0eWxlcy5tb250aHNIb3Jpem9udGFsXG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBvblByZXZpZXdDaGFuZ2U/LigpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IHR5cGVvZiBzdGF0ZS5zY3JvbGxBcmVhLmNhbGVuZGFyV2lkdGggPT09ICdzdHJpbmcnID8gc3RhdGUuc2Nyb2xsQXJlYS5jYWxlbmRhcldpZHRoIDogKChzdGF0ZS5zY3JvbGxBcmVhLmNhbGVuZGFyV2lkdGggfHwgMCkgKyAxMSksXG4gICAgICAgICAgICAgIGhlaWdodDogc3RhdGUuc2Nyb2xsQXJlYS5jYWxlbmRhckhlaWdodCArIDExLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uU2Nyb2xsPXtoYW5kbGVTY3JvbGx9PlxuICAgICAgICAgICAgPFJlYWN0TGlzdFxuICAgICAgICAgICAgICBsZW5ndGg9e2RpZmZlcmVuY2VJbkNhbGVuZGFyTW9udGhzKFxuICAgICAgICAgICAgICAgIGVuZE9mTW9udGgobWF4RGF0ZSksXG4gICAgICAgICAgICAgICAgYWRkRGF5cyhzdGFydE9mTW9udGgobWluRGF0ZSksIC0xKVxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICB0eXBlPVwidmFyaWFibGVcIlxuICAgICAgICAgICAgICByZWY9e3RhcmdldCA9PiB7XG4gICAgICAgICAgICAgICAgcmVmcy5jdXJyZW50Lmxpc3QgPSB0YXJnZXQ7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGl0ZW1TaXplRXN0aW1hdG9yPXtlc3RpbWF0ZU1vbnRoU2l6ZX1cbiAgICAgICAgICAgICAgYXhpcz17aXNWZXJ0aWNhbCA/ICd5JyA6ICd4J31cbiAgICAgICAgICAgICAgaXRlbVJlbmRlcmVyPXsoaW5kZXgsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vbnRoU3RlcCA9IGFkZE1vbnRocyhtaW5EYXRlLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxNb250aFxuICAgICAgICAgICAgICAgICAgICBkYXlDb250ZW50UmVuZGVyZXI9e2RheUNvbnRlbnRSZW5kZXJlcn1cbiAgICAgICAgICAgICAgICAgICAgZml4ZWRIZWlnaHQ9e2ZpeGVkSGVpZ2h0fVxuICAgICAgICAgICAgICAgICAgICBzaG93UHJldmlldz17c2hvd1ByZXZpZXd9XG4gICAgICAgICAgICAgICAgICAgIHdlZWtkYXlEaXNwbGF5Rm9ybWF0PXt3ZWVrZGF5RGlzcGxheUZvcm1hdH1cbiAgICAgICAgICAgICAgICAgICAgZGF5RGlzcGxheUZvcm1hdD17ZGF5RGlzcGxheUZvcm1hdH1cbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU1vZGU9e2Rpc3BsYXlNb2RlfVxuICAgICAgICAgICAgICAgICAgICBvblByZXZpZXdDaGFuZ2U9e29uUHJldmlld0NoYW5nZSB8fCB1cGRhdGVQcmV2aWV3fVxuICAgICAgICAgICAgICAgICAgICBwcmV2aWV3PXtwcmV2aWV3IHx8IHN0YXRlLnByZXZpZXd9XG4gICAgICAgICAgICAgICAgICAgIHJhbmdlcz17cmFuZ2VzSW50ZXJuYWx9XG4gICAgICAgICAgICAgICAgICAgIGtleT17a2V5fVxuICAgICAgICAgICAgICAgICAgICBmb2N1c2VkUmFuZ2U9e2ZvY3VzZWRSYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgZHJhZz17c3RhdGUuZHJhZ31cbiAgICAgICAgICAgICAgICAgICAgbW9udGhEaXNwbGF5Rm9ybWF0PXttb250aERpc3BsYXlGb3JtYXR9XG4gICAgICAgICAgICAgICAgICAgIGRhdGVPcHRpb25zPXtyZWZzLmN1cnJlbnQuZGF0ZU9wdGlvbnMgYXMgdW5rbm93biBhcyBGb3JtYXRPcHRpb25zfVxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZERhdGVzPXtkaXNhYmxlZERhdGVzfVxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZERheT17ZGlzYWJsZWREYXl9XG4gICAgICAgICAgICAgICAgICAgIG1vbnRoPXttb250aFN0ZXB9XG4gICAgICAgICAgICAgICAgICAgIG9uRHJhZ1NlbGVjdGlvblN0YXJ0PXtvbkRyYWdTZWxlY3Rpb25TdGFydH1cbiAgICAgICAgICAgICAgICAgICAgb25EcmFnU2VsZWN0aW9uRW5kPXtvbkRyYWdTZWxlY3Rpb25FbmR9XG4gICAgICAgICAgICAgICAgICAgIG9uRHJhZ1NlbGVjdGlvbk1vdmU9e29uRHJhZ1NlbGVjdGlvbk1vdmV9XG4gICAgICAgICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17KCkgPT4gb25QcmV2aWV3Q2hhbmdlPy4oKX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGVzPXtyZWZzLmN1cnJlbnQuc3R5bGVzIGFzIFN0eWxlc1R5cGV9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtcbiAgICAgICAgICAgICAgICAgICAgICBpc1ZlcnRpY2FsXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHsgaGVpZ2h0OiBlc3RpbWF0ZU1vbnRoU2l6ZShpbmRleCkgfVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB7IGhlaWdodDogc3RhdGUuc2Nyb2xsQXJlYS5tb250aEhlaWdodCwgd2lkdGg6IGVzdGltYXRlTW9udGhTaXplKGluZGV4KSB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2hvd01vbnRoTmFtZVxuICAgICAgICAgICAgICAgICAgICBzaG93V2Vla0RheXM9eyFpc1ZlcnRpY2FsfVxuICAgICAgICAgICAgICAgICAgICBjb2xvcj17Y29sb3J9XG4gICAgICAgICAgICAgICAgICAgIG1heERhdGU9e21heERhdGV9XG4gICAgICAgICAgICAgICAgICAgIG1pbkRhdGU9e21pbkRhdGV9XG4gICAgICAgICAgICAgICAgICAgIGRhdGU9e2RhdGV9XG4gICAgICAgICAgICAgICAgICAgIHdlZWtzTnVtYmVyc0xhYmVsPXt3ZWVrc051bWJlcnNMYWJlbH1cbiAgICAgICAgICAgICAgICAgICAgc2hvd1dlZWtOdW1iZXJzPXtzaG93V2Vla051bWJlcnN9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoXG4gICAgICAgICAgICByZWZzLmN1cnJlbnQuc3R5bGVzLm1vbnRocyxcbiAgICAgICAgICAgIGlzVmVydGljYWwgPyByZWZzLmN1cnJlbnQuc3R5bGVzLm1vbnRoc1ZlcnRpY2FsIDogcmVmcy5jdXJyZW50LnN0eWxlcy5tb250aHNIb3Jpem9udGFsXG4gICAgICAgICAgKX0+XG4gICAgICAgICAge25ldyBBcnJheShtb250aHMpLmZpbGwobnVsbCkubWFwKChfLCBpKSA9PiB7XG4gICAgICAgICAgICBsZXQgbW9udGhTdGVwID0gYWRkTW9udGhzKHN0YXRlLmZvY3VzZWREYXRlLCBpKTs7XG4gICAgICAgICAgICBpZiAoY2FsZW5kYXJGb2N1cyA9PT0gJ2JhY2t3YXJkcycpIHtcbiAgICAgICAgICAgICAgbW9udGhTdGVwID0gc3ViTW9udGhzKHN0YXRlLmZvY3VzZWREYXRlLCBtb250aHMgLSAxIC0gaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8TW9udGhcbiAgICAgICAgICAgICAgICBkYXlDb250ZW50UmVuZGVyZXI9e2RheUNvbnRlbnRSZW5kZXJlcn1cbiAgICAgICAgICAgICAgICBmaXhlZEhlaWdodD17Zml4ZWRIZWlnaHR9XG4gICAgICAgICAgICAgICAgd2Vla2RheURpc3BsYXlGb3JtYXQ9e3dlZWtkYXlEaXNwbGF5Rm9ybWF0fVxuICAgICAgICAgICAgICAgIGRheURpc3BsYXlGb3JtYXQ9e2RheURpc3BsYXlGb3JtYXR9XG4gICAgICAgICAgICAgICAgbW9udGhEaXNwbGF5Rm9ybWF0PXttb250aERpc3BsYXlGb3JtYXR9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3t9fVxuICAgICAgICAgICAgICAgIHNob3dQcmV2aWV3PXtzaG93UHJldmlld31cbiAgICAgICAgICAgICAgICBkaXNwbGF5TW9kZT17ZGlzcGxheU1vZGV9XG4gICAgICAgICAgICAgICAgb25QcmV2aWV3Q2hhbmdlPXtvblByZXZpZXdDaGFuZ2UgfHwgdXBkYXRlUHJldmlld31cbiAgICAgICAgICAgICAgICBwcmV2aWV3PXtwcmV2aWV3IHx8IHN0YXRlLnByZXZpZXd9XG4gICAgICAgICAgICAgICAgcmFuZ2VzPXtyYW5nZXNJbnRlcm5hbH1cbiAgICAgICAgICAgICAgICBrZXk9e2l9XG4gICAgICAgICAgICAgICAgZHJhZz17c3RhdGUuZHJhZ31cbiAgICAgICAgICAgICAgICBmb2N1c2VkUmFuZ2U9e2ZvY3VzZWRSYW5nZX1cbiAgICAgICAgICAgICAgICBkYXRlT3B0aW9ucz17cmVmcy5jdXJyZW50LmRhdGVPcHRpb25zIGFzIEZvcm1hdE9wdGlvbnN9XG4gICAgICAgICAgICAgICAgZGlzYWJsZWREYXRlcz17ZGlzYWJsZWREYXRlc31cbiAgICAgICAgICAgICAgICBkaXNhYmxlZERheT17ZGlzYWJsZWREYXl9XG4gICAgICAgICAgICAgICAgbW9udGg9e21vbnRoU3RlcH1cbiAgICAgICAgICAgICAgICBvbkRyYWdTZWxlY3Rpb25TdGFydD17b25EcmFnU2VsZWN0aW9uU3RhcnR9XG4gICAgICAgICAgICAgICAgb25EcmFnU2VsZWN0aW9uRW5kPXtvbkRyYWdTZWxlY3Rpb25FbmR9XG4gICAgICAgICAgICAgICAgb25EcmFnU2VsZWN0aW9uTW92ZT17b25EcmFnU2VsZWN0aW9uTW92ZX1cbiAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IG9uUHJldmlld0NoYW5nZT8uKCl9XG4gICAgICAgICAgICAgICAgc3R5bGVzPXtyZWZzLmN1cnJlbnQuc3R5bGVzIGFzIFN0eWxlc1R5cGV9XG4gICAgICAgICAgICAgICAgc2hvd1dlZWtEYXlzPXshaXNWZXJ0aWNhbCB8fCBpID09PSAwfVxuICAgICAgICAgICAgICAgIHNob3dNb250aE5hbWU9eyFpc1ZlcnRpY2FsIHx8IGkgPiAwfVxuICAgICAgICAgICAgICAgIGNvbG9yPXtjb2xvcn1cbiAgICAgICAgICAgICAgICBtYXhEYXRlPXttYXhEYXRlfVxuICAgICAgICAgICAgICAgIG1pbkRhdGU9e21pbkRhdGV9XG4gICAgICAgICAgICAgICAgZGF0ZT17ZGF0ZX1cbiAgICAgICAgICAgICAgICB3ZWVrc051bWJlcnNMYWJlbD17d2Vla3NOdW1iZXJzTGFiZWx9XG4gICAgICAgICAgICAgICAgc2hvd1dlZWtOdW1iZXJzPXtzaG93V2Vla051bWJlcnN9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbnR5cGUgTW9udGhBbmRZZWFyUHJvcHMgPSB7XG4gIHN0eWxlczogU3R5bGVzVHlwZSxcbiAgc2hvd01vbnRoQXJyb3c6IGJvb2xlYW4sXG4gIG1pbkRhdGU6IERhdGUsXG4gIG1heERhdGU6IERhdGUsXG4gIGFyaWFMYWJlbHM6IEFyaWFMYWJlbHNUeXBlLFxuICBmb2N1c2VkRGF0ZTogRGF0ZSxcbiAgc2hvd01vbnRoQW5kWWVhclBpY2tlcnM6IGJvb2xlYW4sXG4gIG1vbnRoTmFtZXM6IHN0cmluZ1tdLFxuICBjaGFuZ2VTaG93bkRhdGU6ICh2YWx1ZTogbnVtYmVyLCBtb2RlOiBcInNldFwiIHwgXCJtb250aE9mZnNldFwiIHwgXCJzZXRNb250aFwiIHwgXCJzZXRZZWFyXCIpID0+IHZvaWRcbn07XG5cbmZ1bmN0aW9uIE1vbnRoQW5kWWVhcih7XG4gIHN0eWxlcyxcbiAgc2hvd01vbnRoQXJyb3csXG4gIG1pbkRhdGUsXG4gIG1heERhdGUsXG4gIGFyaWFMYWJlbHMsXG4gIGZvY3VzZWREYXRlLFxuICBzaG93TW9udGhBbmRZZWFyUGlja2VycyxcbiAgY2hhbmdlU2hvd25EYXRlLFxuICBtb250aE5hbWVzXG59OiBNb250aEFuZFllYXJQcm9wcykge1xuXG4gIGNvbnN0IHVwcGVyWWVhckxpbWl0ID0gbWF4RGF0ZS5nZXRGdWxsWWVhcigpO1xuICBjb25zdCBsb3dlclllYXJMaW1pdCA9IG1pbkRhdGUuZ2V0RnVsbFllYXIoKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgb25Nb3VzZVVwPXtlID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9IGNsYXNzTmFtZT17c3R5bGVzLm1vbnRoQW5kWWVhcldyYXBwZXJ9PlxuICAgICAge3Nob3dNb250aEFycm93ID8gKFxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHN0eWxlcy5uZXh0UHJldkJ1dHRvbiwgc3R5bGVzLnByZXZCdXR0b24pfVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGNoYW5nZVNob3duRGF0ZSgtMSwgJ21vbnRoT2Zmc2V0Jyl9XG4gICAgICAgICAgYXJpYS1sYWJlbD17YXJpYUxhYmVscy5wcmV2QnV0dG9ufT5cbiAgICAgICAgICA8aSAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICkgOiBudWxsfVxuICAgICAge3Nob3dNb250aEFuZFllYXJQaWNrZXJzID8gKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e3N0eWxlcy5tb250aEFuZFllYXJQaWNrZXJzfT5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e3N0eWxlcy5tb250aFBpY2tlcn0+XG4gICAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICAgIHZhbHVlPXtmb2N1c2VkRGF0ZS5nZXRNb250aCgpfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBjaGFuZ2VTaG93bkRhdGUoTnVtYmVyKGUudGFyZ2V0LnZhbHVlKSwgJ3NldE1vbnRoJyl9XG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2FyaWFMYWJlbHMubW9udGhQaWNrZXJ9PlxuICAgICAgICAgICAgICB7bW9udGhOYW1lcy5tYXAoKG1vbnRoTmFtZTogc3RyaW5nLCBpOiBudW1iZXIpID0+IChcbiAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17aX0gdmFsdWU9e2l9PlxuICAgICAgICAgICAgICAgICAge21vbnRoTmFtZX1cbiAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtzdHlsZXMubW9udGhBbmRZZWFyRGl2aWRlcn0gLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e3N0eWxlcy55ZWFyUGlja2VyfT5cbiAgICAgICAgICAgIDxzZWxlY3RcbiAgICAgICAgICAgICAgdmFsdWU9e2ZvY3VzZWREYXRlLmdldEZ1bGxZZWFyKCl9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IGNoYW5nZVNob3duRGF0ZShOdW1iZXIoZS50YXJnZXQudmFsdWUpLCAnc2V0WWVhcicpfVxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPXthcmlhTGFiZWxzLnllYXJQaWNrZXJ9PlxuICAgICAgICAgICAgICB7bmV3IEFycmF5KHVwcGVyWWVhckxpbWl0IC0gbG93ZXJZZWFyTGltaXQgKyAxKVxuICAgICAgICAgICAgICAgIC5maWxsKHVwcGVyWWVhckxpbWl0KVxuICAgICAgICAgICAgICAgIC5tYXAoKHZhbCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgeWVhciA9IHZhbCAtIGk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17eWVhcn0gdmFsdWU9e3llYXJ9PlxuICAgICAgICAgICAgICAgICAgICAgIHt5ZWFyfVxuICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICkgOiAoXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT17c3R5bGVzLm1vbnRoQW5kWWVhclBpY2tlcnN9PlxuICAgICAgICAgIHttb250aE5hbWVzW2ZvY3VzZWREYXRlLmdldE1vbnRoKCldfSB7Zm9jdXNlZERhdGUuZ2V0RnVsbFllYXIoKX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKX1cbiAgICAgIHtzaG93TW9udGhBcnJvdyA/IChcbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhzdHlsZXMubmV4dFByZXZCdXR0b24sIHN0eWxlcy5uZXh0QnV0dG9uKX1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBjaGFuZ2VTaG93bkRhdGUoKzEsICdtb250aE9mZnNldCcpfVxuICAgICAgICAgIGFyaWEtbGFiZWw9e2FyaWFMYWJlbHMubmV4dEJ1dHRvbn0+XG4gICAgICAgICAgPGkgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG50eXBlIFdlZWtkYXlzUHJvcHMgPSB7XG4gIHN0eWxlczogUGFydGlhbDxTdHlsZXNUeXBlPixcbiAgZGF0ZU9wdGlvbnM6IHtcbiAgICBsb2NhbGU6IExvY2FsZSxcbiAgICB3ZWVrU3RhcnRzT24/OiBudW1iZXJcbiAgfSxcbiAgd2Vla2RheURpc3BsYXlGb3JtYXQ6IHN0cmluZ1xufTtcblxuZnVuY3Rpb24gV2Vla2RheXMoe1xuICBzdHlsZXMsXG4gIGRhdGVPcHRpb25zLFxuICB3ZWVrZGF5RGlzcGxheUZvcm1hdFxufTogV2Vla2RheXNQcm9wcykge1xuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy53ZWVrRGF5c30+XG4gICAgICB7ZWFjaERheU9mSW50ZXJ2YWwoe1xuICAgICAgICBzdGFydDogc3RhcnRPZldlZWsobm93LCBkYXRlT3B0aW9ucyBhcyBXZWVrT3B0aW9ucyksXG4gICAgICAgIGVuZDogZW5kT2ZXZWVrKG5vdywgZGF0ZU9wdGlvbnMgYXMgV2Vla09wdGlvbnMpLFxuICAgICAgfSkubWFwKChkYXksIGkpID0+IChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtzdHlsZXMud2Vla0RheX0ga2V5PXtpfT5cbiAgICAgICAgICB7Zm9ybWF0KGRheSwgd2Vla2RheURpc3BsYXlGb3JtYXQsIGRhdGVPcHRpb25zIGFzIFdlZWtPcHRpb25zKX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKSl9XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbnR5cGUgRGF0ZURpc3BsYXlQcm9wcyA9IHtcbiAgZm9jdXNlZFJhbmdlOiBudW1iZXJbXSxcbiAgY29sb3I6IHN0cmluZyxcbiAgcmFuZ2VzOiBEYXRlUmFuZ2VbXSxcbiAgcmFuZ2VDb2xvcnM6IHN0cmluZ1tdLFxuICBkYXRlT3B0aW9uczogUGFyc2VPcHRpb25zLFxuICBkYXRlRGlzcGxheUZvcm1hdDogc3RyaW5nLFxuICBlZGl0YWJsZURhdGVJbnB1dHM6IGJvb2xlYW4sXG4gIHN0YXJ0RGF0ZVBsYWNlaG9sZGVyOiBzdHJpbmcsXG4gIGVuZERhdGVQbGFjZWhvbGRlcjogc3RyaW5nLFxuICBhcmlhTGFiZWxzOiBBcmlhTGFiZWxzVHlwZSxcbiAgc3R5bGVzOiBQYXJ0aWFsPFN0eWxlc1R5cGU+LFxuICBvbkRyYWdTZWxlY3Rpb25FbmQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkLFxuICBoYW5kbGVSYW5nZUZvY3VzQ2hhbmdlOiAocmFuZ2VzSW5kZXg6IG51bWJlciwgcmFuZ2VJdGVtSW5kZXg6IG51bWJlcikgPT4gdm9pZFxufTtcblxuZnVuY3Rpb24gRGF0ZURpc3BsYXkoe1xuICBmb2N1c2VkUmFuZ2UsXG4gIGNvbG9yLFxuICByYW5nZXMsXG4gIHJhbmdlQ29sb3JzLFxuICBkYXRlRGlzcGxheUZvcm1hdCxcbiAgZWRpdGFibGVEYXRlSW5wdXRzLFxuICBzdGFydERhdGVQbGFjZWhvbGRlcixcbiAgZW5kRGF0ZVBsYWNlaG9sZGVyLFxuICBhcmlhTGFiZWxzLFxuICBzdHlsZXMsXG4gIGRhdGVPcHRpb25zLFxuICBvbkRyYWdTZWxlY3Rpb25FbmQsXG4gIGhhbmRsZVJhbmdlRm9jdXNDaGFuZ2Vcbn06IERhdGVEaXNwbGF5UHJvcHMpIHtcbiAgY29uc3QgZGVmYXVsdENvbG9yID0gcmFuZ2VDb2xvcnNbZm9jdXNlZFJhbmdlWzBdXSB8fCBjb2xvcjtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuZGF0ZURpc3BsYXlXcmFwcGVyfT5cbiAgICAgIHtyYW5nZXMubWFwKChyYW5nZSwgaSkgPT4ge1xuICAgICAgICBpZiAocmFuZ2Uuc2hvd0RhdGVEaXNwbGF5ID09PSBmYWxzZSB8fCAocmFuZ2UuZGlzYWJsZWQgJiYgIXJhbmdlLnNob3dEYXRlRGlzcGxheSkpXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtzdHlsZXMuZGF0ZURpc3BsYXl9XG4gICAgICAgICAgICBrZXk9e2l9XG4gICAgICAgICAgICBzdHlsZT17eyBjb2xvcjogcmFuZ2UuY29sb3IgfHwgZGVmYXVsdENvbG9yIH19PlxuICAgICAgICAgICAgPERhdGVJbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoc3R5bGVzLmRhdGVEaXNwbGF5SXRlbSwge1xuICAgICAgICAgICAgICAgIFtzdHlsZXMuZGF0ZURpc3BsYXlJdGVtQWN0aXZlXTogZm9jdXNlZFJhbmdlWzBdID09PSBpICYmIGZvY3VzZWRSYW5nZVsxXSA9PT0gMCxcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgIHJlYWRPbmx5PXshZWRpdGFibGVEYXRlSW5wdXRzfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17cmFuZ2UuZGlzYWJsZWR9XG4gICAgICAgICAgICAgIHZhbHVlPXtyYW5nZS5zdGFydERhdGV9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtzdGFydERhdGVQbGFjZWhvbGRlcn1cbiAgICAgICAgICAgICAgZGF0ZU9wdGlvbnM9e2RhdGVPcHRpb25zfVxuICAgICAgICAgICAgICBkYXRlRGlzcGxheUZvcm1hdD17ZGF0ZURpc3BsYXlGb3JtYXR9XG4gICAgICAgICAgICAgIGFyaWFMYWJlbD17XG4gICAgICAgICAgICAgICAgYXJpYUxhYmVscy5kYXRlSW5wdXQgJiZcbiAgICAgICAgICAgICAgICBhcmlhTGFiZWxzLmRhdGVJbnB1dFtyYW5nZS5rZXldICYmXG4gICAgICAgICAgICAgICAgYXJpYUxhYmVscy5kYXRlSW5wdXRbcmFuZ2Uua2V5XS5zdGFydERhdGVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17b25EcmFnU2VsZWN0aW9uRW5kfVxuICAgICAgICAgICAgICBvbkZvY3VzPXsoKSA9PiBoYW5kbGVSYW5nZUZvY3VzQ2hhbmdlKGksIDApfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxEYXRlSW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHN0eWxlcy5kYXRlRGlzcGxheUl0ZW0sIHtcbiAgICAgICAgICAgICAgICBbc3R5bGVzLmRhdGVEaXNwbGF5SXRlbUFjdGl2ZV06IGZvY3VzZWRSYW5nZVswXSA9PT0gaSAmJiBmb2N1c2VkUmFuZ2VbMV0gPT09IDEsXG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICByZWFkT25seT17IWVkaXRhYmxlRGF0ZUlucHV0c31cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3JhbmdlLmRpc2FibGVkfVxuICAgICAgICAgICAgICB2YWx1ZT17cmFuZ2UuZW5kRGF0ZX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e2VuZERhdGVQbGFjZWhvbGRlcn1cbiAgICAgICAgICAgICAgZGF0ZU9wdGlvbnM9e2RhdGVPcHRpb25zfVxuICAgICAgICAgICAgICBkYXRlRGlzcGxheUZvcm1hdD17ZGF0ZURpc3BsYXlGb3JtYXR9XG4gICAgICAgICAgICAgIGFyaWFMYWJlbD17XG4gICAgICAgICAgICAgICAgYXJpYUxhYmVscy5kYXRlSW5wdXQgJiZcbiAgICAgICAgICAgICAgICBhcmlhTGFiZWxzLmRhdGVJbnB1dFtyYW5nZS5rZXldICYmXG4gICAgICAgICAgICAgICAgYXJpYUxhYmVscy5kYXRlSW5wdXRbcmFuZ2Uua2V5XS5lbmREYXRlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e29uRHJhZ1NlbGVjdGlvbkVuZH1cbiAgICAgICAgICAgICAgb25Gb2N1cz17KCkgPT4gaGFuZGxlUmFuZ2VGb2N1c0NoYW5nZShpLCAxKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgICB9KX1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZnVuY3Rpb24gZ2V0TW9udGhOYW1lcyhsb2NhbGU6IExvY2FsZSkge1xuICByZXR1cm4gWy4uLkFycmF5KDEyKS5rZXlzKCldLm1hcChpID0+IGxvY2FsZS5sb2NhbGl6ZS5tb250aChpIGFzIEZOU01vbnRoKSk7XG59XG5cbmZ1bmN0aW9uIGNhbGNTY3JvbGxBcmVhKGRpcmVjdGlvbjogJ3ZlcnRpY2FsJyB8ICdob3Jpem9udGFsJywgbW9udGhzOiBudW1iZXIsIHNjcm9sbDogQ2FsZW5kYXJQcm9wc1tcInNjcm9sbFwiXSkge1xuICBpZiAoIXNjcm9sbC5lbmFibGVkKSByZXR1cm4geyBlbmFibGVkOiBmYWxzZSB9O1xuXG4gIGNvbnN0IGxvbmdNb250aEhlaWdodCA9IHNjcm9sbC5sb25nTW9udGhIZWlnaHQgfHwgc2Nyb2xsLm1vbnRoSGVpZ2h0O1xuXG4gIGlmIChkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIG1vbnRoSGVpZ2h0OiBzY3JvbGwubW9udGhIZWlnaHQgfHwgMjIwLFxuICAgICAgbG9uZ01vbnRoSGVpZ2h0OiBsb25nTW9udGhIZWlnaHQgfHwgMjYwLFxuICAgICAgY2FsZW5kYXJXaWR0aDogJ2F1dG8nLFxuICAgICAgY2FsZW5kYXJIZWlnaHQ6IChzY3JvbGwuY2FsZW5kYXJIZWlnaHQgfHwgbG9uZ01vbnRoSGVpZ2h0IHx8IDI0MCkgKiBtb250aHMsXG4gICAgfTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgbW9udGhXaWR0aDogc2Nyb2xsLm1vbnRoV2lkdGggfHwgMzMyLFxuICAgIGNhbGVuZGFyV2lkdGg6IChzY3JvbGwuY2FsZW5kYXJXaWR0aCB8fCBzY3JvbGwubW9udGhXaWR0aCB8fCAzMzIpICogbW9udGhzLFxuICAgIG1vbnRoSGVpZ2h0OiBsb25nTW9udGhIZWlnaHQgfHwgMzAwLFxuICAgIGNhbGVuZGFySGVpZ2h0OiBsb25nTW9udGhIZWlnaHQgfHwgMzAwLFxuICB9O1xufSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsTUFBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBR0EsSUFBQUMsUUFBQSxHQUFBRCxPQUFBO0FBRUEsSUFBQUUsS0FBQSxHQUFBRixPQUFBO0FBQ0EsSUFBQUcsTUFBQSxHQUFBSCxPQUFBO0FBQ0EsSUFBQUksT0FBQSxHQUFBTCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUssVUFBQSxHQUFBTixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQU0sV0FBQSxHQUFBUCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQU8sVUFBQSxHQUFBUixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVEsTUFBQSxHQUFBVCxzQkFBQSxDQUFBQyxPQUFBO0FBQTZCLFNBQUFELHVCQUFBVSxHQUFBLFdBQUFBLEdBQUEsSUFBQUEsR0FBQSxDQUFBQyxVQUFBLEdBQUFELEdBQUEsS0FBQUUsT0FBQSxFQUFBRixHQUFBO0FBNkRkLFNBQVNHLFFBQVFBLENBQUFDLElBQUEsRUErQ2Q7RUFBQSxJQS9DZTtJQUMvQkMsY0FBYyxHQUFHLElBQUk7SUFDckJDLHVCQUF1QixHQUFHLElBQUk7SUFDOUJDLGFBQWEsR0FBRyxFQUFFO0lBQ2xCQyxXQUFXLEdBQUdBLENBQUEsS0FBTSxLQUFLO0lBQ3pCQyxPQUFPLEdBQUcsSUFBQUMsaUJBQVEsRUFBQyxJQUFJQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ3BDQyxPQUFPLEdBQUcsSUFBQUYsaUJBQVEsRUFBQyxJQUFJQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztJQUNsQ0UsSUFBSTtJQUNKQyxRQUFRO0lBQ1JDLGVBQWU7SUFDZkMsa0JBQWtCO0lBQ2xCQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ2ZDLE1BQU0sR0FBR0MsVUFBSTtJQUNiQyxTQUFTO0lBQ1RDLGlCQUFpQjtJQUNqQkMsTUFBTSxHQUFHLEVBQUU7SUFDWEMsT0FBTztJQUNQQyxpQkFBaUIsR0FBRyxhQUFhO0lBQ2pDQyxrQkFBa0IsR0FBRyxVQUFVO0lBQy9CQyxvQkFBb0IsR0FBRyxHQUFHO0lBQzFCQyxZQUFZO0lBQ1pDLGdCQUFnQixHQUFHLEdBQUc7SUFDdEJDLFlBQVksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckJDLGtCQUFrQjtJQUNsQkMsTUFBTSxHQUFHLENBQUM7SUFDVkMsU0FBUztJQUNUQyxlQUFlLEdBQUcsSUFBSTtJQUN0QkMsV0FBVyxHQUFHLElBQUk7SUFDbEJDLFdBQVcsR0FBRyxNQUFNO0lBQ3BCQyxLQUFLLEdBQUcsU0FBUztJQUNqQkMsV0FBVztJQUNYQyxNQUFNLEdBQUc7TUFDUEMsT0FBTyxFQUFFO0lBQ1gsQ0FBQztJQUNEQyxTQUFTLEdBQUcsVUFBVTtJQUN0QkMsb0JBQW9CLEdBQUksT0FBTTtJQUM5QkMsa0JBQWtCLEdBQUksWUFBVztJQUNqQ0MsV0FBVyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7SUFDL0NDLGtCQUFrQixHQUFHLEtBQUs7SUFDMUJDLG9CQUFvQixHQUFHLElBQUk7SUFDM0JDLFdBQVcsR0FBRyxLQUFLO0lBQ25CQyxhQUFhLEdBQUcsVUFBVTtJQUMxQkMsa0JBQWtCLEdBQUcsS0FBSztJQUMxQkMsVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNmQywyQkFBMkIsR0FBRyxLQUFLO0lBQ25DQyxlQUFlLEdBQUcsS0FBSztJQUN2QkM7RUFDYSxDQUFDLEdBQUFoRCxJQUFBO0VBRWQsTUFBTWlELElBQUksR0FBR0MsY0FBSyxDQUFDQyxNQUFNLENBQUM7SUFDeEJDLFdBQVcsRUFBRTtNQUNYdEMsTUFBTTtNQUNOUztJQUNGLENBQUM7SUFDRDhCLE1BQU0sRUFBRSxJQUFBQyxxQkFBYyxFQUFDLENBQUNDLGVBQVUsRUFBRTFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hEMkMsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUNqQkMsSUFBSSxFQUFFLElBQUk7SUFDVnZCLE1BQU07SUFDTndCLGFBQWEsRUFBRSxJQUFJO0lBQ25CakQsSUFBSSxFQUFFQSxJQUFJO0lBQ1ZTLE1BQU0sRUFBRUE7RUFDVixDQUFDLENBQUM7RUFFRixNQUFNLENBQUN5QyxLQUFLLEVBQUVDLFFBQVEsQ0FBQyxHQUFHVixjQUFLLENBQUNXLFFBQVEsQ0FBQztJQUN2Q0MsVUFBVSxFQUFFQyxhQUFhLENBQUNqRCxNQUFNLENBQUM7SUFDakNrRCxXQUFXLEVBQUUsSUFBQUMsb0JBQWEsRUFBQyxJQUFJLEVBQUVqRCxTQUFTLEVBQUVQLElBQUksRUFBRWtCLE1BQU0sRUFBRVQsTUFBTSxFQUFFTyxZQUFZLEVBQUVNLFdBQVcsQ0FBQztJQUM1Rm1DLElBQUksRUFBRTtNQUNKQyxNQUFNLEVBQUUsS0FBSztNQUNiQyxLQUFLLEVBQUU7UUFBRUMsU0FBUyxFQUFFLElBQUk7UUFBRUMsT0FBTyxFQUFFO01BQUssQ0FBQztNQUN6Q0MsY0FBYyxFQUFFO0lBQ2xCLENBQUM7SUFDREMsVUFBVSxFQUFFQyxjQUFjLENBQUNyQyxTQUFTLEVBQUVULE1BQU0sRUFBRU8sTUFBTSxDQUFDO0lBQ3JEZixPQUFPLEVBQUV1RDtFQUNYLENBQUMsQ0FBQztFQUVGLE1BQU1DLGVBQWUsR0FBR0EsQ0FBQSxLQUFNO0lBQzVCLE1BQU1DLFFBQVEsR0FBRyxJQUFBWCxvQkFBYSxFQUFDTixLQUFLLENBQUNLLFdBQVcsRUFBRWhELFNBQVMsRUFBRVAsSUFBSSxFQUFFa0IsTUFBTSxFQUFFVCxNQUFNLEVBQUVPLFlBQVksRUFBRU0sV0FBVyxDQUFDO0lBRTdHOEMsV0FBVyxDQUFDRCxRQUFRLENBQUM7RUFDdkIsQ0FBQztFQUVEMUIsY0FBSyxDQUFDNEIsU0FBUyxDQUFDLE1BQU07SUFFcEIsSUFBSUMsSUFBSSxDQUFDQyxTQUFTLENBQUM5RCxNQUFNLENBQUMsSUFBSTZELElBQUksQ0FBQ0MsU0FBUyxDQUFDL0IsSUFBSSxDQUFDZ0MsT0FBTyxDQUFDL0QsTUFBTSxDQUFDLElBQUlULElBQUksRUFBRXlFLE9BQU8sR0FBRyxDQUFDLElBQUlqQyxJQUFJLENBQUNnQyxPQUFPLENBQUN4RSxJQUFJLEVBQUV5RSxPQUFPLEdBQUcsQ0FBQyxFQUFFO01BQ3hIakMsSUFBSSxDQUFDZ0MsT0FBTyxDQUFDL0QsTUFBTSxHQUFHQSxNQUFNO01BQzVCK0IsSUFBSSxDQUFDZ0MsT0FBTyxDQUFDeEUsSUFBSSxHQUFHQSxJQUFJO01BRXhCLElBQUcsQ0FBQ3FDLDJCQUEyQixFQUFFO1FBQy9CNkIsZUFBZSxDQUFDLENBQUM7TUFDbkI7SUFDRjtJQUVBLElBQUkxQixJQUFJLENBQUNnQyxPQUFPLENBQUM3QixXQUFXLENBQUN0QyxNQUFNLElBQUlBLE1BQU0sRUFBRTtNQUM3Q21DLElBQUksQ0FBQ2dDLE9BQU8sQ0FBQzdCLFdBQVcsQ0FBQ3RDLE1BQU0sR0FBR0EsTUFBTTtNQUN4QzhDLFFBQVEsQ0FBQ3VCLENBQUMsS0FBSztRQUFFLEdBQUdBLENBQUM7UUFBRXJCLFVBQVUsRUFBRUMsYUFBYSxDQUFDakQsTUFBTTtNQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlEO0lBRUFtQyxJQUFJLENBQUNnQyxPQUFPLENBQUM3QixXQUFXLENBQUM3QixZQUFZLEdBQUdBLFlBQVk7SUFFcEQsSUFBSXdELElBQUksQ0FBQ0MsU0FBUyxDQUFDL0IsSUFBSSxDQUFDZ0MsT0FBTyxDQUFDL0MsTUFBTSxDQUFDLElBQUk2QyxJQUFJLENBQUNDLFNBQVMsQ0FBQzlDLE1BQU0sQ0FBQyxFQUFFO01BQ2pFZSxJQUFJLENBQUNnQyxPQUFPLENBQUMvQyxNQUFNLEdBQUdBLE1BQU07TUFHNUIwQixRQUFRLENBQUN1QixDQUFDLEtBQUs7UUFBRSxHQUFHQSxDQUFDO1FBQUVYLFVBQVUsRUFBRUMsY0FBYyxDQUFDckMsU0FBUyxFQUFFVCxNQUFNLEVBQUVPLE1BQU07TUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsRjtFQUVGLENBQUMsRUFBRSxDQUFDaEIsTUFBTSxFQUFFVCxJQUFJLEVBQUV5QixNQUFNLEVBQUVFLFNBQVMsRUFBRVQsTUFBTSxFQUFFYixNQUFNLEVBQUVTLFlBQVksQ0FBQyxDQUFDO0VBRW5FMkIsY0FBSyxDQUFDNEIsU0FBUyxDQUFDLE1BQU07SUFDcEIsSUFBSTVDLE1BQU0sQ0FBQ0MsT0FBTyxFQUFFO01BQ2xCMEMsV0FBVyxDQUFDbEIsS0FBSyxDQUFDSyxXQUFXLENBQUM7SUFDaEM7RUFDRixDQUFDLEVBQUUsQ0FBQzlCLE1BQU0sQ0FBQ0MsT0FBTyxDQUFDLENBQUM7RUFFcEIsTUFBTWlELFVBQVUsR0FBR2hELFNBQVMsS0FBSyxVQUFVO0VBRTNDLE1BQU1pRCxvQkFBb0IsR0FBSTVFLElBQVUsSUFBSztJQUMzQyxJQUFJZ0Msb0JBQW9CLEVBQUU7TUFDeEJtQixRQUFRLENBQUM7UUFBRSxHQUFHRCxLQUFLO1FBQUVPLElBQUksRUFBRTtVQUFFQyxNQUFNLEVBQUUsSUFBSTtVQUFFQyxLQUFLLEVBQUU7WUFBRUMsU0FBUyxFQUFFNUQsSUFBSTtZQUFFNkQsT0FBTyxFQUFFN0Q7VUFBSyxDQUFDO1VBQUU4RCxjQUFjLEVBQUU7UUFBTTtNQUFFLENBQUMsQ0FBQztJQUNsSCxDQUFDLE1BQU07TUFDTDdELFFBQVEsR0FBR0QsSUFBSSxDQUFDO0lBQ2xCO0VBQ0YsQ0FBQztFQUVELE1BQU02RSxrQkFBa0IsR0FBSTdFLElBQVUsSUFBSztJQUN6QyxJQUFJLENBQUNnQyxvQkFBb0IsRUFBRTtNQUN6QjtJQUNGO0lBRUEsSUFBSVYsV0FBVyxJQUFJLE1BQU0sSUFBSSxDQUFDNEIsS0FBSyxDQUFDTyxJQUFJLENBQUNDLE1BQU0sRUFBRTtNQUMvQ3pELFFBQVEsR0FBR0QsSUFBSSxDQUFDO01BQ2hCO0lBQ0Y7SUFFQSxNQUFNOEUsUUFBUSxHQUFHO01BQ2ZsQixTQUFTLEVBQUVWLEtBQUssQ0FBQ08sSUFBSSxDQUFDRSxLQUFLLENBQUNDLFNBQVM7TUFDckNDLE9BQU8sRUFBRTdEO0lBQ1gsQ0FBQztJQUVELElBQUlzQixXQUFXLElBQUksV0FBVyxJQUFJLElBQUF5RCxrQkFBUyxFQUFDRCxRQUFRLENBQUNsQixTQUFTLEVBQUU1RCxJQUFJLENBQUMsRUFBRTtNQUNyRW1ELFFBQVEsQ0FBQztRQUFFLEdBQUdELEtBQUs7UUFBRU8sSUFBSSxFQUFFO1VBQUVDLE1BQU0sRUFBRSxLQUFLO1VBQUVDLEtBQUssRUFBRTtZQUFFQyxTQUFTLEVBQUUsSUFBSTtZQUFFQyxPQUFPLEVBQUU7VUFBSyxDQUFDO1VBQUVDLGNBQWMsRUFBRVosS0FBSyxDQUFDTyxJQUFJLENBQUNLO1FBQWU7TUFBRSxDQUFDLENBQUM7TUFDckk3RCxRQUFRLEdBQUdELElBQUksQ0FBQztJQUNsQixDQUFDLE1BQU07TUFDTG1ELFFBQVEsQ0FBQztRQUFFLEdBQUdELEtBQUs7UUFBRU8sSUFBSSxFQUFFO1VBQUVDLE1BQU0sRUFBRSxLQUFLO1VBQUVDLEtBQUssRUFBRTtZQUFFQyxTQUFTLEVBQUUsSUFBSTtZQUFFQyxPQUFPLEVBQUU7VUFBSyxDQUFDO1VBQUVDLGNBQWMsRUFBRVosS0FBSyxDQUFDTyxJQUFJLENBQUNLO1FBQWU7TUFBRSxDQUFDLENBQUM7TUFDckl0QyxXQUFXLEdBQUdzRCxRQUFRLENBQUM7SUFDekI7RUFDRixDQUFDO0VBRUQsTUFBTUUsbUJBQW1CLEdBQUloRixJQUFVLElBQUs7SUFDMUMsSUFBSSxDQUFDa0QsS0FBSyxDQUFDTyxJQUFJLENBQUNDLE1BQU0sSUFBSSxDQUFDMUIsb0JBQW9CLEVBQUU7TUFDL0M7SUFDRjtJQUVBbUIsUUFBUSxDQUFDO01BQUUsR0FBR0QsS0FBSztNQUFFTyxJQUFJLEVBQUU7UUFBRUMsTUFBTSxFQUFFUixLQUFLLENBQUNPLElBQUksQ0FBQ0MsTUFBTTtRQUFFQyxLQUFLLEVBQUU7VUFBRUMsU0FBUyxFQUFFVixLQUFLLENBQUNPLElBQUksQ0FBQ0UsS0FBSyxDQUFDQyxTQUFTO1VBQUVDLE9BQU8sRUFBRTdEO1FBQUssQ0FBQztRQUFFOEQsY0FBYyxFQUFFWixLQUFLLENBQUNPLElBQUksQ0FBQ0s7TUFBZTtJQUFFLENBQUMsQ0FBQztFQUN6SyxDQUFDO0VBRUQsTUFBTW1CLHNCQUFzQixHQUFHQSxDQUFDQyxXQUFtQixFQUFFQyxjQUFzQixLQUFLO0lBQzlFaEYsa0JBQWtCLEdBQUcsQ0FBQytFLFdBQVcsRUFBRUMsY0FBYyxDQUFDLENBQUM7RUFDckQsQ0FBQztFQUVELE1BQU1DLGlCQUFpQixHQUFHQSxDQUFDQyxLQUFhLEVBQUVDLEtBQTZCLEtBQUs7SUFFMUUsSUFBSUEsS0FBSyxFQUFFO01BQ1Q5QyxJQUFJLENBQUNnQyxPQUFPLENBQUN6QixhQUFhLEdBQUd1QyxLQUFLO01BRWxDLElBQUlBLEtBQUssQ0FBQ0QsS0FBSyxDQUFDLEVBQUU7UUFDaEIsT0FBT0MsS0FBSyxDQUFDRCxLQUFLLENBQUM7TUFDckI7SUFDRjtJQUVBLElBQUkxRCxTQUFTLElBQUksWUFBWSxFQUFFO01BQzdCLE9BQU91QixLQUFLLENBQUNhLFVBQVUsQ0FBQ3dCLFVBQVU7SUFDcEM7SUFFQSxNQUFNQyxTQUFTLEdBQUcsSUFBQUMsa0JBQVMsRUFBQzdGLE9BQU8sRUFBRXlGLEtBQUssQ0FBQztJQUMzQyxNQUFNO01BQUVLLEtBQUs7TUFBRUM7SUFBSSxDQUFDLEdBQUcsSUFBQUMsMkJBQW9CLEVBQUNKLFNBQVMsRUFBRWhELElBQUksQ0FBQ2dDLE9BQU8sQ0FBQzdCLFdBQTBCLENBQUM7SUFDL0YsTUFBTWtELFdBQVcsR0FBRyxJQUFBQyx5QkFBZ0IsRUFBQ0gsR0FBRyxFQUFFRCxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDNUQsT0FBT0csV0FBVyxHQUFHM0MsS0FBSyxDQUFDYSxVQUFVLENBQUNnQyxlQUFlLEdBQUc3QyxLQUFLLENBQUNhLFVBQVUsQ0FBQ2lDLFdBQVc7RUFDdEYsQ0FBQztFQUVELE1BQU1DLFlBQVksR0FBR0EsQ0FBQSxLQUFNO0lBQ3pCLE1BQU1DLGFBQWEsR0FBRzFELElBQUksQ0FBQ2dDLE9BQU8sQ0FBQ3hCLElBQUksQ0FBQ21ELGVBQWUsQ0FBQyxDQUFDO0lBRXpELElBQUlELGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBS2pDLFNBQVMsRUFBRTtJQUVwQyxNQUFNbUMsWUFBWSxHQUFHLElBQUFYLGtCQUFTLEVBQUM3RixPQUFPLEVBQUVzRyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlELE1BQU1HLG9CQUFvQixHQUFHLENBQUMsSUFBQUMsb0JBQVcsRUFBQ0YsWUFBWSxFQUFFbEQsS0FBSyxDQUFDSyxXQUFXLENBQUM7SUFFMUUsSUFBSThDLG9CQUFvQixJQUFJLENBQUM3RCxJQUFJLENBQUNnQyxPQUFPLENBQUN2QixhQUFhLEVBQUU7TUFDdkRFLFFBQVEsQ0FBQ3VCLENBQUMsS0FBSztRQUFFLEdBQUdBLENBQUM7UUFBRW5CLFdBQVcsRUFBRTZDO01BQWEsQ0FBQyxDQUFDLENBQUM7TUFDcEQ1RixpQkFBaUIsR0FBRzRGLFlBQVksQ0FBQztJQUNuQztJQUVBNUQsSUFBSSxDQUFDZ0MsT0FBTyxDQUFDdkIsYUFBYSxHQUFHLEtBQUs7RUFDcEMsQ0FBQztFQUVELE1BQU1zRCxhQUFhLEdBQUlDLEdBQVUsSUFBSztJQUNwQyxJQUFJLENBQUNBLEdBQUcsRUFBRTtNQUNSckQsUUFBUSxDQUFDdUIsQ0FBQyxLQUFLO1FBQUUsR0FBR0EsQ0FBQztRQUFFaEUsT0FBTyxFQUFFdUQ7TUFBVSxDQUFDLENBQUMsQ0FBQztNQUM3QztJQUNGO0lBRUEsTUFBTXZELE9BQU8sR0FBRztNQUNka0QsU0FBUyxFQUFFNEMsR0FBRztNQUNkM0MsT0FBTyxFQUFFMkMsR0FBRztNQUNaakYsS0FBSyxFQUFFQTtJQUNULENBQUM7SUFFRDRCLFFBQVEsQ0FBQ3VCLENBQUMsS0FBSztNQUFFLEdBQUdBLENBQUM7TUFBRWhFO0lBQVEsQ0FBQyxDQUFDLENBQUM7RUFDcEMsQ0FBQztFQUVELE1BQU0wRCxXQUFXLEdBQUcsU0FBQUEsQ0FBQ3BFLElBQVUsRUFBZ0M7SUFBQSxJQUE5QnlHLGtCQUFrQixHQUFBQyxTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBekMsU0FBQSxHQUFBeUMsU0FBQSxNQUFHLElBQUk7SUFFeEQsSUFBSSxDQUFDakYsTUFBTSxDQUFDQyxPQUFPLEVBQUU7TUFDbkIsSUFBSStFLGtCQUFrQixJQUFJdEUsa0JBQWtCLEVBQUU7UUFDNUMsTUFBTXlFLGVBQWUsR0FBRyxJQUFBQyxtQ0FBMEIsRUFBQzdHLElBQUksRUFBRWtELEtBQUssQ0FBQ0ssV0FBVyxDQUFDO1FBRTNFLE1BQU11RCxnQkFBZ0IsR0FBRzVFLGFBQWEsS0FBSyxVQUFVLElBQUkwRSxlQUFlLElBQUksQ0FBQztRQUM3RSxNQUFNRyxpQkFBaUIsR0FBRzdFLGFBQWEsS0FBSyxXQUFXLElBQUkwRSxlQUFlLElBQUksQ0FBQztRQUMvRSxJQUFJLENBQUNFLGdCQUFnQixJQUFJQyxpQkFBaUIsS0FBS0MsSUFBSSxDQUFDQyxHQUFHLENBQUNMLGVBQWUsQ0FBQyxHQUFHMUYsTUFBTSxFQUFFO1VBQ2pGO1FBQ0Y7TUFDRjtNQUVBaUMsUUFBUSxDQUFDdUIsQ0FBQyxLQUFLO1FBQUUsR0FBR0EsQ0FBQztRQUFFbkIsV0FBVyxFQUFFdkQ7TUFBSyxDQUFDLENBQUMsQ0FBQztNQUM1QztJQUNGO0lBRUEsTUFBTWtILGdCQUFnQixHQUFHLElBQUFMLG1DQUEwQixFQUFDN0csSUFBSSxFQUFFSixPQUFPLENBQUM7SUFDbEUsTUFBTXNHLGFBQWEsR0FBRzFELElBQUksQ0FBQ2dDLE9BQU8sQ0FBQ3hCLElBQUksQ0FBQ21ELGVBQWUsQ0FBQyxDQUFDO0lBRXpELElBQUlNLGtCQUFrQixJQUFJUCxhQUFhLENBQUNpQixRQUFRLENBQUNELGdCQUFnQixDQUFDLEVBQUU7SUFFcEUxRSxJQUFJLENBQUNnQyxPQUFPLENBQUN2QixhQUFhLEdBQUcsSUFBSTtJQUNqQ1QsSUFBSSxDQUFDZ0MsT0FBTyxDQUFDeEIsSUFBSSxDQUFDb0UsUUFBUSxDQUFDRixnQkFBZ0IsQ0FBQztJQUM1Qy9ELFFBQVEsQ0FBQ3VCLENBQUMsS0FBSztNQUFFLEdBQUdBLENBQUM7TUFBRW5CLFdBQVcsRUFBRXZEO0lBQUssQ0FBQyxDQUFDLENBQUM7RUFDOUMsQ0FBQztFQUVELE1BQU1xSCxlQUFlLEdBQUcsU0FBQUEsQ0FBQ0MsS0FBYSxFQUFtRTtJQUFBLElBQWpFQyxJQUFvRCxHQUFBYixTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBekMsU0FBQSxHQUFBeUMsU0FBQSxNQUFHLEtBQUs7SUFDbEcsTUFBTWMsVUFBVSxHQUFHO01BQ2pCQyxXQUFXLEVBQUVBLENBQUEsS0FBTSxJQUFBaEMsa0JBQVMsRUFBQ3ZDLEtBQUssQ0FBQ0ssV0FBVyxFQUFFK0QsS0FBSyxDQUFDO01BQ3RESSxRQUFRLEVBQUVBLENBQUEsS0FBTSxJQUFBQSxpQkFBUSxFQUFDeEUsS0FBSyxDQUFDSyxXQUFXLEVBQUUrRCxLQUFLLENBQUM7TUFDbERLLE9BQU8sRUFBRUEsQ0FBQSxLQUFNLElBQUFBLGdCQUFPLEVBQUN6RSxLQUFLLENBQUNLLFdBQVcsRUFBRStELEtBQUssQ0FBQztNQUNoRE0sR0FBRyxFQUFFQSxDQUFBLEtBQU1OO0lBQ2IsQ0FBQztJQUVELE1BQU1PLE9BQU8sR0FBRyxJQUFBQyxZQUFHLEVBQUMsQ0FBQyxJQUFBQyxZQUFHLEVBQUMsQ0FBQ1AsVUFBVSxDQUFDRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUzSCxPQUFPLENBQUMsQ0FBQyxFQUFFRyxPQUFPLENBQUMsQ0FBQztJQUNsRXFFLFdBQVcsQ0FBQ3lELE9BQU8sRUFBRSxLQUFLLENBQUM7SUFDM0JySCxpQkFBaUIsR0FBR3FILE9BQU8sQ0FBQztFQUM5QixDQUFDO0VBRUQsTUFBTUcsY0FBYyxHQUFHdkgsTUFBTSxDQUFDd0gsR0FBRyxDQUFDLENBQUN0RSxLQUFLLEVBQUV1RSxDQUFDLE1BQU07SUFDL0MsR0FBR3ZFLEtBQUs7SUFDUnBDLEtBQUssRUFBRW9DLEtBQUssQ0FBQ3BDLEtBQUssSUFBSU8sV0FBVyxDQUFDb0csQ0FBQyxDQUFDLElBQUkzRztFQUMxQyxDQUFDLENBQUMsQ0FBQztFQUVILG9CQUNFL0MsTUFBQSxDQUFBYSxPQUFBLENBQUE4SSxhQUFBO0lBQ0VoSCxTQUFTLEVBQUUsSUFBQWlILG1CQUFVLEVBQUM1RixJQUFJLENBQUNnQyxPQUFPLENBQUM1QixNQUFNLENBQUN5RixlQUFlLEVBQUVsSCxTQUFTLENBQUU7SUFDdEVtSCxTQUFTLEVBQUVBLENBQUEsS0FBTTtNQUNmbkYsUUFBUSxDQUFDO1FBQUUsR0FBR0QsS0FBSztRQUFFTyxJQUFJLEVBQUU7VUFBRUMsTUFBTSxFQUFFLEtBQUs7VUFBRUMsS0FBSyxFQUFFO1lBQUVDLFNBQVMsRUFBRSxJQUFJO1lBQUVDLE9BQU8sRUFBRTtVQUFLLENBQUM7VUFBRUMsY0FBYyxFQUFFO1FBQU07TUFBRSxDQUFDLENBQUM7SUFDbkgsQ0FBRTtJQUNGeUUsWUFBWSxFQUFFQSxDQUFBLEtBQU07TUFDbEJwRixRQUFRLENBQUM7UUFBRSxHQUFHRCxLQUFLO1FBQUVPLElBQUksRUFBRTtVQUFFQyxNQUFNLEVBQUUsS0FBSztVQUFFQyxLQUFLLEVBQUU7WUFBRUMsU0FBUyxFQUFFLElBQUk7WUFBRUMsT0FBTyxFQUFFO1VBQUssQ0FBQztVQUFFQyxjQUFjLEVBQUU7UUFBTTtNQUFFLENBQUMsQ0FBQztJQUNuSDtFQUFFLEdBQ0QxQyxlQUFlLGdCQUFHNUMsTUFBQSxDQUFBYSxPQUFBLENBQUE4SSxhQUFBLENBQUNLLFdBQVc7SUFBQzNELGtCQUFrQixFQUFFQSxrQkFBbUI7SUFBQ0ksc0JBQXNCLEVBQUVBLHNCQUF1QjtJQUFDdEMsV0FBVyxFQUFFSCxJQUFJLENBQUNnQyxPQUFPLENBQUM3QixXQUE0QjtJQUFDUCxVQUFVLEVBQUVBLFVBQVc7SUFBQ1EsTUFBTSxFQUFFSixJQUFJLENBQUNnQyxPQUFPLENBQUM1QixNQUFPO0lBQUNoQixvQkFBb0IsRUFBRUEsb0JBQXFCO0lBQUNDLGtCQUFrQixFQUFFQSxrQkFBbUI7SUFBQ0Usa0JBQWtCLEVBQUVBLGtCQUFtQjtJQUFDZixZQUFZLEVBQUVBLFlBQWE7SUFBQ08sS0FBSyxFQUFFQSxLQUFNO0lBQUNkLE1BQU0sRUFBRXVILGNBQWU7SUFBQ2xHLFdBQVcsRUFBRUEsV0FBWTtJQUFDbkIsaUJBQWlCLEVBQUVBO0VBQWtCLENBQUUsQ0FBQyxHQUFHLElBQUksZUFDM2VuQyxNQUFBLENBQUFhLE9BQUEsQ0FBQThJLGFBQUEsQ0FBQ00sWUFBWTtJQUFDcEYsVUFBVSxFQUFFSCxLQUFLLENBQUNHLFVBQVc7SUFBQ0UsV0FBVyxFQUFFTCxLQUFLLENBQUNLLFdBQVk7SUFBQzhELGVBQWUsRUFBRUEsZUFBZ0I7SUFBQ3pFLE1BQU0sRUFBRUosSUFBSSxDQUFDZ0MsT0FBTyxDQUFDNUIsTUFBcUI7SUFBQ25ELHVCQUF1QixFQUFFQSx1QkFBd0I7SUFBQ0QsY0FBYyxFQUFFQSxjQUFlO0lBQUNJLE9BQU8sRUFBRUEsT0FBUTtJQUFDRyxPQUFPLEVBQUVBLE9BQVE7SUFBQ3FDLFVBQVUsRUFBRUE7RUFBVyxDQUFFLENBQUMsRUFDeFNYLE1BQU0sQ0FBQ0MsT0FBTyxnQkFDYmxELE1BQUEsQ0FBQWEsT0FBQSxDQUFBOEksYUFBQSxjQUNHeEQsVUFBVSxnQkFBR25HLE1BQUEsQ0FBQWEsT0FBQSxDQUFBOEksYUFBQSxDQUFDTyxRQUFRO0lBQUM5RixNQUFNLEVBQUVKLElBQUksQ0FBQ2dDLE9BQU8sQ0FBQzVCLE1BQU87SUFBQ0QsV0FBVyxFQUFFSCxJQUFJLENBQUNnQyxPQUFPLENBQUM3QixXQUFZO0lBQUM5QixvQkFBb0IsRUFBRUE7RUFBcUIsQ0FBRSxDQUFDLEdBQUcsSUFBSSxlQUNqSnJDLE1BQUEsQ0FBQWEsT0FBQSxDQUFBOEksYUFBQTtJQUNFaEgsU0FBUyxFQUFFLElBQUFpSCxtQkFBVSxFQUNuQjVGLElBQUksQ0FBQ2dDLE9BQU8sQ0FBQzVCLE1BQU0sQ0FBQytGLGNBQWMsRUFDbENoRSxVQUFVLEdBQUduQyxJQUFJLENBQUNnQyxPQUFPLENBQUM1QixNQUFNLENBQUNnRyxjQUFjLEdBQUdwRyxJQUFJLENBQUNnQyxPQUFPLENBQUM1QixNQUFNLENBQUNpRyxnQkFDeEUsQ0FBRTtJQUNGTixZQUFZLEVBQUVBLENBQUEsS0FBTXJJLGVBQWUsR0FBRyxDQUFFO0lBQ3hDNEksS0FBSyxFQUFFO01BQ0xDLEtBQUssRUFBRSxPQUFPN0YsS0FBSyxDQUFDYSxVQUFVLENBQUNpRixhQUFhLEtBQUssUUFBUSxHQUFHOUYsS0FBSyxDQUFDYSxVQUFVLENBQUNpRixhQUFhLEdBQUksQ0FBQzlGLEtBQUssQ0FBQ2EsVUFBVSxDQUFDaUYsYUFBYSxJQUFJLENBQUMsSUFBSSxFQUFHO01BQ3pJQyxNQUFNLEVBQUUvRixLQUFLLENBQUNhLFVBQVUsQ0FBQ21GLGNBQWMsR0FBRztJQUM1QyxDQUFFO0lBQ0ZDLFFBQVEsRUFBRWxEO0VBQWEsZ0JBQ3ZCekgsTUFBQSxDQUFBYSxPQUFBLENBQUE4SSxhQUFBLENBQUNsSixVQUFBLENBQUFJLE9BQVM7SUFDUnNILE1BQU0sRUFBRSxJQUFBRSxtQ0FBMEIsRUFDaEMsSUFBQXVDLG1CQUFVLEVBQUNySixPQUFPLENBQUMsRUFDbkIsSUFBQXNKLGdCQUFPLEVBQUMsSUFBQUMscUJBQVksRUFBQzFKLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNuQyxDQUFFO0lBQ0YySixJQUFJLEVBQUMsVUFBVTtJQUNmQyxHQUFHLEVBQUVDLE1BQU0sSUFBSTtNQUNiakgsSUFBSSxDQUFDZ0MsT0FBTyxDQUFDeEIsSUFBSSxHQUFHeUcsTUFBTTtJQUM1QixDQUFFO0lBQ0ZDLGlCQUFpQixFQUFFdEUsaUJBQWtCO0lBQ3JDdUUsSUFBSSxFQUFFaEYsVUFBVSxHQUFHLEdBQUcsR0FBRyxHQUFJO0lBQzdCaUYsWUFBWSxFQUFFQSxDQUFDdkUsS0FBSyxFQUFFd0UsR0FBRyxLQUFLO01BQzVCLE1BQU1yRSxTQUFTLEdBQUcsSUFBQUMsa0JBQVMsRUFBQzdGLE9BQU8sRUFBRXlGLEtBQUssQ0FBQztNQUMzQyxvQkFDRTdHLE1BQUEsQ0FBQWEsT0FBQSxDQUFBOEksYUFBQSxDQUFDakosTUFBQSxDQUFBRyxPQUFLO1FBQ0o0QixrQkFBa0IsRUFBRUEsa0JBQW1CO1FBQ3ZDZ0IsV0FBVyxFQUFFQSxXQUFZO1FBQ3pCWixXQUFXLEVBQUVBLFdBQVk7UUFDekJSLG9CQUFvQixFQUFFQSxvQkFBcUI7UUFDM0NFLGdCQUFnQixFQUFFQSxnQkFBaUI7UUFDbkNPLFdBQVcsRUFBRUEsV0FBWTtRQUN6QnBCLGVBQWUsRUFBRUEsZUFBZSxJQUFJcUcsYUFBYztRQUNsRDdGLE9BQU8sRUFBRUEsT0FBTyxJQUFJd0MsS0FBSyxDQUFDeEMsT0FBUTtRQUNsQ0QsTUFBTSxFQUFFdUgsY0FBZTtRQUN2QjZCLEdBQUcsRUFBRUEsR0FBSTtRQUNUN0ksWUFBWSxFQUFFQSxZQUFhO1FBQzNCeUMsSUFBSSxFQUFFUCxLQUFLLENBQUNPLElBQUs7UUFDakI3QyxrQkFBa0IsRUFBRUEsa0JBQW1CO1FBQ3ZDK0IsV0FBVyxFQUFFSCxJQUFJLENBQUNnQyxPQUFPLENBQUM3QixXQUF3QztRQUNsRWpELGFBQWEsRUFBRUEsYUFBYztRQUM3QkMsV0FBVyxFQUFFQSxXQUFZO1FBQ3pCbUssS0FBSyxFQUFFdEUsU0FBVTtRQUNqQlosb0JBQW9CLEVBQUVBLG9CQUFxQjtRQUMzQ0Msa0JBQWtCLEVBQUVBLGtCQUFtQjtRQUN2Q0csbUJBQW1CLEVBQUVBLG1CQUFvQjtRQUN6Q3VELFlBQVksRUFBRUEsQ0FBQSxLQUFNckksZUFBZSxHQUFHLENBQUU7UUFDeEMwQyxNQUFNLEVBQUVKLElBQUksQ0FBQ2dDLE9BQU8sQ0FBQzVCLE1BQXFCO1FBQzFDa0csS0FBSyxFQUNIbkUsVUFBVSxHQUNOO1VBQUVzRSxNQUFNLEVBQUU3RCxpQkFBaUIsQ0FBQ0MsS0FBSztRQUFFLENBQUMsR0FDcEM7VUFBRTRELE1BQU0sRUFBRS9GLEtBQUssQ0FBQ2EsVUFBVSxDQUFDaUMsV0FBVztVQUFFK0MsS0FBSyxFQUFFM0QsaUJBQWlCLENBQUNDLEtBQUs7UUFBRSxDQUM3RTtRQUNEMEUsYUFBYTtRQUNiQyxZQUFZLEVBQUUsQ0FBQ3JGLFVBQVc7UUFDMUJwRCxLQUFLLEVBQUVBLEtBQU07UUFDYnhCLE9BQU8sRUFBRUEsT0FBUTtRQUNqQkgsT0FBTyxFQUFFQSxPQUFRO1FBQ2pCSSxJQUFJLEVBQUVBLElBQUs7UUFDWHVDLGlCQUFpQixFQUFFQSxpQkFBa0I7UUFDckNELGVBQWUsRUFBRUE7TUFBZ0IsQ0FDbEMsQ0FBQztJQUVOO0VBQUUsQ0FDSCxDQUNFLENBQ0YsQ0FBQyxnQkFFTjlELE1BQUEsQ0FBQWEsT0FBQSxDQUFBOEksYUFBQTtJQUNFaEgsU0FBUyxFQUFFLElBQUFpSCxtQkFBVSxFQUNuQjVGLElBQUksQ0FBQ2dDLE9BQU8sQ0FBQzVCLE1BQU0sQ0FBQzFCLE1BQU0sRUFDMUJ5RCxVQUFVLEdBQUduQyxJQUFJLENBQUNnQyxPQUFPLENBQUM1QixNQUFNLENBQUNnRyxjQUFjLEdBQUdwRyxJQUFJLENBQUNnQyxPQUFPLENBQUM1QixNQUFNLENBQUNpRyxnQkFDeEU7RUFBRSxHQUNELElBQUlvQixLQUFLLENBQUMvSSxNQUFNLENBQUMsQ0FBQ2dKLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQ2pDLEdBQUcsQ0FBQyxDQUFDa0MsQ0FBQyxFQUFFakMsQ0FBQyxLQUFLO0lBQzFDLElBQUkxQyxTQUFTLEdBQUcsSUFBQUMsa0JBQVMsRUFBQ3ZDLEtBQUssQ0FBQ0ssV0FBVyxFQUFFMkUsQ0FBQyxDQUFDO0lBQUM7SUFDaEQsSUFBSWhHLGFBQWEsS0FBSyxXQUFXLEVBQUU7TUFDakNzRCxTQUFTLEdBQUcsSUFBQTRFLGtCQUFTLEVBQUNsSCxLQUFLLENBQUNLLFdBQVcsRUFBRXJDLE1BQU0sR0FBRyxDQUFDLEdBQUdnSCxDQUFDLENBQUM7SUFDMUQ7SUFDQSxvQkFDRTFKLE1BQUEsQ0FBQWEsT0FBQSxDQUFBOEksYUFBQSxDQUFDakosTUFBQSxDQUFBRyxPQUFLO01BQ0o0QixrQkFBa0IsRUFBRUEsa0JBQW1CO01BQ3ZDZ0IsV0FBVyxFQUFFQSxXQUFZO01BQ3pCcEIsb0JBQW9CLEVBQUVBLG9CQUFxQjtNQUMzQ0UsZ0JBQWdCLEVBQUVBLGdCQUFpQjtNQUNuQ0gsa0JBQWtCLEVBQUVBLGtCQUFtQjtNQUN2Q2tJLEtBQUssRUFBRSxDQUFDLENBQUU7TUFDVnpILFdBQVcsRUFBRUEsV0FBWTtNQUN6QkMsV0FBVyxFQUFFQSxXQUFZO01BQ3pCcEIsZUFBZSxFQUFFQSxlQUFlLElBQUlxRyxhQUFjO01BQ2xEN0YsT0FBTyxFQUFFQSxPQUFPLElBQUl3QyxLQUFLLENBQUN4QyxPQUFRO01BQ2xDRCxNQUFNLEVBQUV1SCxjQUFlO01BQ3ZCNkIsR0FBRyxFQUFFM0IsQ0FBRTtNQUNQekUsSUFBSSxFQUFFUCxLQUFLLENBQUNPLElBQUs7TUFDakJ6QyxZQUFZLEVBQUVBLFlBQWE7TUFDM0IyQixXQUFXLEVBQUVILElBQUksQ0FBQ2dDLE9BQU8sQ0FBQzdCLFdBQTZCO01BQ3ZEakQsYUFBYSxFQUFFQSxhQUFjO01BQzdCQyxXQUFXLEVBQUVBLFdBQVk7TUFDekJtSyxLQUFLLEVBQUV0RSxTQUFVO01BQ2pCWixvQkFBb0IsRUFBRUEsb0JBQXFCO01BQzNDQyxrQkFBa0IsRUFBRUEsa0JBQW1CO01BQ3ZDRyxtQkFBbUIsRUFBRUEsbUJBQW9CO01BQ3pDdUQsWUFBWSxFQUFFQSxDQUFBLEtBQU1ySSxlQUFlLEdBQUcsQ0FBRTtNQUN4QzBDLE1BQU0sRUFBRUosSUFBSSxDQUFDZ0MsT0FBTyxDQUFDNUIsTUFBcUI7TUFDMUNvSCxZQUFZLEVBQUUsQ0FBQ3JGLFVBQVUsSUFBSXVELENBQUMsS0FBSyxDQUFFO01BQ3JDNkIsYUFBYSxFQUFFLENBQUNwRixVQUFVLElBQUl1RCxDQUFDLEdBQUcsQ0FBRTtNQUNwQzNHLEtBQUssRUFBRUEsS0FBTTtNQUNieEIsT0FBTyxFQUFFQSxPQUFRO01BQ2pCSCxPQUFPLEVBQUVBLE9BQVE7TUFDakJJLElBQUksRUFBRUEsSUFBSztNQUNYdUMsaUJBQWlCLEVBQUVBLGlCQUFrQjtNQUNyQ0QsZUFBZSxFQUFFQTtJQUFnQixDQUNsQyxDQUFDO0VBRU4sQ0FBQyxDQUNFLENBRUosQ0FBQztBQUVWO0FBY0EsU0FBU21HLFlBQVlBLENBQUE0QixLQUFBLEVBVUM7RUFBQSxJQVZBO0lBQ3BCekgsTUFBTTtJQUNOcEQsY0FBYztJQUNkSSxPQUFPO0lBQ1BHLE9BQU87SUFDUHFDLFVBQVU7SUFDVm1CLFdBQVc7SUFDWDlELHVCQUF1QjtJQUN2QjRILGVBQWU7SUFDZmhFO0VBQ2lCLENBQUMsR0FBQWdILEtBQUE7RUFFbEIsTUFBTUMsY0FBYyxHQUFHdkssT0FBTyxDQUFDd0ssV0FBVyxDQUFDLENBQUM7RUFDNUMsTUFBTUMsY0FBYyxHQUFHNUssT0FBTyxDQUFDMkssV0FBVyxDQUFDLENBQUM7RUFFNUMsb0JBQ0UvTCxNQUFBLENBQUFhLE9BQUEsQ0FBQThJLGFBQUE7SUFBS0csU0FBUyxFQUFFbUMsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLGVBQWUsQ0FBQyxDQUFFO0lBQUN2SixTQUFTLEVBQUV5QixNQUFNLENBQUMrSDtFQUFvQixHQUM3RW5MLGNBQWMsZ0JBQ2JoQixNQUFBLENBQUFhLE9BQUEsQ0FBQThJLGFBQUE7SUFDRW9CLElBQUksRUFBQyxRQUFRO0lBQ2JwSSxTQUFTLEVBQUUsSUFBQWlILG1CQUFVLEVBQUN4RixNQUFNLENBQUNnSSxjQUFjLEVBQUVoSSxNQUFNLENBQUNpSSxVQUFVLENBQUU7SUFDaEVDLE9BQU8sRUFBRUEsQ0FBQSxLQUFNekQsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBRTtJQUNsRCxjQUFZakYsVUFBVSxDQUFDeUk7RUFBVyxnQkFDbENyTSxNQUFBLENBQUFhLE9BQUEsQ0FBQThJLGFBQUEsVUFBSSxDQUNFLENBQUMsR0FDUCxJQUFJLEVBQ1AxSSx1QkFBdUIsZ0JBQ3RCakIsTUFBQSxDQUFBYSxPQUFBLENBQUE4SSxhQUFBO0lBQU1oSCxTQUFTLEVBQUV5QixNQUFNLENBQUNtSTtFQUFvQixnQkFDMUN2TSxNQUFBLENBQUFhLE9BQUEsQ0FBQThJLGFBQUE7SUFBTWhILFNBQVMsRUFBRXlCLE1BQU0sQ0FBQ29JO0VBQVksZ0JBQ2xDeE0sTUFBQSxDQUFBYSxPQUFBLENBQUE4SSxhQUFBO0lBQ0ViLEtBQUssRUFBRS9ELFdBQVcsQ0FBQzBILFFBQVEsQ0FBQyxDQUFFO0lBQzlCaEwsUUFBUSxFQUFFd0ssQ0FBQyxJQUFJcEQsZUFBZSxDQUFDNkQsTUFBTSxDQUFDVCxDQUFDLENBQUNoQixNQUFNLENBQUNuQyxLQUFLLENBQUMsRUFBRSxVQUFVLENBQUU7SUFDbkUsY0FBWWxGLFVBQVUsQ0FBQzRJO0VBQVksR0FDbEMzSCxVQUFVLENBQUM0RSxHQUFHLENBQUMsQ0FBQ2tELFNBQWlCLEVBQUVqRCxDQUFTLGtCQUMzQzFKLE1BQUEsQ0FBQWEsT0FBQSxDQUFBOEksYUFBQTtJQUFRMEIsR0FBRyxFQUFFM0IsQ0FBRTtJQUFDWixLQUFLLEVBQUVZO0VBQUUsR0FDdEJpRCxTQUNLLENBQ1QsQ0FDSyxDQUNKLENBQUMsZUFDUDNNLE1BQUEsQ0FBQWEsT0FBQSxDQUFBOEksYUFBQTtJQUFNaEgsU0FBUyxFQUFFeUIsTUFBTSxDQUFDd0k7RUFBb0IsQ0FBRSxDQUFDLGVBQy9DNU0sTUFBQSxDQUFBYSxPQUFBLENBQUE4SSxhQUFBO0lBQU1oSCxTQUFTLEVBQUV5QixNQUFNLENBQUN5STtFQUFXLGdCQUNqQzdNLE1BQUEsQ0FBQWEsT0FBQSxDQUFBOEksYUFBQTtJQUNFYixLQUFLLEVBQUUvRCxXQUFXLENBQUNnSCxXQUFXLENBQUMsQ0FBRTtJQUNqQ3RLLFFBQVEsRUFBRXdLLENBQUMsSUFBSXBELGVBQWUsQ0FBQzZELE1BQU0sQ0FBQ1QsQ0FBQyxDQUFDaEIsTUFBTSxDQUFDbkMsS0FBSyxDQUFDLEVBQUUsU0FBUyxDQUFFO0lBQ2xFLGNBQVlsRixVQUFVLENBQUNpSjtFQUFXLEdBQ2pDLElBQUlwQixLQUFLLENBQUNLLGNBQWMsR0FBR0UsY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUM1Q04sSUFBSSxDQUFDSSxjQUFjLENBQUMsQ0FDcEJyQyxHQUFHLENBQUMsQ0FBQ3pCLEdBQUcsRUFBRTBCLENBQUMsS0FBSztJQUNmLE1BQU1vRCxJQUFJLEdBQUc5RSxHQUFHLEdBQUcwQixDQUFDO0lBQ3BCLG9CQUNFMUosTUFBQSxDQUFBYSxPQUFBLENBQUE4SSxhQUFBO01BQVEwQixHQUFHLEVBQUV5QixJQUFLO01BQUNoRSxLQUFLLEVBQUVnRTtJQUFLLEdBQzVCQSxJQUNLLENBQUM7RUFFYixDQUFDLENBQ0csQ0FDSixDQUNGLENBQUMsZ0JBRVA5TSxNQUFBLENBQUFhLE9BQUEsQ0FBQThJLGFBQUE7SUFBTWhILFNBQVMsRUFBRXlCLE1BQU0sQ0FBQ21JO0VBQW9CLEdBQ3pDMUgsVUFBVSxDQUFDRSxXQUFXLENBQUMwSCxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBQyxFQUFDMUgsV0FBVyxDQUFDZ0gsV0FBVyxDQUFDLENBQzFELENBQ1AsRUFDQS9LLGNBQWMsZ0JBQ2JoQixNQUFBLENBQUFhLE9BQUEsQ0FBQThJLGFBQUE7SUFDRW9CLElBQUksRUFBQyxRQUFRO0lBQ2JwSSxTQUFTLEVBQUUsSUFBQWlILG1CQUFVLEVBQUN4RixNQUFNLENBQUNnSSxjQUFjLEVBQUVoSSxNQUFNLENBQUMySSxVQUFVLENBQUU7SUFDaEVULE9BQU8sRUFBRUEsQ0FBQSxLQUFNekQsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBRTtJQUNsRCxjQUFZakYsVUFBVSxDQUFDbUo7RUFBVyxnQkFDbEMvTSxNQUFBLENBQUFhLE9BQUEsQ0FBQThJLGFBQUEsVUFBSSxDQUNFLENBQUMsR0FDUCxJQUNELENBQUM7QUFFVjtBQVdBLFNBQVNPLFFBQVFBLENBQUE4QyxLQUFBLEVBSUM7RUFBQSxJQUpBO0lBQ2hCNUksTUFBTTtJQUNORCxXQUFXO0lBQ1g5QjtFQUNhLENBQUMsR0FBQTJLLEtBQUE7RUFDZCxNQUFNQyxHQUFHLEdBQUcsSUFBSTNMLElBQUksQ0FBQyxDQUFDO0VBRXRCLG9CQUNFdEIsTUFBQSxDQUFBYSxPQUFBLENBQUE4SSxhQUFBO0lBQUtoSCxTQUFTLEVBQUV5QixNQUFNLENBQUM4STtFQUFTLEdBQzdCLElBQUFDLDBCQUFpQixFQUFDO0lBQ2pCakcsS0FBSyxFQUFFLElBQUFrRyxvQkFBVyxFQUFDSCxHQUFHLEVBQUU5SSxXQUEwQixDQUFDO0lBQ25EZ0QsR0FBRyxFQUFFLElBQUFrRyxrQkFBUyxFQUFDSixHQUFHLEVBQUU5SSxXQUEwQjtFQUNoRCxDQUFDLENBQUMsQ0FBQ3NGLEdBQUcsQ0FBQyxDQUFDNkQsR0FBRyxFQUFFNUQsQ0FBQyxrQkFDWjFKLE1BQUEsQ0FBQWEsT0FBQSxDQUFBOEksYUFBQTtJQUFNaEgsU0FBUyxFQUFFeUIsTUFBTSxDQUFDbUosT0FBUTtJQUFDbEMsR0FBRyxFQUFFM0I7RUFBRSxHQUNyQyxJQUFBOEQsZUFBTSxFQUFDRixHQUFHLEVBQUVqTCxvQkFBb0IsRUFBRThCLFdBQTBCLENBQ3pELENBQ1AsQ0FDRSxDQUFDO0FBRVY7QUFrQkEsU0FBUzZGLFdBQVdBLENBQUF5RCxLQUFBLEVBY0M7RUFBQSxJQWRBO0lBQ25CakwsWUFBWTtJQUNaTyxLQUFLO0lBQ0xkLE1BQU07SUFDTnFCLFdBQVc7SUFDWG5CLGlCQUFpQjtJQUNqQm9CLGtCQUFrQjtJQUNsQkgsb0JBQW9CO0lBQ3BCQyxrQkFBa0I7SUFDbEJPLFVBQVU7SUFDVlEsTUFBTTtJQUNORCxXQUFXO0lBQ1hrQyxrQkFBa0I7SUFDbEJJO0VBQ2dCLENBQUMsR0FBQWdILEtBQUE7RUFDakIsTUFBTUMsWUFBWSxHQUFHcEssV0FBVyxDQUFDZCxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSU8sS0FBSztFQUUxRCxvQkFDRS9DLE1BQUEsQ0FBQWEsT0FBQSxDQUFBOEksYUFBQTtJQUFLaEgsU0FBUyxFQUFFeUIsTUFBTSxDQUFDdUo7RUFBbUIsR0FDdkMxTCxNQUFNLENBQUN3SCxHQUFHLENBQUMsQ0FBQ3RFLEtBQUssRUFBRXVFLENBQUMsS0FBSztJQUN4QixJQUFJdkUsS0FBSyxDQUFDdkMsZUFBZSxLQUFLLEtBQUssSUFBS3VDLEtBQUssQ0FBQ3lJLFFBQVEsSUFBSSxDQUFDekksS0FBSyxDQUFDdkMsZUFBZ0IsRUFDL0UsT0FBTyxJQUFJO0lBQ2Isb0JBQ0U1QyxNQUFBLENBQUFhLE9BQUEsQ0FBQThJLGFBQUE7TUFDRWhILFNBQVMsRUFBRXlCLE1BQU0sQ0FBQ3lKLFdBQVk7TUFDOUJ4QyxHQUFHLEVBQUUzQixDQUFFO01BQ1BZLEtBQUssRUFBRTtRQUFFdkgsS0FBSyxFQUFFb0MsS0FBSyxDQUFDcEMsS0FBSyxJQUFJMks7TUFBYTtJQUFFLGdCQUM5QzFOLE1BQUEsQ0FBQWEsT0FBQSxDQUFBOEksYUFBQSxDQUFDcEosVUFBQSxDQUFBTSxPQUFTO01BQ1I4QixTQUFTLEVBQUUsSUFBQWlILG1CQUFVLEVBQUN4RixNQUFNLENBQUMwSixlQUFlLEVBQUU7UUFDNUMsQ0FBQzFKLE1BQU0sQ0FBQzJKLHFCQUFxQixHQUFHdkwsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLa0gsQ0FBQyxJQUFJbEgsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLO01BQy9FLENBQUMsQ0FBRTtNQUNId0wsUUFBUSxFQUFFLENBQUN6SyxrQkFBbUI7TUFDOUJxSyxRQUFRLEVBQUV6SSxLQUFLLENBQUN5SSxRQUFTO01BQ3pCOUUsS0FBSyxFQUFFM0QsS0FBSyxDQUFDQyxTQUFVO01BQ3ZCNkksV0FBVyxFQUFFN0ssb0JBQXFCO01BQ2xDZSxXQUFXLEVBQUVBLFdBQVk7TUFDekJoQyxpQkFBaUIsRUFBRUEsaUJBQWtCO01BQ3JDK0wsU0FBUyxFQUNQdEssVUFBVSxDQUFDdUssU0FBUyxJQUNwQnZLLFVBQVUsQ0FBQ3VLLFNBQVMsQ0FBQ2hKLEtBQUssQ0FBQ2tHLEdBQUcsQ0FBQyxJQUMvQnpILFVBQVUsQ0FBQ3VLLFNBQVMsQ0FBQ2hKLEtBQUssQ0FBQ2tHLEdBQUcsQ0FBQyxDQUFDakcsU0FDakM7TUFDRDNELFFBQVEsRUFBRTRFLGtCQUFtQjtNQUM3QitILE9BQU8sRUFBRUEsQ0FBQSxLQUFNM0gsc0JBQXNCLENBQUNpRCxDQUFDLEVBQUUsQ0FBQztJQUFFLENBQzdDLENBQUMsZUFDRjFKLE1BQUEsQ0FBQWEsT0FBQSxDQUFBOEksYUFBQSxDQUFDcEosVUFBQSxDQUFBTSxPQUFTO01BQ1I4QixTQUFTLEVBQUUsSUFBQWlILG1CQUFVLEVBQUN4RixNQUFNLENBQUMwSixlQUFlLEVBQUU7UUFDNUMsQ0FBQzFKLE1BQU0sQ0FBQzJKLHFCQUFxQixHQUFHdkwsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLa0gsQ0FBQyxJQUFJbEgsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLO01BQy9FLENBQUMsQ0FBRTtNQUNId0wsUUFBUSxFQUFFLENBQUN6SyxrQkFBbUI7TUFDOUJxSyxRQUFRLEVBQUV6SSxLQUFLLENBQUN5SSxRQUFTO01BQ3pCOUUsS0FBSyxFQUFFM0QsS0FBSyxDQUFDRSxPQUFRO01BQ3JCNEksV0FBVyxFQUFFNUssa0JBQW1CO01BQ2hDYyxXQUFXLEVBQUVBLFdBQVk7TUFDekJoQyxpQkFBaUIsRUFBRUEsaUJBQWtCO01BQ3JDK0wsU0FBUyxFQUNQdEssVUFBVSxDQUFDdUssU0FBUyxJQUNwQnZLLFVBQVUsQ0FBQ3VLLFNBQVMsQ0FBQ2hKLEtBQUssQ0FBQ2tHLEdBQUcsQ0FBQyxJQUMvQnpILFVBQVUsQ0FBQ3VLLFNBQVMsQ0FBQ2hKLEtBQUssQ0FBQ2tHLEdBQUcsQ0FBQyxDQUFDaEcsT0FDakM7TUFDRDVELFFBQVEsRUFBRTRFLGtCQUFtQjtNQUM3QitILE9BQU8sRUFBRUEsQ0FBQSxLQUFNM0gsc0JBQXNCLENBQUNpRCxDQUFDLEVBQUUsQ0FBQztJQUFFLENBQzdDLENBQ0UsQ0FBQztFQUVWLENBQUMsQ0FDRSxDQUFDO0FBRVY7QUFFQSxTQUFTNUUsYUFBYUEsQ0FBQ2pELE1BQWMsRUFBRTtFQUNyQyxPQUFPLENBQUMsR0FBRzRKLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQzRDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzVFLEdBQUcsQ0FBQ0MsQ0FBQyxJQUFJN0gsTUFBTSxDQUFDeU0sUUFBUSxDQUFDaEQsS0FBSyxDQUFDNUIsQ0FBYSxDQUFDLENBQUM7QUFDN0U7QUFFQSxTQUFTbEUsY0FBY0EsQ0FBQ3JDLFNBQW9DLEVBQUVULE1BQWMsRUFBRU8sTUFBK0IsRUFBRTtFQUM3RyxJQUFJLENBQUNBLE1BQU0sQ0FBQ0MsT0FBTyxFQUFFLE9BQU87SUFBRUEsT0FBTyxFQUFFO0VBQU0sQ0FBQztFQUU5QyxNQUFNcUUsZUFBZSxHQUFHdEUsTUFBTSxDQUFDc0UsZUFBZSxJQUFJdEUsTUFBTSxDQUFDdUUsV0FBVztFQUVwRSxJQUFJckUsU0FBUyxLQUFLLFVBQVUsRUFBRTtJQUM1QixPQUFPO01BQ0xELE9BQU8sRUFBRSxJQUFJO01BQ2JzRSxXQUFXLEVBQUV2RSxNQUFNLENBQUN1RSxXQUFXLElBQUksR0FBRztNQUN0Q0QsZUFBZSxFQUFFQSxlQUFlLElBQUksR0FBRztNQUN2Q2lELGFBQWEsRUFBRSxNQUFNO01BQ3JCRSxjQUFjLEVBQUUsQ0FBQ3pILE1BQU0sQ0FBQ3lILGNBQWMsSUFBSW5ELGVBQWUsSUFBSSxHQUFHLElBQUk3RTtJQUN0RSxDQUFDO0VBQ0g7RUFDQSxPQUFPO0lBQ0xRLE9BQU8sRUFBRSxJQUFJO0lBQ2I2RCxVQUFVLEVBQUU5RCxNQUFNLENBQUM4RCxVQUFVLElBQUksR0FBRztJQUNwQ3lELGFBQWEsRUFBRSxDQUFDdkgsTUFBTSxDQUFDdUgsYUFBYSxJQUFJdkgsTUFBTSxDQUFDOEQsVUFBVSxJQUFJLEdBQUcsSUFBSXJFLE1BQU07SUFDMUU4RSxXQUFXLEVBQUVELGVBQWUsSUFBSSxHQUFHO0lBQ25DbUQsY0FBYyxFQUFFbkQsZUFBZSxJQUFJO0VBQ3JDLENBQUM7QUFDSCIsImlnbm9yZUxpc3QiOltdfQ==