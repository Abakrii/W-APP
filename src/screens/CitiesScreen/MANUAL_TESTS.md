# CitiesScreen Manual Tests

## Navigation Tests

- [ ] Screen loads correctly within navigation stack
- [ ] Pressing city name navigates to CityDetail screen
- [ ] Pressing history button navigates to HistoricalData screen
- [ ] Navigation works with proper city data parameters

## City Management Tests

- [ ] FAB button opens add city modal
- [ ] Modal allows city name input
- [ ] Empty city name shows validation error
- [ ] Invalid city name shows appropriate error
- [ ] Valid city name adds city to list
- [ ] Remove button deletes city from list
- [ ] Cities persist between app launches

## Loading States Tests

- [ ] Loading indicator shows during initial load
- [ ] Loading indicator shows during city addition
- [ ] Empty state displays when no cities are added
- [ ] List displays correctly when cities are present

## UI/UX Tests

- [ ] FAB button is round and blue (#2388C7) in bottom-right
- [ ] City items display with dash prefix and proper formatting
- [ ] History buttons are green (#34C759)
- [ ] Remove buttons are red (#FF3B30)
- [ ] Divider appears only when cities are present
- [ ] Modal has proper styling and layout
- [ ] Snackbar messages display correctly

## Error Handling Tests

- [ ] Network errors show user-friendly messages
- [ ] Invalid city names show validation errors
- [ ] Storage errors are handled gracefully
- [ ] API failures don't crash the app

## Performance Tests

- [ ] Screen loads quickly with existing cities
- [ ] City list scrolls smoothly
- [ ] Modal opens and closes without lag
- [ ] Multiple city operations don't cause performance issues

## Integration Tests

- [ ] Works with actual storage service
- [ ] Integrates with weather API
- [ ] Works with navigation system
- [ ] Handles real weather data correctly
