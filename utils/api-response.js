/**
 * A utility function to standardize API responses.
 * 
 * @param {Object} options - The options for the response.
 * @param {string} options.message - A message describing the response.
 * @param {Object|null} options.data - The actual response data (can be null).
 * @param {number} options.status - HTTP status code for the response.
 * @param {Object|null} [options.error] - Optional error details for debugging.
 * @returns {Object} - Standardized response object.
 */
export function createResponse({ message, data = null, status = 200, error = null }) {
    const response = {
      message,
      data,
    };
  
    if (error) {
      response.error = error; // Include error details if provided
    }
  
    return response;
  }
  