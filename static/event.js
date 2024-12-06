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

    // arquivo json
    var user_data = {
        "user_name": "teste", // --------- adicionar funcionalidade dps
        "id_event": window.location.pathname.slice(1),
        "user_times": user_available_times_array
    }

    console.log(user_data)

    fetch('/user-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Definindo o tipo de conteúdo como JSON
        },
        body: JSON.stringify(user_data) // Convertendo o objeto para JSON
    })
    .then(response => {
        if (response.ok){
            // window.location.reload(true);
        }})
    .then(data => {
        console.log('Sucesso:', data); // A resposta do servidor
    })
    .catch((error) => {
        console.error('Erro:', error); // Se ocorrer algum erro
    });    
}