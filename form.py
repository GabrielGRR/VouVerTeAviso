# importing Flask and other modules
from flask import Flask, request, render_template 

# Flask constructor
app = Flask(__name__) 

# A decorator used to tell the application
# which URL is associated function
@app.route('/criar_evento', methods =["POST"])
def criar_evento():

	# BUSCAR DADOS
	# VALIDAR DADOS
	# ENVIAR PARA O BANCO

	# getting input with name = fname in HTML form
	nome_evento = request.form.get("event_name")
	
	# getting input with name = lname in HTML form 
	last_name = request.form.get("lname") 
	pinto = "penes"
	return render_template("index.html")

# @app.route("/add_to_DB", methods="POST")
# #conectando ao DB SQLITE3
# def get_database():

#     #possivelmente terá um for loop aqui
#     event = request.form.get('event_name')
#     print(event)
#     print(type(event))
#     # day = request.form["event"]
#     # month = request.form["event"]
#     # min_hour = request.form["event"]
#     # min_minute = request.form["event"]
#     # max_hour = request.form["event"]
#     # max_minute = request.form["event"]

