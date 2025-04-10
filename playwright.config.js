const { defineConfig, devices } = require('@playwright/test');
const os = require("node:os");
const { Status } = require("allure-js-commons");

/**
 * Read environment variables from file.
 * not needed for this prject
 *
 */
// const dotenv = require('dotenv');
// const path = require('path');
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

module.exports = defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 600 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000
  },

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["line"], ["html"], [
    "allure-playwright",
    {
      resultsDir: "allure-results",
      detail: true,
      suiteTitle: true,
      links: {
        issue: {
          nameTemplate: "Issue #%s",
          urlTemplate: "https://issues.example.com/%s",
        },
        tms: {
          nameTemplate: "TMS #%s",
          urlTemplate: "https://tms.example.com/%s",
        },
        jira: {
          // Removed TypeScript type annotation ': any'
          urlTemplate: (v) => `https://jira.example.com/browse/${v}`,
        },
      },
      categories: [
        {
          name: "foo",
          messageRegex: "bar",
          traceRegex: "baz",
          // Using Status enum values imported via require
          matchedStatuses: [Status.FAILED, Status.BROKEN],
        },
      ],
      environmentInfo: {
        os_platform: os.platform(),
        os_release: os.release(),
        os_version: os.version(),
        node_version: process.version,
      },
    },
  ]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    testIdAttribute: 'data-testid', // Keep using testIdAttribute if your app uses data-testid
    video: {
      mode: "on", // Record video for all tests
      size: {width: 1920, height: 1080}
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        // Project-specific baseURL
        baseURL: process.env.COMMON_URL || 'https://qa-assessment.pages.dev/', //
        headless: false, // Run in non-headless mode for local debugging
        deviceScaleFactor: undefined, // Use default scaling
        viewport: null, // Use maximized viewport via launchOptions args
        launchOptions:{
          args: ["--start-maximized", // Start browser maximized
            // Below are common args to make automation more stable/less detectable though it didnt work for the button
            // "--disable-component-extensions-with-background-pages",
            // "--disable-dev-shm-usage",
            // "--disable-blink-features=AutomationControlled"
          ]}
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'https://qa-assessment.pages.dev/', // <--- SET YOUR ACTUAL BASE URL HERE
        headless: false,
        args: ["--start-maximized" ],
        viewport: { width: 1920, height: 1200 },
      },
    },
    //
    // {
    //   name: 'webkit',
    //   use: {
    //      ...devices['Desktop Safari'],
    //      baseURL: 'https://qa-assessment.pages.dev/', // <--- SET YOUR ACTUAL BASE URL HERE
    //   },
    // },

    /* Test against mobile viewports (example) */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //      ...devices['Pixel 5'],
    //      baseURL: 'https://qa-assessment.pages.dev/', // <--- SET YOUR ACTUAL BASE URL HERE
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //      ...devices['iPhone 12'],
    //      baseURL: 'https://qa-assessment.pages.dev/', // <--- SET YOUR ACTUAL BASE URL HERE
    //    },
    // },

    /* Test against branded browsers (example) */
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge', // Use installed Edge stable channel
        baseURL: 'https://qa-assessment.pages.dev/', // <--- SET YOUR ACTUAL BASE URL HERE
      },
    },
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // Use installed Chrome stable channel
        baseURL: 'https://qa-assessment.pages.dev/', // <--- SET YOUR ACTUAL BASE URL HERE
      },
    },
  ],

  /* Run your local dev server before starting the tests (uncomment if needed) */
  // webServer: {
  //   command: 'npm run start', // Your command to start the dev server
  //   url: 'http://127.0.0.1:3000', // URL to poll to check if server is up
  //   reuseExistingServer: !process.env.CI, // Reuse server locally, start fresh on CI
  // },
});
