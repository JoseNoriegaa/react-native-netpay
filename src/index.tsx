// External dependencies
import { NativeModules, Platform } from 'react-native';

// Types & Interfaces
interface NetPayNativeModule {
  init: (apiKey: string, testMode: boolean) => void;
  openCheckout: (showAsAlert: boolean) => Promise<{
    token: string;
    lastFour: string;
    brand: string;
  }>;
}

interface InitOptions {
  /** Enables Sandbox Mode. By default it's enabled. */
  testMode?: boolean;
}

// Constants
const LINKING_ERROR =
  `The package 'react-native-netpay' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const NetPay: NetPayNativeModule = NativeModules.ReactNativeNetPay
  ? NativeModules.ReactNativeNetPay
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

// Lib handlers
/**
 * Initializes the NetPay module.
 * @param apiKey Your NetPay public key.
 * @param options Options
 */
function init(apiKey: string, options: InitOptions = { testMode: true }): void {
  NetPay.init(apiKey, Boolean(options.testMode));
}

/**
 * Opens the card form
 */
async function openCheckout(showAsAlert: boolean = false) {
  if (Platform.OS !== 'android') {
    throw new Error('Platform not supported');
  }

  return await NetPay.openCheckout(showAsAlert);
}

const ReactNativeNetPay = Object.freeze({
  init,
  openCheckout,
});

export { init, openCheckout };
export default ReactNativeNetPay;
