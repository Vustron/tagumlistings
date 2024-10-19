# PowerShell script to remove .next, .turbo, and node_modules folders
# To run this script in PowerShell, navigate to the directory containing the script and run .\cleanup.ps1

param (
    [string]$path = (Get-Location),
    [switch]$dryRun = $false,
    [switch]$verbose = $false
)

$foldersToRemove = @(".next", ".turbo")
$totalSize = 0
$totalFolders = 0
$processedPaths = New-Object System.Collections.Generic.HashSet[string]

function Get-FolderSize {
    param ([string]$folder)
    return (Get-ChildItem $folder -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
}

function Format-Size {
    param ([long]$size)
    if ($size -gt 1GB) { return "{0:N2} GB" -f ($size / 1GB) }
    elseif ($size -gt 1MB) { return "{0:N2} MB" -f ($size / 1MB) }
    elseif ($size -gt 1KB) { return "{0:N2} KB" -f ($size / 1KB) }
    else { return "$size Bytes" }
}

function Remove-Folders {
    param ([string]$path)

    if (-not $processedPaths.Add($path)) {
        # Path has already been processed, skip to avoid infinite loop
        return
    }

    Get-ChildItem -Path $path -Directory -Force -ErrorAction SilentlyContinue | ForEach-Object {
        $currentPath = $_.FullName
        if ($foldersToRemove -contains $_.Name) {
            $size = Get-FolderSize $currentPath
            $totalSize += $size
            $totalFolders++
            
            $formattedSize = Format-Size $size
            if ($dryRun) {
                Write-Host "🔍 Would remove: $currentPath (Size: $formattedSize)" -ForegroundColor Yellow
            } else {
                Write-Host "🗑️  Removing $currentPath (Size: $formattedSize)..." -ForegroundColor Cyan
                try {
                    Remove-Item -Path $currentPath -Recurse -Force -ErrorAction Stop
                    Write-Host "✅ Removed successfully." -ForegroundColor Green
                } catch {
                    Write-Host "❌ Error removing: $_" -ForegroundColor Red
                }
            }
        } elseif ($verbose) {
            Write-Host "👀 Scanning: $currentPath" -ForegroundColor Gray
        }
        
        # Recursively search subdirectories
        Remove-Folders -path $currentPath
    }
}

# Validate the path
if (-not (Test-Path -Path $path -PathType Container)) {
    Write-Host "❌ Error: The specified path does not exist or is not a directory." -ForegroundColor Red
    exit 1
}

Write-Host "🧹 Starting cleanup in $path..."
if ($dryRun) { Write-Host "DRY RUN: No files will be deleted." -ForegroundColor Yellow }

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
Remove-Folders -path $path
$stopwatch.Stop()

$formattedTotalSize = Format-Size $totalSize
Write-Host "✨ Cleanup completed in $($stopwatch.Elapsed.TotalSeconds.ToString("F2")) seconds."
Write-Host "📊 Summary: $totalFolders folders processed, total size: $formattedTotalSize"

if ($dryRun) {
    Write-Host "To perform the actual cleanup, run the script without the -dryRun switch." -ForegroundColor Yellow
}
