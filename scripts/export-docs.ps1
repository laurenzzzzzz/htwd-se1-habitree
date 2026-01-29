[CmdletBinding()]
param(
  [string]$OutDir = "dist/docs",
  [string]$ZipPath = "dist/Habitree_Dokumente.zip"
)

$ErrorActionPreference = 'Stop'

function Convert-ToDockerMountPath([string]$windowsPath) {
  $full = (Resolve-Path -Path $windowsPath).Path
  return ($full -replace '\\','/')
}

function Assert-DockerRunning {
  & docker info *> $null
  if ($LASTEXITCODE -ne 0) {
    throw "Docker ist installiert, aber der Docker-Daemon läuft nicht (oder ist nicht erreichbar). Bitte Docker Desktop starten und auf 'Docker is running' warten."
  }
}

$repoRoot = (Resolve-Path -Path (Join-Path $PSScriptRoot '..')).Path
Push-Location $repoRoot

try {
  if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker wurde nicht gefunden. Bitte Docker Desktop installieren/aktivieren oder die PDFs mit einer lokalen Asciidoctor-PDF Installation erzeugen."
  }

  Assert-DockerRunning

  $outDirFull = Join-Path $repoRoot $OutDir
  New-Item -ItemType Directory -Force -Path $outDirFull | Out-Null

  $docs = @(
    @{ In = 'docs/Softwareprodukt_Abgabe.adoc'; Out = '01_Softwareprodukt_Bereitstellung.pdf' },
    @{ In = 'docs/requirements/vision.adoc'; Out = '02_Visionsdokument.pdf' },
    @{ In = 'docs/requirements/glossary.adoc'; Out = '03_Glossar.pdf' },
    @{ In = 'docs/development/design.adoc'; Out = '04_Entwicklerdokumentation.pdf' },
    @{ In = 'docs/test/test_cases.adoc'; Out = '05_Testdokumentation.pdf' },
    @{ In = 'docs/Anwenderdokumentation/Anwenderdokumentation.adoc'; Out = '06_Anwenderdokumentation.pdf' },
    @{ In = 'docs/deployment/Betriebsdokumentation.adoc'; Out = '07_Betriebsdokumentation.pdf' }
  )

  $mountPath = Convert-ToDockerMountPath $repoRoot

  foreach ($doc in $docs) {
    $inPath = $doc.In
    $outFile = $doc.Out

    if (-not (Test-Path -Path (Join-Path $repoRoot $inPath))) {
      throw "Eingabedatei fehlt: $inPath"
    }

    Write-Host "[PDF] $inPath -> $OutDir/$outFile"

    & docker run --rm `
      -v "${mountPath}:/documents" `
      -w /documents `
      asciidoctor/docker-asciidoctor `
      asciidoctor-pdf -a allow-uri-read -r asciidoctor-diagram `
      -D $OutDir -o $outFile $inPath

    if ($LASTEXITCODE -ne 0) {
      throw "PDF-Export fehlgeschlagen עבור: $inPath (ExitCode=$LASTEXITCODE)"
    }
  }

  $zipFull = Join-Path $repoRoot $ZipPath
  $zipDir = Split-Path -Parent $zipFull
  New-Item -ItemType Directory -Force -Path $zipDir | Out-Null

  if (Test-Path $zipFull) {
    Remove-Item -Force $zipFull
  }

  $pdfs = Get-ChildItem -Path $outDirFull -Filter '*.pdf' -File -ErrorAction SilentlyContinue
  if (-not $pdfs -or $pdfs.Count -eq 0) {
    throw "Keine PDFs erzeugt. ZIP wird nicht erstellt."
  }

  Compress-Archive -Path $pdfs.FullName -DestinationPath $zipFull -Force

  Write-Host ""
  Write-Host "Fertig. PDFs: $outDirFull"
  Write-Host "ZIP:   $zipFull"
}
finally {
  Pop-Location
}
