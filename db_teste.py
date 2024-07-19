import sqlite3 as sql

#conectando ao DB SQLITE3
connection = sql.connect('events_db.db')
cursor = connection.cursor() 
#potencialmente terei que deletar este código todo abaixo, pois eu acho que eu vou sobescrever um monte de coisas

execute_command = '''INSERT INTO events(EVENT, DAY, MONTH, MIN_HOUR, MIN_MINUTE, MAX_HOUR, MAX_MINUTE) VALUES('Jaeh', '22', 'July', 19, 25, 23, 30)'''

cursor.execute(execute_command)
connection.commit()
connection.close()