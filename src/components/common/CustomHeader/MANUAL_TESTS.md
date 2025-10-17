# CustomHeader Manual Tests

Since automated rendering tests have compatibility issues, please manually verify:

## Visual Tests

- [ ] Header appears blue (#2388C7) with white text
- [ ] Title is displayed correctly with large font (34px, bold)
- [ ] Back button appears only when `showBackButton={true}`
- [ ] Back button is positioned correctly (top: 50, left: 16)
- [ ] Title container adjusts spacing when back button is visible

## Interaction Tests

- [ ] Tapping back button triggers `onBackPress` callback
- [ ] Back button has proper hit slop for easy tapping
- [ ] Component doesn't crash when `onBackPress` is not provided

## Accessibility Tests

- [ ] Text is readable and has sufficient contrast
- [ ] Back button is tappable and has visual feedback
