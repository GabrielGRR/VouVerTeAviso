mes = 5
ano = 12
def next_month(lista_mes_ano):
    lista_mes_ano[0]+=1
lista = [mes,ano]
print(lista)
for _ in range(2):



    next_month(lista)
print(lista)