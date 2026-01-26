# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# ===== React Native =====
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip
-keep,allowobfuscation @interface com.facebook.jni.annotations.DoNotStrip

-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *
-keep @com.facebook.jni.annotations.DoNotStrip class *

-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
    @com.facebook.jni.annotations.DoNotStrip *;
}

-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}

-keep class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * extends com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers,includedescriptorclasses class * { native <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactProp <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>; }

-dontwarn com.facebook.react.**
-keep,includedescriptorclasses class com.facebook.react.bridge.** { *; }
-keep,includedescriptorclasses class com.facebook.react.turbomodule.core.** { *; }

# Hermes
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.hermes.intl.** { *; }

# ===== React Native New Architecture (Fabric/Bridgeless) =====
-keep class com.facebook.react.fabric.** { *; }
-keep class com.facebook.react.runtime.** { *; }
-keep interface com.facebook.react.runtime.** { *; }
# NOT: devsupport kuralları KALDIRILDI - release'de native lib yok, Java kodu da olmamalı
# -keep class com.facebook.react.devsupport.** { *; }  # KALDIRILDI - CXX crash'e sebep olur!
# -keep interface com.facebook.react.devsupport.** { *; }  # KALDIRILDI
-keep class com.facebook.react.uimanager.** { *; }
-keep class com.facebook.react.modules.** { *; }
-keep class com.facebook.react.common.** { *; }
-keep class com.facebook.react.internal.** { *; }
-keep,includedescriptorclasses class com.facebook.react.codegen.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep interface com.facebook.react.turbomodule.** { *; }
# DevSupport uyarılarını sustur (kod silinecek ama uyarı vermesin)
-dontwarn com.facebook.react.devsupport.**
-dontwarn com.facebook.react.runtime.**
-dontwarn com.facebook.react.internal.**

# NativeModule extensions
-keep class * extends com.facebook.react.bridge.ReactContextBaseJavaModule { *; }
-keep class * extends com.facebook.react.bridge.BaseJavaModule { *; }

# SoLoader
-keep class com.facebook.soloader.** { *; }
-dontwarn com.facebook.soloader.**


# ===== OkHttp =====
-keepattributes Signature
-keepattributes *Annotation*
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**

# ===== Firebase & Google Play Services =====
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
-keep class com.google.firebase.messaging.** { *; }
-keep class com.google.firebase.crashlytics.** { *; }
-keep class com.google.firebase.analytics.** { *; }
-keep class com.google.firebase.installations.** { *; }
-keep class com.google.firebase.sessions.** { *; }
-keep class com.google.firebase.iid.** { *; }
-keep class com.google.android.gms.common.** { *; }
-keep class com.google.android.gms.tasks.** { *; }
-keep class com.google.android.gms.auth.** { *; }
-keep class androidx.credentials.** { *; }
-keep class com.google.android.libraries.identity.googleid.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# ===== Kotlin =====
-keep class kotlin.Metadata { *; }
-keep class kotlin.reflect.** { *; }
-keep class kotlin.coroutines.** { *; }
-dontwarn kotlin.**
-keepclassmembers class **$WhenMappings {
    <fields>;
}
-keepclassmembers class kotlin.Metadata {
    public <methods>;
}
-assumenosideeffects class kotlin.jvm.internal.Intrinsics {
    static void checkNotNull(java.lang.Object);
    static void checkNotNull(java.lang.Object, java.lang.String);
    static void checkParameterIsNotNull(java.lang.Object, java.lang.String);
}

# ===== AndroidX (Specific rules only) =====
# Core AndroidX
-keep class androidx.lifecycle.** { *; }
-keep class androidx.savedstate.** { *; }
-keep class androidx.activity.** { *; }
-keep class androidx.fragment.** { *; }

# Credentials API (for Google Sign-In)
-keep class androidx.credentials.** { *; }

# AndroidX annotations
-dontwarn androidx.annotation.**
-dontwarn androidx.appcompat.**
-dontwarn androidx.core.**

# ===== React Native Vector Icons =====
-keep class com.oblador.vectoricons.** { *; }

# ===== React Native Apple Authentication =====
-keep class com.invertase.react.apple.** { *; }

# ===== React Native IAP (In-App Purchase) =====
-keep class com.dooboolab.rniap.** { *; }
-keep class com.android.billingclient.api.** { *; }

# ===== React Native Sound =====
-keep class com.zmxv.RNSound.** { *; }

# ===== React Native Reanimated =====
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# ===== React Native Gesture Handler =====
-keep class com.swmansion.gesturehandler.** { *; }

# ===== React Native Screens =====
-keep class com.swmansion.rnscreens.** { *; }

# ===== React Native SVG =====
-keep class com.horcrux.svg.** { *; }

# ===== React Native Device Info =====
-keep class com.learnium.RNDeviceInfo.** { *; }

# ===== React Native Linear Gradient =====
-keep class com.BV.LinearGradient.** { *; }

# ===== React Native Safe Area Context =====
-keep class com.th3rdwave.safeareacontext.** { *; }

# ===== React Native In-App Review =====
-keep class com.google.android.play.core.review.** { *; }

# ===== General =====
-keepattributes Exceptions,InnerClasses,Signature,Deprecated,SourceFile,LineNumberTable,*Annotation*,EnclosingMethod

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

# Keep enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Parcelables
-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}

# Keep Serializable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}


# Keep BuildConfig
-keep class **.BuildConfig { *; }

# Keep R classes
-keepclassmembers class **.R$* {
    public static <fields>;
}

