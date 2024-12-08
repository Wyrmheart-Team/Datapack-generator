# Navigate to mod/1.21.1 or exit if the directory doesn't exist
Set-Location -Path "mod/1.21.1" -ErrorAction Stop

Remove-Item -Path "../../public/generated/1.21.1/mod/classes" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "../../public/generated/1.21.1/mod/resources" -Recurse -Force -ErrorAction SilentlyContinue

# Run gradle tasks
./gradlew runData
./gradlew build

New-Item -ItemType Directory -Path "../../public/generated/1.21.1/mod/classes/" -Force
New-Item -ItemType Directory -Path "../../public/generated/1.21.1/mod/resources/" -Force

# Copy the compiled classes and resources to the public directory
Copy-Item -Path "build/classes/java/main/dmr_datapack/DMRDatapack.class" -Destination "../../public/generated/1.21.1/mod/classes/" -Force
Copy-Item -Path "build/resources/main/META-INF" -Destination "../../public/generated/1.21.1/mod/resources/" -Recurse -Force

# Navigate back to the root directory
Set-Location -Path "../.."
