const log = require('node-color-log'); // Import node-color-log

class BasePage {
    /**
     * @param {Page} page Playwright page instance
     */
    constructor(page) {
        /** @type {Page} */
        this.page = page;
    }

    /**
     * Navigates to a specified path relative to the baseURL.
     * @param {string} [path='/'] - The path to navigate to.
     */
    async goto(path = '/') {
        log.info(`Navigating to path: ${path}`); // Info level seems appropriate here
        await this.page.goto(path);
    }

    /**
     * Clicks a given locator.
     * @param {Locator} locator
     * @param {string} elementName
     * @param {object} [options]
     */
    async clickElement(locator, elementName, options) {
        log.debug(`Clicking on: ${elementName}`);
        await locator.click(locator);
    }

    /**
     * Fills a given locator with text.
     * @param {Locator} locator
     * @param {string} text
     * @param {string} elementName
     * @param {object} [options]
     */
    async fillText(locator, text, elementName, options) {
        // Avoid logging sensitive data like passwords fully
        const loggedText = (elementName.toLowerCase().includes('password'))
            ? '***'
            : (text.length > 30 ? text.substring(0, 27) + '...' : text);
        log.debug(`Filling '${elementName}' with text: '${loggedText}'`); // Debug level
        await locator.fill(text, options);
    }

    /**
     * Selects an option in a dropdown by value.
     * @param {Locator} locator
     * @param {string} value
     * @param {string} elementName
     * @param {object} [options]
     */
    async selectDropdownOptionByValue(locator, value, elementName, options) {
        log.debug(`Selecting option with value '${value}' in dropdown: ${elementName}`); // Debug
        await locator.selectOption({ value: value }, options);
    }

    /**
     * Selects an option in a dropdown by label.
     * @param {Locator} locator
     * @param {string} label
     * @param {string} elementName
     * @param {object} [options]
     */
    async selectDropdownOptionByLabel(locator, label, elementName, options) {
        log.debug(`Selecting option with label '${label}' in dropdown: ${elementName}`); // Debug
        await locator.selectOption({ label: label }, options);
    }

    /**
     * Checks a radio button or checkbox.
     * @param {Locator} locator
     * @param {string} elementName
     * @param {object} [options]
     */
    async checkElement(locator, elementName, options) {
        log.debug(`Checking element: ${elementName}`); // Debug
        await locator.check(options);
    }

    /**
     * Gets the text content of a given locator.
     * @param {Locator} locator
     * @param {string} elementName
     * @param {object} [options]
     * @returns {Promise<string|null>}
     */
    async getTextContent(locator, elementName, options) {
        log.debug(`Getting text content from: ${elementName}`); // Debug
        // It's okay to log the retrieved text unless it's expected to be sensitive
        const text = await locator.textContent(options);
        // log.debug(` -> Text found: ${text}`); // Optional: log the result too
        return text;
    }

    /**
     * Waits for a specific locator to be visible.
     * @param {Locator} locator
     * @param {string} elementName
     * @param {object} [options]
     */
    async waitForElementVisible(locator, elementName, options) {
        log.debug(`Waiting for element to be visible: ${elementName}`); // Debug
        await locator.waitFor({ state: 'visible', ...options });
    }

    /**
     * Waits for a specific locator to be hidden.
     * @param {Locator} locator
     * @param {string} elementName
     * @param {object} [options]
     */
    async waitForElementHidden(locator, elementName, options) {
        log.debug(`Waiting for element to be hidden: ${elementName}`); // Debug
        await locator.waitFor({ state: 'hidden', ...options });
    }

    /**
     * Gets the current page title.
     * @returns {Promise<string>}
     */
    async getPageTitle() {
        const title = await this.page.title();
        log.info(`Current page title: ${title}`); // Info level
        return title;
    }

    /**
     * Gets the current page URL.
     * @returns {string}
     */
    getPageUrl() {
        const url = this.page.url();
        log.info(`Current page URL: ${url}`); // Info level
        return url;
    }

    /**
     * Explicit wait. Use sparingly.
     * @param {number} milliseconds
     */
    async wait(milliseconds) {
        log.debug(`Waiting explicitly for ${milliseconds}ms`); // Debug
        await this.page.waitForTimeout(milliseconds);
    }
}

module.exports = { BasePage };
