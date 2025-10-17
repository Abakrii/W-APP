# WeatherDetailRow Manual Tests

## Visual Tests

- [ ] Label appears in black (#000000) with semibold weight (600)
- [ ] Value appears in gray (#666666) with regular weight (400)
- [ ] Both label and value use 16px font size
- [ ] Label is left-aligned, value is right-aligned
- [ ] Container has light gray border (#E5E5E5) at bottom
- [ ] Proper vertical padding (16px) between rows
- [ ] Flex layout ensures equal space distribution

## Content Tests

- [ ] Long labels wrap to multiple lines if needed
- [ ] Long values wrap to multiple lines if needed
- [ ] Special characters (°, %, km/h, etc.) display correctly
- [ ] Temperature values with negative signs display properly
- [ ] Percentage values format correctly
- [ ] Wind speed with direction arrows displays properly

## Interaction Tests

- [ ] Rows stack correctly in vertical lists
- [ ] Borders create proper separation between rows
- [ ] Layout remains consistent across different screen sizes
- [ ] Text remains readable when system font size changes

## Integration Tests

- [ ] Works correctly in WeatherDetailsScreen with current weather data
- [ ] Works correctly in ForecastScreen with forecast data
- [ ] Works correctly in AdvancedMetricsScreen with detailed data
- [ ] Properly handles both metric and imperial units
- [ ] Integrates with weather data fetching and formatting

## Accessibility Tests

- [ ] Sufficient color contrast for both label and value text
- [ ] Proper text sizing for readability
- [ ] Logical reading order (label then value)
- [ ] Works with screen readers and voiceover
