import sqlite3 as sql

#conectando ao DB SQLITE3
connection = sql.connect('events_db.db')
cursor = connection.cursor() 
#potencialmente terei que deletar este código todo abaixo, pois eu acho que eu vou sobescrever um monte de coisas

execute_command = '''INSERT INTO events(EVENT, DAY, MONTH, MIN_HOUR, MIN_MINUTE, MAX_HOUR, MAX_MINUTE) VALUES('Jaeh', '22', 'July', 19, 25, 23, 30)'''

cursor.execute(execute_command)
connection.commit()
connection.close()

#o banco de dados funciona, agora temos alguns desafios:

#será necessário DUAS tabelas, uma com o evento, outra com as informações do evento

#inserir em cada uma das divs de eventos criado o dropdown de horas inicio/horas final
#descobrir como inserir os dados de MULTIPLAS divs em sequencia, possivelmente será com o for loop, mas como que seria com o .commit()? existe outras funções?

# assistir https://www.youtube.com/watch?v=v3CSQkPJtAc