console.log('event.js')

function check_color(event){
    const divClicada = event.target;
    console.log(event);

    if (divClicada.classList.contains('hour_selected')) {
        divClicada.classList.remove('hour_selected');
    } else {
        divClicada.classList.add('hour_selected');
    }
}

const box_divs = document.querySelectorAll('.min_box');

box_divs.forEach(function(element) {
    element.addEventListener("click", check_color);
});