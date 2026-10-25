---
title: "Vibecodando o projetor HY300: debloat via ADB, HDMI automático ao ligar e um prompt pra IA fazer por você"
description: "Como limpei um projetor HY300 (Android 11, 1 GB de RAM) só com ADB, sem root: 53 pacotes desativados, boot direto no HDMI e acesso às Settings por um mini-launcher de 20 linhas. No fim, um prompt pronto pra sua IA repetir o processo."
date: 2026-10-25T12:00:00Z
tags: [android, projetor, adb, debloat, hy300, ia]
translationKey: hy300-projector-debloat
---

O HY300 é um desses projetores baratos que estão em todo lugar. O meu roda Android 11 com **938 MB de RAM** e o build `UI_Veng.projector.20250221.201033`. Eu só uso dele duas coisas: a entrada **HDMI** (tem um Fire Stick espetado) e as **Settings**, pra parear Bluetooth. Todo o resto — Netflix, YouTube, loja de apps, Miracast, Google Play Services — era peso morto que deixava o aparelho lento e com só ~30 MB de RAM livre.

Esse post conta o que eu fiz, na ordem, com os problemas que apareceram no caminho. Tudo foi feito **por ADB, sem root e sem flashar firmware**, e tudo é reversível. No final tem um **prompt pronto** pra você colar na sua IA com acesso ao terminal e repetir o processo no seu aparelho.

> Eu fiz essa sessão inteira conversando com o Claude Code, que rodou os comandos `adb` por mim. Por isso o "vibecodado" no título. O prompt no fim é a versão condensada do que aprendemos.

## Avisos antes de começar

- **Isso é para o seu aparelho, e o risco é seu.** Desativar o pacote errado pode deixar o projetor sem tela inicial. Por isso o passo 2 é fazer backup.
- **Nada aqui precisa de root.** Os pacotes são desativados com `pm disable-user --user 0`, que é reversível com `pm enable`. Um factory reset também desfaz tudo.
- **Meu caso é específico:** eu uso um Fire Stick no HDMI e nunca uso os apps do projetor. Se você usa Netflix ou YouTube **do próprio projetor**, não desative o que eu desativei.
- **A porta ADB fica aberta e sem senha na sua rede** enquanto a depuração estiver ligada. Feche no final (passo 7).
- Os nomes de pacote abaixo são do **meu firmware**. Confira a lista do seu aparelho antes de copiar.

## O que você vai precisar

| Item | Para quê |
|---|---|
| `adb` no computador (`brew install android-platform-tools` no Mac) | Falar com o projetor |
| Projetor e computador **na mesma rede** | ADB por Wi-Fi |
| Android SDK build-tools (`aapt2`, `d8`, `apksigner`) e JDK | Só se for fazer o mini-launcher do passo 5 |

## Passo 1: ligar o ADB

No projetor: **Settings > About**, toque ~7 vezes em *Build* pra liberar as **Developer options** e ligue **USB debugging** (e **ADB over network**, se aparecer).

Aqui bati em dois problemas:

1. **USB não funcionou.** O Mac não enxergou nada, nem com outro cabo. Muitos projetores só têm USB-A *host* (pra pendrive) e não funcionam como dispositivo. Vá direto pro Wi-Fi.
2. **Redes diferentes.** O projetor estava em `192.168.1.x` e o Mac em `192.168.15.x` (dois roteadores). O `ping` dava 100% de perda e `adb connect` dava timeout. Conecte os dois **no mesmo Wi-Fi**.

Depois de ajustar:

```bash
adb connect 192.168.1.50:5555
```

Na primeira vez aparece `unauthorized`. Olhe a tela do projetor, aceite o pop-up **"Allow USB debugging?"** e marque "Always allow". Se o `adb devices` mostrar `offline` depois de um reboot, é só `adb disconnect IP:5555` e conectar de novo.

Confirme:

```bash
adb shell getprop ro.product.model          # adt3
adb shell getprop ro.build.version.release  # 11
adb shell free -m
```

Na minha máquina: `Mem: 938 total, 908 used, 30 free`. Sem espaço nenhum.

## Passo 2: inventário e backup

Antes de mexer em qualquer coisa:

```bash
mkdir backup
adb shell pm list packages -f   > backup/packages_all.txt
adb shell pm list packages -d   > backup/packages_disabled_before.txt
adb shell getprop               > backup/getprop.txt
adb shell settings list global  > backup/settings_global.txt
adb shell settings list secure  > backup/settings_secure.txt
adb shell settings list system  > backup/settings_system.txt
```

E um script de restore que reativa tudo o que você desativar (lista de pacotes em arquivos `batchN.txt`):

```bash
#!/bin/sh
# usage: restore.sh IP:5555
D=${1:-192.168.1.50:5555}
for f in "$(dirname "$0")"/batch*.txt; do
  while read p; do adb -s $D shell pm enable --user 0 "$p" </dev/null; done < "$f"
done
```

> **Pegadinha que me custou uma rodada:** o `adb shell` **consome o stdin**. Dentro de `while read p; do adb shell ...; done < arquivo`, o loop morre depois do primeiro item. Sempre coloque `</dev/null` no `adb shell` dentro de loops.

## Passo 3: debloat

`pm list packages -3` (apps de terceiros) veio **vazio**: todo o peso está em apps de sistema. Eu separei em grupos:

**Desativei sem medo** (lixo de fábrica, telemetria, OTA, apps que eu nunca abro):

- Apps inúteis: `calculator2`, `egg`, `music`, `musicfx`, `htmlviewer`, `dreams.web`, `dreams.basic`, `soundpicker`
- Impressão: `bips`, `printspooler`, `printservice.recommendation`
- Telefonia/backup que não fazem sentido num projetor: `cellbroadcast*`, `companiondevicemanager`, `backupconfirm`, `sharedstoragebackup`, `localtransport`, `wallpaperbackup`, `onetimeinitializer`, `dynsystem`
- Teste de fábrica: `htc.hyk_test`, `hotack.writesn`, `softwinner.agingdragonbox`, `dragonbox`, `dragonatt`, `awlogsettings`
- Telemetria e atualização: `htc.eventuploadservice`, `htc.htcotaupdate`, `softwinner.update`, `android.rockchip.update.service`
- Mídia embutida: `TvdFileManager`, `TvdVideo`, `htc.storeos`
- Google: `com.google.android.gms`, `gsf`, `com.android.vending` (sem Play Store, cast e login Google, o que é ok no meu caso)

**Mantive, porque o HDMI e as Settings dependem deles:** `systemui`, `tv.settings`, `htc.htcsettings`, `softwinner.awlivetv`, `awsource`, `vis` (serviço de entrada de vídeo), `awmanager`, `settingsassist`, `settingssetup`, `provision`, `tvvolume`, `theme.*`, `providers.*`, `webview`, `permissioncontroller`, `packageinstaller`, `bluetooth`, o teclado, e os `networkstack*`.

O comando é um por pacote:

```bash
while read p; do
  echo -n "$p: "
  adb -s $D shell pm disable-user --user 0 "$p" </dev/null 2>&1 | tail -1
done < backup/batch1.txt
```

Faça em **lotes pequenos** e olhe a tela do projetor entre eles. Depois do último, **reinicie** e compare `pm list packages -d` com o que você desativou, porque alguns firmwares reativam pacotes sozinhos no boot.

Resultado: **53 pacotes desativados**, RAM livre subiu de ~30 MB pra ~110–165 MB. O aparelho voltou a ser usável.

> **Nunca abra pacotes de "factory", "aging", "production" ou "fac menu" só pra ver o que fazem.** Em algumas placas, abrir um deles muda uma flag que desliga CEC e o botão de entrada. Use `dumpsys package <nome>` pra olhar sem executar.

## Passo 4: o launcher ainda mostrava Netflix e YouTube

Depois de desativar tudo, o launcher original (da HTC, `com.htc.htclauncherhighenglishd08`) **continuou mostrando os blocos de Netflix, YouTube e App Store**. Não tem nenhum desses apps instalados: os blocos são **atalhos fixos desenhados no launcher**, sem opção de remover. Tentei segurar OK em cima deles, nada.

Como o launcher é app de `/system`, editar o APK exigiria root. Caminho sem root: **instalar outro launcher**.

Tentei o [FLauncher](https://gitlab.com/flauncher/flauncher) (open source, 0.18.0, tem build `armeabi-v7a`). Funcionou, mas o instalador demorou: **26 MB pelo Wi-Fi do projetor levaram mais de 10 minutos** (≈0,04 MB/s). Instalei com `adb push` + `pm install -r` pelo shell, que é mais confiável que `adb install` em alguns aparelhos. E aí vieram dois problemas novos:

- O FLauncher só lista apps com categoria `LEANBACK_LAUNCHER`. A entrada HDMI (`com.softwinner.awsource`) não tem, **então some**.
- O botão de **seta pra baixo do meu controle não funciona** (mais sobre isso no passo 6).

No fim, o que eu realmente queria era **abrir direto no HDMI ao ligar**. Isso pede um launcher de 20 linhas.

## Passo 5: o mini-launcher que abre o HDMI ao ligar

### Descobrindo como abrir o HDMI

Existem duas atividades:

- `com.softwinner.awsource/.MainActivity` abre um **seletor de fonte** (HDMI1, HDMI2, HDMI3, CVBS1, CVBS2) como overlay.
- `com.softwinner.awlivetv/.MainActivity` é a **tela que mostra a imagem**.

Chamei a segunda de **partida a frio** (depois de `am force-stop`) e olhei o log:

```bash
adb shell am force-stop com.softwinner.awlivetv
adb shell am start -n com.softwinner.awlivetv/.MainActivity
adb logcat -d | grep onTune
# HdmiInputService: SessionImpl onTune: channeluri: content://android.media.tv/passthrough/com.softwinner.vis%2F.HdmiInputService%2FHW1
```

Sem passar nada, ela sintonizou **`HW1` (HDMI1)** sozinha. Se o seu Fire Stick estiver em outra porta, confira esse log antes de assumir.

### O truque do Home

Sem root não tem `init.d` nem script de boot. E apps não podem abrir atividades "do nada" no boot desde o Android 10 (restrições de background). **Mas o app que é o Home padrão é aberto pelo sistema no boot e pode abrir outra tela.** Então o mini-launcher é um Home que:

- Nos primeiros **150 s** depois de ligar, abre o HDMI;
- Depois disso, abre as **Settings** (o bloco "Setting" é `com.htc.htcsettings/com.htc.activity.HomeActivity` no meu firmware).

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

`res/values/s.xml` (tema transparente, sem UI nenhuma):

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

### Compilar, assinar e instalar (sem Gradle)

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
keytool -genkeypair -keystore ks.jks -storepass senha -keypass senha -alias k \
  -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=hdmiboot"
$BT/apksigner sign --ks ks.jks --ks-pass pass:senha --out hdmiboot.apk aligned.apk

adb push hdmiboot.apk /data/local/tmp/
adb shell pm install -r /data/local/tmp/hdmiboot.apk
adb shell cmd package set-home-activity com.jean.hdmiboot/.BootActivity
```

O APK tem ~12 KB. **Teste antes de tirar o launcher antigo de cena:** aperte Home e confirme com

```bash
adb shell dumpsys window | grep mCurrentFocus
adb shell cmd package resolve-activity --brief -c android.intent.category.HOME -a android.intent.action.MAIN | tail -1
```

Depois reiniciei o projetor: logo no boot, `mCurrentFocus` já era o `awlivetv` e o log mostrava o `onTune` em `HW1`. Pronto: liga direto no Fire Stick. Só então desativei o launcher HTC e o Miracast.

## Passo 6: o controle remoto

Meu controle **não tinha a seta pra baixo funcionando**. Pra entender, escutei o receptor de IR:

```bash
adb shell "timeout 60 getevent -lt /dev/input/event6"
```

(O `getevent` desse Android só aceita **um** dispositivo por vez. Passar dois dá um erro de uso e não grava nada.)

O controle manda **códigos Linux que parecem letras**, e o layout do aparelho (`/vendor/usr/keylayout/sunxi-ir-uinput.kl`) traduz:

| Linux (o que chega) | Android |
|---|---|
| `KEY_R` (19) | ↑ |
| `KEY_T` (20) | **↓** |
| `KEY_Y` (21) | ← |
| `KEY_U` (22) | → |
| `KEY_I` (23) | OK |

Nas capturas chegavam `R`, `U` e `I`, **mas o `T` nunca apareceu**: o ↓ simplesmente não era enviado. Em outras tentativas o receptor pegou quase nada, o que aponta pra **pilha fraca ou receptor mal posicionado**. Antes de qualquer remapeamento, **troque a pilha e mire na frente do aparelho**.

Se o botão estiver morto de verdade, a solução sem root seria um serviço de acessibilidade que converte outra tecla em ↓, já que o `/vendor` é só leitura. Eu não cheguei a fazer isso: com o mini-launcher, o Home já abre as Settings direto, e o Bluetooth fica acessível por ali.

## Passo 7: fechar o ADB

Quando terminar:

1. Settings > Developer options: desligue **USB debugging** e **ADB over network**.
2. **Revogue** as autorizações de depuração USB e reinicie.
3. Confirme do computador que a porta recusa a conexão: `nc -vz IP 5555`. No macOS, só **"Connection refused"** prova que fechou. "No route to host" não prova nada.

## O que mudou no fim

| | Antes | Depois |
|---|---|---|
| RAM livre | ~30 MB | ~110–165 MB |
| Pacotes de sistema desativados | 2 | 55 (53 por mim) |
| Ao ligar | Launcher com Netflix/YouTube | Direto no HDMI1 |
| Home | Launcher cheio de atalhos | Settings (Bluetooth) |
| Temperatura | 78–79 °C na CPU com 1 min de uptime | igual |

A temperatura **não mudou**, e isso é esperado. A CPU estava ~65% **ociosa** o tempo todo, porque o HDMI passa quase tudo por hardware dedicado. O calor vem da lâmpada/LED, do chip de vídeo e do ventilador. O que realmente ajuda: **limpar a entrada e saída de ar**, usar o **modo Eco** do brilho e deixar espaço em volta. Sem root não dá pra limitar a frequência da CPU.

## O prompt pra IA

Esse prompt é a versão condensada do que aprendi, escrito pra uma IA com acesso ao terminal (Claude Code, por exemplo). Ele foi inspirado no ótimo guia [cleanyourtv](https://github.com/Gathin23/cleanyourtv), de onde peguei as regras de segurança de "o que nunca desativar" e "faça em lotes pequenos", e adaptado pro HY300.

```text
Quero fazer debloat do meu projetor HY300 (Android 11, ~1 GB de RAM, Allwinner/"softwinner")
e deixá-lo abrindo direto no HDMI ao ligar. Eu só uso o projetor como tela para um
streamer externo no HDMI (modelo: <MODELO/ENTRADA HDMI AQUI>), e as Settings para parear Bluetooth.
Trabalhe no aparelho real via ADB, passo a passo, e confirme cada coisa com screenshot
(adb shell screencap -p) ou dumpsys. Pergunte antes de qualquer decisão que dependa de mim.

Conexão
- Se o projetor está em outra sub-rede que o computador, pare e me diga: precisam estar na MESMA rede.
- Conecte por `adb connect IP:5555`. Se o adb mostrar `offline`, faça disconnect e connect de novo.
  Me avise quando aparecer o pop-up "Allow USB debugging?" para eu aceitar.
- USB geralmente não funciona neste modelo (porta só host). Use Wi-Fi.

Backup (antes de mudar qualquer coisa)
- Salve: pm list packages -f, pm list packages -d, getprop, settings list global/secure/system.
- Crie um restore.sh que reativa (pm enable --user 0) tudo o que você desativar, com os pacotes
  em arquivos batchN.txt.

Debloat
- Liste os pacotes (`pm list packages -s -e`; `-3` costuma vir vazio) e classifique em:
  telemetria/OTA, apps de fábrica/teste (dragonbox, aging, hyk_test, writesn), mídia/arquivos embutidos,
  impressão, telefonia/backup inúteis, Google (gms, gsf, vending), e o que o HDMI/Settings precisam.
- Use `pm disable-user --user 0` (nunca uninstall), UM pacote por chamada, em lotes pequenos,
  com checagem da tela entre lotes. Em loops de shell use `</dev/null` no adb shell
  (ele consome o stdin e o loop morre depois do primeiro item).
- NUNCA desative: systemui, tv.settings, o pacote de Settings do fabricante, awlivetv, awsource,
  vis (HdmiInputService), awmanager, settingsassist, settingssetup, provision, tvvolume, theme.*,
  providers.*, webview, permissioncontroller, packageinstaller, bluetooth, teclado, networkstack*,
  o ext.services/ext.shared, modulemetadata.
- Antes de desativar o Google (gms/gsf/vending), me pergunte se uso Play Store/cast no projetor.
- NÃO abra pacotes de "factory/aging/production/fac menu" para ver o que fazem; use dumpsys package.
- Ao final, reinicie e compare `pm list packages -d` com o que desativou.

Launcher
- Verifique se o launcher original tem atalhos fixos (Netflix/YouTube) sem pacote instalado.
  Se sim, não dá para remover sem root: faça um mini-launcher.
- Descubra como abrir o HDMI: com.softwinner.awsource/.MainActivity é um SELETOR de fonte;
  com.softwinner.awlivetv/.MainActivity mostra a imagem. Faça `am force-stop` + `am start` do awlivetv
  (partida a frio) e confirme no logcat (`onTune ... passthrough ... HW1`) qual porta HDMI ele sintoniza.
  Se não for a porta do meu streamer, ache outro jeito e me pergunte.
- Crie um app Android mínimo (sem Gradle: aapt2 + javac + d8 + zipalign + apksigner do build-tools)
  cuja única activity é HOME/DEFAULT, com tema transparente. Nos primeiros 150 s após o boot
  (SystemClock.elapsedRealtime() < 150_000) ela abre awlivetv; depois disso abre o app de Settings
  do fabricante. Em ambos os casos faz finish(). Declare <queries> para os dois pacotes.
- Envie por adb push para /data/local/tmp e instale com `pm install -r` (não `adb install`),
  defina com `cmd package set-home-activity` e CONFIRME com `dumpsys window | grep mCurrentFocus`
  e `cmd package resolve-activity --brief -c android.intent.category.HOME` antes de desativar o launcher antigo.
- O push pelo Wi-Fi do projetor é muito lento (~0,04 MB/s): avise e rode em background se o APK for grande.
  Prefira APKs pequenos.
- Teste reiniciando: logo no boot o foco tem que ser awlivetv e o log deve mostrar onTune.

Controle remoto
- Se uma seta do controle não funciona, capture com `adb shell "timeout 60 getevent -lt /dev/input/eventN"`
  UM dispositivo por vez, e compare com /vendor/usr/keylayout/*.kl. Antes de remapear, sugira trocar a pilha.
- Sem root não dá para editar /vendor. A única opção é um serviço de acessibilidade com
  canRequestFilterKeyEvents; só faça se eu pedir.

Desempenho
- Meça antes e depois: free -m, top, /sys/class/thermal/thermal_zone*/temp. Seja honesto: se a CPU está
  ociosa, o calor é de hardware (lâmpada/ventilação), não de software.

No final
- Me entregue: restore.sh, o código-fonte do mini-launcher e um README com como reverter.
- Feche o ADB: desligue USB debugging e ADB over network, revogue autorizações, reinicie,
  e confirme com `nc -vz IP 5555` que a resposta é "Connection refused" (no macOS, "No route to host"
  não prova nada).
```

Se funcionar com o seu aparelho (ou falhar de um jeito interessante), me manda uma mensagem. Esse modelo é popular e quanto mais variações de firmware a gente documentar, melhor.
