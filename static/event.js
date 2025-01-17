// todos os horários disponíveis estão dentro deste elemento
const box_divs = document.querySelectorAll('#user_min_box');

const original_color = 'rgb(80, 200, 120)';
const default_color = 'rgb(241, 243, 194)';

let max_users = 0;
var percent = 0;

let user_name = '';
let current_user_object_array = []


// evento de mouse para mostrar quem são as pessoas que marcaram aquele dia
const mouse_targets = document.querySelectorAll('div[users_quantity]');
mouse_targets.forEach(target => {
    target.addEventListener("mouseenter", () => {
        var list_names =[];

        let month = target.getAttribute('month');
        let day = target.getAttribute('day');
        let hour = target.getAttribute('hour');
        let min = target.getAttribute('minute');
        let year = target.getAttribute('year');

        current_user_object_array.forEach(item => {
            
            // Compara o valor dos atributos com o BD
            if (month === item.User_month.toString() &&
                day === item.User_day.toString() &&
                hour === item.User_hour.toString() &&
                min === item.User_minute.toString() &&
                year === item.User_year.toString()) {
                    list_names.push(item.User_name)
            }
            show_available_users(list_names);
            show_unavailable_users(list_names)
        });
    });

    target.addEventListener("mouseleave", () => {
        // target.style.backgroundColor = "#F1F3C2";
        show_available_users([]);

        const container_names = document.getElementById('unavailable_users');

        while (container_names.firstChild) {
            container_names.removeChild(container_names.firstChild);
        };
    });
});

// todos os elementos escutam evento de clique
// box_divs.forEach(function(element) {
//     element.addEventListener("click", time_selected_toggle);
// });

// Alterna entre estados
function time_selected_toggle(event){
    const divClicada = event.target;

    let month = divClicada.getAttribute('month');
    let day = divClicada.getAttribute('day');
    let hour = divClicada.getAttribute('hour');
    let min = divClicada.getAttribute('minute');
    let year = divClicada.getAttribute('year');

    clear_colors();

    // remover da array
    if (divClicada.getAttribute('selected') === 'true') {
        divClicada.setAttribute('selected', 'false');
        divClicada.classList.remove('hour_selected');

        current_user_object_array = current_user_object_array.filter(obj => !(
            obj.User_day === day &&
            obj.User_month === month &&
            obj.User_hour === hour &&
            obj.User_minute === min &&
            obj.User_name === user_name &&
            obj.User_year === year
        ))

    // adicionar à array
    } else if (divClicada.getAttribute('selected') === 'false') {
        divClicada.setAttribute('selected', 'true');
        divClicada.classList.add('hour_selected');

        current_user_object_array.push({
            User_day: day,
            User_hour: hour,
            User_minute: min,
            User_month: month,
            User_name: user_name,
            User_year: year
        });
    };
    populate_colors(current_user_object_array);
};

// Salva nome do usuario para futuro fetch de BD
function get_user_name(event){
    event.preventDefault(); // Previne o comportamento padrão de recarregar a pagina
    user_name = document.getElementById("user_name").value

    document.getElementById("inform_username").classList.add('hidden_left_panel');
    document.getElementById("inform_username").classList.remove('temporary_forms');
    document.getElementById("event_user_name").classList.remove('hidden_left_panel');
    document.getElementById("add_hrs_db").classList.remove('hidden_left_panel');
};

fetch(`/get_users-time?Id_event=${window.location.pathname.slice(1)}`)
                .then(response => response.json())
                .then(data => {
                    current_user_object_array = data;
                    populate_colors(data);

                })
                .catch(error => console.error('Erro:', error));

function clear_colors(){
    const colors_div = document.querySelectorAll('div[users_quantity]');
    colors_div.forEach(function(element){
        element.setAttribute('users_quantity', '0');
        element.style.backgroundColor = default_color
    });
}

// Seleciona todas as divs que possuem o atributo users_quantity
function populate_colors(users_current_times){
    max_users = 0;
    const users_divs = document.querySelectorAll('div[users_quantity]');
    users_divs.forEach(function(element){
        let month = element.getAttribute('month');
        let day = element.getAttribute('day');
        let hour = element.getAttribute('hour');
        let min = element.getAttribute('minute');
        let year = element.getAttribute('year');

        if (element.id === "min_box"){
            element.setAttribute("id", month+day+"_"+hour+min)
        }

        users_current_times.forEach(item => {
            
            // Compara o valor dos atributos com o BD
            if (month === item.User_month.toString() &&
                day === item.User_day.toString() &&
                hour === item.User_hour.toString() &&
                min === item.User_minute.toString() &&
                year === item.User_year.toString()) {
                    let users_current_total = Number(element.getAttribute('users_quantity'));
                    users_current_total++;
                    if (users_current_total > max_users){
                        max_users = users_current_total;
                    };
                    users_current_total = users_current_total.toString();
                    element.setAttribute('users_quantity', users_current_total);
            }
        });        
    });
    percent = 100/max_users;
    populate_colors_right_panel(max_users);
    create_color_divs_ruler(max_users);
};

// como terá uma 'régua' mostrando a quantidade de pessoas por dia, mudar para valor full
// possivlmente terá um loop criando divs dentro do display flex da régua
// deixar salvo a cor "máxima", ir aumentando percent

function populate_colors_right_panel(max_users){
    const users_divs = document.querySelectorAll('div[users_quantity]');
    users_divs.forEach(function(element){
        let users_quantity = Number(element.getAttribute('users_quantity'))
        if (users_quantity > 0) {
            element.style.backgroundColor = original_color;
            let shade_amount = max_users-users_quantity;

            for(let i=0;i<shade_amount;i++){
                shadeRGBColor_div(element, shade_amount);
            }
        }
    });
};

function create_color_divs_ruler(max_users){
    const ruler_divs = document.getElementById('container_regua_temp');

    // Remove todos os elementos filhos do container
    while (ruler_divs.firstChild) {
        ruler_divs.removeChild(ruler_divs.firstChild);
    }

    for(let i=0;i<max_users+1;i++){
        var ruler_qtt = document.createElement("div");
        ruler_qtt.textContent = i;
        ruler_qtt.classList.add("ruler_qtt"); // Adiciona uma classe à div

        var element = document.createElement("div");
        element.id = 'color'+i;
        element.style.width = '35px';
        element.style.height = '24px';
        element.style.backgroundColor = "white";

        var ruler_container = document.createElement("div");
        ruler_container.id = 'ruler_contain'
        ruler_container.appendChild(ruler_qtt);
        ruler_container.appendChild(element);

        ruler_divs.appendChild(ruler_container);
        let shade_amount = max_users-i;
        shadeRGBColor_div(element, shade_amount);
    }
};

function show_available_users(list_names){
    const container_names = document.getElementById('available_users');

    // Remove todos os elementos filhos do container
    while (container_names.firstChild) {
        container_names.removeChild(container_names.firstChild);
    };

    list_names.forEach((name) => {
        var div_name = document.createElement("div");
        div_name.textContent = name;
        container_names.appendChild(div_name);        
    });
};

function show_unavailable_users(list_names){
    const container_names = document.getElementById('unavailable_users');

    // Remove todos os elementos filhos do container
    while (container_names.firstChild) {
        container_names.removeChild(container_names.firstChild);
    };

    var all_names = new Set();

    current_user_object_array.forEach(item => {            
        all_names.add(item.User_name);
    });

    const unavailable_users = Array.from(all_names).filter(item => !list_names.includes(item));

    unavailable_users.forEach((name) => {
        var div_name = document.createElement("div");
        div_name.textContent = name;
        container_names.appendChild(div_name);        
    });
};



// Clareia a cor de uma div
function shadeRGBColor_div(div_element, difference) {

    let local_percent = percent * difference

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
}


// Enviar horários para o DB
function add_user_times_to_db(){
    const user_available_times_array = [];
    
    box_divs.forEach(function(element) {
        if (element.getAttribute('selected') === 'true') {
            const month = element.getAttribute('month');
            const day = element.getAttribute('day');
            const hour = element.getAttribute('hour');
            const min = element.getAttribute('minute');
            const year = element.getAttribute('year');
            user_available_times_array.push([String(month), String(day), String(hour), String(min), String(year)])
        }}
    );    

    // arquivo json
    var user_data = {
        "user_name": user_name,
        "id_event": window.location.pathname.slice(1),
        "user_times": user_available_times_array
    }


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






const selection_box_divs = document.querySelectorAll('.min_box');

let mb1_pressed = false;
let already_selected = false;

selection_box_divs.forEach(target => {
    target.addEventListener("mousedown", (e) => {
        mb1_pressed = true
        if (target.getAttribute('selected') === 'false') {
            already_selected = false;                       
        }
        else {
            already_selected = true;
        }
        time_selected_toggle(e); 
    });

    target.addEventListener("mouseover", (e) => {
        if(mb1_pressed && already_selected && target.getAttribute('selected') === 'true'){
            time_selected_toggle(e);
        }
        else if (mb1_pressed && !already_selected && target.getAttribute('selected') === 'false'){
            time_selected_toggle(e);
        }
    });
    

    target.addEventListener("mouseup", () => {
        mb1_pressed = false;
    });
});

// sanity check
const doc_body = document.body;

doc_body.addEventListener("mousedown", () => {
    mb1_pressed = true;
});

doc_body.addEventListener("mouseup", () => {
    mb1_pressed = false;
});
