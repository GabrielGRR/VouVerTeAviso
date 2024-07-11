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
            const max_hour = 18; // ~~~~~~~~ placeholder
            if (button.getAttribute('aria-pressed') === 'true') {
                button.setAttribute('aria-pressed', 'false');
                button.classList.remove('pressed');
                remove_DayFromContainer(day, month);
            } else {
                button.setAttribute('aria-pressed', 'true');
                button.classList.add('pressed');
                add_Day_Hour_ToContainer(day, month, min_hour, max_hour);
            }
        });
    });

    //adicionar item no container
    function add_Day_Hour_ToContainer(day, month, min_hour, max_hour) {
        const selected_day = document.createElement('div');
        selected_day.textContent = `Day ${day} month ${month}`;
        selected_day.setAttribute('data-day', day);
        selected_day.setAttribute('data-month', month);
        daysContainer.appendChild(selected_day);
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
        dayElements.forEach(selected_day => {
            daysContainer.removeChild(selected_day);
        });

        const hourElements = hoursContainer.querySelectorAll(`div[data-day='${day}'][data-month='${month}']`);
        hourElements.forEach(hoursdiv => {
            hoursContainer.removeChild(hoursdiv);
        });
    }

    //adicioanr SQL ao código ou começar implementação das HORAS nos dias adicionados...
});