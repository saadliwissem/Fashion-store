/**
 * Format a date string into a readable format
 * @param {string|Date} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "N/A";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Check if date is valid
  if (isNaN(dateObj.getTime())) return "Invalid date";

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat("en-US", defaultOptions).format(dateObj);
};

/**
 * Format a date with time
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
  if (!date) return "N/A";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(dateObj);
};

/**
 * Format a date as relative time (e.g., "2 days ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return "N/A";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "Invalid date";

  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  } else {
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  }
};

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale (default: 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "USD", locale = "en-US") => {
  if (amount === null || amount === undefined) return "N/A";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Alias for formatCurrency (for backward compatibility)
 */
export const formatPrice = formatCurrency;

/**
 * Format a number with thousand separators
 * @param {number} num - The number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined) return "N/A";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Format a percentage
 * @param {number} value - The percentage value (e.g., 0.75 for 75%)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Truncate a string to a specified length
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add when truncated (default: '...')
 * @returns {string} Truncated string
 */
export const truncateString = (str, length = 50, suffix = "...") => {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

/**
 * Format a file size in bytes to human readable format
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  if (!bytes) return "N/A";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

/**
 * Format a phone number to a standard format
 * @param {string} phone - The phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return "N/A";

  // Remove all non-numeric characters
  const cleaned = ("" + phone).replace(/\D/g, "");

  // Check if it's a US number (10 digits) or international
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6,
      10
    )}`;
  } else if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(
      7,
      11
    )}`;
  } else {
    // Return original if can't format
    return phone;
  }
};

/**
 * Format a duration in seconds to human readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return "N/A";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
};

/**
 * Format a wallet address to a shortened form
 * @param {string} address - The wallet address
 * @param {number} startChars - Number of characters to show at start
 * @param {number} endChars - Number of characters to show at end
 * @returns {string} Shortened address
 */
export const formatWalletAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return "N/A";
  if (address.length <= startChars + endChars) return address;

  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Format a blockchain transaction hash
 * @param {string} txHash - The transaction hash
 * @returns {string} Formatted transaction hash
 */
export const formatTxHash = (txHash) => {
  return formatWalletAddress(txHash, 10, 8);
};

/**
 * Convert a string to title case
 * @param {string} str - The string to convert
 * @returns {string} Title cased string
 */
export const toTitleCase = (str) => {
  if (!str) return "";
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Convert a string to kebab case (for URLs)
 * @param {string} str - The string to convert
 * @returns {string} Kebab cased string
 */
export const toKebabCase = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};

/**
 * Format a JSON object as a pretty string
 * @param {Object} obj - The object to format
 * @returns {string} Pretty printed JSON
 */
export const formatJson = (obj) => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return "Invalid JSON";
  }
};

/**
 * Parse and format a JSON string
 * @param {string} jsonStr - The JSON string to parse and format
 * @returns {string} Pretty printed JSON or error message
 */
export const formatJsonString = (jsonStr) => {
  try {
    const obj = JSON.parse(jsonStr);
    return JSON.stringify(obj, null, 2);
  } catch {
    return "Invalid JSON string";
  }
};

/**
 * Format a boolean as Yes/No
 * @param {boolean} value - The boolean value
 * @param {string} trueText - Text for true (default: 'Yes')
 * @param {string} falseText - Text for false (default: 'No')
 * @returns {string} Formatted boolean
 */
export const formatBoolean = (value, trueText = "Yes", falseText = "No") => {
  if (value === null || value === undefined) return "N/A";
  return value ? trueText : falseText;
};

/**
 * Format a rating (e.g., 4.5 out of 5)
 * @param {number} rating - The rating value
 * @param {number} maxRating - Maximum rating (default: 5)
 * @returns {string} Formatted rating
 */
export const formatRating = (rating, maxRating = 5) => {
  if (rating === null || rating === undefined) return "N/A";
  return `${rating.toFixed(1)} / ${maxRating}`;
};

/**
 * Format a list of items as a comma-separated string
 * @param {Array} items - The items to format
 * @param {string} separator - Separator (default: ', ')
 * @returns {string} Formatted list
 */
export const formatList = (items, separator = ", ") => {
  if (!items || !Array.isArray(items)) return "";
  return items.join(separator);
};

/**
 * Format a number with ordinal suffix (1st, 2nd, 3rd, etc.)
 * @param {number} num - The number to format
 * @returns {string} Number with ordinal suffix
 */
export const formatOrdinal = (num) => {
  if (num === null || num === undefined) return "N/A";

  const j = num % 10;
  const k = num % 100;

  if (j === 1 && k !== 11) {
    return num + "st";
  }
  if (j === 2 && k !== 12) {
    return num + "nd";
  }
  if (j === 3 && k !== 13) {
    return num + "rd";
  }
  return num + "th";
};
