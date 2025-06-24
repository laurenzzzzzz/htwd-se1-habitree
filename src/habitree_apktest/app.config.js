export default {
  expo: {
    name: "Habit Tracker",
    slug: "habit-tracker",
    scheme: "habittracker",
    version: "1.0.0",
    orientation: "portrait",
    platforms: ["ios", "android", "web"],
    icon: "assets/images/icon.png",
    splash: {
      image: "assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    plugins: [
      "expo-web-browser",
      "expo-router",
      [
        "react-native-firebase",
        {
          config: {
            googleServicesFile: "./android/app/google-services.json"
          }
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "818b9e1e-fbdd-4061-aea6-330289c963a0"
      }
    },
    owner: "alex.chl"
  }
};
