export const getYears = (start, end) => {
    let years = [];

    for (let i = start; i <= end; i++){
        years.push(i)
    }

    return years;
}

export const formatErrors = (str) => {
    let chars = ['-', '_', '!', '*', '{', '}', ':', '"', '[', ']', '\\'];
    let escapedChars = chars.map(char => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    let regex = new RegExp(escapedChars.join('|'), 'g');
    return str.replace(regex, '');
}

export const getConditionLabel = (code) => {
    const conditions = [
        { code: '1', label: 'Excellent' },
        { code: '4', label: 'Usable' },
        { code: '7', label: 'Repairable' },
        { code: 'X', label: 'Salvage' },
        { code: 'S', label: 'Scrap' }
    ];

    const condition = conditions.find(cnd => cnd.code === String(code));
    return condition ? condition.label : code; // Return original code if not found
}

export const statusColor = (stat) => {
    switch(stat) {
        case 'pending...':
            return 'text-orange-500';
        case 'pending':
            return 'text-orange-500';
        case 'Not started':
            return 'text-orange-500';
        case 'processing...':
            return 'text-brand';
        case 'On going...':
            return 'text-green-500';
        case 'in progress':
            return 'text-green-500';
        case 'completed...':
            return 'text-green-500';
        case 'completed':
            return 'text-accent dark:text-brand';
        case 'declined...':
            return 'text-red-500';
        case 'cancelled':
            return 'text-red-500';
        case 'awaiting rating...':
            return 'text-orange-500';
        case 'rating in progress...':
            return 'text-brand';
        case 'rating completed':
            return 'text-green-600';
        case 'Completed':
            return 'text-blue-600 dark:text-blue-300';
        case 'Past':
            return 'text-muted-foreground/50';
        default:
            return 'text-red-500';
    }
}

export const bgColor = (stat) => {
    switch(stat) {
        case 'pending...':
            return 'bg-orange-500';
        case 'pending':
            return 'bg-orange-500';
        case 'Not started':
            return 'bg-orange-500';
        case 'processing...':
            return 'bg-brand';
        case 'On going...':
            return 'bg-green-500';
        case 'in progress':
            return 'bg-green-500';
        case 'completed...':
            return 'bg-green-500';
        case 'completed':
            return 'bg-accent dark:bg-brand';
        case 'declined...':
            return 'bg-red-500';
        case 'cancelled':
            return 'bg-red-500';
        case 'awaiting rating...':
            return 'bg-orange-500';
        case 'rating in progress...':
            return 'bg-brand';
        case 'rating completed':
            return 'bg-green-600';
        case 'Completed':
            return 'bg-blue-600 dark:bg-blue-300';
        default:
            return 'bg-red-500';
    }
}

export const compareJsonAndGetDifferences = (obj1, obj2) => {
    const differences = {};
    obj1 = JSON.parse(obj1);
    obj2 = JSON.parse(obj2);
    
    // Get all keys from both objects
    const allKeys = [...new Set([...Object.keys(obj1), ...Object.keys(obj2)])];
    
    // Find common keys
    const commonKeys = allKeys.filter(key => 
        obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)
    );
    
    // Compare common keys
    commonKeys.forEach(key => {
        // Handle nested objects recursively
        if (typeof obj1[key] === 'object' && obj1[key] !== null && 
            typeof obj2[key] === 'object' && obj2[key] !== null) {
            
            const nestedDiff = compareJsonAndGetDifferences(obj1[key], obj2[key]);
            if (Object.keys(nestedDiff).length > 0) {
                differences[key] = {
                    old: obj1[key],
                    new: obj2[key]
                };
            }
        } 
        // Compare primitive values
        else if (obj1[key] !== obj2[key]) {
            differences[key] = {
                old: obj1[key],
                new: obj2[key]
            };
        }
    });
    
    return differences;
}


export const formatDateAndTime = (dt) => {

    const date = new Date(dt);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${monthNames[month]} ${day}, ${year} ${hour}:${minutes}:${seconds}`;
}

export const shouldRenderField = (field, formData) => {
    // If no dependency, always render
    if (field.depends_on === 'none') return true;
  
    const dependentKey = field.depends_on;
  
    // If the dependent field hasn't been filled yet
    if (!(dependentKey in formData)) return false;
  
    // Check if value matches the logic condition
    return formData[dependentKey] === field.logic;
}

export const capitalizeFirstWord = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const replaceCharsWithSpace = (str, charsArray) => {
    // If string is empty or charsArray is empty, return original string
    if (!str || !charsArray || charsArray.length === 0) {
        return str;
    }
    
    // Create a regular expression from the array of characters
    // Escape special regex characters to avoid errors
    const escapedChars = charsArray.map(char => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`[${escapedChars.join('')}]`, 'g');
    
    // Replace matching characters with space
    return str.replace(regex, ' ');
}

export const removeDuplicateSentences = (text) => {
    // Split by periods, question marks, exclamation marks
    let sentences = text.split(/(?<=[.!?])\s+/);
    
    // Remove duplicates while preserving order
    let uniqueSentences = [...new Set(sentences)];
    
    return uniqueSentences.join(' ');
}


export const appendArrayToFormData = (formData, array, name) => {
    array.forEach((item, index) => {
        Object.keys(item).forEach(key => {
            formData.append(`${name}[${index}][${key}]`, item[key]);
        });
    });
    return formData;
}


export const sumRatings = (ratingObj) => {
    const sum = Object.values(ratingObj).reduce((acc, value) => {
        return acc + Number(value);
    }, 0);
    return sum;
}

export const sumArrayRatings = (ratingArr) => {
    const sum = ratingArr.reduce((acc, item) => {
        return acc + item.total;
    }, 0);
    return sum;
}


export const sumArrayTotalRatings = (ratingArr) => {
    const sum = ratingArr.reduce((acc, item) => {
        return acc + parseInt(item.options);
    }, 0);
    return sum;
}

export const roundBasedOnDecimal = (num) => {
    // Get the decimal part
    const decimal = num - Math.floor(num);
    
    // Check if decimal is less than 0.5
    if (decimal < 0.5) {
        return Math.floor(num); // Round down
    } else {
        return Math.ceil(num); // Round up
    }
}


/**
 * Checks the status of a date range against the current date.
 * @param {Date} date1 - Start date (expected to be before date2)
 * @param {Date} date2 - End date
 * @returns {string} 'not started', 'on going', or 'completed'
 */
export const getActivityStatus = (date1, date2) => {

    // Convert to Date objects if they're strings
    const startDate = typeof date1 === 'string' ? new Date(date1) : date1;
    const endDate = typeof date2 === 'string' ? new Date(date2) : date2;
    
    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 'invalid date';
    }
    
    const now = new Date();
    const current = now.getTime();
    const start = startDate.getTime();
    const end = endDate.getTime();

    // Current date is strictly before the start
    if (current < start) {
        return 'Not started';
    }

    // Current date is strictly between start and end (not including end)
    // Uses >= for start so that the start date itself is considered 'on going'
    if (current >= start && current < end) {
        return 'On going...';
    }

    // Current date is on or after the end
    if (current >= end) {
        return 'Past';
    }

    // Fallback (should never occur with valid dates)
    return 'unknown';
}


export const generateTwoDigitRange = (start) => {
    // Get the last two digits of the current year
    const end = (new Date().getFullYear() + 1) % 100;
  
    // Validate input
    if (typeof start !== 'number' || !Number.isInteger(start)) {
      throw new TypeError('Start must be an integer');
    }
  
    if (start < 0 || start > 99) {
      throw new RangeError('Start must be between 0 and 99');
    }
  
    const result = [];
    for (let i = start; i <= end; i++) {
        result.push({ title: 'FY'+String(i).padStart(2, '0') });
    }
    return result;
}

export const getNextQuarter = () => {
    const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
  
    // Determine current quarter (1–4)
    const currentQuarter = Math.floor(month / 3) + 1;
  
    // Return the NEXT quarter, wrapping Q4 → Q1
    const nextQuarter = (currentQuarter % 4) + 1;
  
    return `Q${nextQuarter}`;
}

export const getFiscalYear = (date = new Date()) => {
    const year = date.getFullYear();
    const month = date.getMonth();
  
    const fiscalYear = month >= 9 ? year + 1 : year;
    return 'FY' + String(fiscalYear % 100).padStart(2, '0');
}

export const getStates = (data) => {
    return [...new Set(data.map(dt => dt.state))].sort().map(state => ({ title: state }));;
}

export const getLGAsByState = (data, state) => {
    return [...new Set(
        data
            .filter(item => item.state === state)
            .map(item => item.lga)
    )]
        .sort()
        .map(lga => ({ title: lga }));
}

export const getFacilitiesByLga = (data, lga) => {
    return data
        .filter(item => item.lga === lga && item.facility !== null)
        .map(item => ({ title: item.facility }));
}

export const getTripOrigin = (str, separator = "__") => {
    const parts = str.split(separator);
    return parts[0]+' '+parts[2] ?? null;
}

export const filterFullnameAndEmail = (users) => {
    return users.map(user => ({
        label: user.fullname,
        title: user.email
    }));
}

export const formatDateToUnderscore = (isoString) => {
    const date = new Date(isoString);
    
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    
    return `${year}_${month}_${day}`;
}

export const ucfirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const uniqueValues = (arr, key) => {
    return [...new Set(arr.map(item => item[key]))].map(title => ({ title }));
}
