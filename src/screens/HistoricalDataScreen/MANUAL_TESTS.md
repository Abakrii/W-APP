# HistoricalDataScreen Manual Tests

## Navigation Tests

- [ ] Screen loads correctly with city parameter from route
- [ ] Navigation works from CitiesScreen history buttons
- [ ] Back navigation returns to CitiesScreen

## Data Loading Tests

- [ ] Loading spinner shows while fetching historical data
- [ ] Historical data list displays when data is available
- [ ] Empty state message shows when no historical data exists
- [ ] Error message shows with retry option on failure

## List Display Tests

- [ ] Historical entries display with formatted dates
- [ ] Weather descriptions and temperatures show correctly
- [ ] "View Details" buttons appear for each entry
- [ ] List scrolls smoothly with multiple entries
- [ ] Entries are separated by proper dividers

## Navigation to Details Tests

- [ ] "View Details" button navigates to CityDetail screen
- [ ] Historical data and timestamp are passed correctly
- [ ] CityDetail screen shows historical badge for these entries
- [ ] Navigation preserves the historical context

## Error Handling Tests

- [ ] Storage errors show appropriate error messages
- [ ] Retry button reloads historical data
- [ ] No crashes when historical data is corrupted
- [ ] Empty state is distinct from error state

## UI/UX Tests

- [ ] Date text is smaller and gray (#666666)
- [ ] Weather text is prominent and black (#000000)
- [ ] "View Details" buttons are blue (#2388C7) with white text
- [ ] Proper spacing between list items
- [ ] List has appropriate padding and margins
- [ ] Empty state text is centered and styled appropriately

## Performance Tests

- [ ] Screen loads quickly with existing historical data
- [ ] List scrolls smoothly with many historical entries
- [ ] Memory usage remains stable during navigation
- [ ] No unnecessary re-renders when data doesn't change

## Integration Tests

- [ ] Works with actual storage service data
- [ ] Integrates with CityDetail screen for historical viewing
- [ ] Handles different date formats correctly
- [ ] Works with various weather condition types
