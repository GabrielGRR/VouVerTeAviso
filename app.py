import datetime
import urllib

from flask import Flask, flash, redirect, render_template, request, session
#from flask_session import Session
#from werkzeug.security import check_password_hash, generate_password_hash

# Configure application
app = Flask(__name__)

# usar recurso jinja

@app.route('/')
def index():
    calendar_header = ['semana', 'D','S','T','Q','Q','S','S','ano?']
    items = ['dia', 'div 1', 'div 2', 'div 3', 'div 4', 'div 5', 'div 6', 'div 7', 'ano?']
    num_rows = 5 #quantidade de linhas do calendário
    return render_template('index.html', items=items, num_rows=num_rows, calendar_header=calendar_header)

if __name__ == '__main__':
    app.run(debug=True)