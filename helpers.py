import calendar
from datetime import datetime
import pytz

#junho/2024 é um bom mês para testar todos os códigos

calendar.setfirstweekday(calendar.SUNDAY) # semana começa no domingo
timezone = pytz.timezone('America/Sao_Paulo')  # Substitua pelo fuso horário do usuário

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
months = {1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'}

#shown weeks
week_list = []
first_month_matrix = calendar.monthcalendar(current_year, current_month) #calendário com listas de todas as semanas do mês

first_month_check = True
def months_in_the_week(week):
    #string com semana do mes (jun/jul)
    #TEM que usar depois de zero_removal
    global current_month
    global months_weeks
    global months
    global original_day
    global first_month_check
    if week[-1] < week[0] and (original_day <= week[-1] and current_month == original_month) and first_month_check:#primeira semana de first_month
        _, prev_month = prev_month_calc(current_year, current_month) 
        month_of_the_week = f"{months[prev_month]}/{months[current_month]}"
        first_month_check = False
    elif week[-1] < week[0]: #mês atual + prox
        _, next_month = next_month_calc(current_year, current_month) 
        month_of_the_week = f"{months[current_month]}/{months[next_month]}"
    else: #semana/dia normal
        month_of_the_week = f"{months[current_month]}"
    months_weeks.append(month_of_the_week)

def next_month_calc(current_year, current_month): #mudar pos desta linha no código?
    new_month = current_month
    new_year = current_year
    new_month+=1
    if new_month > 12:
        new_month = 1 #current_month volta pra jan
        new_year+=1 # +1 ano

    return new_year, new_month

def prev_month_calc(current_year, current_month): #mudar pos desta linha no código?
    prev_month = current_month
    prev_year = current_year
    prev_month-=1
    if prev_month == 0:
        prev_month = 12 #current_month volta pra jan
        prev_year-=1 # +1 ano
    return prev_year, prev_month

def zero_removal(week):
    day_counter = 0
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
    global week_list, current_month, current_year, current_day, months_weeks

    #correção caso a primeira semana tenha a semana compartilhada com o mês anterior, já que o current_month não linka o mês anterior
    shared_first_week_month = False
    if first_month_matrix[0][0] == 0 and first_month_matrix[0][-1] >= current_day:
        _, current_month = prev_month_calc(current_year, current_month)
        shared_first_week_month = True

    found = False
    for week in first_month_matrix: #loop no mês ORIGINAL
        for day in week:
            #encontrar dia da semana que você está
            if day == current_day:
                found = True            
                break 

        if found:

            if shared_first_week_month: #reestruturação do current_month
                _, current_month = next_month_calc(current_year, current_month)
                shared_first_week_month = False
            zero_removal(week)
            months_in_the_week(week)
            week_list.append(week)

    current_year, current_month = next_month_calc(current_year, current_month) #add +1 ao mês

    return months_weeks, week_list

#altera alguns itens como jan/fev para somente fev
def month_headers():
    global months_weeks, original_month
    months_header = []
    month_check = set()
    i = 0
    for month in months_weeks:
        month_slashless = month.split('/')[-1]
        if month_slashless not in month_check:
            month_check.add(month_slashless)
            months_header.append(month_slashless)
        i+=1
    
    if months_header[0] != months[original_month]:  #quando passar pro dia 30 para o 1, o mês virar
        months_header.insert(0, months[original_month])
    
    #mês booleano para adicionar <a> no html
    
    bool_months_weeks = []
    prev_month = None
    counter = 0
    for month in months_weeks:
        if prev_month == None:
            bool_months_weeks.append(True)
            prev_month = months_header[counter]
            counter+=1
        elif prev_month == month:
            bool_months_weeks.append("")
        else:
            bool_months_weeks.append(True)
            prev_month = month.split("/")[-1]
    return months_header, bool_months_weeks

# first_month() # primeira semana é o elemento que não se repete
# for _ in range(11):
#     add_month() #repetição de meses


# months_header, bool_months_weeks = month_headers()
# print('---')
# for i in range(len(week_list)):
#     print(months_weeks[i], bool_months_weeks[i])




#first_month_monthlist, first_month_weekslist = first_month()
#print(first_month_monthlist, first_month_weekslist)


#a nova ideia é sempre ter 12 meses, aí a pessoa vai scrollando até este limite
#se a pessoa scrollar mais do que a metade do próximo mês, add_month() e vai indo