from datetime import datetime
#import pytz
#import urllib
#import calendar
from calendar_logic import first_month, add_month, month_headers, month_belong_to_day #importando as funções do meu arquivo helpers.py
import sqlite3 as sql


from flask import Flask, flash, redirect, render_template, g, request, url_for 
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

    if request.method == "POST":
        event_name = request.form.get("event_name")
        hour_1 = request.form.get("hour_1")
        hour_2 = request.form.get("hour_2")
        print('eu tou aqui')

        return f"Event name is :{event_name}\nevent starts at: {hour_1}\nevent ends at: {hour_2}"

    return render_template('index.html', 
                           num_rows= num_rows, 
                           calendar_header= calendar_header, 
                           monthlist = month_monthlist, 
                           weeklist = month_weekslist,
                           excl_months = excl_months,
                           bool_list = bool_list,
                           month_of_the_day = month_of_the_day)

@app.route('/layout', methods=["POST", "GET"])
def layout():
    if request.method == "POST":
        print("POST")
    event_name = request.form.get("event_name")
    hour_1 = request.form.get("hour_1")
    hour_2 = request.form.get("hour_2")

    return f"Event name is :{event_name}\nevent starts at: {hour_1}\nevent ends at: {hour_2}"
    #return render_template("layout.html")

if __name__ == '__main__':
    app.run(debug=True)