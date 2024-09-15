@echo off

docker login -u douglaseleuterioferreira -p Fox789789@!
if %errorlevel% neq 0 exit /b %errorlevel%

docker build -t clinica-app-v1.0.16 --build-arg VERSION=1.0.16 .
if %errorlevel% neq 0 exit /b %errorlevel%

docker tag clinica-app-v1.0.16 douglaseleuterioferreira/apps:clinica-app-v1.0.16
if %errorlevel% neq 0 exit /b %errorlevel%

docker push douglaseleuterioferreira/apps:clinica-app-v1.0.16
if %errorlevel% neq 0 exit /b %errorlevel%

echo Done!
