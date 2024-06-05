---
sidebar_position: 1
---

# Installation and Setups
Installation setups
- **Requirements**
    - [Node.js](https://nodejs.org/en/download/) version 18.0 or above:
        - You can use <code>nvm</code> to manage your Node version.
    - **Using npm:**
      ```bash
        npm install 
      ```
    - **Using yarn/expo:**
      ``` bash
      yarn upgrade 
      or
      npx expo install
      ```
    - **local env files**

      `.env*.local `
- **Installation Guide**

  - **iOS**
    - **Install Pods**

      moove to the <code>ios</code> directory
      ```bash
      cd ios
      ```
      run this command
      ```bash
      pod install 
      ```
    - **Using npm:**
      ```bash
      npm run ios
      ```
    - **Using expo:**
      ```bash
      npx expo run:ios
      ```
  - **Android**

    - **Using npm:**
      ```bash
      npm run android
      ```
    - **Using expo:**
      ```bash
      npx expo run:android
      ```
- **Recommanded editor** 
  - Vs Code 