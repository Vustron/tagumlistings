# PowerShell script to remove .next, .turbo, and node_modules folders
# To run this script in PowerShell, navigate to the directory containing the script and run .\cleanup.ps1

$foldersToRemove = @(".next", ".turbo", "node_modules")

# Function to remove folders
function Remove-Folders {
    param (
        [string]$path
    )

    foreach ($folder in $foldersToRemove) {
        $folderPath = Join-Path -Path $path -ChildPath $folder
        if (Test-Path -Path $folderPath) {
            Write-Host "🗑️  Removing $folderPath..."
            try {
                Remove-Item -Path $folderPath -Recurse -Force
                Write-Host "✅ ${folderPath} removed successfully."
            } catch {
                Write-Host "❌ Error removing ${folderPath}: $_"
            }
        } else {
            Write-Host "🔍 $folder does not exist in $path, skipping."
        }
    }

    # Recursively search subdirectories
    Get-ChildItem -Path $path -Directory | ForEach-Object {
        Remove-Folders -path $_.FullName
    }
}

# Start the removal process from the current directory
$currentDir = Get-Location
Write-Host "🧹 Starting cleanup in $currentDir..."
Remove-Folders -path $currentDir
Write-Host "✨ Cleanup completed."
