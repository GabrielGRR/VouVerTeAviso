from datetime import datetime
import pytz
import urllib
import calendar
from helpers import first_month, add_month #importando as funções do meu arquivo helpers.py

from flask import Flask, flash, redirect, render_template, request, session
#from flask_session import Session
#from werkzeug.security import check_password_hash, generate_password_hash

# Configure application
app = Flask(__name__)

#iniciação do calendário
month_monthlist, month_weekslist = first_month()
for _ in range(3): # o range deve ser de 11 meses (são 11 + first month)
    add_month()

num_rows = len(month_monthlist)

@app.route('/')
def index():
    calendar_header = ['semana', 'D','S','T','Q','Q','S','S'] #ano tbm?
    
    return render_template('index.html', 
                           num_rows= num_rows, 
                           calendar_header= calendar_header, 
                           monthlist = month_monthlist, 
                           weeklist = month_weekslist)

if __name__ == '__main__':
    app.run(debug=True)