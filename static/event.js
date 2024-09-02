console.log('event.js')

const box_divs = document.querySelectorAll('.min_box');

box_divs.forEach(function(element) {
    element.addEventListener("click", teste);
});

function teste(event){
    const divClicada = event.target;
    divClicada.classList.add('hour_selected'); // Altere a cor de fundo para a cor desejada
    console.log(event)
}