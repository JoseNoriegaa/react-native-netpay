// External dependencies
import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ReactNativeNetPay from 'react-native-netpay';

type PromiseValue<T> = T extends Promise<infer A> ? A : never;
type NetPayResponse = PromiseValue<
  ReturnType<typeof ReactNativeNetPay.openCheckout>
>;

export default function App() {
  const [result, setResult] = React.useState<NetPayResponse | null>(null);

  React.useEffect(() => {
    ReactNativeNetPay.init('YOUR PUBLIC KEY', {
      testMode: true,
    });
  }, []);

  const checkout = async () => {
    try {
      const response = await ReactNativeNetPay.openCheckout(false);

      setResult(response);
    } catch (e) {
      console.log({ e });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={checkout}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Open NetPay Checkout</Text>
        </View>
      </TouchableOpacity>

      {Boolean(result) && (
        <View style={styles.resultContainer}>
          <Text style={styles.result}>{JSON.stringify(result, null, 2)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181420',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#1462EE',
    minHeight: 46,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
  },
  resultContainer: {
    padding: 20,
    borderRadius: 10,
    margin: 20,
    backgroundColor: '#282135',
  },
  result: {
    color: '#DA51AF',
  },
});
