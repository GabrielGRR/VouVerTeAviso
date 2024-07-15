console.log("Script carregado")

document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.toggleButton');
    const daysContainer = document.getElementById('days-container');
    const hoursContainer = document.getElementById('hours-container');

    // Cada botão tem as classes toggleButton, day e month como atributos.
    // a função abaixo entende se o botão está apertado ou não, mudando suas cores e aplicando as funções
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const day = this.getAttribute('day');
            const month = this.getAttribute('month');
            const min_hour = 5; // ~~~~~~~~ placeholder
            const max_hour = 12; // ~~~~~~~~ placeholder
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

        // cria um novo elemento DIV
        const day_div = document.createElement('div');

        // adicionando id a div
        day_div.id = 'day_${day}_month${month}';

        // e adiciona algum conteúdo ao elemento
        const day_div_text = document.createTextNode(`Day ${day} month ${month}`);

        // adiciona o "text node" para o div recém criado
        day_div.appendChild(day_div_text)

        // adiciona o elemento recém criado e seu conteúdo dentro do DOM
        const currentDiv = document.getElementById("ancora");
        document.body.appendChild(day_div, currentDiv);

        let hour = min_hour;

        while (hour <= max_hour) {
            const hoursdiv = document.createElement('div');
            hoursdiv.textContent = `hour test ${hour}`;
            hoursdiv.setAttribute('data-day', day);
            hoursdiv.setAttribute('data-month', month);
            hoursContainer.appendChild(hoursdiv);
            hour++;
        }
    }

    //retirar item do container
    function remove_DayFromContainer(day, month) {
        const dayElements = daysContainer.querySelectorAll(`div[data-day='${day}'][data-month='${month}']`);
        dayElements.forEach(day_div => {
            daysContainer.removeChild(day_div);
        });

        const hourElements = hoursContainer.querySelectorAll(`div[data-day='${day}'][data-month='${month}']`);
        hourElements.forEach(hoursdiv => {
            hoursContainer.removeChild(hoursdiv);
        });
    }

    //adicioanr SQL ao código ou começar implementação das HORAS nos dias adicionados...
});