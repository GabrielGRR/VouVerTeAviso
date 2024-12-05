console.log('event.js')

const box_divs = document.querySelectorAll('.min_box');

box_divs.forEach(function(element) {
    element.addEventListener("click", time_selected_toggle);
});

function time_selected_toggle(event){
    const divClicada = event.target;
    console.log(event);

    const day = divClicada.getAttribute('day');
    const month = divClicada.getAttribute('month');
    const hour = divClicada.getAttribute('hour');
    const min = divClicada.getAttribute('minute');

    if (divClicada.getAttribute('selected') === 'true') {
        divClicada.setAttribute('selected', 'false');
        divClicada.classList.remove('hour_selected');

    } else if (divClicada.getAttribute('selected') === 'false') {
        divClicada.setAttribute('selected', 'true');
        divClicada.classList.add('hour_selected');
        console.log(day,month,hour,min);
    }
}