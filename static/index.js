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

    // Cada botão tem as classes toggleButton, day, month e year como atributos.
    // a função abaixo entende se o botão está apertado ou não, mudando suas cores e aplicando as funções
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const day = this.getAttribute('day');
            const month = this.getAttribute('month');
            const year = this.getAttribute('year');

            if (button.getAttribute('aria-pressed') === 'true') {
                button.setAttribute('aria-pressed', 'false');
                button.classList.remove('pressed');
                remove_day(day, month, year);
            } else {
                button.setAttribute('aria-pressed', 'true');
                button.classList.add('pressed');
                add_day(day, month, year);
            }
        });
    });

    function add_day(day, month, year) {
        days_array.push([day, month, year])
        console.log('evento add', days_array)
    }
    function remove_day(day, month, year) {
        for (let i = days_array.length-1; i >= 0;i--){
            console.log('antes do if', days_array)
            if (days_array[i][0] == day && days_array[i][1] == month && days_array[i][2] == year){
                days_array.splice(i,1);
                console.log('depois do if', days_array)
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
        const event_max_hour = data.get("hour_2");
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
                event_max_hour, 
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
    } else if (selectId === 'hour_2'){
        max_hour = selectElement.value;
    }
}

// Se o evento terminar de madrugada, tem que mudar um pouco a lógica de loop e apresentação de horas