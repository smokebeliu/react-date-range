"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _utils = require("../../utils");
var _DayCell = _interopRequireDefault(require("../DayCell"));
var _dateFns = require("date-fns");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var _default = exports.default = /*#__PURE__*/(0, _react.memo)(function Month(_ref) {
  let {
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
    weeksNumbersLabel
  } = _ref;
  const now = new Date();
  const minDateInternal = !!minDate && (0, _dateFns.startOfDay)(minDate);
  const maxDateInternal = !!maxDate && (0, _dateFns.endOfDay)(maxDate);
  let newMonthDisplayDate = month;
  if (maxDate && (maxDate.getFullYear() < month.getFullYear() || maxDate.getFullYear() == month.getFullYear() && maxDate.getMonth() < month.getMonth())) {
    newMonthDisplayDate = (0, _dateFns.startOfMonth)(maxDate);
  }
  const monthDisplay = (0, _utils.getMonthDisplayRange)(newMonthDisplayDate, dateOptions, fixedHeight);
  let rangesInternal = ranges;
  if (displayMode == 'dateRange' && drag.status) {
    const {
      startDate,
      endDate
    } = drag.range;
    rangesInternal = rangesInternal.map((range, i) => {
      if (i !== focusedRange[0]) return range;
      return {
        ...range,
        startDate,
        endDate
      };
    });
  }
  const showPreviewInternal = showPreview && !drag.disablePreview;
  const weeksNumbers = (0, _utils.getWeeksNumbers)(monthDisplay.start, monthDisplay.end);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: styles.month,
    style: style
  }, showMonthName ? /*#__PURE__*/_react.default.createElement("div", {
    className: styles.monthName
  }, (0, _dateFns.format)(month, monthDisplayFormat, dateOptions)) : null, /*#__PURE__*/_react.default.createElement("div", {
    className: styles.monthWrapper
  }, showWeekNumbers && /*#__PURE__*/_react.default.createElement("div", {
    className: styles.weekNumbersWrapper
  }, showWeekDays && /*#__PURE__*/_react.default.createElement("div", {
    className: styles.weekNumbersLabel
  }, weeksNumbersLabel || 'W'), weeksNumbers.map((weekNumber, i) => {
    return /*#__PURE__*/_react.default.createElement("span", {
      key: i
    }, weekNumber);
  })), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      flex: 1
    }
  }, showWeekDays ? /*#__PURE__*/_react.default.createElement(Weekdays, {
    styles: styles,
    dateOptions: dateOptions,
    weekdayDisplayFormat: weekdayDisplayFormat
  }) : null, /*#__PURE__*/_react.default.createElement("div", {
    className: styles.days,
    onMouseLeave: onMouseLeave
  }, (0, _dateFns.eachDayOfInterval)({
    start: monthDisplay.start,
    end: monthDisplay.end
  }).map((day, index) => {
    const isStartOfMonth = (0, _dateFns.isSameDay)(day, monthDisplay.startDateOfMonth);
    const isEndOfMonth = (0, _dateFns.isSameDay)(day, monthDisplay.endDateOfMonth);
    const isOutsideMinMax = minDateInternal && (0, _dateFns.isBefore)(day, minDateInternal) || maxDateInternal && (0, _dateFns.isAfter)(day, maxDateInternal);
    const isDisabledSpecifically = disabledDates.some(disabledDate => (0, _dateFns.isSameDay)(disabledDate, day));
    const isDisabledDay = disabledDay(day);
    return /*#__PURE__*/_react.default.createElement(_DayCell.default, {
      date: date,
      dayContentRenderer: dayContentRenderer,
      key: index,
      onPreviewChange: onPreviewChange,
      displayMode: displayMode,
      color: color,
      dayDisplayFormat: dayDisplayFormat,
      ranges: rangesInternal,
      day: day,
      preview: showPreviewInternal ? preview : null,
      isWeekend: (0, _dateFns.isWeekend)(day),
      isToday: (0, _dateFns.isSameDay)(day, now),
      isStartOfWeek: (0, _dateFns.isSameDay)(day, (0, _dateFns.startOfWeek)(day, dateOptions)),
      isEndOfWeek: (0, _dateFns.isSameDay)(day, (0, _dateFns.endOfWeek)(day, dateOptions)),
      isStartOfMonth: isStartOfMonth,
      isEndOfMonth: isEndOfMonth,
      disabled: isOutsideMinMax || isDisabledSpecifically || isDisabledDay,
      isPassive: !(0, _dateFns.isWithinInterval)(day, {
        start: monthDisplay.startDateOfMonth,
        end: monthDisplay.endDateOfMonth
      }),
      styles: styles,
      onMouseDown: onDragSelectionStart,
      onMouseUp: onDragSelectionEnd,
      onMouseEnter: onDragSelectionMove
    });
  })))));
});
function Weekdays(_ref2) {
  let {
    styles,
    dateOptions,
    weekdayDisplayFormat
  } = _ref2;
  const now = new Date();
  return /*#__PURE__*/_react.default.createElement("div", {
    className: styles.weekDays
  }, (0, _dateFns.eachDayOfInterval)({
    start: (0, _dateFns.startOfWeek)(now, dateOptions),
    end: (0, _dateFns.endOfWeek)(now, dateOptions)
  }).map((day, i) => {
    return /*#__PURE__*/_react.default.createElement("span", {
      className: styles.weekDay,
      key: i
    }, (0, _dateFns.format)(day, weekdayDisplayFormat, dateOptions));
  }));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfdXRpbHMiLCJfRGF5Q2VsbCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJfZGF0ZUZucyIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwiZSIsIldlYWtNYXAiLCJyIiwidCIsImhhcyIsImdldCIsIm4iLCJfX3Byb3RvX18iLCJhIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ1IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaSIsInNldCIsIl9kZWZhdWx0IiwiZXhwb3J0cyIsIm1lbW8iLCJNb250aCIsIl9yZWYiLCJzdHlsZSIsInN0eWxlcyIsIm1vbnRoIiwiZHJhZyIsImRhdGVPcHRpb25zIiwiZGlzYWJsZWREYXRlcyIsImRpc2FibGVkRGF5IiwicHJldmlldyIsInNob3dQcmV2aWV3IiwiZGF0ZSIsImRpc3BsYXlNb2RlIiwibWluRGF0ZSIsIm1heERhdGUiLCJyYW5nZXMiLCJjb2xvciIsImZvY3VzZWRSYW5nZSIsIm9uRHJhZ1NlbGVjdGlvblN0YXJ0Iiwib25EcmFnU2VsZWN0aW9uRW5kIiwib25EcmFnU2VsZWN0aW9uTW92ZSIsIm9uTW91c2VMZWF2ZSIsIm9uUHJldmlld0NoYW5nZSIsIm1vbnRoRGlzcGxheUZvcm1hdCIsIndlZWtkYXlEaXNwbGF5Rm9ybWF0IiwiZGF5RGlzcGxheUZvcm1hdCIsInNob3dXZWVrRGF5cyIsInNob3dNb250aE5hbWUiLCJmaXhlZEhlaWdodCIsImRheUNvbnRlbnRSZW5kZXJlciIsInNob3dXZWVrTnVtYmVycyIsIndlZWtzTnVtYmVyc0xhYmVsIiwibm93IiwiRGF0ZSIsIm1pbkRhdGVJbnRlcm5hbCIsInN0YXJ0T2ZEYXkiLCJtYXhEYXRlSW50ZXJuYWwiLCJlbmRPZkRheSIsIm5ld01vbnRoRGlzcGxheURhdGUiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwic3RhcnRPZk1vbnRoIiwibW9udGhEaXNwbGF5IiwiZ2V0TW9udGhEaXNwbGF5UmFuZ2UiLCJyYW5nZXNJbnRlcm5hbCIsInN0YXR1cyIsInN0YXJ0RGF0ZSIsImVuZERhdGUiLCJyYW5nZSIsIm1hcCIsInNob3dQcmV2aWV3SW50ZXJuYWwiLCJkaXNhYmxlUHJldmlldyIsIndlZWtzTnVtYmVycyIsImdldFdlZWtzTnVtYmVycyIsInN0YXJ0IiwiZW5kIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsIm1vbnRoTmFtZSIsImZvcm1hdCIsIm1vbnRoV3JhcHBlciIsIndlZWtOdW1iZXJzV3JhcHBlciIsIndlZWtOdW1iZXJzTGFiZWwiLCJ3ZWVrTnVtYmVyIiwia2V5IiwiZmxleCIsIldlZWtkYXlzIiwiZGF5cyIsImVhY2hEYXlPZkludGVydmFsIiwiZGF5IiwiaW5kZXgiLCJpc1N0YXJ0T2ZNb250aCIsImlzU2FtZURheSIsInN0YXJ0RGF0ZU9mTW9udGgiLCJpc0VuZE9mTW9udGgiLCJlbmREYXRlT2ZNb250aCIsImlzT3V0c2lkZU1pbk1heCIsImlzQmVmb3JlIiwiaXNBZnRlciIsImlzRGlzYWJsZWRTcGVjaWZpY2FsbHkiLCJzb21lIiwiZGlzYWJsZWREYXRlIiwiaXNEaXNhYmxlZERheSIsImlzV2Vla2VuZCIsImlzVG9kYXkiLCJpc1N0YXJ0T2ZXZWVrIiwic3RhcnRPZldlZWsiLCJpc0VuZE9mV2VlayIsImVuZE9mV2VlayIsImRpc2FibGVkIiwiaXNQYXNzaXZlIiwiaXNXaXRoaW5JbnRlcnZhbCIsIm9uTW91c2VEb3duIiwib25Nb3VzZVVwIiwib25Nb3VzZUVudGVyIiwiX3JlZjIiLCJ3ZWVrRGF5cyIsIndlZWtEYXkiXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9Nb250aC9pbmRleC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENTU1Byb3BlcnRpZXMsIE1vdXNlRXZlbnQsIG1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2dldE1vbnRoRGlzcGxheVJhbmdlLCBnZXRXZWVrc051bWJlcnN9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IFN0eWxlc1R5cGUgfSBmcm9tICcuLi8uLi9zdHlsZXMnO1xuaW1wb3J0IERheUNlbGwsIHsgRGF5Q2VsbFByb3BzLCBEYXRlUmFuZ2UgfSBmcm9tICcuLi9EYXlDZWxsJztcbmltcG9ydCB7IEZvcm1hdE9wdGlvbnMsIGVhY2hEYXlPZkludGVydmFsLCBlbmRPZkRheSwgZW5kT2ZXZWVrLCBmb3JtYXQsIGlzQWZ0ZXIsIGlzQmVmb3JlLCBpc1NhbWVEYXksIGlzV2Vla2VuZCwgaXNXaXRoaW5JbnRlcnZhbCwgc3RhcnRPZkRheSwgc3RhcnRPZk1vbnRoLCBzdGFydE9mV2VlayB9IGZyb20gJ2RhdGUtZm5zJztcblxudHlwZSBNb250aFByb3BzID0ge1xuICBzdHlsZTogQ1NTUHJvcGVydGllcyxcbiAgc3R5bGVzOiBTdHlsZXNUeXBlLFxuICBtb250aDogRGF0ZSxcbiAgZHJhZzoge1xuICAgIHJhbmdlOiBEYXRlUmFuZ2UsXG4gICAgZGlzYWJsZVByZXZpZXc6IGJvb2xlYW4sXG4gICAgc3RhdHVzOiBib29sZWFuXG4gIH0sXG4gIGRhdGVPcHRpb25zOiBGb3JtYXRPcHRpb25zLFxuICBkaXNhYmxlZERhdGVzPzogRGF0ZVtdLFxuICBkYXRlPzogRGF0ZSxcbiAgZGlzYWJsZWREYXk/OiAoZGF0ZTogRGF0ZSkgPT4gYm9vbGVhbixcbiAgcHJldmlldz86IHtcbiAgICBzdGFydERhdGU6IERhdGUsXG4gICAgZW5kRGF0ZTogRGF0ZVxuICB9LFxuICBzaG93UHJldmlldz86IGJvb2xlYW4sXG4gIGRpc3BsYXlNb2RlOiBcImRhdGVSYW5nZVwiIHwgXCJkYXRlXCIsXG4gIG1pbkRhdGU/OiBEYXRlLFxuICBtYXhEYXRlPzogRGF0ZSxcbiAgcmFuZ2VzPzogRGF5Q2VsbFByb3BzW1wicmFuZ2VzXCJdLFxuICBmb2N1c2VkUmFuZ2U/OiBudW1iZXJbXSxcbiAgY29sb3I/OiBzdHJpbmcsXG4gIG9uUHJldmlld0NoYW5nZT86IChkYXRlPzogRGF0ZSkgPT4gdm9pZCxcbiAgb25EcmFnU2VsZWN0aW9uU3RhcnQ/OiAoZGF0ZTogRGF0ZSkgPT4gdm9pZCxcbiAgb25EcmFnU2VsZWN0aW9uRW5kPzogKGRhdGU6IERhdGUpID0+IHZvaWQsXG4gIG9uRHJhZ1NlbGVjdGlvbk1vdmU/OiAoZGF0ZTogRGF0ZSkgPT4gdm9pZCxcbiAgb25Nb3VzZUxlYXZlPzogKGV2ZW50OiBNb3VzZUV2ZW50PEhUTUxEaXZFbGVtZW50PikgPT4gdm9pZCxcbiAgbW9udGhEaXNwbGF5Rm9ybWF0OiBzdHJpbmcsXG4gIHdlZWtkYXlEaXNwbGF5Rm9ybWF0OiBzdHJpbmcsXG4gIGRheURpc3BsYXlGb3JtYXQ6IHN0cmluZyxcbiAgc2hvd1dlZWtEYXlzPzogYm9vbGVhbixcbiAgc2hvd01vbnRoTmFtZT86IGJvb2xlYW4sXG4gIGZpeGVkSGVpZ2h0PzogYm9vbGVhbixcbiAgZGF5Q29udGVudFJlbmRlcmVyPzogKGRhdGU6IERhdGUpID0+IFJlYWN0LlJlYWN0RWxlbWVudFxuICBzaG93V2Vla051bWJlcnM/OiBib29sZWFuLFxuICB3ZWVrc051bWJlcnNMYWJlbD86IHN0cmluZyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW8oZnVuY3Rpb24gTW9udGgoe1xuICBzdHlsZSxcbiAgc3R5bGVzLFxuICBtb250aCxcbiAgZHJhZyxcbiAgZGF0ZU9wdGlvbnMsXG4gIGRpc2FibGVkRGF0ZXMsXG4gIGRpc2FibGVkRGF5LFxuICBwcmV2aWV3LFxuICBzaG93UHJldmlldyxcbiAgZGF0ZSxcbiAgZGlzcGxheU1vZGUsXG4gIG1pbkRhdGUsXG4gIG1heERhdGUsXG4gIHJhbmdlcyxcbiAgY29sb3IsXG4gIGZvY3VzZWRSYW5nZSxcbiAgb25EcmFnU2VsZWN0aW9uU3RhcnQsXG4gIG9uRHJhZ1NlbGVjdGlvbkVuZCxcbiAgb25EcmFnU2VsZWN0aW9uTW92ZSxcbiAgb25Nb3VzZUxlYXZlLFxuICBvblByZXZpZXdDaGFuZ2UsXG4gIG1vbnRoRGlzcGxheUZvcm1hdCxcbiAgd2Vla2RheURpc3BsYXlGb3JtYXQsXG4gIGRheURpc3BsYXlGb3JtYXQsXG4gIHNob3dXZWVrRGF5cyxcbiAgc2hvd01vbnRoTmFtZSxcbiAgZml4ZWRIZWlnaHQsXG4gIGRheUNvbnRlbnRSZW5kZXJlcixcbiAgc2hvd1dlZWtOdW1iZXJzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlZWtzTnVtYmVyc0xhYmVsLFxufTogTW9udGhQcm9wcykge1xuXG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG5cbiAgY29uc3QgbWluRGF0ZUludGVybmFsID0gISFtaW5EYXRlICYmIHN0YXJ0T2ZEYXkobWluRGF0ZSk7XG4gIGNvbnN0IG1heERhdGVJbnRlcm5hbCA9ICEhbWF4RGF0ZSAmJiBlbmRPZkRheShtYXhEYXRlKTtcblxuICBsZXQgbmV3TW9udGhEaXNwbGF5RGF0ZSA9IG1vbnRoO1xuXG4gIGlmIChtYXhEYXRlICYmIChtYXhEYXRlLmdldEZ1bGxZZWFyKCkgPCBtb250aC5nZXRGdWxsWWVhcigpIHx8IChtYXhEYXRlLmdldEZ1bGxZZWFyKCkgPT0gbW9udGguZ2V0RnVsbFllYXIoKSAmJiBtYXhEYXRlLmdldE1vbnRoKCkgPCBtb250aC5nZXRNb250aCgpKSkpIHtcbiAgICBuZXdNb250aERpc3BsYXlEYXRlID0gc3RhcnRPZk1vbnRoKG1heERhdGUpO1xuICB9XG5cbiAgY29uc3QgbW9udGhEaXNwbGF5ID0gZ2V0TW9udGhEaXNwbGF5UmFuZ2UobmV3TW9udGhEaXNwbGF5RGF0ZSwgZGF0ZU9wdGlvbnMsIGZpeGVkSGVpZ2h0KTtcblxuICBsZXQgcmFuZ2VzSW50ZXJuYWwgPSByYW5nZXM7XG5cbiAgaWYgKGRpc3BsYXlNb2RlID09ICdkYXRlUmFuZ2UnICYmIGRyYWcuc3RhdHVzKSB7XG4gICAgY29uc3QgeyBzdGFydERhdGUsIGVuZERhdGUgfSA9IGRyYWcucmFuZ2U7XG5cbiAgICByYW5nZXNJbnRlcm5hbCA9IHJhbmdlc0ludGVybmFsLm1hcCgocmFuZ2UsIGkpID0+IHtcbiAgICAgIGlmIChpICE9PSBmb2N1c2VkUmFuZ2VbMF0pIHJldHVybiByYW5nZTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnJhbmdlLFxuICAgICAgICBzdGFydERhdGUsXG4gICAgICAgIGVuZERhdGUsXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3Qgc2hvd1ByZXZpZXdJbnRlcm5hbCA9IHNob3dQcmV2aWV3ICYmICFkcmFnLmRpc2FibGVQcmV2aWV3O1xuXG4gIGNvbnN0IHdlZWtzTnVtYmVycyA9IGdldFdlZWtzTnVtYmVycyhtb250aERpc3BsYXkuc3RhcnQsIG1vbnRoRGlzcGxheS5lbmQpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy5tb250aH0gc3R5bGU9e3N0eWxlfT5cbiAgICAgIHtcbiAgICAgICAgc2hvd01vbnRoTmFtZSA/IDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMubW9udGhOYW1lfT57Zm9ybWF0KG1vbnRoLCBtb250aERpc3BsYXlGb3JtYXQsIGRhdGVPcHRpb25zKX08L2Rpdj4gOiBudWxsXG4gICAgICB9XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLm1vbnRoV3JhcHBlcn0+XG4gICAgICAgIHtzaG93V2Vla051bWJlcnMgJiYgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy53ZWVrTnVtYmVyc1dyYXBwZXJ9PlxuICAgICAgICAgIHtzaG93V2Vla0RheXMgJiYgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy53ZWVrTnVtYmVyc0xhYmVsfT57d2Vla3NOdW1iZXJzTGFiZWwgfHwgJ1cnfTwvZGl2Pn1cbiAgICAgICAgICB7XG4gICAgICAgICAgICB3ZWVrc051bWJlcnMubWFwKCh3ZWVrTnVtYmVyLCBpKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiA8c3BhbiBrZXk9e2l9Pnt3ZWVrTnVtYmVyfTwvc3Bhbj5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICA8L2Rpdj59XG4gICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4OiAxfX0+XG4gICAgICAgICAge1xuICAgICAgICAgICAgc2hvd1dlZWtEYXlzID8gPFdlZWtkYXlzIHN0eWxlcz17c3R5bGVzfSBkYXRlT3B0aW9ucz17ZGF0ZU9wdGlvbnN9IHdlZWtkYXlEaXNwbGF5Rm9ybWF0PXt3ZWVrZGF5RGlzcGxheUZvcm1hdH0gLz4gOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuZGF5c30gb25Nb3VzZUxlYXZlPXtvbk1vdXNlTGVhdmV9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBlYWNoRGF5T2ZJbnRlcnZhbCh7IHN0YXJ0OiBtb250aERpc3BsYXkuc3RhcnQsIGVuZDogbW9udGhEaXNwbGF5LmVuZCB9KS5tYXAoKGRheTogRGF0ZSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzU3RhcnRPZk1vbnRoID0gaXNTYW1lRGF5KGRheSwgbW9udGhEaXNwbGF5LnN0YXJ0RGF0ZU9mTW9udGgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzRW5kT2ZNb250aCA9IGlzU2FtZURheShkYXksIG1vbnRoRGlzcGxheS5lbmREYXRlT2ZNb250aCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNPdXRzaWRlTWluTWF4ID0gKG1pbkRhdGVJbnRlcm5hbCAmJiBpc0JlZm9yZShkYXksIG1pbkRhdGVJbnRlcm5hbCkpIHx8IChtYXhEYXRlSW50ZXJuYWwgJiYgaXNBZnRlcihkYXksIG1heERhdGVJbnRlcm5hbCkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzRGlzYWJsZWRTcGVjaWZpY2FsbHkgPSBkaXNhYmxlZERhdGVzLnNvbWUoZGlzYWJsZWREYXRlID0+XG4gICAgICAgICAgICAgICAgICBpc1NhbWVEYXkoZGlzYWJsZWREYXRlLCBkYXkpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGlzRGlzYWJsZWREYXkgPSBkaXNhYmxlZERheShkYXkpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxEYXlDZWxsXG4gICAgICAgICAgICAgICAgICAgIGRhdGU9e2RhdGV9XG4gICAgICAgICAgICAgICAgICAgIGRheUNvbnRlbnRSZW5kZXJlcj17ZGF5Q29udGVudFJlbmRlcmVyfVxuICAgICAgICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICBvblByZXZpZXdDaGFuZ2U9e29uUHJldmlld0NoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU1vZGU9e2Rpc3BsYXlNb2RlfVxuICAgICAgICAgICAgICAgICAgICBjb2xvcj17Y29sb3J9XG4gICAgICAgICAgICAgICAgICAgIGRheURpc3BsYXlGb3JtYXQ9e2RheURpc3BsYXlGb3JtYXR9XG4gICAgICAgICAgICAgICAgICAgIHJhbmdlcz17cmFuZ2VzSW50ZXJuYWx9XG4gICAgICAgICAgICAgICAgICAgIGRheT17ZGF5fVxuICAgICAgICAgICAgICAgICAgICBwcmV2aWV3PXtzaG93UHJldmlld0ludGVybmFsID8gcHJldmlldyA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgIGlzV2Vla2VuZD17aXNXZWVrZW5kKGRheSl9XG4gICAgICAgICAgICAgICAgICAgIGlzVG9kYXk9e2lzU2FtZURheShkYXksIG5vdyl9XG4gICAgICAgICAgICAgICAgICAgIGlzU3RhcnRPZldlZWs9e2lzU2FtZURheShkYXksIHN0YXJ0T2ZXZWVrKGRheSwgZGF0ZU9wdGlvbnMpKX1cbiAgICAgICAgICAgICAgICAgICAgaXNFbmRPZldlZWs9e2lzU2FtZURheShkYXksIGVuZE9mV2VlayhkYXksIGRhdGVPcHRpb25zKSl9XG4gICAgICAgICAgICAgICAgICAgIGlzU3RhcnRPZk1vbnRoPXtpc1N0YXJ0T2ZNb250aH1cbiAgICAgICAgICAgICAgICAgICAgaXNFbmRPZk1vbnRoPXtpc0VuZE9mTW9udGh9XG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtpc091dHNpZGVNaW5NYXggfHwgaXNEaXNhYmxlZFNwZWNpZmljYWxseSB8fCBpc0Rpc2FibGVkRGF5fVxuICAgICAgICAgICAgICAgICAgICBpc1Bhc3NpdmU9e1xuICAgICAgICAgICAgICAgICAgICAgICFpc1dpdGhpbkludGVydmFsKGRheSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IG1vbnRoRGlzcGxheS5zdGFydERhdGVPZk1vbnRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBtb250aERpc3BsYXkuZW5kRGF0ZU9mTW9udGgsXG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZXM9e3N0eWxlc31cbiAgICAgICAgICAgICAgICAgICAgb25Nb3VzZURvd249e29uRHJhZ1NlbGVjdGlvblN0YXJ0fVxuICAgICAgICAgICAgICAgICAgICBvbk1vdXNlVXA9e29uRHJhZ1NlbGVjdGlvbkVuZH1cbiAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXtvbkRyYWdTZWxlY3Rpb25Nb3ZlfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcblxufSk7XG5cbnR5cGUgV2Vla2RheXNQcm9wcyA9IHtcbiAgc3R5bGVzOiBTdHlsZXNUeXBlLFxuICBkYXRlT3B0aW9uczogRm9ybWF0T3B0aW9ucyxcbiAgd2Vla2RheURpc3BsYXlGb3JtYXQ6IHN0cmluZ1xufTtcblxuZnVuY3Rpb24gV2Vla2RheXMoe1xuICBzdHlsZXMsXG4gIGRhdGVPcHRpb25zLFxuICB3ZWVrZGF5RGlzcGxheUZvcm1hdFxufTogV2Vla2RheXNQcm9wcykge1xuXG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLndlZWtEYXlzfT5cbiAgICAgIHtcbiAgICAgICAgZWFjaERheU9mSW50ZXJ2YWwoe1xuICAgICAgICAgIHN0YXJ0OiBzdGFydE9mV2Vlayhub3csIGRhdGVPcHRpb25zKSxcbiAgICAgICAgICBlbmQ6IGVuZE9mV2Vlayhub3csIGRhdGVPcHRpb25zKVxuICAgICAgICB9KS5tYXAoKGRheTogRGF0ZSwgaTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17c3R5bGVzLndlZWtEYXl9IGtleT17aX0+e2Zvcm1hdChkYXksIHdlZWtkYXlEaXNwbGF5Rm9ybWF0LCBkYXRlT3B0aW9ucyl9PC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICA8L2Rpdj5cbiAgKVxufSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsTUFBQSxHQUFBQyx1QkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsTUFBQSxHQUFBRCxPQUFBO0FBRUEsSUFBQUUsUUFBQSxHQUFBQyxzQkFBQSxDQUFBSCxPQUFBO0FBQ0EsSUFBQUksUUFBQSxHQUFBSixPQUFBO0FBQTJMLFNBQUFHLHVCQUFBRSxHQUFBLFdBQUFBLEdBQUEsSUFBQUEsR0FBQSxDQUFBQyxVQUFBLEdBQUFELEdBQUEsS0FBQUUsT0FBQSxFQUFBRixHQUFBO0FBQUEsU0FBQUcseUJBQUFDLENBQUEsNkJBQUFDLE9BQUEsbUJBQUFDLENBQUEsT0FBQUQsT0FBQSxJQUFBRSxDQUFBLE9BQUFGLE9BQUEsWUFBQUYsd0JBQUEsWUFBQUEsQ0FBQUMsQ0FBQSxXQUFBQSxDQUFBLEdBQUFHLENBQUEsR0FBQUQsQ0FBQSxL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