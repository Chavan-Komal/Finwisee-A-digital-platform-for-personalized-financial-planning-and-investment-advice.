@ECHO OFF
setlocal

set MAVEN_PROJECTBASEDIR=%~dp0
if not defined MAVEN_OPTS set MAVEN_OPTS=

set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_PROPERTIES="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties"

set DOWNLOAD_URL=
for /F "usebackq tokens=1,2 delims==" %%A in (%WRAPPER_PROPERTIES%) do (
  if "%%A"=="wrapperUrl" set DOWNLOAD_URL=%%B
)

if not exist %WRAPPER_JAR% (
  echo Downloading Maven Wrapper...
  powershell -Command "[Net.ServicePointManager]::SecurityProtocol = 'Tls12'; Invoke-WebRequest -UseBasicParsing %DOWNLOAD_URL% -OutFile %WRAPPER_JAR%"
)

set JAVA_EXE=java

%JAVA_EXE% -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" -cp %WRAPPER_JAR% org.apache.maven.wrapper.MavenWrapperMain %*

endlocal
