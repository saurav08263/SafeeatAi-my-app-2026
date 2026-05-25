# SafeEat AI - ProGuard Rules

# Preserve line numbers for debugging stack traces
-keepattributes SourceFile,LineNumberTable

# Hide original source file name
-renamesourcefileattribute SourceFile

# WebView with JS interface (Capacitor bridge)
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Capacitor core
-keep class com.getcapacitor.** { *; }
-keep class capacitor.** { *; }
-keep class com.safeeat.ai.** { *; }

# Keep JavaScript interface classes
-keepclassmembers class * extends com.getcapacitor.Plugin {
    @com.getcapacitor.annotation.CapacitorPlugin <methods>;
}

# Prevent stripping Capacitor plugin annotations
-keepattributes *Annotation*

# OkHttp (used by Capacitor)
-dontwarn okhttp3.**
-dontwarn okio.**

# AndroidX
-dontwarn androidx.**
