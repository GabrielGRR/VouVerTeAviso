import calendar
from datetime import datetime
import pytz

calendar.setfirstweekday(calendar.SUNDAY) # semana começa no domingo
timezone = pytz.timezone('America/Sao_Paulo')  # Substitua pelo fuso horário do usuário
current_day = 29#int(datetime.now(timezone).strftime("%d"))  # Obtém o dia atual
month = int(datetime.now(timezone).strftime("%m"))  # Obtém o mês atual
year = int(datetime.now(timezone).strftime("%Y"))  # Obtém o ano atual

months_weeks = []
months = {1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'}

month_oftheweek = None

#shown weeks
week_1, week_2, week_3, week_4, week_5, week_6 = [], [], [], [], [], []
week_list = [week_1, week_2, week_3, week_4, week_5, week_6]

num_rows = len(week_list) #quantidade de linhas do calendário

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


week_found = False
week_counter = 0
prev_verif = False
next_verif = False
for week in month_matrix:
    day_counter = 0
    for day in week:
        #printa somente a partir da semana que vc está
        if day >= current_day: 
            week_found = True
            continue

    if week_found:
        #preenchendo os meses das semanas
        if week[0] == 0:
            prev_verif = True
            month_oftheweek = months[prev_month]+"/"+months[month]
        elif week[-1] == 0:
            next_verif = True
            month_oftheweek = months[month]+"/"+months[next_month]
        else:
            month_oftheweek = months[month]

        #substituindo os zeros 
        for day in week:
            if day == 0:
                if prev_verif and week_counter == 0:
                    week[day_counter] = prev_month_matrix[-1][day_counter]

                elif next_verif:
                    week[day_counter] = next_month_matrix[0][day_counter]

            day_counter+=1

        week_list[week_counter] = week
        months_weeks.append(month_oftheweek)
        week_counter+=1

counter = 0
#adicionado próximas semanas que sairam do mês principal
while week_counter+counter < num_rows: 
    months_weeks.append(months[next_month])
    if next_verif:
        week_list[week_counter+counter] = next_month_matrix[counter+1]

    else:
        week_list[week_counter+counter] = next_month_matrix[counter]

    counter+=1

#~~~~~~~~~~~~~~testar o código com início/meio/final do mês, passar este código para o app.py, interatividade (onclick com o site), fazer uma inclusão disto com o SQL

for week in week_list:
    print(week)

for month in months_weeks:
    print(month)
