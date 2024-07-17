console.log("Script carregado")

var div_num = 0;

var min_hour = 0; 
var min_minute = 0; 
var max_hour = 12; 
var max_minute = 0; 

document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.toggleButton');

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

    //adicionar item no container
    // mudar nome da função para add_day_hours_div
    function add_day_hour_ToContainer(day, month, min_hour, max_hour) {

        //div container principal:
        //container
        //div dia_mes
        //div com horas
        var container = document.getElementById('days-container');
        var day_hour_div = document.createElement('div');
        day_hour_div.setAttribute('class', "flex_hour");
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

        let hour = min_hour;

        while (hour <= max_hour) {
            var hoursdiv = document.createElement('div');
            hoursdiv.innerHTML = `hour test ${hour}`;
            hoursdiv.setAttribute('data-day', day);
            hoursdiv.setAttribute('data-month', month);
            hoursdiv.setAttribute('hours-container', 'hours-container')
            day_container.appendChild(hoursdiv);
            hour++;
        }
        div_num++;
    }

    

    //retirar item do container
    function remove_DayFromContainer(day, month) {
        const days_hours_container = document.getElementById('days-container');
        const day_hours_elements = days_hours_container.querySelectorAll(`div[data-day='${day}'][data-month='${month}']`);
        day_hours_elements.forEach(day_div => {
            days_hours_container.removeChild(day_div);
            console.log('day_div', day_div);
            console.log('day_hours_elements', day_hours_elements);
            console.log('days_hours_container', days_hours_container);
            div_num--;
        });
    }
});

function salvar_horaMin(selectId) {
    let selectElement = document.getElementById(selectId)
    if(selectId === 'hour_1'){
        min_hour = selectElement.value;
        console.log('1');
    } else if (selectId === 'min_1'){
        min_minute = selectElement.value;
        console.log('2');
    } else if (selectId === 'hour_2'){
        max_hour = selectElement.value;
        console.log('3');
    } else if (selectId === 'min_2'){
        max_minute = selectElement.value;
        console.log('4');
    } else {
        console.log('Nenhum horario foi selecionado')
    }
}

//se o evento terminar de madrugada, tem que mudar um pouco a lógica de loop e apresentação de horas



//adicioanr SQL ao código ou começar implementação das HORAS nos dias adicionados...