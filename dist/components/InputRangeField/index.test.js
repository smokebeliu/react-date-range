"use strict";

var _react = _interopRequireDefault(require("react"));
var _enzyme = require("enzyme");
var _InputRangeField = _interopRequireDefault(require("../InputRangeField"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const styles = {
  inputRange: 'range',
  inputRangeInput: 'input',
  inputRangeLabel: 'label'
};
const toChangeEvent = value => ({
  target: {
    value
  }
});
describe('InputRangeField tests', () => {
  test('Should parse input value to number', () => {
    const onChange = jest.fn();
    const wrapper = (0, _enzyme.mount)( /*#__PURE__*/_react.default.createElement(_InputRangeField.default, {
      label: "Input label",
      styles: styles,
      onChange: onChange,
      onFocus: jest.fn(),
      onBlur: jest.fn()
    }));
    wrapper.find('input').simulate('change', toChangeEvent('3'));
    expect(onChange).lastCalledWith(3);
    wrapper.find('input').simulate('change', toChangeEvent(12));
    expect(onChange).lastCalledWith(12);
    wrapper.find('input').simulate('change', toChangeEvent(''));
    expect(onChange).lastCalledWith(0);
    wrapper.find('input').simulate('change', toChangeEvent('invalid number'));
    expect(onChange).lastCalledWith(0);
    wrapper.find('input').simulate('change', toChangeEvent(-12));
    expect(onChange).lastCalledWith(0);
    wrapper.find('input').simulate('change', toChangeEvent(99999999));
    expect(onChange).lastCalledWith(99999);
    expect(onChange).toHaveBeenCalledTimes(6);
    expect(wrapper).toMatchSnapshot();
  });
  test('Should rerender when props change', () => {
    const wrapper = (0, _enzyme.mount)( /*#__PURE__*/_react.default.createElement(_InputRangeField.default, {
      value: 12,
      placeholder: "Placeholder",
      label: "Input label",
      styles: styles,
      onChange: jest.fn(),
      onFocus: jest.fn(),
      onBlur: jest.fn()
    }));
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('value')).toEqual(12);
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('placeholder')).toEqual('Placeholder');
    expect(wrapper.find(`.${styles.inputRangeLabel}`).text()).toEqual('Input label');
    wrapper.setProps({
      value: '32'
    });
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('value')).toEqual('32');
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('placeholder')).toEqual('Placeholder');
    expect(wrapper.find(`.${styles.inputRangeLabel}`).text()).toEqual('Input label');
    wrapper.setProps({
      placeholder: '-'
    });
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('value')).toEqual('32');
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('placeholder')).toEqual('-');
    expect(wrapper.find(`.${styles.inputRangeLabel}`).text()).toEqual('Input label');
    wrapper.setProps({
      label: 'Label'
    });
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('value')).toEqual('32');
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('placeholder')).toEqual('-');
    expect(wrapper.find(`.${styles.inputRangeLabel}`).text()).toEqual('Label');
  });
  test('Should render the label as a Component', () => {
    const Label = () => /*#__PURE__*/_react.default.createElement("span", {
      className: "input-range-field-label"
    }, "Input label");
    const wrapper = (0, _enzyme.mount)( /*#__PURE__*/_react.default.createElement(_InputRangeField.default, {
      value: 12,
      placeholder: "Placeholder",
      label: /*#__PURE__*/_react.default.createElement(Label, null),
      styles: styles,
      onChange: jest.fn(),
      onFocus: jest.fn(),
      onBlur: jest.fn()
    }));
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('value')).toEqual(12);
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('placeholder')).toEqual('Placeholder');
    expect(wrapper.find(`.${styles.inputRangeLabel}`).text()).toEqual('Input label');
    expect(wrapper.find(`.${styles.inputRangeLabel}`).text()).toEqual('Input label');
    expect(wrapper.find(`.input-range-field-label`).text()).toEqual('Input label');
    wrapper.setProps({
      value: '32'
    });
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('value')).toEqual('32');
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('placeholder')).toEqual('Placeholder');
    expect(wrapper.find(`.${styles.inputRangeLabel}`).text()).toEqual('Input label');
    wrapper.setProps({
      placeholder: '-'
    });
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('value')).toEqual('32');
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('placeholder')).toEqual('-');
    expect(wrapper.find(`.${styles.inputRangeLabel}`).text()).toEqual('Input label');
    wrapper.setProps({
      label: 'Label'
    });
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('value')).toEqual('32');
    expect(wrapper.find(`.${styles.inputRangeInput}`).prop('placeholder')).toEqual('-');
    expect(wrapper.find(`.${styles.inputRangeLabel}`).text()).toEqual('Label');
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9lbnp5bWUiLCJfSW5wdXRSYW5nZUZpZWxkIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJzdHlsZXMiLCJpbnB1dFJhbmdlIiwiaW5wdXRSYW5nZUlucHV0IiwiaW5wdXRSYW5nZUxhYmVsIiwidG9DaGFuZ2VFdmVudCIsInZhbHVlIiwidGFyZ2V0IiwiZGVzY3JpYmUiLCJ0ZXN0Iiwib25DaGFuZ2UiLCJqZXN0IiwiZm4iLCJ3cmFwcGVyIiwibW91bnQiLCJjcmVhdGVFbGVtZW50IiwibGFiZWwiLCJvbkZvY3VzIiwib25CbHVyIiwiZmluZCIsInNpbXVsYXRlIiwiZXhwZWN0IiwibGFzdENhbGxlZFdpdGgiLCJ0b0hhdmVCZWVuQ2FsbGVkVGltZXMiLCJ0b01hdGNoU25hcHNob3QiLCJwbGFjZWhvbGRlciIsInByb3AiLCJ0b0VxdWFsIiwidGV4dCIsInNldFByb3BzIiwiTGFiZWwiLCJjbGFzc05hbWUiXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9JbnB1dFJhbmdlRmllbGQvaW5kZXgudGVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbW91bnQgfSBmcm9tICdlbnp5bWUnO1xuXG5pbXBvcnQgSW5wdXRSYW5nZUZpZWxkIGZyb20gJy4uL0lucHV0UmFuZ2VGaWVsZCc7XG5cbmNvbnN0IHN0eWxlcyA9IHtcbiAgaW5wdXRSYW5nZTogJ3JhbmdlJyxcbiAgaW5wdXRSYW5nZUlucHV0OiAnaW5wdXQnLFxuICBpbnB1dFJhbmdlTGFiZWw6ICdsYWJlbCcsXG59O1xuY29uc3QgdG9DaGFuZ2VFdmVudCA9ICh2YWx1ZSkgPT4gKHsgdGFyZ2V0OiB7IHZhbHVlIH0gfSk7XG5cbmRlc2NyaWJlKCdJbnB1dFJhbmdlRmllbGQgdGVzdHMnLCAoKSA9PiB7XG4gIHRlc3QoJ1Nob3VsZCBwYXJzZSBpbnB1dCB2YWx1ZSB0byBudW1iZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgb25DaGFuZ2UgPSBqZXN0LmZuKCk7XG4gICAgY29uc3Qgd3JhcHBlciA9IG1vdW50KFxuICAgICAgPElucHV0UmFuZ2VGaWVsZFxuICAgICAgICBsYWJlbD1cIklucHV0IGxhYmVsXCJcbiAgICAgICAgc3R5bGVzPXtzdHlsZXN9XG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgb25Gb2N1cz17amVzdC5mbigpfVxuICAgICAgICBvbkJsdXI9e2plc3QuZm4oKX1cbiAgICAgIC8+XG4gICAgKTtcblxuICAgIHdyYXBwZXIuZmluZCgnaW5wdXQnKS5zaW11bGF0ZSgnY2hhbmdlJywgdG9DaGFuZ2VFdmVudCgnMycpKTtcbiAgICBleHBlY3Qob25DaGFuZ2UpLmxhc3RDYWxsZWRXaXRoKDMpO1xuICAgIHdyYXBwZXIuZmluZCgnaW5wdXQnKS5zaW11bGF0ZSgnY2hhbmdlJywgdG9DaGFuZ2VFdmVudCgxMikpO1xuICAgIGV4cGVjdChvbkNoYW5nZSkubGFzdENhbGxlZFdpdGgoMTIpO1xuICAgIHdyYXBwZXIuZmluZCgnaW5wdXQnKS5zaW11bGF0ZSgnY2hhbmdlJywgdG9DaGFuZ2VFdmVudCgnJykpO1xuICAgIGV4cGVjdChvbkNoYW5nZSkubGFzdENhbGxlZFdpdGgoMCk7XG4gICAgd3JhcHBlci5maW5kKCdpbnB1dCcpLnNpbXVsYXRlKCdjaGFuZ2UnLCB0b0NoYW5nZUV2ZW50KCdpbnZhbGlkIG51bWJlcicpKTtcbiAgICBleHBlY3Qob25DaGFuZ2UpLmxhc3RDYWxsZWRXaXRoKDApO1xuICAgIHdyYXBwZXIuZmluZCgnaW5wdXQnKS5zaW11bGF0ZSgnY2hhbmdlJywgdG9DaGFuZ2VFdmVudCgtMTIpKTtcbiAgICBleHBlY3Qob25DaGFuZ2UpLmxhc3RDYWxsZWRXaXRoKDApO1xuICAgIHdyYXBwZXIuZmluZCgnaW5wdXQnKS5zaW11bGF0ZSgnY2hhbmdlJywgdG9DaGFuZ2VFdmVudCg5OTk5OTk5OSkpO1xuICAgIGV4cGVjdChvbkNoYW5nZSkubGFzdENhbGxlZFdpdGgoOTk5OTkpO1xuXG4gICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoNik7XG4gICAgZXhwZWN0KHdyYXBwZXIpLnRvTWF0Y2hTbmFwc2hvdCgpO1xuICB9KTtcblxuICB0ZXN0KCdTaG91bGQgcmVyZW5kZXIgd2hlbiBwcm9wcyBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgY29uc3Qgd3JhcHBlciA9IG1vdW50KFxuICAgICAgPElucHV0UmFuZ2VGaWVsZFxuICAgICAgICB2YWx1ZT17MTJ9XG4gICAgICAgIHBsYWNlaG9sZGVyPVwiUGxhY2Vob2xkZXJcIlxuICAgICAgICBsYWJlbD1cIklucHV0IGxhYmVsXCJcbiAgICAgICAgc3R5bGVzPXtzdHlsZXN9XG4gICAgICAgIG9uQ2hhbmdlPXtqZXN0LmZuKCl9XG4gICAgICAgIG9uRm9jdXM9e2plc3QuZm4oKX1cbiAgICAgICAgb25CbHVyPXtqZXN0LmZuKCl9XG4gICAgICAvPlxuICAgICk7XG5cbiAgICBleHBlY3Qod3JhcHBlci5maW5kKGAuJHtzdHlsZXMuaW5wdXRSYW5nZUlucHV0fWApLnByb3AoJ3ZhbHVlJykpLnRvRXF1YWwoMTIpO1xuICAgIGV4cGVjdCh3cmFwcGVyLmZpbmQoYC4ke3N0eWxlcy5pbnB1dFJhbmdlSW5wdXR9YCkucHJvcCgncGxhY2Vob2xkZXInKSkudG9FcXVhbCgnUGxhY2Vob2xkZXInKTtcbiAgICBleHBlY3Qod3JhcHBlci5maW5kKGAuJHtzdHlsZXMuaW5wdXRSYW5nZUxhYmVsfWApLnRleHQoKSkudG9FcXVhbCgnSW5wdXQgbGFiZWwnKTtcblxuICAgIHdyYXBwZXIuc2V0UHJvcHMoeyB2YWx1ZTogJzMyJyB9KTtcbiAgICBleHBlY3Qod3JhcHBlci5maW5kKGAuJHtzdHlsZXMuaW5wdXRSYW5nZUlucHV0fWApLnByb3AoJ3ZhbHVlJykpLnRvRXF1YWwoJzMyJyk7XG4gICAgZXhwZWN0KHdyYXBwZXIuZmluZChgLiR7c3R5bGVzLmlucHV0UmFuZ2VJbnB1dH1gKS5wcm9wKCdwbGFjZWhvbGRlcicpKS50b0VxdWFsKCdQbGFjZWhvbGRlcicpO1xuICAgIGV4cGVjdCh3cmFwcGVyLmZpbmQoYC4ke3N0eWxlcy5pbnB1dFJhbmdlTGFiZWx9YCkudGV4dCgpKS50b0VxdWFsKCdJbnB1dCBsYWJlbCcpO1xuXG4gICAgd3JhcHBlci5zZXRQcm9wcyh7IHBsYWNlaG9sZGVyOiAnLScgfSk7XG4gICAgZXhwZWN0KHdyYXBwZXIuZmluZChgLiR7c3R5bGVzLmlucHV0UmFuZ2VJbnB1dH1gKS5wcm9wKCd2YWx1ZScpKS50b0VxdWFsKCczMicpO1xuICAgIGV4cGVjdCh3cmFwcGVyLmZpbmQoYC4ke3N0eWxlcy5pbnB1dFJhbmdlSW5wdXR9YCkucHJvcCgncGxhY2Vob2xkZXInKSkudG9FcXVhbCgnLScpO1xuICAgIGV4cGVjdCh3cmFwcGVyLmZpbmQoYC4ke3N0eWxlcy5pbnB1dFJhbmdlTGFiZWx9YCkudGV4dCgpKS50b0VxdWFsKCdJbnB1dCBsYWJlbCcpO1xuXG4gICAgd3JhcHBlci5zZXRQcm9wcyh7IGxhYmVsOiAnTGFiZWwnIH0pO1xuICAgIGV4cGVjdCh3cmFwcGVyLmZpbmQoYC4ke3N0eWxlcy5pbnB1dFJhbmdlSW5wdXR9YCkucHJvcCgndmFsdWUnKSkudG9FcXVhbCgnMzInKTtcbiAgICBleHBlY3Qod3JhcHBlci5maW5kKGAuJHtzdHlsZXMuaW5wdXRSYW5nZUlucHV0fWApLnByb3AoJ3BsYWNlaG9sZGVyJykpLnRvRXF1YWwoJy0nKTtcbiAgICBleHBlY3Qod3JhcHBlci5maW5kKGAuJHtzdHlsZXMuaW5wdXRSYW5nZUxhYmVsfWApLnRleHQoKSkudG9FcXVhbCgnTGFiZWwnKTtcbiAgfSk7XG5cbiAgdGVzdCgnU2hvdWxkIHJlbmRlciB0aGUgbGFiZWwgYXMgYSBDb21wb25lbnQnLCAoKSA9PiB7XG4gICAgY29uc3QgTGFiZWwgPSAoKSA9PiA8c3BhbiBjbGFzc05hbWU9XCJpbnB1dC1yYW5nZS1maWVsZC1sYWJlbFwiPklucHV0IGxhYmVsPC9zcGFuPjtcbiAgICBjb25zdCB3cmFwcGVyID0gbW91bnQoXG4gICAgICA8SW5wdXRSYW5nZUZpZWxkXG4gICAgICAgIHZhbHVlPXsxMn1cbiAgICAgICAgcGxhY2Vob2xkZXI9XCJQbGFjZWhvbGRlclwiXG4gICAgICAgIGxhYmVsPXs8TGFiZWwgLz59XG4gICAgICAgIHN0eWxlcz17c3R5bGVzfVxuICAgICAgICBvbkNoYW5nZT17amVzdC5mbigpfVxuICAgICAgICBvbkZvY3VzPXtqZXN0LmZuKCl9XG4gICAgICAgIG9uQmx1cj17amVzdC5mbigpfVxuICAgICAgLz5cbiAgICApO1xuXG4gICAgZXhwZWN0KHdyYXBwZXIuZmluZChgLiR7c3R5bGVzLmlucHV0UmFuZ2VJbnB1dH1gKS5wcm9wKCd2YWx1ZScpKS50b0VxdWFsKDEyKTtcbiAgICBleHBlY3Qod3JhcHBlci5maW5kKGAuJHtzdHlsZXMuaW5wdXRSYW5nZUlucHV0fWApLnByb3AoJ3BsYWNlaG9sZGVyJykpLnRvRXF1YWwoJ1BsYWNlaG9sZGVyJyk7XG4gICAgZXhwZWN0KHdyYXBwZXIuZmluZChgLiR7c3R5bGVzLmlucHV0UmFuZ2VMYWJlbH1gKS50ZXh0KCkpLnRvRXF1YWwoJ0lucHV0IGxhYmVsJyk7XG4gICAgZXhwZWN0KHdyYXBwZXIuZmluZChgLiR7c3R5bGVzLmlucHV0UmFuZ2VMYWJlbH1gKS50ZXh0KCkpLnRvRXF1YWwoJ0lucHV0IGxhYmVsJyk7XG4gICAgZXhwZWN0KHdyYXBwZXIuZmluZChgLmlucHV0LXJhbmdlLWZpZWxkLWxhYmVsYCkudGV4dCgpKS50b0VxdWFsKCdJbnB1dCBsYWJlbCcpO1xuXG4gICAgd3JhcHBlci5zZXRQcm9wcyh7IHZhbHVlOiAnMzInIH0pO1xuICAgIGV4cGVjdCh3cmFwcGVyLmZpbmQoYC4ke3N0eWxlcy5pbnB1dFJhbmdlSW5wdXR9YCkucHJvcCgndmFsdWUnKSkudG9FcXVhbCgnMzInKTtcbiAgICBleHBlY3Qod3JhcHBlci5maW5kKGAuJHtzdHlsZXMuaW5wdXRSYW5nZUlucHV0fWApLnByb3AoJ3BsYWNlaG9sZGVyJykpLnRvRXF1YWwoJ1BsYWNlaG9sZGVyJyk7XG4gICAgZXhwZWN0KHdyYXBwZXIuZmluZChgLiR7c3R5bGVzLmlucHV0UmFuZ2VMYWJlbH1gKS50ZXh0KCkpLnRvRXF1YWwoJ0lucHV0IGxhYmVsJyk7XG5cbiAgICB3cmFwcGVyLnNldFByb3BzKHsgcGxhY2Vob2xkZXI6ICctJyB9KTtcbiAgICBleHBlY3Qod3JhcHBlci5maW5kKGAuJHtzdHlsZXMuaW5wdXRSYW5nZUlucHV0fWApLnByb3AoJ3ZhbHVlJykpLnRvRXF1YWwoJzMyJyk7XG4gICAgZXhwZWN0KHdyYXBwZXIuZmluZChgLiR7c3R5bGVzLmlucHV0UmFuZ2VJbnB1dH1gKS5wcm9wKCdwbGFjZWhvbGRlcicpKS50b0VxdWFsKCctJyk7XG4gICAgZXhwZWN0KHdyYXBwZXIuZmluZChgLiR7c3R5bGVzLmlucHV0UmFuZ2VMYWJlbH1gKS50ZXh0KCkpLnRvRXF1YWwoJ0lucHV0IGxhYmVsJyk7XG5cbiAgICB3cmFwcGVyLnNldFByb3BzKHsgbGFiZWw6ICdMYWJlbCcgfSk7XG4gICAgZXhwZWN0KHdyYXBwZXIuZmluZChgLiR7c3R5bGVzLmlucHV0UmFuZ2VJbnB1dH1gKS5wcm9wKCd2YWx1ZScpKS50b0VxdWFsKCczMicpO1xuICAgIGV4cGVjdCh3cmFwcGVyLmZpbmQoYC4ke3N0eWxlcy5pbnB1dFJhbmdlSW5wdXR9YCkucHJvcCgncGxhY2Vob2xkZXInKSkudG9FcXVhbCgnLScpO1xuICAgIGV4cGVjdCh3cmFwcGVyLmZpbmQoYC4ke3N0eWxlcy5pbnB1dFJhbmdlTGFiZWx9YCkudGV4dCgpKS50b0VxdWFsKCdMYWJlbCcpO1xuICB9KTtcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUFBLE1BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLE9BQUEsR0FBQUQsT0FBQTtBQUVBLElBQUFFLGdCQUFBLEdBQUFILHNCQUFBLENBQUFDLE9BQUE7QUFB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