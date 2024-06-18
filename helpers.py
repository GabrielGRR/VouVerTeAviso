import calendar
from datetime import datetime
import pytz
import copy

calendar.setfirstweekday(calendar.SUNDAY) # semana começa no domingo
timezone = pytz.timezone('America/Sao_Paulo')  # Substitua pelo fuso horário do usuário

#junho/2024 é um bom mês para testar todos os códigos

#data atual para destacar e referenciar a partir dali
original_day = 1#int(datetime.now(timezone).strftime("%d"))  # Obtém o dia atual
original_month = int(datetime.now(timezone).strftime("%m"))  # Obtém o mês atual
original_year = int(datetime.now(timezone).strftime("%Y"))  # Obtém o ano atual

#data da semana do loop
current_day = original_day
current_month = original_month
current_year = original_year

lista_mes_ano = [current_month, current_year] #para alterar o valor destas variaveis por função

def next_month_calc(lista_mes_ano):
    lista_mes_ano[0]+=1
    if lista_mes_ano[0] > 12:
        lista_mes_ano[0] = 1 #current_month volta pra jan
        lista_mes_ano[1]+=1 # +1 ano

def prev_month_calc(lista_mes_ano):
    lista_mes_ano[0]-=1
    if lista_mes_ano[0] == 0:
        lista_mes_ano[0] = 12
        lista_mes_ano[1]-=1

#lista dos nomes dos meses no calendário
month_oftheweek = None
months_weeks = []
#os meses são dicionários pq se não o primeiro item da lista teria que ser None ou qualquer outro valor, fica feio
months = {1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'}

#shown weeks
week_list = []
num_rows = 6 #quantidade de semanas visiveis de uma vez no calendário

month_matrix = calendar.monthcalendar(current_year, current_month) #calendário com listas de todas as semanas do mês

#previous current_ calculation
prev_month = current_month-1
prev_year = current_year

if prev_month == 0:
    prev_month = 12
    prev_year-=1

prev_month_matrix = calendar.monthcalendar(prev_year, prev_month)

#next current_ calculation ~~~~~~~~~~~~~~~possivelmente deletar esta parte
next_month = current_month+1
next_year = current_year

if next_month == 13:
    next_month = 1
    next_year+=1

next_month_matrix = calendar.monthcalendar(next_year, next_month)

prev_verif = False
next_verif = False
week_found = False
week_counter = 0

for week in month_matrix: #loop no mês ORIGINAL
    day_counter = 0
    for finding_if_current_day in week:
        #printa somente a partir da semana que vc está
        if finding_if_current_day >= current_day: 
            week_found = True
            continue ####################### isto talvez quebre a função 

    if week_found:
        #preenchendo os meses das semanas
        if week[0] == 0:
            prev_verif = True
            month_oftheweek = months[prev_month]+"/"+months[current_month]
        elif week[-1] == 0:
            next_verif = True
            month_oftheweek = months[current_month]+"/"+months[next_month]##### possivelmente vai dar pau n sei como estava
        else:
            month_oftheweek = months[current_month]

        #substituindo os zeros 
        for day in week:
            next_month_check = True
            prev_month_check = True
            if day == 0 and week[-1] == 0:
                if next_month_check:
                    lista_mes_ano = copy.copy()
                    next_month_calc(lista_mes_ano) ############ resolver esta bagatela aqui    
                next_month_check = False 
                week[day_counter] = calendar.monthcalendar(current_year, current_month)[0][day_counter]

            elif day == 0:
                #if prev_month_check:
                #    prev_month_calc(lista_mes_ano)
                prev_month_check = False    
                week[day_counter] = calendar.monthcalendar(current_year, current_month-1)[-1][day_counter]

            day_counter+=1

        week_list.append(week)
        months_weeks.append(month_oftheweek)
        week_counter+=1

counter = 0
#adicionado próximas semanas que sairam do mês principal
while week_counter+counter < num_rows: 
    months_weeks.append(months[next_month])
    if next_verif:
        week_list.append(next_month_matrix[counter+1])

    else:
        week_list.append(next_month_matrix[counter])

    counter+=1

#~~~~~~~~~~~~~~testar o código com início/meio/final do mês, passar este código para o app.py, interatividade (onclick com o site), fazer uma inclusão disto com o SQL

for week in week_list:
    print(week)

for current_ in months_weeks:
    print(current_)
