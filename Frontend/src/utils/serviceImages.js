/**
 * This is just a helper to ensure you have the service images
 * Create a folder structure in your public folder:
 * /public/images/services/
 * And place these images:
 * - wedding.jpg
 * - pre-wedding.jpg
 * - birthday.jpg
 * - graduation.jpg
 */

export const serviceImages = {
  "Wedding Photography": "/images/services/wedding.jpg",
  "Pre-Wedding Shoot": "/images/services/pre-wedding.jpg",
  "Birthday Photography": "/images/services/birthday.jpg",
  "Graduation Photography": "/images/services/graduation.jpg"
};

// Default image if service image is not found
export const defaultServiceImage = "/images/placeholder-service.jpg";