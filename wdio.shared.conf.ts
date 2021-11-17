import {SauceRegions} from '@wdio/types/build/Options';

/**
 * More information about the WDIO config file can be found here:
 * https://webdriver.io/docs/configurationfile
 */
export const config: WebdriverIO.Config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  //
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  region: (process.env.REGION || 'us') as SauceRegions,
  //
  // ==================
  // Specify Test Files
  // ==================
  //
  specs: [
    './test/specs/**/*.ts'
  ],
  //
  // ============
  // Capabilities
  // ============
  //
  maxInstances: 10,
  //
  capabilities: [],
  //
  // ===================
  // Test Configurations
  // ===================
  logLevel: 'silent',
  //
  bail: 0,
  //
  baseUrl: 'http://localhost',
  //
  waitforTimeout: 15000,
  //
  // Instrumentation can take some time,
  // we also need to be aware of a possible cleaning state of a device in
  // the Sauce Labs Real Device Cloud, so we put this on a max of 5 minutes
  connectionRetryTimeout: 300000,
  //
  connectionRetryCount: 1,
  //
  framework: 'mocha',
  //
  reporters: ['spec'],
  //
  mochaOpts: {
    ui: 'bdd',
    // Some tests can take some more time
    timeout: 180000
  },
  // This service will:
  // - automatically set the job name
  // - automatically set the status of the job
  // - automatically connect to Sauce Labs
  services: ['sauce'],
}
