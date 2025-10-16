/**
 * Formats date to match the exact design specification (DD.MM.YYYY. - HH:mm)
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string exactly like design
 */
export const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}.${month}.${year}. - ${hours}:${minutes}`;
  };
  
  /**
   * Formats date for historical screen (DD.MM.YYYY - HH:mm without trailing dot)
   * @param dateString - ISO date string or Date object
   * @returns Formatted date string for historical screen
   */
  export const formatHistoricalDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}.${month}.${year} - ${hours}:${minutes}`;
  };
  
  /**
   * Capitalizes the first letter of weather description
   * @param str - String to capitalize
   * @returns Capitalized string
   */
  export const capitalizeFirst = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };