# PowerShell script to remove .next, .turbo, and node_modules folders
# To run this script in PowerShell, navigate to the directory containing the script and run .\cleanup.ps1

param (
    [ValidateScript({ Test-Path $_ -PathType Container })]
    [string]$path = (Get-Location),
    [switch]$dryRun = $false,
    [switch]$verbose = $false
)

$foldersToRemove = @()

# Function to prompt user for folders to remove
function Read-ForFolders {
    $foldersToRemove = @()
    $userInput = Read-Host "Enter the folders to remove (comma-separated)"
    $foldersToRemove += $userInput -split ",\s*"
    return $foldersToRemove
}

# Prompt user for folders to remove
$foldersToRemove = Read-ForFolders

$totalSize = 0
$totalFolders = 0
$processedPaths = New-Object System.Collections.Generic.HashSet[string]

# Function to check if folders exist
function Test-FoldersExist {
    param ([array]$folders)
    return $folders | Where-Object { -not (Test-Path -Path (Join-Path -Path $path -ChildPath $_) -PathType Container) }
}

# Preliminary check to see if the folders to be removed exist
$missingFolders = Test-FoldersExist -folders $foldersToRemove

if ($missingFolders.Count -gt 0) {
    Write-Host "The following folders to be removed do not exist:" -ForegroundColor Red
    $missingFolders | ForEach-Object { Write-Host $_ -ForegroundColor Red }
}

# Prompt for final confirmation
$confirmation = Read-Host "Are you sure you want to delete the following folders? $foldersToRemove (Y/N)"
if ($confirmation -ne 'Y') {
    Write-Host "Operation cancelled by user." -ForegroundColor Yellow
    return
}

$folderCount = (Get-ChildItem -Path $path -Recurse -Directory -Force -ErrorAction SilentlyContinue | Where-Object { $foldersToRemove -contains $_.Name }).Count
$currentFolderIndex = 0

function Get-FolderSize {
    param ([string]$folder)
    try {
        return (Get-ChildItem $folder -Recurse -Force -ErrorAction Stop | Measure-Object -Property Length -Sum).Sum
    } catch {
        Write-Host "Error calculating size for: $folder" -ForegroundColor Red
        return 0
    }
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
        $currentFolderIndex++
        
        if ($folderCount -gt 0) {
            $percentComplete = [math]::Min((($currentFolderIndex / $folderCount) * 100), 100)
            Write-Progress -Activity "Cleaning up folders" -Status "Processing $currentPath" -PercentComplete $percentComplete
        }

        if ($foldersToRemove -contains $_.Name) {
            if (Test-Path -Path $currentPath -PathType Container) {
                $size = Get-FolderSize $currentPath
                $totalSize += $size
                $totalFolders++
                
                $formattedSize = Format-Size $size
                if ($dryRun) {
                    Write-Host "Would remove: $currentPath (Size: $formattedSize)" -ForegroundColor Yellow
                } else {
                    Write-Host "Removing $currentPath (Size: $formattedSize)..." -ForegroundColor Cyan
                    try {
                        Remove-Item -Path $currentPath -Recurse -Force -ErrorAction Stop
                        Write-Host "Removed successfully." -ForegroundColor Green
                    } catch {
                        Write-Host "Error removing: $_" -ForegroundColor Red
                    }
                }
            } else {
                Write-Host "Folder does not exist: $currentPath" -ForegroundColor Red
            }
        } elseif ($verbose) {
            Write-Host "Scanning: $currentPath" -ForegroundColor Gray
        }
        
        # Recursively search subdirectories
        Remove-Folders -path $currentPath
    }
}

Write-Host "Starting cleanup in $path..."

if ($dryRun) { 
    Write-Host "DRY RUN: No files will be deleted." -ForegroundColor Yellow 
}

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
Remove-Folders -path $path
$stopwatch.Stop()

$elapsedTime = $stopwatch.Elapsed.TotalSeconds.ToString("F2")
Write-Host "Cleanup completed in $elapsedTime seconds."

if ($dryRun) {
    Write-Host "To perform the actual cleanup, run the script without the -dryRun switch." -ForegroundColor Yellow
}
