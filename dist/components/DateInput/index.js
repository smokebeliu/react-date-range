"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classnames = _interopRequireDefault(require("classnames"));
var _dateFns = require("date-fns");
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports.default = /*#__PURE__*/(0, _react.memo)(function DateInput(_ref) {
  let {
    value,
    placeholder,
    disabled,
    readOnly,
    dateOptions,
    dateDisplayFormat,
    ariaLabel,
    className,
    onFocus,
    onChange
  } = _ref;
  const [state, setState] = _react.default.useState({
    invalid: false,
    changed: false,
    value: formatDate(value, dateDisplayFormat, dateOptions)
  });
  _react.default.useEffect(() => {
    setState(s => ({
      ...s,
      value: formatDate(value, dateDisplayFormat, dateOptions)
    }));
  }, [value, dateDisplayFormat, dateOptions]);
  const update = value => {
    const {
      invalid,
      changed
    } = state;
    if (invalid || !changed || !value) {
      return;
    }
    const parsed = (0, _dateFns.parse)(value, dateDisplayFormat, new Date(), dateOptions);
    if ((0, _dateFns.isValid)(parsed)) {
      setState({
        ...state,
        changed: false
      });
      onChange?.(parsed);
    } else {
      setState({
        ...state,
        invalid: true
      });
    }
  };
  const onChangeInternal = event => {
    setState({
      value: event.target.value,
      changed: true,
      invalid: false
    });
  };
  const onKeyDown = event => {
    if (event.key === 'Enter') {
      update(state.value);
    }
  };
  const onBlur = () => {
    update(state.value);
  };
  return /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)('rdrDateInput', className)
  }, /*#__PURE__*/_react.default.createElement("input", {
    readOnly: readOnly,
    disabled: disabled,
    value: state.value,
    placeholder: placeholder,
    "aria-label": ariaLabel,
    onKeyDown: onKeyDown,
    onChange: onChangeInternal,
    onBlur: onBlur,
    onFocus: onFocus
  }), state.invalid ? /*#__PURE__*/_react.default.createElement("span", {
    className: "rdrWarning"
  }, "\u26A0") : null);
});
function formatDate(value, dateDisplayFormat, dateOptions) {
  if (value && (0, _dateFns.isValid)(value)) {
    return (0, _dateFns.format)(value, dateDisplayFormat, dateOptions);
  }
  return '';
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfY2xhc3NuYW1lcyIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2RhdGVGbnMiLCJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsImUiLCJXZWFrTWFwIiwiciIsInQiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsImhhcyIsImdldCIsIm4iLCJfX3Byb3RvX18iLCJhIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ1IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaSIsInNldCIsIm9iaiIsIl9kZWZhdWx0IiwiZXhwb3J0cyIsIm1lbW8iLCJEYXRlSW5wdXQiLCJfcmVmIiwidmFsdWUiLCJwbGFjZWhvbGRlciIsImRpc2FibGVkIiwicmVhZE9ubHkiLCJkYXRlT3B0aW9ucyIsImRhdGVEaXNwbGF5Rm9ybWF0IiwiYXJpYUxhYmVsIiwiY2xhc3NOYW1lIiwib25Gb2N1cyIsIm9uQ2hhbmdlIiwic3RhdGUiLCJzZXRTdGF0ZSIsIlJlYWN0IiwidXNlU3RhdGUiLCJpbnZhbGlkIiwiY2hhbmdlZCIsImZvcm1hdERhdGUiLCJ1c2VFZmZlY3QiLCJzIiwidXBkYXRlIiwicGFyc2VkIiwicGFyc2UiLCJEYXRlIiwiaXNWYWxpZCIsIm9uQ2hhbmdlSW50ZXJuYWwiLCJldmVudCIsInRhcmdldCIsIm9uS2V5RG93biIsImtleSIsIm9uQmx1ciIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc25hbWVzIiwiZm9ybWF0Il0sInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvRGF0ZUlucHV0L2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7IEZvcm1hdE9wdGlvbnMsIFBhcnNlT3B0aW9ucywgZm9ybWF0LCBpc1ZhbGlkLCBwYXJzZSB9IGZyb20gJ2RhdGUtZm5zJztcbmltcG9ydCBSZWFjdCwge21lbW8sIENoYW5nZUV2ZW50LCBGb2N1c0V2ZW50LCBLZXlib2FyZEV2ZW50IH0gZnJvbSAncmVhY3QnO1xuXG50eXBlIERhdGVJbnB1dFByb3BzID0ge1xuICB2YWx1ZTogRGF0ZSxcbiAgcGxhY2Vob2xkZXI6IHN0cmluZyxcbiAgZGlzYWJsZWQ/OiBib29sZWFuLFxuICByZWFkT25seT86IGJvb2xlYW4sXG4gIGRhdGVPcHRpb25zPzogUGFyc2VPcHRpb25zLFxuICBkYXRlRGlzcGxheUZvcm1hdDogc3RyaW5nLFxuICBhcmlhTGFiZWw/OiBzdHJpbmcsXG4gIGNsYXNzTmFtZT86IHN0cmluZyxcbiAgb25Gb2N1czogKGV2ZW50OiBGb2N1c0V2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PiB2b2lkLFxuICBvbkNoYW5nZTogKGRhdGU6IERhdGUpID0+IHZvaWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW8oZnVuY3Rpb24gRGF0ZUlucHV0KHtcbiAgdmFsdWUsXG4gIHBsYWNlaG9sZGVyLFxuICBkaXNhYmxlZCxcbiAgcmVhZE9ubHksXG4gIGRhdGVPcHRpb25zLFxuICBkYXRlRGlzcGxheUZvcm1hdCxcbiAgYXJpYUxhYmVsLFxuICBjbGFzc05hbWUsXG4gIG9uRm9jdXMsXG4gIG9uQ2hhbmdlXG59OiBEYXRlSW5wdXRQcm9wcykge1xuXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gUmVhY3QudXNlU3RhdGUoe2ludmFsaWQ6IGZhbHNlLCBjaGFuZ2VkOiBmYWxzZSwgdmFsdWU6IGZvcm1hdERhdGUodmFsdWUsIGRhdGVEaXNwbGF5Rm9ybWF0LCBkYXRlT3B0aW9ucyBhcyBGb3JtYXRPcHRpb25zKX0pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0U3RhdGUocyA9PiAoey4uLnMsIHZhbHVlOiBmb3JtYXREYXRlKHZhbHVlLCBkYXRlRGlzcGxheUZvcm1hdCwgZGF0ZU9wdGlvbnMgYXMgRm9ybWF0T3B0aW9ucyl9KSk7XG4gIH0sIFt2YWx1ZSwgZGF0ZURpc3BsYXlGb3JtYXQsIGRhdGVPcHRpb25zXSk7XG5cbiAgY29uc3QgdXBkYXRlID0gKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCB7IGludmFsaWQsIGNoYW5nZWQgfSA9IHN0YXRlO1xuXG4gICAgaWYgKGludmFsaWQgfHwgIWNoYW5nZWQgfHwgIXZhbHVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG5cbiAgICBjb25zdCBwYXJzZWQgPSBwYXJzZSh2YWx1ZSwgZGF0ZURpc3BsYXlGb3JtYXQsIG5ldyBEYXRlKCksIGRhdGVPcHRpb25zKTtcblxuICAgIGlmIChpc1ZhbGlkKHBhcnNlZCkpIHtcbiAgICAgIHNldFN0YXRlKHsuLi5zdGF0ZSwgY2hhbmdlZDogZmFsc2V9KTtcbiAgICAgIG9uQ2hhbmdlPy4ocGFyc2VkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0U3RhdGUoey4uLnN0YXRlLCBpbnZhbGlkOiB0cnVlfSk7XG4gICAgfVxuXG4gIH1cblxuICBjb25zdCBvbkNoYW5nZUludGVybmFsID0gKGV2ZW50OiBDaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT4ge1xuICAgIHNldFN0YXRlKHt2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlLCBjaGFuZ2VkOiB0cnVlLCBpbnZhbGlkOiBmYWxzZX0pO1xuICB9XG5cbiAgY29uc3Qgb25LZXlEb3duID0gKGV2ZW50OiBLZXlib2FyZEV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PiB7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgdXBkYXRlKHN0YXRlLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvbkJsdXIgPSAoKSA9PiB7XG4gICAgdXBkYXRlKHN0YXRlLnZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPHNwYW4gY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdyZHJEYXRlSW5wdXQnLCBjbGFzc05hbWUpfT5cbiAgICAgIDxpbnB1dFxuICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgdmFsdWU9e3N0YXRlLnZhbHVlfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn1cbiAgICAgICAgICBhcmlhLWxhYmVsPXthcmlhTGFiZWx9XG4gICAgICAgICAgb25LZXlEb3duPXtvbktleURvd259XG4gICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlSW50ZXJuYWx9XG4gICAgICAgICAgb25CbHVyPXtvbkJsdXJ9XG4gICAgICAgICAgb25Gb2N1cz17b25Gb2N1c31cbiAgICAgICAgLz5cbiAgICAgICAge3N0YXRlLmludmFsaWQgPyA8c3BhbiBjbGFzc05hbWU9XCJyZHJXYXJuaW5nXCI+JiM5ODg4Ozwvc3Bhbj4gOiBudWxsfVxuICAgIDwvc3Bhbj5cbiAgKVxufSk7XG5cbmZ1bmN0aW9uIGZvcm1hdERhdGUodmFsdWU6IERhdGUsIGRhdGVEaXNwbGF5Rm9ybWF0OiBzdHJpbmcsIGRhdGVPcHRpb25zPzogRm9ybWF0T3B0aW9ucykge1xuICBpZiAodmFsdWUgJiYgaXNWYWxpZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZm9ybWF0KHZhbHVlLCBkYXRlRGlzcGxheUZvcm1hdCwgZGF0ZU9wdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuICcnO1xufSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsV0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsUUFBQSxHQUFBRCxPQUFBO0FBQ0EsSUFBQUUsTUFBQSxHQUFBQyx1QkFBQSxDQUFBSCxPQUFBO0FBQTJFLFNBQUFJLHlCQUFBQyxDQUFBLDZCQUFBQyxPQUFBLG1CQUFBQyxDQUFBLE9BQUFELE9BQUEsSUFBQUUsQ0FBQSxPQUFBRixPQUFBLFlBQUFGLHdCQUFBLFlBQUFBLENBQUFDLENBQUEsV0FBQUEsQ0FBQSxHQUFBRyxDQUFBLEdBQUFELENB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