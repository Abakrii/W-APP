# CityCard Manual Tests

## Visual Tests

- [ ] Dash prefix (-) appears before city name in black color
- [ ] City name and country display in format "City, Country"
- [ ] City text uses regular font weight (400) and 17px size
- [ ] History button appears in green (#34C759) with white text
- [ ] Remove button appears in red (#FF3B30) with white text
- [ ] Buttons have proper corner radius (6px) and padding
- [ ] No borders between city cards (clean design)

## Interaction Tests

- [ ] Tapping city card triggers onPress callback with full city data
- [ ] Tapping history button triggers onHistoryPress with full city data
- [ ] Tapping remove button triggers onRemovePress with city name only
- [ ] All buttons provide visual feedback when pressed

## Content Tests

- [ ] Long city names wrap correctly and don't break layout
- [ ] Cities with special characters display properly
- [ ] Country names display correctly after comma
- [ ] Multiple city cards stack properly in list

## Integration Tests

- [ ] Works correctly in favorite cities list
- [ ] Works correctly in recent cities list
- [ ] Works correctly in search results
- [ ] Properly integrates with navigation system
- [ ] Callbacks correctly update parent component state

## Accessibility Tests

- [ ] City cards have proper accessibility labels
- [ ] Buttons have meaningful accessibility labels
- [ ] Sufficient color contrast for all text elements
- [ ] Touch targets are appropriately sized (44px minimum)
