### Step 0

Run es login

Run npx expo prebuild

### First build

Run build first time
npx expo run:android -d
npx expo:ios for ios

### Result

After connected with device, there is one app (Development Build) created
Click on app name to open debug

### Reload

Later
npx expo start --dev-client

- Connect phone with computer via USB
- press R to reload app
- OPen TranchyUserApp laucher

### Trouble shooting

Error: yarnpkg install exited with non-zero code: 1
at ChildProcess.completionListener (/Users/taudang/Source/Repo/tranchy-platform/src/Mobile/TranchyUserApp/node_modules/@expo/package-manager/node_modules/@expo/spawn-async/build/spawnAsync.js:42:23)
Solution:
delete node_module, android, ios
Run yarn
