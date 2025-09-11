const validateData = (data) => {
    const errors = [];
    const requiredColumns = ['latitude', 'longitude', 'As', 'Cd', 'Cr', 'Pb']; // Example required columns

    if (!Array.isArray(data) || data.length === 0) {
        return {
            isValid: false,
            errors: ['The uploaded file is empty or in an invalid format.'],
        };
    }

    data.forEach((row, index) => {
        const rowNumber = index + 1;

        // 1. Check for required columns
        for (const column of requiredColumns) {
            if (row[column] === undefined || row[column] === null) {
                errors.push(`Row ${rowNumber}: Missing required column "${column}".`);
            }
        }

        // 2. Check data types (ensure coordinates and metal values are numbers)
        for (const column of requiredColumns) {
            // Only check for numbers if the column exists to avoid redundant errors
            if (row[column] !== undefined && typeof row[column] !== 'number') {
                errors.push(`Row ${rowNumber}: Column "${column}" must be a number.`);
            }
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export { validateData };