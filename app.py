from datetime import datetime
import pytz
import urllib
import calendar
import helpers #importando as funções do meu arquivo helpers.py

from flask import Flask, flash, redirect, render_template, request, session
#from flask_session import Session
#from werkzeug.security import check_password_hash, generate_password_hash

# Configure application
app = Flask(__name__)

# usar recurso jinja

@app.route('/')
def index():
    calendar_header = ['semana', 'D','S','T','Q','Q','S','S'] #ano tbm?
    
    first_month_monthlist, first_month_weekslist = helpers.first_month()
    
    num_rows = len(first_month_monthlist)

    return render_template('index.html', 
                           num_rows=num_rows, 
                           calendar_header=calendar_header, 
                           fm_monthlist = first_month_monthlist, 
                           fm_weeklist = first_month_weekslist)

if __name__ == '__main__':
    app.run(debug=True)