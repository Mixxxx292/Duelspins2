@echo off
set NODE_OPTIONS=--openssl-legacy-provider
echo Starting build process...

rem Navigate to the client directory and build
cd client
call npm run build

rem Navigate back to the root directory
cd ..

rem Navigate to the server directory and build
cd server
call npm run build

echo Build process completed successfully!
