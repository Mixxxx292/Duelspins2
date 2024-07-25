@echo off
set NODE_OPTIONS=--openssl-legacy-provider
echo Starting deployment process...

rem Set environment variables if needed
set NODE_ENV=production

rem Navigate to the client directory and build
cd client
call npm run build

rem Navigate back to the root directory
cd ..

rem Start the server in a new window
start cmd /k "cd server && npm start"

rem Start the client in development mode in a new window
start cmd /k "cd client && npm start"

echo Deployment process completed successfully!

