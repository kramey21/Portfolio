
get-date > F:\IncidentResponseLogs\systemtime.txt

systeminfo > F:\IncidentResponseLogs\systeminfo.txt

net user > F:\IncidentResponseLogs\useraccounts.txt

net groups > F:\IncidentResponseLogs\groups.txt

ipconfig /all > F:\IncidentResponseLogs\networkdetails.txt

route print > F:\IncidentResponseLogs\routingtablelog.txt

netstat -abn > F:\IncidentResponseLogs\netstatlog.txt

Start-Sleep -s 15

Get-FileHash F:\IncidentResponseLogs\*.txt > F:\IncidentResponseLogs\filehash.txt

