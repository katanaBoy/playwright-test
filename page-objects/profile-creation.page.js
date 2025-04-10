// page-objects/profile-creation.page.js
const { BasePage } = require('./base.page.js');
const data = require('../data');
const log = require('node-color-log');

/** @typedef {import('@playwright/test').Locator} Locator */
/** @typedef {import('@playwright/test').Page} Page */

class ProfilePage extends BasePage {
    /**
     * @param {Page} page Playwright page instance
     */
    constructor(page) {
        super(page);

        const loc = data.locators.profileCreationLocators;
        this.page = page;
        this.firstNameInput = page.locator(loc.firstNameInput);
        this.lastNameInput = page.locator(loc.lastNameInput);
        this.emailInput = page.locator(loc.emailInput);
        this.passwordInput = page.locator(loc.passwordInput);
        this.confirmPasswordInput = page.locator(loc.confirmPasswordInput);
        this.dobInput = page.locator(loc.dobInput);
        this.phoneInput = page.locator(loc.phoneInput);
        this.addressTextarea = page.locator(loc.addressTextarea);
        this.linkedInInput = page.locator(loc.linkedInInput);
        this.gitHubInput = page.locator(loc.gitHubInput);

        this.genderMaleRadio = page.locator(loc.genderMaleRadio);
        this.genderFemaleRadio = page.locator(loc.genderFemaleRadio);
        this.genderpreferNotToSayRario= page.locator(loc.genderPreferNotToSay);
        this.successMessage = page.locator(loc.successMessage);

        // this.submitButton = page.getByRole(loc.submitButton.role).filter({hasText: loc.submitButton.value});
        this.submitButton = page.getByText("Submit");
    }



    async fillFirstName(firstName) {
        await super.fillText(this.firstNameInput, firstName, 'First Name');
    }
    async fillLastName(lastName) {
        await super.fillText(this.lastNameInput, lastName, 'Last Name');
    }
    async fillEmail(email) {
        await super.fillText(this.emailInput, email, 'Email');
    }
    async fillPassword(password) {
        await super.fillText(this.passwordInput, password, 'Password');
    }
    async fillConfirmPassword(confirmPassword) {
        await super.fillText(this.confirmPasswordInput, confirmPassword, 'Confirm Password');
    }
    async fillDOB(dob) {
        await super.fillText(this.dobInput, dob, 'Date of Birth');
    }
    async fillPhone(phone) {
        await super.fillText(this.phoneInput, phone, 'Phone Number');
    }
    async fillAddress(address) {
        await super.fillText(this.addressTextarea, address, 'Address');
    }
    async fillLinkedIn(url) {
        await super.fillText(this.linkedInInput, url, 'LinkedIn URL');
    }
    async fillGitHub(url) {
        await super.fillText(this.gitHubInput, url, 'GitHub URL');
    }

    async selectGender(gender) {
        log.debug(`Selecting gender: ${gender}`);
        let targetRadio;
        let elementName;
        switch (gender) {
            case 'male':
                targetRadio = this.genderMaleRadio;
                elementName = 'Gender Male Radio';
                break;
            case 'female':
                targetRadio = this.genderFemaleRadio;
                elementName = 'Gender Female Radio';
                break;
            case 'other':
                targetRadio = this.genderpreferNotToSayRario;
                elementName = 'Gender Other Radio';
                break;
            default:
                log.warn(`Invalid gender specified: ${gender}`);
                throw new Error(`Invalid gender specified: ${gender}`);
        }
        await super.checkElement(targetRadio, elementName);
    }

    async submitProfile() {

        await super.clickElement(this.submitButton, 'Submit Button');

    }

    async fillMandatoryFields(userData) {
        await this.fillFirstName(userData.firstName);
        await this.fillLastName(userData.lastName);
        await this.fillEmail(userData.email);
        await this.fillPassword(userData.password);
        await this.fillConfirmPassword(userData.password);
    }


    /**
     *
     * This is needed since playwright is obscuring alert dialogs

     */
    async handleDialogDuringAction(action, timeout = 3000) {

        // Use an object to store results from the async handler
        const result = {
            wasVisible: false,
            dialogType: null,
            dialogMessage: null,
            dialogAccepted: false,
            actionError: null
        };

        // Define the handler function separately to pass it to page.on and page.off
        const dialogHandler = async (dialog) => {
            log.info(`Dialog listener: Intercepted! Type: ${dialog.type()}, Message: "${dialog.message()}"`);
            result.wasVisible = true;
            result.dialogType = dialog.type();
            result.dialogMessage = dialog.message();
            try {
                log.debug('Dialog listener: Accepting dialog...');
                await dialog.accept(); // Accept the dialog
                result.dialogAccepted = true;
                log.debug('Dialog listener: Dialog accepted.');
            } catch (acceptError) {
                log.error(`Dialog listener: Error accepting dialog: ${acceptError.message}`);
                // Store the accept error if the main action succeeded, otherwise prioritize main action error
                if (!result.actionError) result.actionError = acceptError;
            }
        };

        log.debug('Registering temporary dialog listener...');
        this.page.on('dialog', dialogHandler); // Register the listener

        try {
            log.debug('Executing provided action...');
            await action(); // Execute the action
            log.debug('Action completed successfully.');
        } catch (err) {
            log.error(`Error occurred during provided action: ${err.message}`);
            result.actionError = err; // Store the action error
        } finally {
            // IMPORTANT: Always remove the listener afterward to prevent interference
            log.debug('Removing temporary dialog listener.');
            this.page.off('dialog', dialogHandler);
        }

        // The listener updates the 'result' object directly if a dialog appears.
        return result;
    }

}

module.exports = { ProfilePage };
