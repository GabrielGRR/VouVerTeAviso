import calendar
from datetime import datetime
import pytz

#fazer um código orientado a objeto, a primeira linha checa se tem zeros do mês anterior e depois adiciona o mês via objeto
#quatidade de meses é infinito, irá executar um novo objeto a medida que a pessoa for scrollando

#~~~~~~~~~~testar o código com início/meio/final do mês, passar este código para o app.py, 
# interatividade (onclick com o site), fazer uma inclusão disto com o SQL

calendar.setfirstweekday(calendar.SUNDAY) # semana começa no domingo
timezone = pytz.timezone('America/Sao_Paulo')  # Substitua pelo fuso horário do usuário

#junho/2024 é um bom mês para testar todos os códigos

#data atual para destacar e referenciar a partir dali
original_day = int(datetime.now(timezone).strftime("%d"))  # Obtém o dia atual
original_month = int(datetime.now(timezone).strftime("%m"))  # Obtém o mês atual
original_year = int(datetime.now(timezone).strftime("%Y"))  # Obtém o ano atual

#data da semana do loop
current_day = original_day
current_month = original_month
current_year = original_year

#lista dos nomes dos meses no calendário

months_weeks = []
#os meses são dicionários pq se não o primeiro item da lista teria que ser None ou qualquer outro valor, fica feio e não intuitivo
months = {1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'}

#shown weeks
week_list = []
first_month_matrix = calendar.monthcalendar(current_year, current_month) #calendário com listas de todas as semanas do mês

def months_in_the_week(week):
    #string com semana do mes (jun/jul)
    #TEM que usar depois de zero_removal
    global current_month
    global months_weeks
    global months
    if week[-1] < week[0]:#mês atual + prox
        _, next_month = next_month_calc(current_year, current_month) 
        month_of_the_week = f"{months[current_month]}/{months[next_month]}"
    else:
        month_of_the_week = f"{months[current_month]}"
    months_weeks.append(month_of_the_week)

def next_month_calc(current_year, current_month): #mudar pos desta linha no código?
    new_month = current_month
    new_year = current_year
    new_month+=1
    if current_month > 12:
        new_month = 1 #current_month volta pra jan
        new_year+=1 # +1 ano
    return new_year, new_month

def prev_month_calc(current_year, current_month): #mudar pos desta linha no código?
    prev_month = current_month
    prev_year = current_year
    prev_month-=1
    if current_month == 0:
        prev_month = 12 #current_month volta pra jan
        prev_year-=1 # +1 ano
    return prev_year, prev_month

def zero_removal(week):
    day_counter = 0
    next_month_check = True
    for day in week:        
        if day == 0 and week[-1] == 0: #prox mês
            new_year, new_month = next_month_calc(current_year, current_month)
            week[day_counter] = calendar.monthcalendar(new_year, new_month)[0][day_counter]
        
        elif day == 0: #mês anterior
            prev_year, prev_month = prev_month_calc(current_year,current_month)
            week[day_counter] = calendar.monthcalendar(prev_year, prev_month)[-1][day_counter]
       
        day_counter+=1

def add_month():
    #só podem haver duas semanas com zeros, a primera ou a ultima
    global week_list, current_month, current_year, months_weeks
    new_month_matrix = calendar.monthcalendar(current_year, current_month)
    week_counter = 0
    skip = False
    #checa se a primeira semana possui algum zero, se sim é pq ja foi eliminado, então pular
    if new_month_matrix[0][0] == 0 or new_month_matrix[0][-1] == 0:
        skip = True
    for week in new_month_matrix:
        if week_counter == 0 and skip:
            week_counter+=1
            continue
        #conferir se a última semana tem zeros, se sim, zero_removal()
        if week[-1] == 0:
            zero_removal(week)
        week_list.append(week)
        months_in_the_week(week)
        week_counter+=1
        
    current_year, current_month = next_month_calc(current_year, current_month) #add +1 ao mês
    return months_weeks, week_list


def first_month():
    global week_list, current_month, current_year, months_weeks
    found = False
    for week in first_month_matrix: #loop no mês ORIGINAL
        for day in week:
            #encontrar dia da semana que você está
            if day == current_day:
                found = True            
                break 

        if found:
            zero_removal(week)
            months_in_the_week(week)
            week_list.append(week)

    current_year, current_month = next_month_calc(current_year, current_month) #add +1 ao mês

    return months_weeks, week_list


#first_month() # primeira semana é o elemento que não se repete

#add_month() #repetição de meses

#add_month() #repetição de meses

#first_month_monthlist, first_month_weekslist = first_month()
#print(first_month_monthlist, first_month_weekslist)


#se a pessoa scrollar mais do que a metade do próximo mês, add_month() e vai indo