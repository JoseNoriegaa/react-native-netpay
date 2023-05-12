package com.josenoriegaa.netpay;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import mx.com.netpay.netpaysdk.Constants;
import mx.com.netpay.netpaysdk.NetpaySDK;
import mx.com.netpay.netpaysdk.NetpaySDKBuilder;

@ReactModule(name = NetpayModule.NAME)
public class NetpayModule extends ReactContextBaseJavaModule {
  public static final String NAME = "ReactNativeNetPay";

  final NetpaySDK sdk = NetpaySDKBuilder.getNetpaySDK();


  // NetPay Public Key
  private String apiKey;
  private boolean testMode;

  private Promise mPromise;
  private ReactApplicationContext context;
  private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, @Nullable Intent data) {
      super.onActivityResult(activity, requestCode, resultCode, data);

      if (requestCode == Constants.TOKEN_REQUEST) {
        if (resultCode == Activity.RESULT_OK) {
          String token = data.getStringExtra(Constants.RESPONSE_TOKEN);
          String lastFour = data.getStringExtra(Constants.RESPONSE_LAST_FOUR);
          String brand = data.getStringExtra(Constants.RESPONSE_BRAND);

          WritableMap result = Arguments.createMap();
          result.putString("token", token);
          result.putString("lastFour", token);
          result.putString("brand", brand);

          mPromise.resolve(result);
        } else if (resultCode == Activity.RESULT_CANCELED) {
          String errorMessage = data.getStringExtra(Constants.RESPONSE_ERROR);

          mPromise.reject("NET_PAY_MODULE", errorMessage);
        }
      }

      mPromise = null;
    }
  };

  public NetpayModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.testMode = true;
    this.context = reactContext;

    // Add the listener for `onActivityResult`
    this.context.addActivityEventListener(mActivityEventListener);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void init(String apiKey, boolean testMode) {
    this.apiKey = apiKey;
    this.testMode = testMode;
  }

  @ReactMethod
  public void openCheckout(boolean showAsAlert, Promise mPromise) {
    this.mPromise = mPromise;
    this.sdk.launchCreditCardForm(this.context.getCurrentActivity(), this.apiKey, this.testMode, showAsAlert);
  }
}
