import {config} from './wdio.shared.conf';

// ============
// Specs
// ============
config.specs = [
  'test/specs/android.spec.ts',
];

config.capabilities = [
  {
    /**
     * 1. The default capabilities we need to use
     */
    // For more information about the supported Sauce Labs capabilities see:
    // https://wiki.saucelabs.com/display/DOCS/Appium+Capabilities+for+Real+Device+Testing
    platformName: 'Android',
    //
    // We're using dynamic device allocation, which means it will give us the first
    // available device that matches the criteria we provide, in this case a regular expression
    // See https://docs.saucelabs.com/mobile-apps/automated-testing/appium/real-devices/#dynamic-device-allocation
    deviceName: 'Samsung Galaxy S[8912].*',
    //
    // We need to provide the `automationName`
    // for Appium so it will know which driver it needs to use
    automationName: 'UiAutomator2',
    //
    // The path to the app that has been uploaded to the Sauce Storage,
    // see https://wiki.saucelabs.com/display/DOCS/Application+Storage for more information
    app: 'storage:filename=MyBankingApp.apk',
    //
    // For this app we need to tell Appium to wait for this specific activity
    // before Appium can start it's first test command
    appWaitActivity: 'com.mybankingapp.MainActivity',
    //
    // Always default the language to a language you prefer so you know the app language is always as expected
    language: 'en',
    locale: 'en',

    /**
     * 2. Sauce Specific options
     */
    //
    // Only use phones
    // @ts-ignore
    phoneOnly: true,

    /**
     * 3. The Sauce Labs magic for using biometrics and image injection
     */
    //
    // This is needed to tell Sauce Labs that the biometrics need to be mocked, see also
    // https://docs.saucelabs.com/mobile-apps/features/biometric-authentication/#automated-testing
    // @ts-ignore
    allowTouchIdEnroll: true,
    //
    // Enable image-injection on Real Devices, see also
    // https://docs.saucelabs.com/mobile-apps/features/camera-image-injection/#automated-testing
    sauceLabsImageInjectionEnabled: true,
    //
    // This will make your scripting life a bit easier. This will automatically allow the camera and biometrics
    // permissions
    autoGrantPermissions: true,
  },
];

exports.config = config;
