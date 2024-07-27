@echo off
set NODE_OPTIONS=--openssl-legacy-provider
echo Starting deployment process for Duelspins2...

rem Set environment variables
set NODE_ENV=production
set DOMAIN=duelspins.com
set SERVER_PORT=5000
set CLIENT_PORT=434
set ADMIN_PORT=8080

echo Environment variables set.

echo Stopping existing PM2 processes...
pm2 stop all
echo PM2 processes stopped.

echo Building main client...
cd client
call npm run build
cd ..
echo Main client built.

echo Building admin frontend...
cd admin
call npm run build
cd ..
echo Admin frontend built.

echo Starting the server using PM2...
pm2 start server/src/index.js --name duelspins2-server -- --port %SERVER_PORT%
echo Server started.

echo Serving the built client files using PM2...
pm2 serve client/build %CLIENT_PORT% --name duelspins2-client
echo Client files being served.

echo Serving the built admin files using PM2...
pm2 serve admin/dist %ADMIN_PORT% --name duelspins2-admin
echo Admin files being served.

echo Deployment complete. Duelspins2 is now running with PM2.
echo Main site: http://%DOMAIN%
echo Admin panel: http://%DOMAIN%:%ADMIN_PORT%
pm2 list

echo Deployment process finished.
