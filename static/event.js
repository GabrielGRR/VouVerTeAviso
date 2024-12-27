// todos os horários disponíveis estão dentro deste elemento
const box_divs = document.querySelectorAll('#user_min_box');

const original_color = 'rgb(80, 200, 120)';

let max_users = 0;
var percent = 0;

let user_name = '';

var users_dict = {};


// evento de mouse para mostrar quem são as pessoas que marcaram aquele dia
const mouse_targets = document.querySelectorAll('div[users_quantity]');
mouse_targets.forEach(target => {
    target.addEventListener("mouseenter", () => {
        // target.style.backgroundColor = "white";
    });

    target.addEventListener("mouseleave", () => {
        // target.style.backgroundColor = "#F1F3C2";
    });
});

// todos os elementos escutam evento de clique
box_divs.forEach(function(element) {
    element.addEventListener("click", time_selected_toggle);
});

// Alterna entre estados
function time_selected_toggle(event){
    const divClicada = event.target;
    console.log(event);

    // talvez chamar a função todas as vezes de populate_cor_Divs?
    // se selected +1 user count e add name?

    

    // possivelmente desnecessário? mas é um bom sanity check
    const day = divClicada.getAttribute('day');
    const month = divClicada.getAttribute('month');
    const hour = divClicada.getAttribute('hour');
    const min = divClicada.getAttribute('minute');

    // remover da array
    if (divClicada.getAttribute('selected') === 'true') {
        divClicada.setAttribute('selected', 'false');
        divClicada.classList.remove('hour_selected');
        users_dict[divClicada.id].pop();
        
        find_equivalent_div(divClicada,-1)

        populate_colors(users_current_times);

        //aqui vai ter que refazer a contagem de todos os max users, talvez repetir o código para o debaixo

    // adicionar à array
    } else if (divClicada.getAttribute('selected') === 'false') {
        divClicada.setAttribute('selected', 'true');
        divClicada.classList.add('hour_selected');
        console.log(month,day,hour,min);
        if (!users_dict[divClicada.id]){
            users_dict[divClicada.id] = []
        };
        users_dict[divClicada.id].push(user_name);  

        find_equivalent_div(divClicada,+1)

        populate_colors(users_current_times);
    }
};

function find_equivalent_div(clicked_div, operator){
    const day = clicked_div.getAttribute('day');
    const month = clicked_div.getAttribute('month');
    const hour = clicked_div.getAttribute('hour');
    const min = clicked_div.getAttribute('minute');

    const right_panel_divs = document.querySelectorAll('div[users_quantity]');

    right_panel_divs.forEach(function(element) {
        if (day === element.getAttribute('day') &&
            month === element.getAttribute('month')&&
            hour === element.getAttribute('hour')&&
            min === element.getAttribute('min')){                
                let users_current_total = Number(element.getAttribute('users_quantity'));
                users_current_total+=operator;
                users_current_total = users_current_total.toString();
                element.setAttribute('users_quantity', users_current_total);
            }

    });

};


// Salva nome do usuario para futuro fetch de BD
function get_user_name(event){
    event.preventDefault(); // Previne o comportamento padrão do botão
    user_name = document.getElementById("user_name").value
    console.log(user_name)

    document.getElementById("inform_username").classList.add('hidden_left_panel');
    
    document.getElementById("event_user_name").classList.remove('hidden_left_panel');
    document.getElementById("add_hrs_db").classList.remove('hidden_left_panel');
};


// Enviar horários para o DB
function add_user_times_to_db(){
    
    const user_available_times_array = [];
    
    box_divs.forEach(function(element) {
        if (element.getAttribute('selected') === 'true') {
            const month = element.getAttribute('month');
            const day = element.getAttribute('day');
            const hour = element.getAttribute('hour');
            const min = element.getAttribute('minute');
            user_available_times_array.push([String(month), String(day), String(hour), String(min)])
        }}
    );
    
    console.log(user_available_times_array);

    // arquivo json
    var user_data = {
        "user_name": user_name,
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

fetch(`/get_users-time?Id_event=${window.location.pathname.slice(1)}`)
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
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

        if (element.id === "min_box"){
            element.setAttribute("id", month+day+"_"+hour+min)
        }

        users_current_times.forEach(item => {
            // console.log(month,day,hour,min)
            // console.log('---')
            // console.log(item.User_month);
            // console.log(item.User_day);
            // console.log(item.User_hour);
            // console.log(item.User_minute);
            // console.log(item.User_name)
            
            // Compara o valor dos atributos com o BD
            if (month === item.User_month.toString() &&
                day === item.User_day.toString() &&
                hour === item.User_hour.toString() &&
                min === item.User_minute.toString()) {
                    let users_current_total = Number(element.getAttribute('users_quantity'));
                    users_current_total++;
                    if (users_current_total > max_users){
                        max_users = users_current_total;
                    };
                    users_current_total = users_current_total.toString();
                    element.setAttribute('users_quantity', users_current_total);

                    if (!users_dict[element.id]){
                        users_dict[element.id] = []
                    };
                    console.log('username é:',item.User_name);
    
                    users_dict[element.id].push(item.User_name);
                    console.log('dicionario esta como:',users_dict)    
            }
        });        
    });
    console.log("max users are:", max_users);
    percent = 100/max_users;
    populate_colors_on_divs(max_users);
    create_color_divs_ruler(max_users);
};

// como terá uma 'régua' mostrando a quantidade de pessoas por dia, mudar para valor full
// possivlmente terá um loop criando divs dentro do display flex da régua
// deixar salvo a cor "máxima", ir aumentando percent

function populate_colors_on_divs(max_users){
    const users_divs = document.querySelectorAll('div[users_quantity]');
    users_divs.forEach(function(element){
        let users_quantity = Number(element.getAttribute('users_quantity'))
        if (users_quantity > 0) {
            element.style.backgroundColor = original_color;
            let shade_amount = max_users-users_quantity;
            // let local_percent = 100/max_users;
 

            for(let i=0;i<shade_amount;i++){
                shadeRGBColor_div(element, shade_amount);
            }
        }
    });
    
    console.log('teste',users_dict);
};

function create_color_divs_ruler(max_users){
    const ruler_divs = document.getElementById('container_regua_temp');

    // Remove todos os elementos filhos do contêiner
    while (ruler_divs.firstChild) {
        ruler_divs.removeChild(ruler_divs.firstChild);
    }

    for(let i=0;i<max_users+1;i++){
        var ruler_qtt = document.createElement("div");
        ruler_qtt.textContent = i;
        ruler_qtt.classList.add("ruler_qtt"); // Adiciona uma classe à div

        var element = document.createElement("div");
        element.id = 'color'+i;
        element.textContent = "teste";
        element.style.backgroundColor = "white";

        var ruler_container = document.createElement("div");
        ruler_container.id = 'ruler_contain'
        ruler_container.appendChild(ruler_qtt);
        ruler_container.appendChild(element);

        ruler_divs.appendChild(ruler_container);
        let shade_amount = max_users-i;
        shadeRGBColor_div(element, shade_amount);
    }
}


// Clareia a cor de uma div
function shadeRGBColor_div(div_element, difference) {

    let local_percent = percent * difference
    
    // console.log("maxxx users are:", max_users);
    // console.log(local_percent)
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
    // console.log('local percent',local_percent)
}
