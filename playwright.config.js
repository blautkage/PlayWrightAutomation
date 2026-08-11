// @ts-check
const { devices } = require('@playwright/test');


const config = ({
  testDir: './tests',
  timeout: 30 *1000,
  expect : {

    timeout: 5000,

  },
  reporter : 'html',

  use: {
    browserName : 'chromium',
    headlesss : false,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },


});
module.exports = config
