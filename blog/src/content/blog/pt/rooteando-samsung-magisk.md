---
title: "Rooteando um Samsung com Magisk em 2026: o guia que eu queria ter encontrado"
description: "Passo a passo completo de desbloqueio de bootloader e root via Magisk em aparelhos Samsung, incluindo dois problemas raramente documentados: o bloqueio 'KG Prenormal' e dispositivos com ramdisk=false."
date: 2026-09-23T18:00:00Z
tags: [android, samsung, root, magisk]
translationKey: root-samsung-magisk
---

Esse tutorial nasceu de uma sessão de várias horas tentando rootear dois aparelhos Samsung diferentes (um Galaxy A04s e um Galaxy A10). No caminho, bati de frente com dois problemas que praticamente não têm documentação boa em português — e um deles nem tem solução conhecida ainda. Este guia cobre o processo padrão **e** esses dois problemas específicos, com o diagnóstico exato que uso pra identificar cada um.

Se você só quer o passo a passo básico, vá direto para a [Parte 1](#parte-1-o-processo-padrão). Se já fez tudo certo e está travado, pule para a [Parte 2](#parte-2-quando-o-processo-padrão-não-funciona).

## Antes de começar: avisos importantes

- **Isso apaga todos os dados do aparelho.** Faça backup de tudo antes.
- **O Knox é desarmado permanentemente** (`warranty_bit` vira `1`). Isso pode quebrar Samsung Pay, Samsung Health e o Secure Folder para sempre, mesmo se você desfizer o root depois.
- **Você perde a garantia** e assume o risco de dar problema no aparelho (soft-brick é comum e recuperável; hard-brick é raro, mas existe).
- **Não instale atualizações OTA depois de rootear.** Elas sobrescrevem o boot e quebram o root, às vezes de forma feia.
- Nem todo modelo/firmware aceita ser rooteado. Isso é chato de descobrir, mas é a realidade — a Parte 3 fala sobre isso.

## O que você vai precisar

| Item | Onde conseguir | Por quê |
|---|---|---|
| Driver USB Samsung | developer.samsung.com (oficial) | Windows reconhecer o aparelho |
| ADB / Platform Tools | dl.google.com (oficial, via Android SDK) | Ler informações do aparelho, empurrar arquivos |
| Firmware do seu modelo exato | samfw.com ou samfrew.com | O arquivo AP contém o `boot.img` que você vai patchear |
| Magisk (APK) | github.com/topjohnwu/Magisk (releases oficiais) | Faz o patch e gerencia o root |
| Odin | **Não existe fonte 100% oficial.** Veja a seção de avisos abaixo | Grava os arquivos no aparelho |

### Sobre o Odin: um aviso sério

A Samsung nunca distribuiu o Odin oficialmente. Toda cópia que circula na internet vem de terceiros, e há relatos consistentes de versões adulteradas (uma DLL de comunicação de rede que não deveria estar ali, tamanhos de arquivo que batem com builds "hackeadas" conhecidas). Eu mesmo usei uma cópia de origem não verificável nesta sessão, sem alternativa melhor disponível — e ela **travou de verdade** duas vezes, sem motivo aparente, exigindo reinício forçado.

Recomendações práticas:
- Baixe de um post de comunidade estabelecido (XDA, SamMobile), não de sites aleatórios de SEO.
- Rode com o PC **desconectado da internet** enquanto usa o Odin — assim, se a DLL de rede suspeita tentar falar com algum servidor, não tem para onde ir.
- Se o Odin travar em "File analysis" por muito tempo (mais de uns 10-15 minutos) com uso de memória baixo e constante (não crescendo), é sinal de loop, não processamento lento. Force o fechamento e tente de novo — às vezes duas instâncias abertas ao mesmo tempo brigam pela porta USB e causam exatamente esse sintoma.

## Parte 1: O processo padrão

### 1.1. Ativar as opções necessárias

1. **Configurações > Sobre o telefone > Informações do software**, toque 7 vezes em "Número da versão" para ativar as Opções do desenvolvedor.
2. Em **Opções do desenvolvedor**, ative:
   - **Depuração USB**
   - **Desbloqueio de OEM**

Se a opção de Desbloqueio de OEM não aparecer, seu aparelho pode ter essa opção bloqueada pela operadora/região, ou pode estar num modelo com chip MediaTek onde essa opção às vezes simplesmente não existe. Sem ela, o caminho padrão descrito aqui não funciona.

### 1.2. Identificar o aparelho

Com o cabo conectado e a Depuração USB ativa, autorize o PC no celular (toque em "Permitir", marque "Sempre permitir") e rode:

```powershell
adb devices -l
adb shell getprop ro.product.model
adb shell getprop ro.build.display.id
adb shell getprop ro.csc.sales_code
adb shell getprop ro.boot.flash.locked
```

Anote o **modelo exato** (ex: `SM-A047M`), a **build completa** (ex: `A047MUBSGEZH3`) e o **CSC** (ex: `ZTO`). Você vai precisar de um firmware que bata exatamente com essa build.

### 1.3. Desbloquear o bootloader

O combo de botões **varia por modelo e ano**. Dois exemplos que usei nesta sessão:

- **Modelos recentes (ex: A04s, 2022+):** desligado, segure **Vol+ e Vol−** ao conectar o cabo USB. Na tela azul de aviso, aperte **Vol+** para confirmar.
- **Modelos mais antigos sem botão Home físico (ex: A10, 2019):** desligado, segure **Vol+ e Vol−** ao conectar o cabo (sem precisar do botão Power). Depois, dentro do próprio Download Mode, **segure Vol+ de novo** até aparecer um menu específico de desbloqueio de bootloader, e confirme com Vol+ mais uma vez.

Pesquise "entrar em download mode [seu modelo]" se não tiver certeza — errar o combo geralmente só faz o aparelho ligar normal, sem risco.

Depois de desbloquear (o aparelho reinicia e apaga os dados), confirme:

```powershell
adb shell getprop ro.boot.flash.locked        # deve ser 0
adb shell getprop ro.boot.verifiedbootstate   # deve ser "orange"
adb shell getprop ro.boot.vbmeta.device_state # deve ser "unlocked"
```

### 1.4. Baixar e verificar o firmware

No samfw.com ou samfrew.com, procure seu modelo + CSC exatos. Baixe a build **mais recente ou igual** à que já está no aparelho (uma build mais antiga costuma ser recusada pelo Odin com `SW REV. CHECK FAIL`, por causa do anti-rollback).

O pacote vem em `.zip` com cinco arquivos `.tar.md5`: `BL`, `AP`, `CP`, `CSC` e `HOME_CSC`. **Nunca use o `HOME_CSC`** para uma gravação limpa — ele preserva dados e não é o que você quer aqui.

Cada `.tar.md5` tem, nos últimos bytes, um hash MD5 do conteúdo. Vale a pena verificar antes de gravar algo de 4-5 GB às cegas. Script em PowerShell para isso:

```powershell
function Verify-Md5Tar($path) {
  $fs = [IO.File]::OpenRead($path); [int64]$len = $fs.Length
  [void]$fs.Seek($len - 512, [IO.SeekOrigin]::Begin)
  $buf = New-Object byte[] 512; [void]$fs.Read($buf, 0, 512)
  $txt = [Text.Encoding]::ASCII.GetString($buf)
  $m = [regex]::Match($txt, '([0-9a-fA-F]{32})\s+\S+\.tar\s*$')
  if (-not $m.Success) { $fs.Close(); return "SEM TRAILER" }
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
  if ($expected -eq $calc) { "OK" } else { "FALHOU (esperado=$expected calculado=$calc)" }
}

Get-ChildItem . -Filter *.tar.md5 | ForEach-Object {
  "$($_.Name) -> $(Verify-Md5Tar $_.FullName)"
}
```

(Nota: para arquivos maiores que ~2 GB, use `[int64]` em todas as variáveis de tamanho — o `Get-Random`/`[Math]::Min` do PowerShell quebra silenciosamente com `Int32` em arquivos grandes.)

### 1.5. Patchear o AP com o Magisk

1. Instale o Magisk (baixado do GitHub oficial) no aparelho.
2. Copie o arquivo `AP_....tar.md5` para o celular (`adb push` funciona bem, ou copie manualmente).
3. No app do Magisk, toque em **Instalar > Selecionar e patchear um arquivo**, escolha o AP, toque em **Vamos lá**.
4. Puxe de volta o `magisk_patched-XXXXX.tar` gerado (fica na pasta Download).

### 1.6. Gravar no Odin

No slot **AP**, carregue o `magisk_patched-....tar`. **Deixe BL, CP e CSC vazios** — só o AP muda. Marque **Auto Reboot**, deixe **Re-Partition** desmarcado, e clique **Start**.

**Dica de performance:** o AP completo que o Magisk gera inclui `system.img`, `vendor.img`, `super.img` etc. — tudo igual ao original, só o `boot.img` e o `vbmeta.img` realmente mudam. Se o Odin estiver muito lento ou instável com o arquivo de vários GB, monte um "AP mínimo" só com os dois arquivos que importam:

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

O Odin identifica a partição de destino pelo **nome do arquivo dentro do tar** (`boot.img` → partição boot, `vbmeta.img` → partição vbmeta), então um tar menor com só esses dois arquivos funciona normalmente — e processa em segundos em vez de minutos.

Depois do **PASS!**, espere o primeiro boot (pode levar até uns 10 minutos). Abra o Magisk e confira se mostra "Instalado" com a versão.

---

## Parte 2: Quando o processo padrão não funciona

Se você seguiu tudo acima e caiu num desses cenários, aqui vão os dois problemas que enfrentei e como diagnostiquei cada um.

### 2.1. "Only official released binaries are allowed to be flashed" mesmo com bootloader desbloqueado

**Sintoma:** o Odin recusa gravar qualquer coisa — mesmo um AP original, sem modificação — com essa mensagem, apesar de `flash.locked=0` e do bootloader mostrar "unlocked".

**Causa:** existe um estado separado do desbloqueio de bootloader chamado **Knox Guard (KG)**. Ele é visível na própria tela do Download Mode, numa linha como:

```
KG STATE: Prenormal
```

Enquanto o `KG STATE` estiver em `Prenormal`, a Samsung bloqueia a gravação de qualquer binário não-oficial — é uma proteção antirroubo, checando com os servidores da Samsung se o aparelho não está marcado como perdido/roubado, **independente** do bootloader estar desbloqueado.

**Solução:** saia do Download Mode, ligue o aparelho normal, conecte numa rede (Wi-Fi e, se tiver, dados móveis com chip — acelera a confirmação) e deixe ligado e conectado por um tempo. Não há um tempo fixo garantido — no meu caso, resolveu em menos de uma hora, mas relatos na internet variam de minutos a dias. Depois, volte ao Download Mode e confira se o `KG STATE` mudou para `Checking` ou `Normal`. Quando mudar, a gravação passa a funcionar.

Um sinal indireto de que a gravação finalmente passou: a propriedade `ro.boot.warranty_bit` muda de `0` para `1` assim que uma gravação customizada é aceita:

```powershell
adb shell getprop ro.boot.warranty_bit
```

### 2.2. O boot patcha, grava com sucesso, mas o Magisk continua "Não disponível"

Esse foi o mais difícil de diagnosticar, porque **tudo parecia certo**: o Odin confirmava `RES OK` e `succeed 1 / failed 0`, o hash do `boot.img` gravado batia com o patchado (não com o original), e `ro.boot.verifiedbootstate` mostrava `orange` (confirmando que o boot customizado estava mesmo ativo). Mesmo assim, o app do Magisk teimava em mostrar **"Instalado: Não disponível"**.

**Diagnóstico:** abra o app do Magisk, vá na aba de **Registros** (ícone de inseto), toque no ícone de salvar/exportar (isso gera um `.log` na pasta Download), e puxe esse arquivo:

```powershell
adb pull /sdcard/Download/magisk_log_XXXXXXXX.log
```

Nas primeiras linhas do log, procure por:

```
isSAR=true
ramdisk=false
```

Se aparecer `ramdisk=false`, esse é o problema: nesse aparelho específico, o `boot.img` **não usa o ramdisk embutido nele mesmo** em tempo de execução — a lógica de inicialização real do Android vive dentro da partição `system` (uma arquitetura "system-as-root" legada). O Magisk, quando patcheia o `boot.img` pelo app rodando no Android normal, modifica exatamente essa parte que o aparelho ignora. O patch "funciona" tecnicamente (o Odin grava certo, o boot muda de hash), mas não tem efeito nenhum na prática.

**Solução: instalar via TWRP, não via patch direto do boot.**

O instalador do Magisk, quando rodado **de dentro do TWRP** (em vez do app no Android normal), detecta esse cenário e aplica um ajuste diferente. Voce vai ver essa linha no log de instalação quando funcionar:

```
- Legacy SAR, force kernel to load rootfs
```

Passo a passo:

1. **Baixe o TWRP oficial do seu modelo** em `twrp.me` (procure pelo "codename" do seu aparelho — nem sempre é igual ao nome comercial). Confira o hash SHA-256 publicado na própria página de download.

2. **Monte um pacote combinando o `recovery.img` do TWRP com um `vbmeta.img` sem verificação.** Isso evita um erro AVB separado (`invalid vbmeta header`) que acontece se você flashar só o TWRP sem desarmar a verificação do vbmeta junto:

   ```powershell
   tar.exe -xf twrp-XXXX.img.tar recovery.img
   # copie um vbmeta.img ja patchado pelo Magisk (flags=3) para a mesma pasta
   tar.exe --format=ustar -cf twrp_plus_vbmeta.tar recovery.img vbmeta.img
   # (repita o mesmo processo de trailer MD5 mostrado na Parte 1.6)
   ```

3. **Grave no Odin** (slot AP, BL/CP/CSC vazios, **desmarque Auto Reboot** desta vez).

4. Depois do PASS, **desconecte o cabo, desligue o aparelho e ligue direto no combo de Recovery** (geralmente Vol+ e Power, varia por modelo) — não deixe ele completar um boot normal primeiro, ou o Android pode sobrescrever o TWRP sozinho antes de você conseguir usá-lo.

5. **Se o TWRP não conseguir acessar o armazenamento interno** (comum — ele geralmente não decripta a partição de dados sem senha), use o modo linha de comando em vez do sideload tradicional (que, na minha experiência, é instável no Windows):

   ```powershell
   adb push Magisk-vXX.X.apk /tmp/Magisk.zip
   adb shell "twrp install /tmp/Magisk.zip"
   ```

   (Sim, o APK do Magisk funciona direto como zip flashável — é o método oficial documentado pelo próprio projeto.)

6. **Ao reiniciar, não use a opção "Reboot > System" do menu do TWRP se ela te devolver pro TWRP de novo** (bug comum em builds não-oficiais de TWRP, onde a flag de "próximo boot = recovery" não é limpa direito). Em vez disso:

   ```powershell
   adb shell "twrp reboot system"
   ```

   Esse comando via linha de comando, na minha experiência, limpa a flag corretamente onde o toque no menu não limpava.

7. Confirme o root:

   ```powershell
   adb shell "su -c id"
   # deve retornar algo como: uid=0(root) gid=0(root) ... context=u:r:magisk:s0
   ```

---

## Parte 3: Quando nada disso funciona

Nem todo aparelho/firmware aceita ser rooteado com os métodos acima, e é importante saber reconhecer isso em vez de ficar tentando indefinidamente.

**Sinal de alerta:** se o boot patchado (por qualquer método — patch direto, TWRP, versões diferentes do Magisk) sempre resulta na mesma tela vermelha de aviso seguida de reinício em loop, **mesmo com o `vbmeta` corretamente sem verificação**, pode ser um bug de compatibilidade entre o Magisk e aquele firmware específico. Antes de insistir:

**Descarte primeiro a hipótese do `ramdisk=false` (Parte 2.2).** Puxe o log do Magisk e confira as duas primeiras linhas. Se `ramdisk=true`, o problema **não é** o mesmo do A10 — é outra coisa, e o método TWRP provavelmente não resolve (ele resolve especificamente o caso `ramdisk=false`; para `ramdisk=true` o instalador do TWRP roda pelo caminho normal de SAR e produz o mesmo resultado que patchear o boot direto pelo app).

Outro sinal a checar no mesmo log, mais adiante na seção de propriedades do sistema:

```
ro.boot.vbmeta.invalidate_on_error = yes
```

Se essa flag estiver em `yes`, o chipset é configurado de fábrica para se auto-invalidar (travar e reiniciar) assim que detecta qualquer inconsistência na verificação AVB — em vez de só mostrar um aviso e continuar, como normalmente acontece num bootloader desbloqueado. Isso ajuda a confirmar que o comportamento é mesmo do chipset/firmware, não um erro seu no processo, mas **não é um problema que dá para contornar refazendo o pacote** — é exatamente o tipo de caso que costuma aparecer como "não resolvido" no rastreador de issues do Magisk.

1. Procure no [rastreador de issues do Magisk no GitHub](https://github.com/topjohnwu/Magisk/issues) pelo nome do seu modelo exato. Encontrei um relatório idêntico ao meu problema, fechado pelo próprio criador do projeto como "não tem informação suficiente para corrigir" — ou seja, alguns casos são bugs conhecidos e **sem solução no momento**.
2. Desconfie de qualquer solução que envolva um **kernel customizado de terceiro não auditável**, especialmente se for compilado para uma variante regional diferente da sua (ex: usar um kernel feito para a versão global do aparelho, comprado numa distribuidora, com a sua versão latino-americana). O risco não compensa o benefício na maioria dos casos.
3. Se nada funcionar, o aparelho continua 100% funcional sem root, com o bootloader desbloqueado (o que já facilita uma tentativa futura, se o Magisk corrigir o bug ou uma atualização de firmware mudar o comportamento).

## Checklist rápido de diagnóstico

| Sintoma | Causa provável | Onde olhar |
|---|---|---|
| Odin recusa até um AP original | Knox Guard em `Prenormal` | Tela do Download Mode, linha `KG STATE` |
| Odin trava em "File analysis" por muito tempo | Duas instâncias do Odin abertas, ou build adulterada | Gerenciador de tarefas (processos duplicados) |
| `invalid vbmeta header` / `no footer detected` | Flashou recovery/boot customizado sem desarmar o `vbmeta` junto | Confira se `vbmeta.img` patchado foi incluído no mesmo flash |
| Boot patcheado trava com tela vermelha + reinicia (mesmo com `ramdisk=true`) | Bug de compatibilidade Magisk × firmware (sem solução garantida) | Busque o modelo exato no issue tracker do Magisk; confira também `ro.boot.vbmeta.invalidate_on_error` |
| Magisk diz "Instalado: Não disponível" mesmo após flash bem-sucedido | `ramdisk=false` — precisa instalar via TWRP, não patch direto | Log do Magisk (`isSAR`/`ramdisk` nas primeiras linhas) |
| TWRP sempre volta pro TWRP ao reiniciar | Flag de boot não limpa (bug comum em builds não-oficiais) | Use `adb shell twrp reboot system` em vez do menu |

---

*Este guia documenta um processo real, feito em setembro de 2026 em dois aparelhos Samsung (Galaxy A04s e Galaxy A10). Comandos e combinações de botões podem variar por modelo — pesquise sempre pelo seu modelo exato antes de seguir qualquer passo.*
