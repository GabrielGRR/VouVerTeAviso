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

# print(month_of_the_day) 

#Inicialização da home
@app.route('/', methods=["POST","GET"])
def index():

    return render_template('index.html', 
                           num_rows= num_rows, 
                           monthlist = month_monthlist, 
                           weeklist = month_weekslist,
                           excl_months = excl_months,
                           bool_list = bool_list,
                           month_and_year_of_the_day = month_of_the_day)

#Rota acessada para criar evento e processar dados
@app.route('/process-data', methods=["POST", "GET"])
def process_data():
    if request.method == "POST":
        #cria conexão com o BD
        connection = sql.connect('events_db.db')
        #Cursor é o objeto que irá manipular a DB, acessando as células e executando comandos
        cursor = connection.cursor() 
        
        data_package = request.get_json()
        event_name = data_package.get('event_name')
        execute_command = "INSERT INTO event(Event) VALUES(?)"
        cursor.execute(execute_command, [event_name])
        connection.commit()

        #agora é adicionado outras informações, como horário mínimo e máximo e linkando ao ID único do evento
        execute_command = """INSERT INTO event_time(
        Id_event, Day, Month, Event_min_hour, Event_max_hour, Year) VALUES(?, ?, ?, ?, ?, ?)"""

        Id_event = cursor.lastrowid

        days_array = data_package.get('days_array')

        # print(data_package)
        for i in range(len(days_array)):
            Day = days_array[i][0]
            Month = days_array[i][1]
            Year = days_array[i][2]

            #possivelmente terei de escalar este código ao incluir horários individuais dos dias de evento
            
            Event_min_hour = data_package.get('event_min_hour')
            Event_max_hour = data_package.get('event_max_hour')
            cursor.execute(execute_command, [Id_event, Day, Month, Event_min_hour, Event_max_hour, Year])
        connection.commit()

        connection.close()   
        return jsonify({"url": f"/{Id_event}", 
                        "Id_event": Id_event
                        })

    else:
        print("Você tentou acessar diretamente pelo método GET")

#Rota do evento
@app.route('/<int:Id_event>', methods=["POST", "GET"])
def events(Id_event):
    #cria conexão com o BD
    connection = sql.connect('events_db.db')
    cursor = connection.cursor()
    event_query = f"""SELECT Day, Month, Event_min_hour, Event_max_hour, Year FROM event_time WHERE Id_event = {Id_event}
    ORDER BY Year,
        CASE 
            WHEN Month = 'Jan' THEN 1
            WHEN Month = 'Fev' THEN 2
            WHEN Month = 'Mar' THEN 3
            WHEN Month = 'Abr' THEN 4
            WHEN Month = 'Mai' THEN 5
            WHEN Month = 'Jun' THEN 6
            WHEN Month = 'Jul' THEN 7
            WHEN Month = 'Ago' THEN 8
            WHEN Month = 'Set' THEN 9
            WHEN Month = 'Out' THEN 10
            WHEN Month = 'Nov' THEN 11
            WHEN Month = 'Dez' THEN 12
        END,
        Day;"""
    result = cursor.execute(event_query).fetchall()

    # filtrar por ano > mês > Dia 
    # pytz e month_monthlist
    
    # print(result)
    #se não tiver dias marcados no calendário
    #acredito que isto não está funcionando, entender o pq dps
    #provavelmente lidar com isso via JS ou html de não deixar ele dar submit vazio
    if not result:
        print('Submit vazio')
        return redirect(url_for('index'))

    users_query = f"select User_name, User_month, User_day, User_hour, User_minute, User_year from users_time where Id_event = {Id_event};"
    users_result = cursor.execute(users_query).fetchall()
    # print(users_result)

    users_query = f"select event from event where id_event = {Id_event};"
    name_event = cursor.execute(users_query).fetchone()
    # print(name_event)

    connection.close() #talvez seja desnecessário
    # print(result)
    return render_template('event.html', Id_event = Id_event, event_data = result, users_result = users_result, name_event = name_event[0])

#Enviar para o BD informações do usuário
@app.route('/user-data', methods=["POST", "GET"])
def user_event():
    if request.method == "POST":

        # json output: {'user_name': 'teste', 'id_event': '196', 'user_times': [['10', 'Out', '15', '00'], ['10', 'Out', '15', '45'], ['10', 'Out', '17', '45'], ['8', 'Out', '16', '00'], ['8', 'Out', '17', '00']]}

        data_package = request.get_json()
        user_name = data_package.get('user_name')
        id_event = data_package.get('id_event')
        user_times = data_package.get('user_times')

        # não esquecer de converter user_hour e user_min para int

        # print(data_package)
        # print(user_name,id_event,user_times)

        connection = sql.connect('events_db.db')
        cursor = connection.cursor()         
        execute_command = "INSERT INTO users_time(Id_event, User_name, User_month, User_day, User_hour, User_minute, User_year) VALUES(?,?,?,?,?,?,?)"
        for time in user_times:
            cursor.execute(execute_command, [id_event, user_name, time[0], time[1], time[2], time[3], time[4]])
            # print(id_event, user_name, time[0], time[1], time[2], time[3], time[4])

        connection.commit()
        connection.close()

        return jsonify({"url": f"/{id_event}", 
                        "Id_event": id_event})

    else:
        print("Você tentou acessar diretamente pelo método GET")

# Enviar para o evento informações do BD
@app.route('/get_users-time', methods=["POST", "GET"])
def get_users_time():
    Id_event = request.args.get('Id_event')
    if Id_event:
        connection = sql.connect('events_db.db')
        cursor = connection.cursor()
        users_query = "SELECT User_name, User_month, User_day, User_hour, User_minute, User_year FROM users_time WHERE Id_event = ?;"
        users_result = cursor.execute(users_query, (Id_event,)).fetchall()
        connection.close()

        print("users_result:",users_result)

        # Converte o resultado para uma lista de dicionários
        users_list = []
        for row in users_result:
            user_dict = {
                "User_name": row[0],
                "User_month": row[1],
                "User_day": row[2],
                "User_hour": row[3],
                "User_minute": row[4],
                "User_year": row[5]
            }
            users_list.append(user_dict)

        return jsonify(users_list)
    else:
        return jsonify({"error": "Id_event parameter is required"}), 400

if __name__ == '__main__':
    app.run(debug=False)

