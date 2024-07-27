@echo off
set NODE_OPTIONS=--openssl-legacy-provider
echo Starting full deployment process for Duelspins2...

rem Set environment variables
set NODE_ENV=production
set DOMAIN=duelspins.com
set SERVER_PORT=5000
set CLIENT_PORT=443
set ADMIN_PORT=8080

rem Backup current version
echo Backing up current version...
xcopy /E /I /Y current_version backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%

rem Install dependencies
echo Installing dependencies...
call npm install
cd client && call npm install && cd ..
cd admin && call npm install && cd ..
cd server && call npm install && cd ..

rem Build main client
echo Building main client...
cd client
call npm run build
cd ..

rem Build admin frontend
echo Building admin frontend...
cd admin
call npm run build
cd ..

rem Run database migrations if needed
echo Running database migrations...
cd server
call npm run migrate
cd ..

rem Deploy Backend
echo Deploying Backend...
start cmd /k "cd server && node src/index.js"

rem Deploy Frontend
echo Deploying Frontend...
start cmd /k "cd client && npm start"

rem Deploy Admin Panel
echo Deploying Admin Panel...
start cmd /k "cd admin && npm run serve"

echo Deployment complete. Duelspins2 is now running on separate instances.
echo Main site: https://%DOMAIN%
echo Admin panel: https://%DOMAIN%:%ADMIN_PORT%

rem Cleanup old backups
echo Cleaning up old backups...
forfiles /P "backups" /M *.* /D -30 /C "cmd /c del @path"
