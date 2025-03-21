
/**
 * Normalizes image URLs from various sources to ensure they work properly
 * Handles URLs from:
 * - Imgur (direct and indirect formats)
 * - Discord CDN
 * - General image URLs
 * 
 * @param url The image URL to normalize
 * @returns A properly formatted image URL
 */
export const normalizeImageUrl = (url: string): string => {
  if (!url) return '/placeholder.svg';
  
  // Already a fully formed URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Handle Imgur URLs in various formats
  if (url.includes('imgur.com') || url.includes('i.imgur')) {
    // Direct Imgur ID without domain
    if (!url.includes('.') && !url.includes('/')) {
      return `https://i.imgur.com/${url}.jpg`;
    }
    
    // i.imgur.com without protocol
    if (url.startsWith('i.imgur.com/')) {
      return `https://${url}`;
    }
    
    // imgur.com without protocol but with path
    if (url.startsWith('imgur.com/')) {
      // Convert imgur.com/abc to https://i.imgur.com/abc.jpg
      const imgurId = url.replace('imgur.com/', '');
      if (!imgurId.includes('.')) {
        return `https://i.imgur.com/${imgurId}.jpg`;
      }
      return `https://i.${url}`;
    }
    
    // Just add https:// prefix
    return `https://${url}`;
  }
  
  // Handle Discord CDN URLs
  if (url.includes('cdn.discordapp.com') || url.includes('media.discordapp.net')) {
    if (!url.startsWith('http')) {
      return `https://${url}`;
    }
    return url;
  }
  
  // For other cases, assume it might be a path or full URL
  if (url.startsWith('/')) {
    // Relative path from root
    return url;
  }
  
  // Unknown format, try as Imgur ID
  if (!url.includes('/') && !url.includes('.')) {
    return `https://i.imgur.com/${url}.jpg`;
  }
  
  // Unknown format, try direct URL
  return url;
};

/**
 * Converts a normalized display URL back to a storage format
 * for saving to the database
 * 
 * @param url The display URL to convert back to storage format
 * @returns URL in storage format
 */
export const getStorageImageUrl = (url: string): string => {
  if (!url) return '';
  
  // Handle Imgur URLs - store them in shorter format
  if (url.includes('imgur.com')) {
    // Extract imgur ID from URL
    const match = url.match(/imgur\.com\/([a-zA-Z0-9]+)(\.[a-z]+)?/);
    if (match && match[1]) {
      return `imgur.com/${match[1]}`;
    }
    
    // Extract i.imgur.com ID from URL
    const iMatch = url.match(/i\.imgur\.com\/([a-zA-Z0-9]+)(\.[a-z]+)?/);
    if (iMatch && iMatch[1]) {
      return `i.imgur.com/${iMatch[1]}`;
    }
  }
  
  // For others, return as is
  return url;
};
