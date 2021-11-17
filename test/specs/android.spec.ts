import {join} from 'path';
import {readFileSync} from 'fs';

/**
 * NOTE:
 * 1. This example script doesn't hold any best practices, it's there
 *    to show you how to use image-injection and biometrics with Sauce Labs
 * 2. WebdriverIO gives you the option to select elements based on their
 *    `accessibilityID`, the shortcut to select elements with this is
 *    by using the `~`, meaning we can find elements like this
 *    `await $('~Scan a registered Device-screen').waitForDisplayed();`
 */

describe('My Banking app For Android', () => {
  it('should be able to register and use BioMetrics', async () => {
    //
    // Wait for the Sing Up screen appears and select
    // Register existing phone
    await signUpWithRegisteredDevice();

    /**
     * This is where the Scanning magic happens
     */
    //
    // Wait for the scan a registered Device Screen and submit the QR-code
    await $('~Scan a registered Device-screen').waitForDisplayed();
    //
    // The image needs to be provided as a base64 string
    const qrCodeImage = readFileSync(
      join(process.cwd(), 'assets/scan-registered-device.png'),
      'base64',
    );
    //
    // This is the command to send the image to the device as a base64 string
    await driver.execute(`sauce:inject-image=${qrCodeImage}`);
    /**
     * End of the Scanning magic
     */

    //
    // After the image we expect that we need to confirm the account data
    // and go to the next screen
    await confirmRegisteredData();
    //
    // Now wait for the passcode confirm screen and submit the current passcode
    await confirmPasscode('17539');
    //
    // Now wait for the you did it screen and proceed
    await successfulRegistration();
    //
    // Now wait for the sign in screen and submit the passcode
    // and wait for the next screen
    await signIn('17539');
    //
    // Go to the settings > biometrics and enable it
    await enableBiometrics();
    //
    // Go back and sign out
    await driver.back();
    await signOut();

    /**
     * This is where the biometrics magic happens
     */
    //
    // Now wait for the biometrics modal for Android to be shown
    // Android can have fingerprint or FaceID, so use that in the selector
    const androidBiometricsModalSelector =
        '//android.widget.TextView[contains(@text,"Sign in with FingerPrint") or contains(@text,"Sign in with FaceID")]';
    await $(androidBiometricsModalSelector).waitForDisplayed();
    // Now submit a successful biometrics
    await driver.execute('sauce:biometrics-authenticate=true');
    /**
     * End of Biometrics magic
     */

    //
    // Now wait till you're signed in, no assertion is needed because if the screen
    // is not displayed it will fail
    await $('~Account Overview-screen').waitForDisplayed();
  });
});

/**
 * Sign up with a registered device
 */
async function signUpWithRegisteredDevice() {
  await $('~Sign Up-screen').waitForDisplayed();
  await $('~Yes-button').click();
}

/**
 * Confirm the registered data
 */
async function confirmRegisteredData() {
  await $('~Scan Device Data-screen').waitForDisplayed();
  await expect($('~accountNumber-text')).toHaveTextContaining('12494980148173100');
  await expect($('~cardNumber-text')).toHaveTextContaining('576');
  await expect($('~username-text')).toHaveTextContaining('Mr. Sauce Bot');
  await $('~Yes-button').click();
}

/**
 * Confirm with the passcode
 */
async function confirmPasscode(passcode: string) {
  await $('~Confirm Passcode-screen').waitForDisplayed();
  await submitPasscode(passcode);
}

/**
 * Verify a successful registration
 */
async function successfulRegistration() {
  await $('~Successful Registration-screen').waitForDisplayed();
  await $('~Sign In-button').click();
}

/**
 * Sign in and wait for the next screen
 */
async function signIn(passcode: string) {
  await $('~Sign In-screen').waitForDisplayed();
  await submitPasscode(passcode);
  await $('~Account Overview-screen').waitForDisplayed();
}

/**
 * Enable biometrics in Settings
 */
async function enableBiometrics() {
  // Go to settings
  await $('//*[@resource-id="settings-tab"]').click();
  await $('~Settings Screen-screen').waitForDisplayed();
  // Open biometrics
  await $('~biometrics-menu-item').click();
  // Wait for the biometrics screen and enable it
  await $('~Biometrics-screen').waitForDisplayed();
  await $('~biometrics-switch').click();
}

/**
 * Sign out
 */
async function signOut() {
  const androidSelector = (text: string) => `//android.widget.Button[contains(@text,'${text}')]`;
  await $('~Settings Screen-screen').waitForDisplayed();
  await $('~Sign Out-menu-item').click();
  await $(androidSelector('SIGN OUT')).waitForDisplayed();
  await $(androidSelector('SIGN OUT')).click();
  // Wait for animation to be done
  await driver.pause(750);
}

/**
 * Submit the passcode
 */
async function submitPasscode(passcode: string) {
  for (let i = 0; i < passcode.length; i++) {
    const selector = `~${passcode.charAt(i)}-key`;
    await $(selector).click();
  }
}
