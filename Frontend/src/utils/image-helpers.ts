/**
 * Formats image paths to ensure proper display across the application
 */
export const formatImagePath = (imagePath: string | undefined): string => {
  if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
  
  // If it's already a complete URL (starts with http:// or https://)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If path begins with /uploads/
  if (imagePath.startsWith('/uploads/')) {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePath}`;
  }
  
  // If it's a relative path with filename pattern (e.g. print-12345.jpg)
  if (imagePath.match(/^[a-zA-Z0-9_-]+\.\w+$/)) {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/prints/${imagePath}`;
  }
  
  // For any other case, assume it's a path relative to the API
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};