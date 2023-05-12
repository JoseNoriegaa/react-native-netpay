# react-native-netpay

A React Native Wrapper for NetPay SDK.

> Note: This library only supports Android for now.

## Installation

```sh
npm install react-native-netpay
```

## Usage

```js
import ReactNativeNetPay from 'react-native-netpay';

// ...

ReactNativeNetPay.init('<YOUR PUBLIC KEY>', { testMode: true });

// ...

try {
  const response = await ReactNativeNetPay.openCheckout(false);
  /*
  response = {
    brand: string;
    lastFour: string;
    token: string;
  }
  */
} catch (e) {
  // 
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
