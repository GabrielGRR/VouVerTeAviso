from datetime import datetime
#import pytz
#import urllib
#import calendar
from calendar_logic import first_month, add_month, month_headers, month_belong_to_day #importando as funções do meu arquivo helpers.py
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
        execute_command = """INSERT INTO event_days_hours(
        Id_event, Day, Month, Event_min_hour, Event_min_minute, Event_max_hour, Event_max_minute
        ) VALUES(?, ?, ?, ?, ?, ?, ?)"""

        Id_event = cursor.lastrowid

        days_array = data_package.get('days_array')

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
        
        connection.close()

        #avaliar se aqui será alcançado em alguma situação

        print(data_package)
        print("metodo get")

        return render_template('layout.html')
    

        #return f"Event name is: {event_name}\nevent starts at: {Event_min_hour}\nevent ends at: {Event_max_hour}"
        #return render_template("process_data.html")
    else:
        print("deu ruim")
        if request.method == "GET":
            return "Você tentou acessar diretamente pelo método GET"
        else:
            return "Falhou em alguma outra etapa"
        
@app.route('/<int:Id_event>', methods=["POST", "GET"])
def layout(Id_event):
    return f"o Id_event é {Id_event}"

if __name__ == '__main__':
    app.run(debug=True)