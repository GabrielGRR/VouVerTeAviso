from datetime import datetime
#import pytz
#import urllib
#import calendar
from calendar_logic import first_month, add_month, month_headers, month_belong_to_day
import sqlite3 as sql

from flask import Flask, flash, redirect, render_template, g, request, jsonify, url_for 
#from flask_session import Session
#from werkzeug.security import check_password_hash, generate_password_hash

# Configure application
app = Flask(__name__)

#iniciação do calendário
month_monthlist, month_weekslist = first_month()
for _ in range(11): # o range deve ser de 11 meses (são 11 + first month)
    add_month()

excl_months, bool_list = month_headers()
month_of_the_day = month_belong_to_day()
num_rows = len(month_monthlist)

#Inicialização do get_event_name
@app.route('/', methods=["POST","GET"])
def index():
    calendar_header = ['semana', 'D','S','T','Q','Q','S','S'] #ano tbm?

    return render_template('index.html', 
                           num_rows= num_rows, 
                           calendar_header= calendar_header, 
                           monthlist = month_monthlist, 
                           weeklist = month_weekslist,
                           excl_months = excl_months,
                           bool_list = bool_list,
                           month_of_the_day = month_of_the_day)

#Rota acessada para criar evento e processar dados
@app.route('/process-data', methods=["POST", "GET"])
def process_data():
    if request.method == "POST":
        #cria conexão com o BD
        connection = sql.connect('events_db.db')
        #Cursor é o objeto que irá manipular a DB, acessando as células e executando comandos
        cursor = connection.cursor() 
        #coletando dados do JSON, o formato é em DICT{'days_array': [['24', 'Jul'], ['31', 'Jul']], 'event_min_hour': '4', 
        # 'event_min_minute': '50', 'event_max_hour': '7', 'event_max_minute': '50', 'event_name': 'ssss'}
        
        data_package = request.get_json()
        event_name = data_package.get('event_name')
        execute_command = "INSERT INTO event(Event) VALUES(?)"
        cursor.execute(execute_command, [event_name])
        connection.commit()

        #agora é adicionado outras informações, como horário mínimo e máximo e linkando ao ID único do evento
        execute_command = """INSERT INTO event_time(
        Id_event, Day, Month, Event_min_hour, Event_min_minute, Event_max_hour, Event_max_minute
        ) VALUES(?, ?, ?, ?, ?, ?, ?)"""

        Id_event = cursor.lastrowid

        days_array = data_package.get('days_array')

        print(data_package)
        for i in range(len(days_array)):
            Day = days_array[i][0]
            Month = days_array[i][1]

            #possivelmente terei de escalar este código ao incluir horários individuais dos dias de evento
            
            Event_min_hour = data_package.get('event_min_hour')
            Event_min_minute = data_package.get('event_min_minute')
            Event_max_hour = data_package.get('event_max_hour')
            Event_max_minute = data_package.get('event_max_minute')
            cursor.execute(execute_command, [Id_event, Day, Month, Event_min_hour, 
                                            Event_min_minute, Event_max_hour, Event_max_minute])
        connection.commit()

        connection.close()   
        return jsonify({"url": f"/{Id_event}", 
                        "Id_event": Id_event
                        })

    #aqui com certeza tem problema
    else:
        print("deu ruim")
        if request.method == "GET":
            return "Você tentou acessar diretamente pelo método GET"
        else:
            return "Falhou em alguma outra etapa"

@app.route('/<int:Id_event>', methods=["POST", "GET"])
def events(Id_event):
    #cria conexão com o BD
    connection = sql.connect('events_db.db')
    cursor = connection.cursor()
    query = f"select Day, Month, Event_min_hour, Event_max_hour from event_time where Id_event = {Id_event} order by Day;"
    result = cursor.execute(query).fetchall()
    
    print(result)
    #se não tiver dias marcados no calendário
    #acredito que isto não está funcionando, entender o pq dps
    if not result:
        print('fedorento deu submit vazio')
        return redirect(url_for('index'))

    print(type(result[0][-1]))
    # if not isinstance(result[0][-1], int):
    #     print('is not int')
    #     result[0][-1] = 12
    #     result[0][-2] = 18
    connection.close() #talvez seja desnecessário
    print(result)
    return render_template('event.html', Id_event = Id_event, event_data = result )


############## mexer neste código
#Rota acessada para criar evento e processar dados
@app.route('/user-data', methods=["POST", "GET"])
def user_event():
    if request.method == "POST":

        # json output: {'user_name': 'teste', 'id_event': '196', 'user_times': [['10', 'Out', '15', '00'], ['10', 'Out', '15', '45'], ['10', 'Out', '17', '45'], ['8', 'Out', '16', '00'], ['8', 'Out', '17', '00']]}

        data_package = request.get_json()
        user_name = data_package.get('user_name')
        id_event = data_package.get('id_event')
        user_times = data_package.get('user_times')

        # não esquecer de converter user_hour e user_min para int

        print(data_package)
        print(user_name,id_event,user_times)

        connection = sql.connect('events_db.db')
        cursor = connection.cursor()         
        execute_command = "INSERT INTO users_time(Id_event, User_name, User_month, User_day, User_hour, User_minute) VALUES(?,?,?,?,?,?)"
        for time in user_times:
            cursor.execute(execute_command, [id_event, user_name, time[0], time[1], time[2], time[3]])

        connection.commit()
        connection.close()

        return jsonify({"url": f"/{id_event}", 
                        "Id_event": id_event
                        })

    #aqui com certeza tem problema
    else:
        print("deu ruim")
        if request.method == "GET":
            return "Você tentou acessar diretamente pelo método GET"
        else:
            return "Falhou em alguma outra etapa"

if __name__ == '__main__':
    app.run(debug=True)
