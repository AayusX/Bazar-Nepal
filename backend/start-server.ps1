$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:JAVA_TOOL_OPTIONS = "-Duser.timezone=UTC"
$env:PORT = "8080"
$env:PGHOST = "tokaido.proxy.rlwy.net"
$env:PGPORT = "42860"
$env:PGDATABASE = "railway"
$env:PGUSER = "postgres"
$env:PGPASSWORD = "oKogXMQBwevoMvSKFionlSShfUxWXmoJ"

$java = "C:\Program Files\Java\jdk-21\bin\java.exe"
$jar = "C:\Users\DELL\Desktop\project secret\mobile-app\backend\target\bazaar-nepal-backend-0.0.1-SNAPSHOT.jar"
$log = "C:\Users\DELL\Desktop\project secret\backend-server.log"

while ($true) {
    "=== BazaarNepal server starting at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ===" | Add-Content -Path $log
    & $java -jar $jar *>> $log
    "=== server stopped at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') restarting in 5s ===" | Add-Content -Path $log
    Start-Sleep -Seconds 5
}
