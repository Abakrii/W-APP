# LoadingSpinner Manual Tests

## Visual Tests

- [ ] Spinner appears in blue color (#007AFF)
- [ ] Container centers content both vertically and horizontally
- [ ] Large spinner is visibly larger than small spinner
- [ ] Message appears below spinner with proper margin (12px)
- [ ] Message text is gray (#666) and centered
- [ ] Custom loading messages are displayed correctly

## Size Tests

- [ ] Large spinner is appropriate for full-screen loading
- [ ] Small spinner is appropriate for inline/in-context loading
- [ ] Default size is large when not specified

## Content Tests

- [ ] Long loading messages wrap correctly and remain readable
- [ ] Empty messages don't break the layout
- [ ] Default message "Loading..." is shown when no message provided

## Integration Tests

- [ ] Works correctly during API calls for weather data
- [ ] Works correctly during city search operations
- [ ] Works correctly when embedded in various screens
- [ ] Properly centers in both full-screen and container contexts

## Performance Tests

- [ ] Spinner animates smoothly without jank
- [ ] Component doesn't cause unnecessary re-renders
- [ ] Memory usage remains stable during prolonged loading states
