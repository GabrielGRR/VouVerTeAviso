console.log('event.js')

// todos os horários disponíveis estão dentro deste elemento
const box_divs = document.querySelectorAll('.min_box');

// todos os elementos escutam evento de clique
box_divs.forEach(function(element) {
    element.addEventListener("click", time_selected_toggle);
});

// Alterna entre estados
function time_selected_toggle(event){
    const divClicada = event.target;
    console.log(event);

    // possivelmente desnecessário? mas é um bom sanity check
    const day = divClicada.getAttribute('day');
    const month = divClicada.getAttribute('month');
    const hour = divClicada.getAttribute('hour');
    const min = divClicada.getAttribute('minute');

    if (divClicada.getAttribute('selected') === 'true') {
        divClicada.setAttribute('selected', 'false');
        divClicada.classList.remove('hour_selected');
        // remover da array

    } else if (divClicada.getAttribute('selected') === 'false') {
        divClicada.setAttribute('selected', 'true');
        divClicada.classList.add('hour_selected');
        console.log(day,month,hour,min);
        // adicionar à array
    }
};

function add_user_times_to_db(){
    
    const user_available_times_array = [];
    
    box_divs.forEach(function(element) {
        if (element.getAttribute('selected') === 'true') {
            const day = element.getAttribute('day');
            const month = element.getAttribute('month');
            const hour = element.getAttribute('hour');
            const min = element.getAttribute('minute');
            user_available_times_array.push([String(day), String(month), String(hour), String(min)])
    }});
    
    console.log(user_available_times_array);



    // Coleta os dados do formulário
    const data = new FormData(evento.target);
    const event_min_hour = data.get("hour_1");
    const event_min_minute = data.get("min_1");
    const event_max_hour = data.get("hour_2");
    const event_max_minute = data.get("min_2");
    const event_name = data.get("event_name");

    // Envia a solicitação HTTP usando fetch
    fetch('/user-data', { 
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
            user_available_times_array, 
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
        // location.reload();
    })
    .catch(error => {
        // Lida com qualquer erro que ocorreu durante a solicitação
        console.error('Erro:', error);
    });
    
};