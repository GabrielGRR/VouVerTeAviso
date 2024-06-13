import calendar
from datetime import datetime
import pytz



calendar.setfirstweekday(0)
timezone = pytz.timezone('America/Sao_Paulo')  # Substitua pelo fuso horário do usuário
current_day = datetime.now(timezone).strftime("%d")  # Obtém o dia atual
month = int(datetime.now(timezone).strftime("%m"))  # Obtém o mês atual
year = int(datetime.now(timezone).strftime("%Y"))  # Obtém o ano atual
week_found = False
week_counter = 0

month_matrix = calendar.monthcalendar(year, month) #calendário com listas de todas as semanas do mês

#loop que printa somente a partir da semana que vc está
for week in month_matrix:
    for day in week:
        if day >= int(current_day):
            week_found = True

    if week_found:
        print(week)
        week_counter+=1

    week_found = False