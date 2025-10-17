# CityDetailScreen Manual Tests

## Navigation Tests

- [ ] Screen loads correctly with city parameter
- [ ] Navigation works from CitiesScreen and HistoricalDataScreen
- [ ] Back navigation returns to previous screen

## Data Display Tests

- [ ] Current weather data displays correctly (temperature, description, etc.)
- [ ] Historical weather data displays with "Historical Data" badge
- [ ] Weather icon matches the current condition
- [ ] All weather details are displayed in the table
- [ ] Temperature is shown in Celsius
- [ ] Last updated timestamp displays correctly

## Loading States Tests

- [ ] Loading indicator shows when fetching current weather
- [ ] No loading shows when historical data is provided
- [ ] Loading text is appropriate for the context

## Error Handling Tests

- [ ] Error message shows when API fails
- [ ] Retry button reloads weather data
- [ ] Refresh option shows for current data errors (not historical)
- [ ] No crashes when network is unavailable

## Historical Data Tests

- [ ] Historical badge appears for historical data
- [ ] Historical timestamp displays correctly
- [ ] No refresh option for historical data errors
- [ ] Historical data doesn't trigger API calls

## UI/UX Tests

- [ ] City name displays prominently at top
- [ ] Weather icon and temperature are properly aligned
- [ ] Weather details card has proper styling
- [ ] Section dividers create clear visual separation
- [ ] Text colors and sizes follow design system
- [ ] Scroll view works smoothly

## Integration Tests

- [ ] Works with actual weather API
- [ ] Integrates with storage service for caching
- [ ] Handles both metric and imperial units correctly
- [ ] Works with different screen sizes
- [ ] Performance is good with large weather data sets

## Accessibility Tests

- [ ] Screen readers can navigate all content
- [ ] Weather icons have proper accessibility labels
- [ ] Sufficient color contrast for all text
- [ ] Touch targets are appropriately sized
