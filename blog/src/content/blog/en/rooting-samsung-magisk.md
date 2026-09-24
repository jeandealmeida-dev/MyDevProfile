---
title: "Rooting a Samsung with Magisk in 2026: the guide I wish I'd found"
description: "Complete walkthrough for bootloader unlock and Magisk root on Samsung devices, including two rarely-documented issues: the 'KG Prenormal' lock and ramdisk=false devices."
date: 2026-09-23T18:00:00Z
tags: [android, samsung, root, magisk]
translationKey: root-samsung-magisk
---

This tutorial came out of a multi-hour session trying to root two different Samsung phones (a Galaxy A04s and a Galaxy A10). Along the way I hit two problems that barely have any good documentation — and one of them doesn't even have a known fix yet. This guide covers the standard process **and** those two specific problems, with the exact diagnostic steps I used to identify each one.

If you just want the basic walkthrough, jump to [Part 1](#part-1-the-standard-process). If you already did everything right and got stuck, skip to [Part 2](#part-2-when-the-standard-process-doesnt-work).

## Before you start: important warnings

- **This wipes all data on the device.** Back everything up first.
- **Knox gets permanently tripped** (`warranty_bit` flips to `1`). This can break Samsung Pay, Samsung Health, and Secure Folder for good, even if you undo the root later.
- **You lose your warranty** and take on the risk of something going wrong (soft-bricks are common and recoverable; hard-bricks are rare but real).
- **Don't install OTA updates after rooting.** They overwrite the boot partition and break root, sometimes badly.
- Not every model/firmware combo can actually be rooted. That's annoying to find out, but it's the reality — see Part 3.

## What you'll need

| Item | Where to get it | Why |
|---|---|---|
| Samsung USB driver | developer.samsung.com (official) | So Windows recognizes the device |
| ADB / Platform Tools | dl.google.com (official, via Android SDK) | Read device info, push files |
| Firmware for your exact model | samfw.com or samfrew.com | The AP file contains the `boot.img` you'll patch |
| Magisk (APK) | github.com/topjohnwu/Magisk (official releases) | Does the patching and manages root |
| Odin | **No fully official source exists.** See the warning below | Flashes the files to the device |

### About Odin: a serious warning

Samsung has never officially distributed Odin. Every copy floating around online comes from a third party, and there are consistent reports of tampered builds (a network-communication DLL that shouldn't be there, file sizes matching known "hacked" builds). I personally used a copy from an unverifiable source in this session, with no better alternative available — and it **genuinely hung** twice, for no apparent reason, requiring a forced close.

Practical recommendations:
- Download from an established community post (XDA, SamMobile), not random SEO sites.
- Run with your PC **disconnected from the internet** while using Odin — that way, if the suspicious network DLL tries to phone home, there's nowhere for it to go.
- If Odin hangs on "File analysis" for a long time (more than ~10-15 minutes) with low, flat memory usage (not growing), that's a sign of a loop, not slow processing. Force-close it and retry — sometimes two instances open at once fight over the USB port and cause exactly this symptom.

## Part 1: The standard process

### 1.1. Enable the required options

1. **Settings > About phone > Software information**, tap "Build number" 7 times to enable Developer options.
2. In **Developer options**, turn on:
   - **USB debugging**
   - **OEM unlocking**

If the OEM unlocking option doesn't show up, your device may have it locked by your carrier/region, or it might be a MediaTek-chip model where this option sometimes simply doesn't exist. Without it, the standard path described here won't work.

### 1.2. Identify the device

With the cable connected and USB debugging on, authorize the PC on the phone (tap "Allow", check "Always allow") and run:

```powershell
adb devices -l
adb shell getprop ro.product.model
adb shell getprop ro.build.display.id
adb shell getprop ro.csc.sales_code
adb shell getprop ro.boot.flash.locked
```

Note down the **exact model** (e.g. `SM-A047M`), the **full build** (e.g. `A047MUBSGEZH3`), and the **CSC** (e.g. `ZTO`). You'll need a firmware package that matches that build exactly.

### 1.3. Unlock the bootloader

The button combo **varies by model and year**. Two examples I used in this session:

- **Recent models (e.g. A04s, 2022+):** powered off, hold **Vol+ and Vol-** while connecting the USB cable. On the blue warning screen, press **Vol+** to confirm.
- **Older models without a physical Home button (e.g. A10, 2019):** powered off, hold **Vol+ and Vol-** while connecting the cable (no Power button needed). Then, inside Download Mode itself, **hold Vol+ again** until a dedicated bootloader-unlock menu appears, and confirm with Vol+ once more.

Search "enter download mode [your model]" if you're not sure — getting the combo wrong usually just boots the phone normally, no risk involved.

After unlocking (the phone reboots and wipes data), confirm:

```powershell
adb shell getprop ro.boot.flash.locked        # should be 0
adb shell getprop ro.boot.verifiedbootstate   # should be "orange"
adb shell getprop ro.boot.vbmeta.device_state # should be "unlocked"
```

### 1.4. Download and verify the firmware

On samfw.com or samfrew.com, look up your exact model + CSC. Download the **latest, or the same** build already on the device (an older build usually gets rejected by Odin with `SW REV. CHECK FAIL` due to anti-rollback protection).

The package comes as a `.zip` with five `.tar.md5` files: `BL`, `AP`, `CP`, `CSC`, and `HOME_CSC`. **Never use `HOME_CSC`** for a clean flash — it preserves data and isn't what you want here.

Each `.tar.md5` has an MD5 hash of its content appended in the last bytes. It's worth verifying before flashing something several GB in size blind. PowerShell script for that:

```powershell
function Verify-Md5Tar($path) {
  $fs = [IO.File]::OpenRead($path); [int64]$len = $fs.Length
  [void]$fs.Seek($len - 512, [IO.SeekOrigin]::Begin)
  $buf = New-Object byte[] 512; [void]$fs.Read($buf, 0, 512)
  $txt = [Text.Encoding]::ASCII.GetString($buf)
  $m = [regex]::Match($txt, '([0-9a-fA-F]{32})\s+\S+\.tar\s*$')
  if (-not $m.Success) { $fs.Close(); return "NO TRAILER" }
  $expected = $m.Groups[1].Value.ToLower()
  [int64]$dataLen = $len - ($txt.Length - $m.Index)
  [void]$fs.Seek(0, [IO.SeekOrigin]::Begin)
  $md5 = [Security.Cryptography.MD5]::Create(); [int64]$left = $dataLen; $b = New-Object byte[] (8MB)
  while ($left -gt 0) {
    $want = if ($left -lt $b.Length) { [int]$left } else { $b.Length }
    $n = $fs.Read($b, 0, $want); if ($n -le 0) { break }
    [void]$md5.TransformBlock($b, 0, $n, $null, 0); $left -= $n
  }
  [void]$md5.TransformFinalBlock($b, 0, 0)
  $calc = ([BitConverter]::ToString($md5.Hash) -replace '-','').ToLower(); $fs.Close()
  if ($expected -eq $calc) { "OK" } else { "FAILED (expected=$expected calculated=$calc)" }
}

Get-ChildItem . -Filter *.tar.md5 | ForEach-Object {
  "$($_.Name) -> $(Verify-Md5Tar $_.FullName)"
}
```

(Note: for files larger than ~2 GB, use `[int64]` for all size variables — PowerShell's implicit `Int32` handling silently breaks on large files.)

### 1.5. Patch the AP with Magisk

1. Install Magisk (downloaded from the official GitHub repo) on the phone.
2. Copy the `AP_....tar.md5` file to the phone (`adb push` works well, or copy it manually).
3. In the Magisk app, tap **Install > Select and Patch a File**, choose the AP, tap **Let's Go**.
4. Pull the generated `magisk_patched-XXXXX.tar` back (it lands in the Download folder).

### 1.6. Flash with Odin

In the **AP** slot, load the `magisk_patched-....tar`. **Leave BL, CP, and CSC empty** — only the AP changes. Check **Auto Reboot**, leave **Re-Partition** unchecked, and click **Start**.

**Performance tip:** the full AP that Magisk generates includes `system.img`, `vendor.img`, `super.img`, etc. — all identical to the original; only `boot.img` and `vbmeta.img` actually change. If Odin is too slow or unstable with the multi-GB file, build a "mini AP" with just the two files that matter:

```powershell
tar.exe -xf magisk_patched-XXXXX.tar boot.img vbmeta.img
tar.exe --format=ustar -cf mini_AP.tar boot.img vbmeta.img

$md5 = (Get-FileHash mini_AP.tar -Algorithm MD5).Hash.ToLower()
$trailer = "$md5  mini_AP.tar`n"
$tb = [Text.Encoding]::ASCII.GetBytes($trailer)
$fs = [IO.File]::Open("mini_AP.tar.md5", [IO.FileMode]::Create)
$sb = [IO.File]::ReadAllBytes("mini_AP.tar")
$fs.Write($sb,0,$sb.Length); $fs.Write($tb,0,$tb.Length); $fs.Close()
```

Odin identifies the target partition by the **filename inside the tar** (`boot.img` → boot partition, `vbmeta.img` → vbmeta partition), so a smaller tar with just those two files works fine — and processes in seconds instead of minutes.

After **PASS!**, wait for the first boot (can take up to ~10 minutes). Open Magisk and check that it shows "Installed" with a version number.

---

## Part 2: When the standard process doesn't work

If you followed everything above and hit one of these scenarios, here are the two problems I ran into and how I diagnosed each one.

### 2.1. "Only official released binaries are allowed to be flashed" even with an unlocked bootloader

**Symptom:** Odin refuses to flash anything — even an untouched, original AP — with this message, despite `flash.locked=0` and the bootloader showing "unlocked".

**Cause:** there's a separate state from bootloader unlock called **Knox Guard (KG)**. It's visible right on the Download Mode screen, in a line like:

```
KG STATE: Prenormal
```

While `KG STATE` is `Prenormal`, Samsung blocks flashing any non-official binary — it's an anti-theft protection, checking in with Samsung's servers that the device isn't marked lost/stolen, **regardless** of whether the bootloader is unlocked.

**Fix:** exit Download Mode, boot the phone normally, connect to a network (Wi-Fi, and mobile data with a SIM if you have one — speeds up the check-in), and leave it on and connected for a while. There's no guaranteed fixed time — in my case it resolved in under an hour, but reports online range from minutes to days. Then go back into Download Mode and check whether `KG STATE` changed to `Checking` or `Normal`. Once it does, flashing works.

An indirect sign that a flash finally went through: `ro.boot.warranty_bit` flips from `0` to `1` as soon as a custom binary write is accepted:

```powershell
adb shell getprop ro.boot.warranty_bit
```

### 2.2. Boot patches, flashes successfully, but Magisk still says "Not installed"

This was the hardest one to diagnose, because **everything looked right**: Odin confirmed `RES OK` and `succeed 1 / failed 0`, the hash of the flashed `boot.img` matched the patched version (not the original), and `ro.boot.verifiedbootstate` showed `orange` (confirming the custom boot was actually active). Yet the Magisk app kept showing **"Installed: N/A"**.

**Diagnosis:** open the Magisk app, go to the **Logs** tab (the bug icon), tap the save/export icon (this generates a `.log` file in the Download folder), and pull it:

```powershell
adb pull /sdcard/Download/magisk_log_XXXXXXXX.log
```

In the first few lines of the log, look for:

```
isSAR=true
ramdisk=false
```

If you see `ramdisk=false`, that's the problem: on this particular device, the `boot.img` **doesn't actually use its own embedded ramdisk** at runtime — the real Android init logic lives inside the `system` partition instead (a legacy "system-as-root" architecture). When Magisk patches `boot.img` through the app running on normal Android, it modifies exactly the part the device ignores. The patch "works" technically (Odin flashes it fine, the boot hash changes), but it has zero practical effect.

**Fix: install via TWRP instead of patching boot directly.**

The Magisk installer, when run **from inside TWRP** (instead of the app on normal Android), detects this scenario and applies a different fix. You'll see this line in the install log when it works:

```
- Legacy SAR, force kernel to load rootfs
```

Step by step:

1. **Download the official TWRP for your model** from `twrp.me` (search by your device's "codename" — it's not always the same as the marketing name). Verify the SHA-256 hash published on the download page itself.

2. **Build a package combining TWRP's `recovery.img` with a verification-disabled `vbmeta.img`.** This avoids a separate AVB error (`invalid vbmeta header`) that happens if you flash TWRP alone without also disabling vbmeta verification:

   ```powershell
   tar.exe -xf twrp-XXXX.img.tar recovery.img
   # copy a vbmeta.img already patched by Magisk (flags=3) into the same folder
   tar.exe --format=ustar -cf twrp_plus_vbmeta.tar recovery.img vbmeta.img
   # (repeat the same MD5 trailer process shown in Part 1.6)
   ```

3. **Flash with Odin** (AP slot, BL/CP/CSC empty, **uncheck Auto Reboot** this time).

4. After PASS, **disconnect the cable, power off the phone, and boot straight into the Recovery combo** (usually Vol+ and Power, varies by model) — don't let it complete a normal boot first, or stock Android may silently overwrite TWRP before you get to use it.

5. **If TWRP can't access internal storage** (common — it usually can't decrypt the data partition without a password), use the command-line method instead of traditional sideload (which, in my experience, was unstable on Windows):

   ```powershell
   adb push Magisk-vXX.X.apk /tmp/Magisk.zip
   adb shell "twrp install /tmp/Magisk.zip"
   ```

   (Yes, the Magisk APK works directly as a flashable zip — that's the officially documented method from the project itself.)

6. **When rebooting, if TWRP's menu "Reboot > System" just sends you back to TWRP** (a common bug in unofficial TWRP builds, where the "next boot = recovery" flag doesn't get cleared), don't fight it through the menu. Instead:

   ```powershell
   adb shell "twrp reboot system"
   ```

   This command-line call, in my experience, cleared the flag correctly where the menu tap didn't.

7. Confirm root:

   ```powershell
   adb shell "su -c id"
   # should return something like: uid=0(root) gid=0(root) ... context=u:r:magisk:s0
   ```

---

## Part 3: When none of this works

Not every device/firmware combo can actually be rooted with the methods above, and it's important to recognize that instead of retrying indefinitely.

**Warning sign:** if the patched boot (through any method — direct patch, TWRP, different Magisk versions) always results in the same red warning screen followed by a reboot loop, **even with `vbmeta` correctly verification-disabled**, it might be a genuine compatibility bug between Magisk and that specific firmware. Before you keep hammering at it:

**Rule out the `ramdisk=false` hypothesis first (Part 2.2).** Pull the Magisk log and check the first two lines. If `ramdisk=true`, this **isn't** the same problem as the A10 — it's something else, and the TWRP method likely won't fix it (it specifically fixes the `ramdisk=false` case; for `ramdisk=true` devices, TWRP's installer runs through the normal SAR path and produces the same result as patching boot directly through the app).

Another thing worth checking further down in the same log, in the system properties section:

```
ro.boot.vbmeta.invalidate_on_error = yes
```

If this flag is `yes`, the chipset is factory-configured to auto-invalidate itself (halt and reboot) the moment it detects any AVB verification inconsistency — instead of just showing a warning and continuing, which is the normal behavior on an unlocked bootloader. This helps confirm the behavior really is coming from the chipset/firmware and isn't a mistake in your process, but it's **not something you can work around by repackaging files differently** — it's exactly the kind of case that tends to show up as "not enough info to fix" on the Magisk issue tracker.

1. Search the [Magisk issue tracker on GitHub](https://github.com/topjohnwu/Magisk/issues) for your exact model. I found a report identical to my problem, closed by the project's own creator as "not enough info to fix" — meaning some cases are known bugs **with no current solution**.
2. Be wary of any fix that involves an **unauditable third-party custom kernel**, especially one compiled for a different regional variant than yours (e.g. using a kernel built for the global version of a phone when you have the Latin American variant). The risk usually isn't worth the benefit.
3. If nothing works, the device remains fully functional without root, with the bootloader unlocked (which at least makes a future attempt easier, if Magisk fixes the bug or a firmware update changes the behavior).

## Quick diagnosis checklist

| Symptom | Likely cause | Where to look |
|---|---|---|
| Odin refuses even a stock, untouched AP | Knox Guard stuck in `Prenormal` | Download Mode screen, `KG STATE` line |
| Odin hangs on "File analysis" for a long time | Two Odin instances open, or a tampered build | Task Manager (duplicate processes) |
| `invalid vbmeta header` / `no footer detected` | Flashed a custom recovery/boot without also disabling `vbmeta` verification | Check whether a patched `vbmeta.img` was included in the same flash |
| Patched boot hangs on red screen + reboots (even with `ramdisk=true`) | Magisk × firmware compatibility bug (no guaranteed fix) | Search your exact model on the Magisk issue tracker; also check `ro.boot.vbmeta.invalidate_on_error` |
| Magisk shows "Installed: N/A" despite a successful flash | `ramdisk=false` — needs TWRP install, not direct patch | Magisk log (`isSAR`/`ramdisk` in the first lines) |
| TWRP always boots back into TWRP | Boot flag not cleared (common bug in unofficial TWRP builds) | Use `adb shell twrp reboot system` instead of the menu |

---

*This guide documents a real process, done in September 2026 on two Samsung devices (Galaxy A04s and Galaxy A10). Commands and button combos may vary by model — always search for your exact model before following any step.*
