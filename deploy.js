@echo off
set NODE_OPTIONS=--openssl-legacy-provider
echo Starting deployment process for Duelspins2...

rem Set environment variables
set NODE_ENV=production
set DOMAIN=duelspins.com
set SERVER_PORT=5000
set CLIENT_PORT=434
set ADMIN_PORT=8080

echo Environment variables set. Press any key to continue...
pause > nul

echo Stopping existing PM2 processes...
pm2 stop all
echo PM2 processes stopped. Press any key to continue...
pause > nul

echo Building main client...
cd client
call npm run build
cd ..
echo Main client built. Press any key to continue...
pause > nul

echo Building admin frontend...
cd admin
call npm run build
cd ..
echo Admin frontend built. Press any key to continue...
pause > nul

echo Starting the server using PM2...
pm2 start server/src/index.js --name duelspins2-server -- --port %SERVER_PORT%
echo Server started. Press any key to continue...
pause > nul

echo Serving the built client files using PM2...
pm2 start npx --name duelspins2-client -- http-server client/build -p %CLIENT_PORT% --proxy http://localhost:%SERVER_PORT%
echo Client files being served. Press any key to continue...
pause > nul

echo Serving the built admin files using PM2...
pm2 start npx --name duelspins2-admin -- http-server admin/dist -p %ADMIN_PORT%
echo Admin files being served. Press any key to continue...
pause > nul

echo Deployment complete. Duelspins2 is now running with PM2.
echo Main site: http://%DOMAIN%
echo Admin panel: http://%DOMAIN%:%ADMIN_PORT%
pm2 list

echo Deployment process finished. Press any key to exit...
pause > nul
