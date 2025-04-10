const { faker } = require('@faker-js/faker');

/**
 * Helper function to format a Date object into YYYY-MM-DD string
 * @param {Date} date - The date object to format
 * @returns {string} - Formatted date string (YYYY-MM-DD)
 */
function formatDate(date) {
    const year = date.getFullYear();
    // getMonth() is 0-indexed, so add 1
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Generates user data containing only the mandatory fields required for profile creation.
 * Ensures first/last names are alphabetical only.
 * @returns {object} Object with firstName, lastName, email, password
 */
function generateMandatoryUserData() {
    const password = faker.internet.password({ length: 12, prefix: 'Mand@' }); // Reasonably complex password
    return {
        // Replace non-alpha chars just in case faker includes hyphens, apostrophes etc.
        firstName: faker.person.firstName().replace(/[^a-zA-Z]/g, ''),
        lastName: faker.person.lastName().replace(/[^a-zA-Z]/g, ''),
        email: faker.internet.email(),
        password: password, // Contains the generated password
        // Note: confirmPassword should be the same, handled during filling in page object/test
    };
}

/**
 * Generates user data containing all fields (mandatory and optional).
 * @returns {object} Object with all profile fields populated with valid data
 */
function generateFullUserData() {
    const mandatoryData = generateMandatoryUserData(); // Reuse mandatory data generation
    const userName = faker.internet.userName().replace(/[^a-zA-Z0-9_-]/g, ''); // Sanitize for URL use

    return {
        ...mandatoryData, // Spread mandatory fields
        gender: faker.helpers.arrayElement(['male', 'female', 'other']),
        // Generate a birthdate within a reasonable range (e.g., 18-80 years ago) and format it
        dob: formatDate(faker.date.birthdate({ min: 18, max: 80, mode: 'age' })),
        phone: faker.string.numeric(10), // Generates exactly 10 digits
        address: faker.location.streetAddress(true), // Includes secondary address like Apt#
        // Generate valid looking URLs
        linkedInUrl: `https://www.linkedin.com/in/${userName}`, // Use sanitized username
        gitHubUrl: `https://github.com/${userName}` // Use sanitized username
    };
}

/**
 * Generates user data with specific invalid values for testing validations.
 * Customize this based on the specific negative test case needed.
 * Example: Invalid First Name
 * @returns {object} User data with an invalid first name
 */
function generateInvalidFirstNameData() {
    const validData = generateMandatoryUserData();
    return {
        ...validData,
        firstName: 'John123',
    }
}

// --- Add more specific data generators as needed ---
// e.g., generateMismatchedPasswordData, generateInvalidEmailData, etc.

module.exports = {
    generateMandatoryUserData,
    generateFullUserData,
    generateInvalidFirstNameData,

};
