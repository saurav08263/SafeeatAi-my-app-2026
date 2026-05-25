# SafeEat AI - Keystore & Signing Configuration

## ⚠️ KEEP THESE FILES SECURE — DO NOT COMMIT TO PUBLIC REPOS

### Release Keystore
- **File**: `app/safeeat-release.jks`
- **Alias**: `safeeat`
- **Store Password**: `safeeat2024`
- **Key Password**: `safeeat2024`
- **Validity**: 10,000 days (until Oct 10, 2053)
- **SHA-256**: `69:50:54:42:F6:A0:03:E1:35:9D:24:F2:00:B5:CC:99:00:50:0F:D8:AE:BD:87:18:D9:B9:FE:51:F8:C6:E9:05`
- **SHA-1**: `82:CC:57:D7:C9:09:93:3F:64:C6:5D:51:CA:60:FC:98:2C:F3:F2:63`

### Debug Keystore
- **File**: `app/safeeat-debug.keystore`
- **Alias**: `androiddebugkey`
- **Store Password**: `android`
- **Key Password**: `android`
- **SHA-256**: `11:2C:88:0B:2B:19:67:96:46:98:1D:99:D6:C2:94:E6:3C:2E:00:EC:74:F9:7C:B3:AF:6A:AE:33:FC:84:F0:A8`

## Using with Firebase
1. Go to Firebase Console → Project Settings → Your Apps
2. Add the **Release SHA-256** fingerprint: `69:50:54:42:F6:A0:03:E1:35:9D:24:F2:00:B5:CC:99:00:50:0F:D8:AE:BD:87:18:D9:B9:FE:51:F8:C6:E9:05`
3. Also add the **Debug SHA-256** for development: `11:2C:88:0B:2B:19:67:96:46:98:1D:99:D6:C2:94:E6:3C:2E:00:EC:74:F9:7C:B3:AF:6A:AE:33:FC:84:F0:A8`
4. Download the updated `google-services.json`
5. Place it in `android/app/google-services.json`

## Play Store Signing
- For Play Store production, Google will **re-sign** your AAB with their own key
- You can use App Signing by Google Play (recommended)
- Upload the `app-release.aab` to Play Console
- Google provides a separate SHA-256 for their signing key

## Build Commands
```bash
# Debug APK
bun run android:debug

# Release APK (signed)
bun run android:build

# AAB Bundle (for Play Store upload)
bun run android:bundle

# View signing report with SHA-256
bun run android:signingReport

# Get just the SHA-256
bun run android:sha256
```
