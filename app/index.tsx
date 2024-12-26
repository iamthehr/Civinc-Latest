import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

export default function Index() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Location permission denied");
          return;
        }
      }
    };

    requestLocationPermission();

    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true; // prevent default back behavior
      }
      ToastAndroid.show("No more pages to go back to", ToastAndroid.SHORT);
      return true; // prevent closing the app
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // cleanup on component unmount
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: "https://ne-wcivic.vercel.app/" }}
        style={styles.webView}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});
