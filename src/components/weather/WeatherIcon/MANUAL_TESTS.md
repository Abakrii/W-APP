# WeatherIcon Manual Tests

## Visual Tests

- [ ] Icons display at correct sizes: small (40px), medium (80px), large (120px)
- [ ] Loading spinner appears in blue (#2388C7) while image loads
- [ ] Error fallback shows cloud emoji (🌤️) on gray background (#F8F8F8)
- [ ] Weather description appears below icon when showDescription=true
- [ ] Description text is gray (#666666) and centered
- [ ] Icons have slight border radius (8px)
- [ ] Images properly resize with contain mode

## Loading States Tests

- [ ] Loading spinner appears immediately when component mounts
- [ ] Spinner disappears when image loads successfully
- [ ] Error fallback appears when image fails to load
- [ ] Component handles slow network connections gracefully
- [ ] No flash of content when switching between states

## Content Tests

- [ ] All OpenWeatherMap icon codes display correctly (01d, 02n, etc.)
- [ ] Weather descriptions display properly below icons
- [ ] Long descriptions wrap correctly and remain readable
- [ ] Fallback emoji displays when icons fail to load
- [ ] Accessibility labels match weather descriptions

## Integration Tests

- [ ] Works correctly in CurrentWeatherScreen with large icons
- [ ] Works correctly in ForecastScreen with medium icons
- [ ] Works correctly in HourlyForecast with small icons
- [ ] Properly integrates with OpenWeatherMap API data
- [ ] Handles network errors gracefully without crashing
- [ ] Performance remains good with multiple icons on screen

## Network Tests

- [ ] Icons load quickly on good network connections
- [ ] Loading states are clear on slow connections
- [ ] Error states provide useful fallback on network failures
- [ ] Component recovers when network connection improves

## Accessibility Tests

- [ ] Images have proper accessibility labels
- [ ] Loading states are announced to screen readers
- [ ] Error states provide meaningful feedback
- [ ] Sufficient color contrast in all states
