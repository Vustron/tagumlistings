# PowerShell script to remove folders
# To run this script in PowerShell, navigate to the directory containing the script and run .\cleanup.ps1

param (
    [ValidateScript({ Test-Path $_ -PathType Container })]
    [string]$path = (Get-Location),
    [switch]$dryRun = $false,
    [switch]$verbose = $false
)

function Format-Size {
    param ([long]$size)
    if ($size -gt 1GB) { return "{0:N2} GB" -f ($size / 1GB) }
    elseif ($size -gt 1MB) { return "{0:N2} MB" -f ($size / 1MB) }
    elseif ($size -gt 1KB) { return "{0:N2} KB" -f ($size / 1KB) }
    else { return "$size Bytes" }
}

# Initialize statistics
$stats = @{
    TotalSize = 0
    TotalFolders = 0
    ProcessedItems = 0
    FailedItems = 0
    CurrentFile = ""
}

$processedPaths = New-Object System.Collections.Generic.HashSet[string]

# Function to check if folders exist in the directory tree
function Test-FoldersExist {
    param (
        [string[]]$folderNames,
        [string]$basePath
    )
    
    Write-Host "`nChecking for folder existence..." -ForegroundColor Cyan
    $foundFolders = @()
    $notFoundFolders = @()
    
    foreach ($folder in $folderNames) {
        Write-Progress -Activity "Checking folders" -Status "Searching for: $folder" -PercentComplete -1
        
        $exists = Get-ChildItem -Path $basePath -Recurse -Directory -Force -ErrorAction SilentlyContinue |
                 Where-Object { $_.Name -eq $folder } |
                 Select-Object -First 1
        
        if ($exists) {
            $foundFolders += $folder
            Write-Host "✓ Found: $folder" -ForegroundColor Green
        } else {
            $notFoundFolders += $folder
            Write-Host "✗ Not found: $folder" -ForegroundColor Red
        }
    }
    
    Write-Progress -Activity "Checking folders" -Completed
    
    return @{
        Found = $foundFolders
        NotFound = $notFoundFolders
    }
}

# Function to prompt user for folders to remove
function Read-FoldersToRemove {
    Write-Host "Enter the folders to remove (comma-separated, e.g., node_modules,.next,.turbo):" -ForegroundColor Cyan
    $userInput = Read-Host
    return $userInput -split ",\s*" | Where-Object { $_ -ne "" } | ForEach-Object { $_.Trim() }
}

# Get folders to remove
$foldersToRemove = Read-FoldersToRemove

# Validate input
if ($foldersToRemove.Count -eq 0) {
    Write-Host "No folders specified. Exiting..." -ForegroundColor Yellow
    exit
}

# Check folder existence
$existenceCheck = Test-FoldersExist -folderNames $foldersToRemove -basePath $path

if ($existenceCheck.NotFound.Count -gt 0) {
    Write-Host "`nWarning: Some folders were not found in the directory tree:" -ForegroundColor Yellow
    $existenceCheck.NotFound | ForEach-Object {
        Write-Host "- $_" -ForegroundColor Yellow
    }
    
    $proceed = Read-Host "`nDo you want to continue with the found folders only? (Y/N)"
    if ($proceed -ne 'Y') {
        Write-Host "Operation cancelled by user." -ForegroundColor Yellow
        exit
    }
    
    # Update folders to remove with only the found folders
    $foldersToRemove = $existenceCheck.Found
}

if ($foldersToRemove.Count -eq 0) {
    Write-Host "No folders found to remove. Exiting..." -ForegroundColor Yellow
    exit
}

Write-Host "`nWill process the following folders:" -ForegroundColor Cyan
$foldersToRemove | ForEach-Object {
    Write-Host "- $_" -ForegroundColor White
}

# Function to calculate total work
function Get-TotalWork {
    param ([string]$searchPath)
    $total = 0
    Write-Progress -Activity "Calculating total folders..." -Status "Scanning directories" -PercentComplete 0
    
    $folders = Get-ChildItem -Path $searchPath -Recurse -Directory -Force -ErrorAction SilentlyContinue |
               Where-Object { $foldersToRemove -contains $_.Name }
    
    $folders | ForEach-Object { 
        $total++
        Write-Progress -Activity "Calculating total folders..." -Status "Found $total folders" -PercentComplete -1
    }
    
    Write-Progress -Activity "Calculating total folders..." -Completed
    return $total
}

# Calculate total work
Write-Host "`nCalculating total work..." -ForegroundColor Cyan
$totalWork = Get-TotalWork -searchPath $path

function Remove-Folders {
    param ([string]$currentPath)

    if (-not $processedPaths.Add($currentPath)) { return }

    Get-ChildItem -Path $currentPath -Directory -Force -ErrorAction SilentlyContinue | ForEach-Object {
        $folderPath = $_.FullName
        
        # Update progress bar
        $progress = [math]::Round(($stats.ProcessedItems / $totalWork) * 100)
        $stats.CurrentFile = $_.Name
        
        Write-Progress -Activity "Cleaning up folders" `
                      -Status "Processing: $($stats.CurrentFile)" `
                      -PercentComplete $progress `
                      -CurrentOperation "Removed: $($stats.ProcessedItems)/$totalWork folders ($($stats.FailedItems) failed)"

        if ($foldersToRemove -contains $_.Name) {
            $size = (Get-ChildItem $folderPath -Recurse -Force -ErrorAction SilentlyContinue | 
                    Measure-Object -Property Length -Sum).Sum
            $stats.TotalSize += $size
            $stats.TotalFolders++
            $stats.ProcessedItems++

            $formattedSize = Format-Size $size
            if ($dryRun) {
                Write-Host "Would remove: $folderPath (Size: $formattedSize)" -ForegroundColor Yellow
            } else {
                try {
                    Remove-Item -Path $folderPath -Recurse -Force -ErrorAction Stop
                    Write-Host "Removed: $folderPath (Size: $formattedSize)" -ForegroundColor Green
                } catch {
                    $stats.FailedItems++
                    Write-Host "Failed to remove: $folderPath - $($_.Exception.Message)" -ForegroundColor Red
                }
            }
        } elseif ($verbose) {
            Write-Host "Scanning: $folderPath" -ForegroundColor Gray
        }

        # Recurse into subdirectories
        Remove-Folders -currentPath $folderPath
    }
}

# Main execution
Write-Host "Starting cleanup in $path..."
if ($dryRun) { 
    Write-Host "DRY RUN MODE: No files will be deleted." -ForegroundColor Yellow 
}

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
Remove-Folders -currentPath $path
$stopwatch.Stop()

# Complete the progress bar
Write-Progress -Activity "Cleaning up folders" -Completed

# Final statistics
Write-Host "`nCleanup Summary:" -ForegroundColor Cyan
Write-Host "----------------" -ForegroundColor Cyan
Write-Host "Total folders processed: $($stats.TotalFolders)" -ForegroundColor White
Write-Host "Total size cleaned: $(Format-Size $stats.TotalSize)" -ForegroundColor White
Write-Host "Failed operations: $($stats.FailedItems)" -ForegroundColor $(if ($stats.FailedItems -gt 0) { 'Red' } else { 'White' })
Write-Host "Time elapsed: $($stopwatch.Elapsed.TotalSeconds.ToString('F2')) seconds" -ForegroundColor White

if ($dryRun) {
    Write-Host "`nTo perform the actual cleanup, run the script without the -dryRun switch." -ForegroundColor Yellow
}
