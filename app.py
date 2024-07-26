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
        print("POST")

        #cria conexão com o BD
        connection = sql.connect('events_db.db')
        #Cursor é o objeto que irá manipular a DB, acessando as células e executando comandos
        cursor = connection.cursor() 
        #adicionando primeiro o evento para pegar sua ID única
        event_name = request.form.get("event_name")
        execute_command = "INSERT INTO event(Event) VALUES(?)"
        cursor.execute(execute_command, [event_name])
        connection.commit()

        #agora é adicionado outras informações, como horário mínimo e máximo e linkando ao ID único do evento
        execute_command = 'INSERT INTO event_days_hours(Id_event, Day, Month, Event_min_hour, Event_min_minute, Event_max_hour, Event_max_minute) VALUES(?, ?, ?, ?, ?, ?, ?)'
        cursor.execute('SELECT Id_event FROM event ORDER BY Id_event DESC LIMIT 1')
        Id_event = cursor.fetchone()[0]
        
        Day = 'day_test'
        Month = 'month_test'
        Event_min_hour = request.form.get("hour_1")
        Event_min_minute = request.form.get("min_1")
        Event_max_hour = request.form.get("hour_2")
        Event_max_minute = request.form.get("min_2")
        cursor.execute(execute_command, [Id_event, Day, Month, Event_min_hour, Event_min_minute, Event_max_hour, Event_max_minute])
        connection.commit()

        connection.close()

        days_list = request.json.get('days_array')
        return jsonify({'result': days_list}) 
        #return f"Event name is: {event_name}\nevent starts at: {Event_min_hour}\nevent ends at: {Event_max_hour}"
        #return render_template("process_data.html")
    else:
        print("deu ruim")
        if request.method == "GET":
            return "Você tentou acessar diretamente pelo método GET"
        else:
            return "Falhou em alguma outra etapa"

if __name__ == '__main__':
    app.run(debug=True)