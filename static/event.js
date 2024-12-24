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
        console.log(month,day,hour,min);
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
            user_available_times_array.push([String(month), String(day), String(hour), String(min)])
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
            window.location.reload(true);
        }})
    .then(data => {
        console.log('Sucesso:', data); // A resposta do servidor
    })
    .catch((error) => {
        console.error('Erro:', error); // Se ocorrer algum erro
    });    
};

let max_users = 0;
var percent = 0;

fetch(`/get_users-time?Id_event=${window.location.pathname.slice(1)}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    users_current_times = data;
                    populate_colors(data)
                })
                .catch(error => console.error('Erro:', error));

// Seleciona todas as divs que possuem o atributo users_quantity
function populate_colors(users_current_times){
    max_users = 0;
    const users_divs = document.querySelectorAll('div[users_quantity]');
    users_divs.forEach(function(element){
        let month = element.getAttribute('month');
        let day = element.getAttribute('day');
        let hour = element.getAttribute('hour');
        let min = element.getAttribute('minute');
        users_current_times.forEach(item => {
            console.log(month,day,hour,min)
            console.log('---')
            console.log(item.User_month);
            console.log(item.User_day);
            console.log(item.User_hour);
            console.log(item.User_minute);
            
            if (month === item.User_month.toString() &&
                day === item.User_day.toString() &&
                hour === item.User_hour.toString() &&
                min === item.User_minute.toString()) {
                    let users_current_total = Number(element.getAttribute('users_quantity'));
                    // debugger;
                    users_current_total++;
                    if (users_current_total > max_users){
                        max_users = users_current_total;
                        // debugger;
                    };
                    users_current_total = users_current_total.toString()
                    element.setAttribute('users_quantity', users_current_total)
            }
        });        
    });
    console.log("max users are:", max_users);
    percent = 100/max_users;
    populate_colors_on_divs();
};

// como terá uma 'régua' mostrando a quantidade de pessoas por dia, mudar para valor full
// possivlmente terá um loop criando divs dentro do display flex da régua
// deixar salvo a cor "máxima", ir aumentando percent

function populate_colors_on_divs(){
    const users_divs = document.querySelectorAll('div[users_quantity]');
    users_divs.forEach(function(element){
        let users_quantity = Number(element.getAttribute('users_quantity'))
        if (users_quantity > 0) {
            element.style.backgroundColor = original_color;
            let shade_amount = max_users-users_quantity;
            let local_percent = 100/max_users;
            for(let i=0;i<shade_amount;i++){
                shadeRGBColor_div(element, shade_amount);
            }
        }
    });
};

// Clareia a cor de uma div
function shadeRGBColor_div(div_element, difference) {

    let local_percent = percent * difference
    
    console.log("maxxx users are:", max_users);
    console.log(local_percent)
    var f = original_color.slice(4, -1).split(","), 
        t = local_percent < 0 ? 0 : 255, 
        p = local_percent < 0 ? local_percent * -1 : local_percent, 
        R = parseInt(f[0]), 
        G = parseInt(f[1]), 
        B = parseInt(f[2]);

    var newR = Math.round((t - R) * (p / 100)) + R;
    var newG = Math.round((t - G) * (p / 100)) + G;
    var newB = Math.round((t - B) * (p / 100)) + B;

    div_element.style.backgroundColor = "rgb(" + newR + "," + newG + "," + newB + ")";
    console.log('local percent',local_percent)
}




// teste1_element = document.getElementById("teste1");
// let teste1_color = window.getComputedStyle(teste1_element).backgroundColor;

// linear shading, se eu usar teste1_color ficará logarítmica 
const original_color = 'rgb(80, 200, 120)';
// document.getElementById("teste1").style.backgroundColor = original_color;

// caso a pessoa adicionar +1 no dia com máximo de pessoas, refazer a conta
// rodar função populate_colors_on_divs quando a pessoa responder o nome dela?

// Clareia a cor de uma div
function shadeRGBColor() {
    
    console.log("maxxx users are:", max_users);
    console.log(percent)
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