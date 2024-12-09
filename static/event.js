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
            const month = element.getAttribute('month');
            const day = element.getAttribute('day');
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
};


// como terá uma 'régua' mostrando a quantidade de pessoas por dia, mudar para valor full
// possivlmente terá um loop criando divs dentro do display flex da régua
// deixar salvo a cor "máxima", ir aumentando percent
teste1_element = document.getElementById("teste1");
let teste1_color = window.getComputedStyle(teste1_element).backgroundColor;

// linear shading, se eu usar teste1_color ficará logarítmica 
const original_color = teste1_color

// caso a pessoa adicionar +1 no dia com máximo de pessoas, refazer a conta
var max_users = 3

var percent = 100/max_users;

// var div_color = percent * current_users
// ou percent - 100 * current_users, algo do tipo

// Clareia a cor de uma div
function shadeRGBColor() {
    var f = original_color.slice(4, -1).split(","), 
        t = percent < 0 ? 0 : 255, 
        p = percent < 0 ? percent * -1 : percent, 
        R = parseInt(f[0]), 
        G = parseInt(f[1]), 
        B = parseInt(f[2]);

    var newR = Math.round((t - R) * (p / 100)) + R;
    var newG = Math.round((t - G) * (p / 100)) + G;
    var newB = Math.round((t - B) * (p / 100)) + B;

    document.getElementById("teste1").style.backgroundColor = "rgb(" + newR + "," + newG + "," + newB + ")";
    teste1_color = document.getElementById("teste1").style.backgroundColor;
    percent+=percent;
    
    console.log(teste1_color)
}