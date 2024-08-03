console.log("Script carregado")

var div_num = 0;
const days_array = [];

var min_hour = 8; 
var min_minute = 0; 
var max_hour = 18; 
var max_minute = 0; 

document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.toggleButton');
    const form = document.querySelector('#criar_evento')

    // Cada botão tem as classes toggleButton, day e month como atributos.
    // a função abaixo entende se o botão está apertado ou não, mudando suas cores e aplicando as funções
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const day = this.getAttribute('day');
            const month = this.getAttribute('month');

            if (button.getAttribute('aria-pressed') === 'true') {
                button.setAttribute('aria-pressed', 'false');
                button.classList.remove('pressed');
                remove_DayFromContainer(day, month);
            } else {
                button.setAttribute('aria-pressed', 'true');
                button.classList.add('pressed');
                add_day_hour_ToContainer(day, month, min_hour, max_hour);
            }
        });
    });

    // adicionar item no container
    // mudar nome da função para add_day_hours_div
    function add_day_hour_ToContainer(day, month, min_hour, max_hour) {

        //div container principal:
        //container
        //div dia_mes
        //div com horas
        var container = document.getElementById('days-container');
        var day_hour_div = document.createElement('div');
        day_hour_div.setAttribute('id',`div_${div_num}`);
        day_hour_div.setAttribute('data-day', day);
        day_hour_div.setAttribute('data-month', month);
        container.appendChild(day_hour_div)

        var day_container = document.getElementById(`div_${div_num}`);
        var novaDiv = document.createElement('div');
        novaDiv.innerHTML = `Day ${day} month ${month}`;
        novaDiv.setAttribute('data-day', day);
        novaDiv.setAttribute('data-month', month);
        day_container.appendChild(novaDiv);

        //adicionar os dias e meses para uma lista que comunicará com o backend
        days_array.push([String(day), String(month)])
        console.log(days_array)

        let hour = Number(min_hour);

        while (hour <= max_hour) {
            var hoursdiv = document.createElement('div');
            hoursdiv.innerHTML = `hour test ${hour}`;
            hoursdiv.setAttribute('data-day', day);
            hoursdiv.setAttribute('data-month', month);
            hoursdiv.setAttribute('hours-container', 'hours-container')
            hoursdiv.setAttribute('class','border border-dark hour')
            day_container.appendChild(hoursdiv);
            hour++;
        }
        div_num++;
        
    }

    // retirar item do container
    function remove_DayFromContainer(day, month) {
        const days_hours_container = document.getElementById('days-container');
        const day_hours_elements = days_hours_container.querySelectorAll(`div[data-day='${day}'][data-month='${month}']`);
        days_hours_container.removeChild(day_hours_elements[0]); //remove a div_# inteira, por ser a pai, vai com todos os childs

        //removendo os dias da lista que comunicará com o backend
        for (let i = days_array.length-1; i >= 0;i--){
            if (days_array[i][0] == String(day) && days_array[i][1] == String(month)){
                days_array.splice(i,1);
            }
        }
    }


    //transforma o http em jason
    form.addEventListener('submit', function(evento) {
        // Previne o comportamento padrão do formulário HTML
        evento.preventDefault();
    
        // Coleta os dados do formulário
        const data = new FormData(evento.target);
        const event_min_hour = data.get("hour_1");
        const event_min_minute = data.get("min_1");
        const event_max_hour = data.get("hour_2");
        const event_max_minute = data.get("min_2");
        const event_name = data.get("event_name");
    
        // Envia a solicitação HTTP usando fetch
        fetch('/process-data', { 
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                days_array, 
                event_min_hour, 
                event_min_minute, 
                event_max_hour, 
                event_max_minute, 
                event_name
            }) 
        })
        .then(response => {
            // Verifica se a resposta foi bem-sucedida
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }
            // Converte a resposta para JSON
            return response.json();
        })
        .then(result => {
            // Lida com o resultado da resposta
            console.log('Sucesso:', result);
            window.location.replace(result.url);
        })
        .catch(error => {
            // Lida com qualquer erro que ocorreu durante a solicitação
            console.error('Erro:', error);
        });
    });

    
});

function salvar_horaMin(selectId) {
    let selectElement = document.getElementById(selectId)
    if(selectId === 'hour_1'){
        min_hour = selectElement.value;
    } else if (selectId === 'min_1'){
        min_minute = selectElement.value;
    } else if (selectId === 'hour_2'){
        max_hour = selectElement.value;
    } else if (selectId === 'min_2'){
        max_minute = selectElement.value;
    }
}



// Se o evento terminar de madrugada, tem que mudar um pouco a lógica de loop e apresentação de horas



// Adicioanr SQL ao código ou começar implementação das HORAS nos dias adicionados...