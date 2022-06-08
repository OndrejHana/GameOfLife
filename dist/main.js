const invoke = window.__TAURI__.invoke;
const tauri_event = window.__TAURI__.event;

const Mapa = {
    rozliseni: 0,
    policka: [],
    mapa: document.getElementById('mapa'),
};

const napln_mapu = () => {
    Mapa.mapa.innerHTML = '';
    for (let i=0 ; i<Mapa.rozliseni ; i++) {
        let radek = document.createElement('tr');
        Mapa.mapa.appendChild(radek);
        for (let j=0 ; j<Mapa.rozliseni ; j++) {
            let policko = document.createElement('td');
            policko.setAttribute('id', `td${i}${j}`);
            if(Mapa.policka[i*Mapa.rozliseni+j]) {
                policko.setAttribute('class', 'mapa_policko zive_policko');    
            } else {
                policko.setAttribute('class', 'mapa_policko mrtve_policko')
            }
            radek.appendChild(policko);
        }
    }
};

// document.getElementById('vytvor_mapu_button').onclick = () => {
//     Mapa.rozliseni = document.getElementById('rozliseni_mapy').value;
//     Mapa.policka = new Array(Mapa.rozliseni*Mapa.rozliseni).fill(true);
//     invoke('vytvor_mapu', {rozliseni: parseInt(Mapa.rozliseni)});
// };

// tauri_event.listen('update_table', event => {
//     Mapa.policka = event.payload;
//     console.log(event);
//     napln_mapu();
// });

// const start = document.getElementById('start_button');
// start.onclick = () => {
//     start.style.visibility = 'hidden';
//     document.getElementById('stop_button').style.visibility = 'visible';
// }

const vytvor_mapu_button = document.getElementById('vytvor_mapu_button');
const start_button = document.getElementById('start_button');
let stav = false;

vytvor_mapu_button.onclick = () => {
    Mapa.rozliseni = document.getElementById('rozliseni_mapy').value;
    Mapa.policka = new Array(Mapa.rozliseni*Mapa.rozliseni);
    start_button.style.visibility = 'visible';
    start_button.setAttribute('class', 'btn btn-primary');
    napln_mapu();
    invoke('vytvor_mapu', {rozliseni: parseInt(Mapa.rozliseni)});
};

start_button.onclick = () => {
    start_button.setAttribute('class', 'btn btn-danger');
    start_button.innerText = 'Stop!';
    
};

