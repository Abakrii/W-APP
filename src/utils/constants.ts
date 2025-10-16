/**
 * Application constants
 */
export const Constants = {
    API: {
      BASE_URL: 'https://api.openweathermap.org/data/2.5',
      KEY: 'f5cb0b965ea1564c50c6f1b74534d823',
      ICON_URL: 'https://openweathermap.org/img/w'
    },
    STORAGE: {
      MAX_HISTORY_ENTRIES: 50
    },
    WEATHER: {
      KELVIN_OFFSET: 273.15
    }
  } as const;