from datetime import datetime
#import pytz
#import urllib
#import calendar
from calendar_logic import first_month, add_month, month_headers, month_belong_to_day #importando as funções do meu arquivo helpers.py
import sqlite3 as sql

from flask import Flask, flash, redirect, render_template, g, request
#from flask_session import Session
#from werkzeug.security import check_password_hash, generate_password_hash

# Configure application
app = Flask(__name__)

#conectando ao DB SQLITE3
def get_database():

    #possivelmente terá um for loop aqui
    # event = request.form["event"]
    # day = request.form["event"]
    # month = request.form["event"]
    # min_hour = request.form["event"]
    # min_minute = request.form["event"]
    # max_hour = request.form["event"]
    # max_minute = request.form["event"]



    connection = sql.connect('events_db.db')
    cursor = connection.cursor() 
    #potencialmente terei que deletar este código todo abaixo, pois eu acho que eu vou sobescrever um monte de coisas
    db = '''CREATE TABLE "event_days_hours" (
    "ID_KEY" INTEGER PRIMARY KEY AUTOINCREMENT,
    "ID_EVENT" INTEGER,
    "EVENT" TEXT,
    "DAY" TEXT,
    "MONTH" TEXT,
    "MIN_HOUR" INTEGER,
    "MIN_MINUTE" INTEGER,
    "MAX_HOUR" INTEGER,
    "MAX_MINUTE" INTEGER
    )'''

    cursor.execute(db)
    connection.commit()
    connection.close()



#iniciação do calendário
month_monthlist, month_weekslist = first_month()
for _ in range(11): # o range deve ser de 11 meses (são 11 + first month)
    add_month()

excl_months, bool_list = month_headers()
month_of_the_day = month_belong_to_day()
num_rows = len(month_monthlist)

@app.route('/')
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

if __name__ == '__main__':
    app.run(debug=True)