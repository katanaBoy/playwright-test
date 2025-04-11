const { test, expect } = require('../fixtures/pages-dev-fixture');
const { ProfilePage } = require('../page-objects/profile-creation.page.js');
const  data  = require('../data');
const log = require('node-color-log');

test.describe('User Profile Creation Scenarios', () => {

    test('Verify successful profile creation (Mandatory fields only)', async ({ page }) => {
        const profilePage = new ProfilePage(page);

        const userData = data.userData.generateMandatoryUserData()

        log.debug('Generated User Data:', { ...userData});


        await profilePage.fillMandatoryFields(userData);

        // 3. Submit the form - use handleDialogDuringAction to assert no dialog appears
        log.info('Submitting the form with all valid data...');
        const dialogDisplay = await profilePage.handleDialogDuringAction(
            async () => { await profilePage.submitProfile(); }, // Pass the submit action
            1000 // Short timeout, expecting no dialog - lower than default
        );

        await expect(dialogDisplay.wasVisible, `Shouldn't see any dialogs since all mandatory fields are filled ${JSON.stringify(dialogDisplay)}`).toBe(false);

        const finalUrlString = page.url();
        log.info(`Navigated to URL: ${finalUrlString}`);
        const finalUrl = new URL(finalUrlString);

        // All those check directly used should be in extracted more info in the readme
        await expect(finalUrl.origin + finalUrl.pathname).toBe('https://qa-assessment.pages.dev/');
        log.debug('Verifying URL search parameters...');
        await expect(finalUrl.searchParams.get('firstName')).toBe(userDetails.firstName);
        await expect(finalUrl.searchParams.get('lastName')).toBe(userDetails.lastName);
        await expect(finalUrl.searchParams.get('email')).toBe(userDetails.email);
        await expect(finalUrl.searchParams.get('password')).toBe(userDetails.password);
        await expect(finalUrl.searchParams.get('confirmPassword')).toBe(userDetails.password);

        /**
         * The success message is hard to verify at the moment  because of the time that is on the screen
         * there are some ways to access it, but it will make the test brittle and given te timeframe I don't think
         * it is worth checking since it is only a message. If this was real scenario that needs testing will put more time in to it
         */
    });

    test('Verify successful profile creation (All fields valid)', async ({ page }) => {

        const profilePage = new ProfilePage(page);
        const userDetails = data.userData.generateFullUserData();

        log.debug('Generated Full User Data:', { ...userDetails, password: '***' });
        await profilePage.fillMandatoryFields(userDetails); // Reuse for mandatory ones
        await profilePage.selectGender(userDetails.gender);
        await profilePage.fillDOB(userDetails.dob);
        await profilePage.fillPhone(userDetails.phone);
        await profilePage.fillAddress(userDetails.address);
        await profilePage.fillLinkedIn(userDetails.linkedInUrl);
        await profilePage.fillGitHub(userDetails.gitHubUrl);

        log.info('Submitting the form with all valid data...');
        const result = await profilePage.handleDialogDuringAction(
            async () => { await profilePage.submitProfile(); }, // Pass the submit action
            1000 // Short timeout, expecting no dialog
        );
        await expect(result.wasVisible, `Shouldn't see any dialogs since all mandatory fields are filled ${JSON.stringify(result)}`).toBe(false);

        const finalUrlString = page.url();
        log.info(`Navigated to URL: ${finalUrlString}`);
        const finalUrl = new URL(finalUrlString);
        await expect(finalUrl.origin + finalUrl.pathname).toBe('https://qa-assessment.pages.dev/');

        log.debug('Verifying URL search parameters...');
        await expect(finalUrl.searchParams.get('firstName')).toBe(userDetails.firstName);
        await expect(finalUrl.searchParams.get('lastName')).toBe(userDetails.lastName);
        await expect(finalUrl.searchParams.get('email')).toBe(userDetails.email);
        await expect(finalUrl.searchParams.get('password')).toBe(userDetails.password);
        await expect(finalUrl.searchParams.get('confirmPassword')).toBe(userDetails.password);
        await expect(finalUrl.searchParams.get('gender')).toBe(userDetails.gender);
        await expect(finalUrl.searchParams.get('dob')).toBe(userDetails.dob);
        await expect(finalUrl.searchParams.get('phone')).toBe(userDetails.phone);
        await expect(finalUrl.searchParams.get('address')).toBe(userDetails.address);
        await expect(finalUrl.searchParams.get('linkedIn')).toBe(userDetails.linkedInUrl);
        await expect(finalUrl.searchParams.get('github')).toBe(userDetails.gitHubUrl);

    });

});
