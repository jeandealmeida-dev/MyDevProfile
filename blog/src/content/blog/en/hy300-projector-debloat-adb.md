---
title: "Vibe-coding the HY300 projector: ADB debloat, HDMI on boot, and an AI prompt that does it for you"
description: "How I cleaned up an HY300 projector (Android 11, 1 GB RAM) using only ADB, no root: 53 packages disabled, boot straight into HDMI, and Settings reachable through a 20-line mini-launcher. At the end, a ready-made prompt for your AI assistant to repeat the process."
date: 2026-10-25T12:00:00Z
tags: [android, projector, adb, debloat, hy300, ai]
translationKey: hy300-projector-debloat
---

The HY300 is one of those cheap projectors that are everywhere. Mine runs Android 11 with **938 MB of RAM** and build `UI_Veng.projector.20250221.201033`. I only use two things on it: the **HDMI** input (a Fire Stick is plugged in) and **Settings**, to pair Bluetooth. Everything else — Netflix, YouTube, the app store, Miracast, Google Play Services — was dead weight that left the device slow, with only ~30 MB of free RAM.

This post walks through what I did, in order, including the problems along the way. Everything was done **over ADB, with no root and no firmware flashing**, and it is all reversible. At the end there is a **ready-made prompt** you can paste into an AI assistant with terminal access to repeat the process on your own device.

> I ran this whole session by talking to Claude Code, which executed the `adb` commands for me. That's the "vibe-coded" in the title. The prompt at the end is the condensed version of what we learned.

## Warnings first

- **This is for your own device, and the risk is yours.** Disabling the wrong package can leave the projector without a home screen. That's why step 2 is a backup.
- **Nothing here needs root.** Packages are disabled with `pm disable-user --user 0`, which is reversible with `pm enable`. A factory reset also undoes everything.
- **My case is specific:** I use a Fire Stick on HDMI and never use the projector's own apps. If you use Netflix or YouTube **on the projector itself**, don't disable what I disabled.
- **The ADB port stays open and passwordless on your network** while debugging is on. Close it at the end (step 7).
- The package names below are from **my firmware**. Check your own device's list before copying.

## What you'll need

| Item | Why |
|---|---|
| `adb` on your computer (`brew install android-platform-tools` on a Mac) | Talk to the projector |
| Projector and computer **on the same network** | ADB over Wi-Fi |
| Android SDK build-tools (`aapt2`, `d8`, `apksigner`) and a JDK | Only for the mini-launcher in step 5 |

## Step 1: turn on ADB

On the projector: **Settings > About**, tap *Build* about 7 times to unlock **Developer options**, and turn on **USB debugging** (and **ADB over network** if it shows up).

I hit two problems here:

1. **USB didn't work.** My Mac saw nothing, even with another cable. Many projectors only have a USB-A *host* port (for flash drives) and can't act as a device. Go straight to Wi-Fi.
2. **Different networks.** The projector was on `192.168.1.x` and my Mac on `192.168.15.x` (two routers). `ping` showed 100% loss and `adb connect` timed out. Put both **on the same Wi-Fi**.

After fixing that:

```bash
adb connect 192.168.1.50:5555
```

The first time it says `unauthorized`. Look at the projector's screen, accept the **"Allow USB debugging?"** pop-up and tick "Always allow". If `adb devices` shows `offline` after a reboot, just `adb disconnect IP:5555` and connect again.

Confirm:

```bash
adb shell getprop ro.product.model          # adt3
adb shell getprop ro.build.version.release  # 11
adb shell free -m
```

On mine: `Mem: 938 total, 908 used, 30 free`. No headroom at all.

## Step 2: inventory and backup

Before touching anything:

```bash
mkdir backup
adb shell pm list packages -f   > backup/packages_all.txt
adb shell pm list packages -d   > backup/packages_disabled_before.txt
adb shell getprop               > backup/getprop.txt
adb shell settings list global  > backup/settings_global.txt
adb shell settings list secure  > backup/settings_secure.txt
adb shell settings list system  > backup/settings_system.txt
```

And a restore script that re-enables everything you disable (package lists live in `batchN.txt` files):

```bash
#!/bin/sh
# usage: restore.sh IP:5555
D=${1:-192.168.1.50:5555}
for f in "$(dirname "$0")"/batch*.txt; do
  while read p; do adb -s $D shell pm enable --user 0 "$p" </dev/null; done < "$f"
done
```

> **A gotcha that cost me a round:** `adb shell` **swallows stdin**. Inside `while read p; do adb shell ...; done < file`, the loop dies after the first item. Always add `</dev/null` to `adb shell` inside loops.

## Step 3: debloat

`pm list packages -3` (third-party apps) came back **empty**: all the weight is in system apps. I sorted them into groups:

**Disabled without worry** (factory junk, telemetry, OTA, apps I never open):

- Useless apps: `calculator2`, `egg`, `music`, `musicfx`, `htmlviewer`, `dreams.web`, `dreams.basic`, `soundpicker`
- Printing: `bips`, `printspooler`, `printservice.recommendation`
- Telephony/backup that make no sense on a projector: `cellbroadcast*`, `companiondevicemanager`, `backupconfirm`, `sharedstoragebackup`, `localtransport`, `wallpaperbackup`, `onetimeinitializer`, `dynsystem`
- Factory test: `htc.hyk_test`, `hotack.writesn`, `softwinner.agingdragonbox`, `dragonbox`, `dragonatt`, `awlogsettings`
- Telemetry and updates: `htc.eventuploadservice`, `htc.htcotaupdate`, `softwinner.update`, `android.rockchip.update.service`
- Built-in media: `TvdFileManager`, `TvdVideo`, `htc.storeos`
- Google: `com.google.android.gms`, `gsf`, `com.android.vending` (no Play Store, casting or Google sign-in, which is fine in my case)

**Kept, because HDMI and Settings depend on them:** `systemui`, `tv.settings`, `htc.htcsettings`, `softwinner.awlivetv`, `awsource`, `vis` (the video input service), `awmanager`, `settingsassist`, `settingssetup`, `provision`, `tvvolume`, `theme.*`, `providers.*`, `webview`, `permissioncontroller`, `packageinstaller`, `bluetooth`, the keyboard, and `networkstack*`.

The command is one package at a time:

```bash
while read p; do
  echo -n "$p: "
  adb -s $D shell pm disable-user --user 0 "$p" </dev/null 2>&1 | tail -1
done < backup/batch1.txt
```

Do it in **small batches** and check the projector's screen between them. After the last one, **reboot** and compare `pm list packages -d` with what you disabled, because some firmwares re-enable packages on boot.

Result: **53 packages disabled**, free RAM went from ~30 MB to ~110–165 MB. The device became usable again.

> **Never open "factory", "aging", "production" or "fac menu" packages just to see what they do.** On some boards, opening one flips a flag that turns off CEC and the input button. Use `dumpsys package <name>` to look without running.

## Step 4: the launcher still showed Netflix and YouTube

After disabling all that, the stock launcher (HTC's, `com.htc.htclauncherhighenglishd08`) **still showed Netflix, YouTube and App Store tiles**. None of those apps is installed: the tiles are **hard-coded shortcuts drawn by the launcher**, with no option to remove them. Long-pressing OK on them did nothing.

The launcher is a `/system` app, so editing its APK would need root. The no-root route: **install a different launcher**.

I tried [FLauncher](https://gitlab.com/flauncher/flauncher) (open source, 0.18.0, ships an `armeabi-v7a` build). It worked, but installing was slow: **26 MB over the projector's Wi-Fi took more than 10 minutes** (≈0.04 MB/s). I used `adb push` + `pm install -r` from the shell, which is more reliable than `adb install` on some devices. Then two new problems showed up:

- FLauncher only lists apps with the `LEANBACK_LAUNCHER` category. The HDMI entry (`com.softwinner.awsource`) doesn't have one, **so it disappears**.
- The **down arrow on my remote doesn't work** (more on that in step 6).

In the end, what I really wanted was to **open straight into HDMI on power-up**. That takes a 20-line launcher.

## Step 5: the mini-launcher that opens HDMI on boot

### Finding how to open HDMI

There are two activities:

- `com.softwinner.awsource/.MainActivity` opens a **source selector** (HDMI1, HDMI2, HDMI3, CVBS1, CVBS2) as an overlay.
- `com.softwinner.awlivetv/.MainActivity` is the **screen that shows the picture**.

I called the second one as a **cold start** (after `am force-stop`) and checked the log:

```bash
adb shell am force-stop com.softwinner.awlivetv
adb shell am start -n com.softwinner.awlivetv/.MainActivity
adb logcat -d | grep onTune
# HdmiInputService: SessionImpl onTune: channeluri: content://android.media.tv/passthrough/com.softwinner.vis%2F.HdmiInputService%2FHW1
```

With no extras it tuned **`HW1` (HDMI1)** on its own. If your Fire Stick is on another port, check that log before assuming.

### The Home trick

Without root there is no `init.d` or boot script. And since Android 10, apps can't launch activities "out of nowhere" in the background. **But the app that is the default Home gets started by the system on boot and can open another screen.** So the mini-launcher is a Home that:

- For the first **150 s** after power-up, opens HDMI;
- After that, opens **Settings** (the "Setting" tile is `com.htc.htcsettings/com.htc.activity.HomeActivity` on my firmware).

`AndroidManifest.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.jean.hdmiboot">
    <uses-sdk android:minSdkVersion="26" android:targetSdkVersion="30" />
    <queries>
        <package android:name="com.softwinner.awlivetv" />
        <package android:name="com.htc.htcsettings" />
    </queries>
    <application android:label="HdmiBoot" android:theme="@style/T">
        <activity android:name=".BootActivity" android:exported="true"
            android:excludeFromRecents="true" android:noHistory="true"
            android:launchMode="singleInstance">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.HOME" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

`res/values/s.xml` (transparent theme, no UI at all):

```xml
<resources>
    <style name="T" parent="@android:style/Theme.DeviceDefault.NoActionBar">
        <item name="android:windowIsTranslucent">true</item>
        <item name="android:windowBackground">@android:color/transparent</item>
        <item name="android:windowNoTitle">true</item>
    </style>
</resources>
```

`BootActivity.java`:

```java
package com.jean.hdmiboot;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.os.Bundle;
import android.os.SystemClock;

// Home stub: right after boot opens HDMI input, later Home presses open Settings.
public class BootActivity extends Activity {
    private static final long BOOT_WINDOW_MS = 150_000;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        Intent i = new Intent(Intent.ACTION_MAIN);
        if (SystemClock.elapsedRealtime() < BOOT_WINDOW_MS) {
            i.setComponent(new ComponentName("com.softwinner.awlivetv", "com.softwinner.awlivetv.MainActivity"));
        } else {
            i.setComponent(new ComponentName("com.htc.htcsettings", "com.htc.activity.HomeActivity"));
        }
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        try {
            startActivity(i);
        } catch (Exception e) {
            // target missing: fall back to whatever Home the system offers
        }
        finish();
    }
}
```

### Build, sign and install (no Gradle)

```bash
BT=~/Library/Android/sdk/build-tools/35.0.0
AJ=~/Library/Android/sdk/platforms/android-34/android.jar
mkdir -p out cls
$BT/aapt2 compile --dir res -o out/res.zip
$BT/aapt2 link -o base.apk -I $AJ --manifest AndroidManifest.xml out/res.zip
javac -source 8 -target 8 -cp $AJ -d cls src/com/jean/hdmiboot/BootActivity.java
$BT/d8 --min-api 26 --lib $AJ --output out cls/com/jean/hdmiboot/*.class
cp base.apk unsigned.apk && (cd out && zip -q -j ../unsigned.apk classes.dex)
$BT/zipalign -f 4 unsigned.apk aligned.apk
keytool -genkeypair -keystore ks.jks -storepass password -keypass password -alias k \
  -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=hdmiboot"
$BT/apksigner sign --ks ks.jks --ks-pass pass:password --out hdmiboot.apk aligned.apk

adb push hdmiboot.apk /data/local/tmp/
adb shell pm install -r /data/local/tmp/hdmiboot.apk
adb shell cmd package set-home-activity com.jean.hdmiboot/.BootActivity
```

The APK is ~12 KB. **Test before taking the old launcher out of the picture:** press Home and confirm with

```bash
adb shell dumpsys window | grep mCurrentFocus
adb shell cmd package resolve-activity --brief -c android.intent.category.HOME -a android.intent.action.MAIN | tail -1
```

Then I rebooted the projector: right after boot, `mCurrentFocus` was already `awlivetv` and the log showed `onTune` on `HW1`. It now powers up straight into the Fire Stick. Only then did I disable the HTC launcher and Miracast.

## Step 6: the remote

My remote **had a dead down arrow**. To understand it, I listened to the IR receiver:

```bash
adb shell "timeout 60 getevent -lt /dev/input/event6"
```

(This Android's `getevent` only accepts **one** device at a time. Passing two prints a usage error and records nothing.)

The remote sends **Linux key codes that look like letters**, and the device's layout (`/vendor/usr/keylayout/sunxi-ir-uinput.kl`) translates them:

| Linux (what arrives) | Android |
|---|---|
| `KEY_R` (19) | ↑ |
| `KEY_T` (20) | **↓** |
| `KEY_Y` (21) | ← |
| `KEY_U` (22) | → |
| `KEY_I` (23) | OK |

In my captures `R`, `U` and `I` showed up, **but `T` never did**: the ↓ button simply wasn't being sent. In other attempts the receiver caught almost nothing, which points to **weak batteries or a badly aimed remote**. Before any remapping, **swap the batteries and aim at the front of the unit**.

If the button really is dead, the no-root fix would be an accessibility service that turns another key into ↓, since `/vendor` is read-only. I never got that far: with the mini-launcher, Home opens Settings directly, and Bluetooth is reachable from there.

## Step 7: close ADB

When you're done:

1. Settings > Developer options: turn off **USB debugging** and **ADB over network**.
2. **Revoke** the USB debugging authorizations and reboot.
3. Confirm from the computer that the port refuses the connection: `nc -vz IP 5555`. On macOS only **"Connection refused"** proves it's closed. "No route to host" proves nothing.

## What changed in the end

| | Before | After |
|---|---|---|
| Free RAM | ~30 MB | ~110–165 MB |
| System packages disabled | 2 | 55 (53 by me) |
| On power-up | Launcher with Netflix/YouTube | Straight to HDMI1 |
| Home | Launcher full of shortcuts | Settings (Bluetooth) |
| Temperature | 78–79 °C on the CPU at 1 min uptime | same |

The temperature **didn't change**, and that's expected. The CPU was ~65% **idle** the whole time, because HDMI passthrough goes almost entirely through dedicated hardware. The heat comes from the lamp/LED, the video chip and the fan. What really helps: **cleaning the air intake and exhaust**, using the **Eco** brightness mode and leaving room around the unit. Without root you can't cap the CPU frequency.

## The AI prompt

This prompt is the condensed version of what I learned, written for an AI with terminal access (Claude Code, for example). It was inspired by the excellent [cleanyourtv](https://github.com/Gathin23/cleanyourtv) guide, where I took the safety rules of "what never to disable" and "do it in small batches", and adapted to the HY300.

```text
I want to debloat my HY300 projector (Android 11, ~1 GB RAM, Allwinner/"softwinner")
and make it boot straight into HDMI. I only use the projector as a display for an external
streamer on HDMI (model: <MODEL / HDMI PORT HERE>), plus Settings to pair Bluetooth.
Work on the real device over ADB, step by step, and verify each thing with a screenshot
(adb shell screencap -p) or dumpsys. Ask me before any decision that depends on my preferences.

Connect
- If the projector is on a different subnet than the computer, stop and tell me: they must be on the SAME network.
- Connect with `adb connect IP:5555`. If adb shows `offline`, disconnect and connect again.
  Tell me when the "Allow USB debugging?" pop-up will appear so I can accept it.
- USB usually doesn't work on this model (host-only port). Use Wi-Fi.

Backup (before changing anything)
- Save: pm list packages -f, pm list packages -d, getprop, settings list global/secure/system.
- Write a restore.sh that re-enables (pm enable --user 0) everything you disable, with the packages
  in batchN.txt files.

Debloat
- List packages (`pm list packages -s -e`; `-3` is usually empty) and classify them as:
  telemetry/OTA, factory/test apps (dragonbox, aging, hyk_test, writesn), built-in media/files,
  printing, useless telephony/backup, Google (gms, gsf, vending), and what HDMI/Settings need.
- Use `pm disable-user --user 0` (never uninstall), ONE package per call, in small batches,
  checking the screen between batches. In shell loops use `</dev/null` on adb shell
  (it swallows stdin and the loop dies after the first item).
- NEVER disable: systemui, tv.settings, the vendor Settings package, awlivetv, awsource,
  vis (HdmiInputService), awmanager, settingsassist, settingssetup, provision, tvvolume, theme.*,
  providers.*, webview, permissioncontroller, packageinstaller, bluetooth, the keyboard, networkstack*,
  ext.services/ext.shared, modulemetadata.
- Before disabling Google (gms/gsf/vending), ask me whether I use Play Store/cast on the projector.
- Do NOT open "factory/aging/production/fac menu" packages to see what they do; use dumpsys package.
- At the end, reboot and compare `pm list packages -d` with what you disabled.

Launcher
- Check whether the stock launcher has hard-coded shortcuts (Netflix/YouTube) with no package installed.
  If so, they can't be removed without root: build a mini-launcher.
- Find how to open HDMI: com.softwinner.awsource/.MainActivity is a source SELECTOR;
  com.softwinner.awlivetv/.MainActivity shows the picture. Do `am force-stop` + `am start` on awlivetv
  (cold start) and confirm in logcat (`onTune ... passthrough ... HW1`) which HDMI port it tunes.
  If it isn't my streamer's port, find another way and ask me.
- Build a minimal Android app (no Gradle: aapt2 + javac + d8 + zipalign + apksigner from build-tools)
  whose only activity is HOME/DEFAULT with a transparent theme. In the first 150 s after boot
  (SystemClock.elapsedRealtime() < 150_000) it opens awlivetv; after that it opens the vendor
  Settings app. In both cases it calls finish(). Declare <queries> for both packages.
- Send it with adb push to /data/local/tmp and install with `pm install -r` (not `adb install`),
  set it with `cmd package set-home-activity` and CONFIRM with `dumpsys window | grep mCurrentFocus`
  and `cmd package resolve-activity --brief -c android.intent.category.HOME` before disabling the old launcher.
- Pushing over the projector's Wi-Fi is very slow (~0.04 MB/s): warn me and run it in the background
  if the APK is big. Prefer small APKs.
- Test by rebooting: right at boot the focus must be awlivetv and the log must show onTune.

Remote control
- If an arrow key doesn't work, capture with `adb shell "timeout 60 getevent -lt /dev/input/eventN"`
  ONE device at a time, and compare with /vendor/usr/keylayout/*.kl. Before remapping, suggest swapping the batteries.
- Without root /vendor can't be edited. The only option is an accessibility service with
  canRequestFilterKeyEvents; only do it if I ask.

Performance
- Measure before and after: free -m, top, /sys/class/thermal/thermal_zone*/temp. Be honest: if the CPU
  is idle, the heat is hardware (lamp/ventilation), not software.

At the end
- Give me: restore.sh, the mini-launcher source, and a README on how to revert.
- Close ADB: turn off USB debugging and ADB over network, revoke authorizations, reboot,
  and confirm with `nc -vz IP 5555` that the answer is "Connection refused" (on macOS, "No route to host"
  proves nothing).
```

If it works on your device (or fails in an interesting way), send me a message. This model is popular, and the more firmware variants we document, the better.
