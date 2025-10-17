# ErrorMessage Manual Tests

## Visual Tests

- [ ] Error message appears in red color (#FF3B30)
- [ ] Message is centered on screen with proper padding
- [ ] Retry button appears only when `onRetry` callback is provided
- [ ] Retry button has blue background (#007AFF) with white text
- [ ] Retry button has proper corner radius (8px) and padding
- [ ] Custom retry button text is displayed when provided

## Interaction Tests

- [ ] Tapping retry button triggers `onRetry` callback
- [ ] Component doesn't crash when `onRetry` is not provided
- [ ] Retry button has proper touch feedback

## Content Tests

- [ ] Long error messages wrap correctly and remain readable
- [ ] Empty error messages don't break the layout
- [ ] Custom retry button text replaces default "Try Again"

## Integration Tests

- [ ] Works correctly in network error scenarios
- [ ] Works correctly in data loading error scenarios
- [ ] Works correctly when embedded in other screens
