from datetime import datetime
import pytz
timezone = pytz.timezone('America/Sao_Paulo')
current_time = datetime.now(timezone).strftime("%d/%m/%Y %H:%M:%S")  # Obtém a data e hora atuais no formato DD/MM/YYYY HH:MM:SS

print( current_time)