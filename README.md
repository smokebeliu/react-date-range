A date library agnostic React component for choosing dates and date ranges. Uses [date-fns](http://date-fns.org/) for date operations.

# Notice ⚠️

This awesome project is a fork of the original [react-date-range](https://github.com/hypeserver/react-date-range) by hypeserver.

This fork aims at keeping this project alive!

Dependencies have been upgraded, class components updated to function components and the entire project has been rewritten in TypeScript. Some of the code has also been optimized further with newer React features.

### Why should you use `@pa/react-date-range`?

- Fully maintained as of 2024!
- Stateless date operations
- Highly configurable
- Multiple range selection
- Based on native js dates
- Drag n Drop selection
- Keyboard friendly
- Built-in TypeScript support


## Getting Started
### Installation

```
npm install @pa/react-date-range
```

or

```
yarn add @pa/react-date-range
```

then, styles and theme file must be imported:

```
import '@pa/react-date-range/dist/styles.css'; // main css file
import '@pa/react-date-range/dist/theme/default.css'; // theme css file
```

This plugin expects `react` and `date-fns` as peerDependencies, It means that you need to install them in your project folder.

```
npm install react date-fns
```

or

```
yarn add react date-fns
```

## Usage

You need to import skeleton and theme styles first.

```javascript
import '@pa/react-date-range/dist/styles.css'; // main style file
import '@pa/react-date-range/dist/theme/default.css'; // theme css file
```

### `DatePicker`
```javascript
import React from 'react';
import { Calendar } from '@pa/react-date-range';

function MyComponent() {

  const [date, setDate] = React.useState(new Date());

  return (
    // onChange returns native Date Object
    <Calendar date={date} onChange={date => setDate(date)}/>
  )
}

```

### `DateRangePicker / DateRange`
```javascript
import React from 'react';
import { DateRangePicker } from '@pa/react-date-range';

function MyComponent() {

  const [range, setRange] = React.useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection' // used as key for range returned from onChange
  });

  return (
    <DateRangePicker ranges={[range]} onChange={(range) => {
      // range returned from onChange will have the structure
      // {
      //   selection: {
      //    startDate: [native Date Object],
      //    endDate: [native Date Object],
      //   }
      // }

      setRange({
        startDate: range.startDate,
        endDate: range.endDate,
        key: Object.keys(range)[0]
      });
    }}/>
  );
}

```

### Options

| Property                                        | type      | Default Value      | Description                                                                                                                                                                                                                |
|-------------------------------------------------|-----------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| locale                                          | Object    | enUS from locale   | you can view full list from [here](https://github.com/hypeserver/react-date-range/tree/next/src/locale/index.js). Locales directly exported from [`date-fns/locales`](https://date-fns.org/docs/I18n#supported-languages). |
| className                                       | String    |                    | wrapper classname                                                                                                                                                                                                          |
| months                                          | Number    | 1                  | rendered month count                                                                                                                                                                                                       |
| showSelectionPreview                            | Boolean   | true               | show preview on focused/hovered dates                                                                                                                                                                                      |
| showMonthAndYearPickers                         | Boolean   | true               | show select tags for month and year on calendar top, if false it will just display the month and year                                                                                                                      |
| rangeColors                                     | String[]  |                    | defines color for selection preview.                                                                                                                                                                                       |
| shownDate                                       | Date      |                    | initial focus date                                                                                                                                                                                                         |
| minDate                                         | Date      |                    | defines minimum date. Disabled earlier dates                                                                                                                                                                               |
| maxDate                                         | Date      |                    | defines maximum date. Disabled later dates                                                                                                                                                                                 |
| direction                                       | String    | 'vertical'         | direction of calendar months. can be `vertical` or `horizontal`                                                                                                                                                            |
| disabledDates                                   | Date[]    | []                 | dates that are disabled                                                                                                                                                                                                    |
| disabledDay                                     | Func      |                    | predicate function that disable day fn(date: Date)                                                                                                                                                                         |
| scroll                                          | Object    | { enabled: false } | infinite scroll behaviour configuration. Check out [Infinite Scroll](#infinite-scrolled-mode) section                                                                                                                      |
| showMonthArrow                                  | Boolean   | true               | show/hide month arrow button                                                                                                                                                                                               |
| navigatorRenderer                               | Func      |                    | renderer for focused date navigation area. fn(currentFocusedDate: Date, changeShownDate: func, props: object)                                                                                                              |
| ranges                                          | *Object[] | []                 | Defines ranges. array of range object                                                                                                                                                                                      |
| moveRangeOnFirstSelection(DateRange)            | Boolean   | false              | move range on startDate selection. Otherwise endDate will replace with startDate unless `retainEndDateOnFirstSelection` is set to true.                                                                                    |
| retainEndDateOnFirstSelection(DateRange)        | Boolean   | false              | Retain end date when the start date is changed, unless start date is later than end date. Ignored if `moveRangeOnFirstSelection` is set to true.                                                                           |
| onChange(Calendar)                              | Func      |                    | callback function for date changes. fn(date: Date)                                                                                                                                                                         |
| onChange(DateRange)                             | Func      |                    | callback function for range changes. fn(changes). changes contains changed ranges with new `startDate`/`endDate` properties.                                                                                               |
| color(Calendar)                                 | String    | `#3d91ff`          | defines color for selected date in Calendar                                                                                                                                                                                |
| date(Calendar)                                  | Date      |                    | date value for Calendar                                                                                                                                                                                                    |
| showDateDisplay(DateRange)                      | Boolean   | true               | show/hide selection display row. Uses `dateDisplayFormat` for formatter                                                                                                                                                    |
| onShownDateChange(DateRange,Calendar)           | Function  |                    | Callback function that is called when the shown date changes                                                                                                                                                               |
| initialFocusedRange(DateRange)                  | Object    |                    | Initial value for focused range. See `focusedRange` for usage.                                                                                                                                                             |
| focusedRange(DateRange)                         | Object    |                    | It defines which range and step are focused. Common initial value is `[0, 0]`; first value is index of ranges, second one is which step on date range(startDate or endDate).                                               |
| onRangeFocusChange(DateRange)                   | Object    |                    | Callback function for focus changes                                                                                                                                                                                        |
| preview(DateRange)                              | Object    |                    | displays a preview range and overwrite DateRange's default preview. Expected shape: `{ startDate: Date, endDate: Date, color: String }`                                                                                    |
| showPreview(DateRange)                          | bool      | true               | visibility of preview                                                                                                                                                                                                      |
| editableDateInputs(Calendar)                    | bool      | false              | whether dates can be edited in the Calendar's input fields                                                                                                                                                                 |
| dragSelectionEnabled(Calendar)                  | bool      | true               | whether dates can be selected via drag n drop                                                                                                                                                                              |
| calendarFocus(Calendar)                         | String    | 'forwards'         | Whether calendar focus month should be forward-driven or backwards-driven. can be 'forwards' or 'backwards'                                                                                                                |
| preventSnapRefocus(Calendar)                    | bool      | false              | prevents unneceessary refocus of shown range on selection                                                                                                                                                                  |
| onPreviewChange(DateRange)                      | Object    |                    | Callback function for preview changes                                                                                                                                                                                      |
| dateDisplayFormat                               | String    | `MMM d, yyyy`      | selected range preview formatter. Check out [date-fns's format option](https://date-fns.org/docs/format)                                                                                                                   |
| dayDisplayFormat                                | String    | `d`                | selected range preview formatter. Check out [date-fns's format option](https://date-fns.org/docs/format)                                                                                                                   |
| weekdayDisplayFormat                            | String    | `E`                | selected range preview formatter. Check out [date-fns's format option](https://date-fns.org/docs/format)                                                                                                                   |
| monthDisplayFormat                              | String    | `MMM yyyy`         | selected range preview formatter. Check out [date-fns's format option](https://date-fns.org/docs/format)                                                                                                                   |
| weekStartsOn                                    | Number    |                    | Whether the week start day that comes from the locale will be overriden. Default value comes from your locale, if no local is specified, note that default locale is enUS                                                  |
| startDatePlaceholder                            | String    | `Early`            | Start Date Placeholder                                                                                                                                                                                                     |
| endDatePlaceholder                              | String    | `Continuous`       | End Date Placeholder                                                                                                                                                                                                       |
| fixedHeight                                     | Boolean   | false              | Since some months require less than 6 lines to show, by setting this prop, you can force 6 lines for all months.                                                                                                           |
| renderStaticRangeLabel(`DefinedRange`)          | Function  |                    | Callback function to be triggered for the static range configurations that have `hasCustomRendering: true` on them. Instead of rendering `staticRange.label`, return value of this callback will be rendered.              |
| staticRanges(`DefinedRange`, `DateRangePicker`) | Array     |                    | -                                                                                                                                                                                                                          |
| inputRanges(`DefinedRange`, `DateRangePicker`)  | Array     |                    | -                                                                                                                                                                                                                          |
| ariaLabels                                      | Object    | {}                 | inserts aria-label to inner elements                                                                                                                                                                                       |
| dayContentRenderer                              | Function  | null               | Function to customize the rendering of Calendar Day. given a date is supposed to return what to render.                                                                                                                    |
| preventScrollToFocusedMonth                     | Boolean   | false              | When two or more months are open, prevent the shift of the focused month to the left.                                                                                                                                      |
| focusNextRangeOnDefinedRangeClick               | Boolean   | false              | When a defined range is clicked, the next range will be focused                                                                                                                                                            |

#### Type DateRange:
 ```ts
type DateRange = {
  startDate: Date,
  endDate: Date,
  color?: string,
  key?: string,
  autoFocus?: boolean,
  disabled?: boolean,
  showDateDisplay?: boolean,
  label?: string
}
```

#### Type AriaLabelsType:
 ```ts
type AriaLabelsType = {
  dateInput?: {
    startDate?: string,
    endDate?: string
  },
  monthPicker?: string,
  yearPicker?: string,
  prevButton?: string,
  nextButton?: string
}
```
#### Infinite Scrolled Mode

To enable infinite scroll set `scroll={{enabled: true}}` basically. Infinite scroll feature is affected by `direction`(rendering direction for months) and `months`(for rendered months count) props directly.
If you prefer, you can overwrite calendar sizes with `calendarWidth`/`calendarHeight` or each month's height/width with `monthWidth`/`monthHeight`/`longMonthHeight` at `scroll` prop.

```ts
type Scroll = {
  enabled?: boolean,
  monthHeight?: number,
  longMonthHeight?: number,
  monthWidth?: number,
  calendarWidth?: number,
  calendarHeight?: number
}
```


### Release workflow
- Merge everything that needs to be in the release to master
- Open a new release PR than:
  - bumps version to appropriate one <new_version>
  - Update CHANGELOG.md
- Make sure the demo and important features are working as expected
- After merging, tag the master commit with `release/<new_version>` and let Github Action handle publishing
- = Profit 🙈

### TODOs

- Make mobile friendly (integrate tap and swipe actions)
- Add tests
- Improve documentation
