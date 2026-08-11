// @ts-check
const { devices } = require('@playwright/test');


const config = ({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  retries: 0,

  /* Maximum time one test can run for. */
  timeout: 30 *1000,

  expect : {

    timeout: 5000,

  },
  reporter : 'html',

  use: {
    browserName : 'chromium',
    headlesss : true,
    screenshot : 'on',
    trace : 'on',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
  },


});
module.exports = config
