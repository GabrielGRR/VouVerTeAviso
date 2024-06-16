import calendar
from datetime import datetime
import pytz



calendar.setfirstweekday(calendar.SUNDAY) # semana começa no domingo
timezone = pytz.timezone('America/Sao_Paulo')  # Substitua pelo fuso horário do usuário
current_day = datetime.now(timezone).strftime("%d")  # Obtém o dia atual
month = int(datetime.now(timezone).strftime("%m"))  # Obtém o mês atual
year = int(datetime.now(timezone).strftime("%Y"))  # Obtém o ano atual

months_weeks = []

num_rows = 5 #quantidade de linhas do calendário

month_matrix = calendar.monthcalendar(year, month) #calendário com listas de todas as semanas do mês

#previous month calculation
prev_month = month-1
prev_year = year

if prev_month == 0:
    prev_month = 12
    prev_year-=1

prev_month_matrix = calendar.monthcalendar(prev_year, prev_month)

#next month calculation
next_month = month+1
next_year = year

if next_month == 13:
    next_month = 1
    next_year+=1

next_month_matrix = calendar.monthcalendar(next_year, next_month)

#shown weeks
week_1, week_2, week_3, week_4, week_5 = [], [], [], [], []
week_list = [week_1, week_2, week_3, week_4, week_5]

#loop que printa somente a partir da semana que vc está
week_found = False
week_counter = 0
prev_verif = False
next_verif = False
for week in month_matrix:
    day_counter = 0
    for day in week:
        if day >= int(current_day):
            week_found = True
            continue

    if week_found:
        #substituindo os zeros das semanas
        if week[0] == 0:
            prev_verif = True
        elif week[-1] == 0:
            next_verif = True
        #substituindo os zeros das semanas
        for day in week:
            if day == 0:
                if prev_verif:
                    week[day_counter] = prev_month_matrix[-1][day_counter]

                elif next_verif:
                    week[day_counter] = next_month_matrix[0][day_counter]

            day_counter+=1

        week_list[week_counter] = week
        week_counter+=1

counter = 0
while week_counter+counter < num_rows: 
    if next_verif:
        week_list[week_counter+counter] = next_month_matrix[counter+1]
    else:
        week_list[week_counter+counter] = next_month_matrix[counter]

    counter+=1

# adicionar months_week (no caso é a lista de strings do mês mai/jun, jun, jun jun,...

for week in week_list:
    print(week)