const { test: base, expect } = require('@playwright/test');
const { BasePage } = require('../page-objects/base.page.js'); // Ensure path is correct
const log = require('node-color-log');

const ossStandaloneConfig = { host: 'localhost', port: 6379 }; // Replace with your actual import/definition

const test = base.extend({
    /**
     * Worker-scoped shared state. Initialized once per worker thread.
     * Contains configuration data accessible to tests within that worker.
     * @type {import('@playwright/test').Fixtures<object, { workerState: {apiUrl: string, dbConfig: object, baseUrl: string} }>}
     */
    workerState: [async ({}, use, testInfo) => {
        log.info(`🚀 Setting up worker state for worker ${testInfo.workerIndex}`);

        // Initialize worker-scoped data
        /** @type {{apiUrl: string, dbConfig: object, baseUrl: string}} */
        const workerState = {
            // Safely access properties from testInfo.project.use
            apiUrl: testInfo.project.use?.apiUrl ?? 'http://default-api-url.com', // Provide a default if potentially undefined
            dbConfig: ossStandaloneConfig, // Provide db config if needed
            baseUrl: testInfo.project.use?.baseURL ?? 'http://default-base-url.com' // Provide a default
        };
        log.info(`🏠 Base URL: ${workerState.baseUrl}`);
        log.info(`🌐 API URL: ${workerState.apiUrl}`);
        log.info(`🗄️ Database Config: ${JSON.stringify(workerState.dbConfig)}`);

        await use(workerState);

        // Optional: Worker teardown code can go here after `await use()`
        log.debug(`Worker ${testInfo.workerIndex} state teardown (if needed).`);

    }, { scope: 'worker' }], // Worker-scoped fixture

    /**
     * Worker-scoped setup/teardown hook. Runs once per worker before/after all tests in that worker.
     * Useful for global worker setup like seeding a database ONLY if absolutely necessary
     * (prefer test-level isolation where possible).
     * @type {import('@playwright/test').Fixtures<object, { forEachWorker: void }>} // Type hint for void fixture
     */
    forEachWorker: [async ({ workerState }, use, testInfo) => { // Changed testInfo to workerIndex for clarity in logs
        const workerIndex = testInfo.workerIndex;
        log.info(`BEFORE ALL in Worker ${workerIndex}: Performing worker setup using base URL: ${workerState.baseUrl}`);
        // Add any worker-level setup here (e.g., connect to a shared resource)
        // Be cautious with shared state modifications here.

        await use(); // Run all tests within this worker

        // Worker Teardown
        log.info(`AFTER ALL in Worker ${workerIndex}: Performing worker teardown.`);
        // Add any worker-level teardown here (e.g., disconnect from shared resource)

    }, { scope: 'worker', auto: true }], // `auto: true` makes it run automatically

    /**
     * Test-scoped fixture providing the Playwright page object,
     * ensuring the base URL is visited before the test uses the page.
     * NOTE: This fixture provides the standard 'page' object, but after navigation.
     * If you wanted to provide the BasePage instance instead, you would `use(basePage)`.
     * The original TS types suggested providing 'page'.
     * @type {import('@playwright/test').Fixtures<{ page: import('@playwright/test').Page }, object>}
     */
    page: async ({ page, workerState }, use) => { // Override the built-in 'page' fixture
        log.info(`Fixture setup (test-scoped): Initializing Base Page and navigating for test.`);

        const basePage = new BasePage(page);
        // Assuming navigateToHomeUrl was a custom method, using the standard goto from BasePage

        await basePage.goto(workerState.baseUrl); // Use the goto method from BasePage

        // Provide the already navigated page object to the test
        await use(page);

        // Optional: Test teardown code can go here after `await use()`
        log.debug(`Fixture teardown (test-scoped): After test execution using page.`);
    },

    // --- Example of providing the Page Object instance ---
    // If you wanted tests to use `profilePage` directly instead of `page`:
    /*
    profilePage: async ({ page, workerState }, use) => {
        log.info(`Fixture setup: Initializing Profile Page and navigating.`);
        // If ProfilePage needs navigation different from base.page.js
        const profilePage = new ProfilePage(page); // Assuming you create ProfilePage extending BasePage
        await profilePage.goto(); // Or specific navigation logic
        await use(profilePage);
    },
    */

});

// Export the customized test runner and expect function
module.exports = { test, expect };
