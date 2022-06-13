const tauri_event = window.__TAURI__.event;

const vytvor_mapu_button = document.getElementById('vytvor_mapu_button');
const submit_button = document.getElementById('submit_button');
let button_type = 'start';

let Mapa = {
    rozliseni: 0,
    policka: [],
    mapa: document.getElementById('mapa'),
};

const napln_mapu = () => {
  Mapa.mapa.innerHTML = '';
  for (let i = 0; i < Mapa.rozliseni; i++) {
    let radek = document.createElement('tr');
    Mapa.mapa.appendChild(radek);
    for (let j = 0; j < Mapa.rozliseni; j++) {
      let policko = document.createElement('td');
      policko.setAttribute('id', `td${i}${j}`);
      if (Mapa.policka[i * Mapa.rozliseni + j]) {
        policko.setAttribute('class', 'mapa_policko zive_policko');
      } else {
        policko.setAttribute('class', 'mapa_policko mrtve_policko');
      }
      radek.appendChild(policko);
    }
  }
};

vytvor_mapu_button.onclick = () => {
    let rozliseni = document.getElementById('rozliseni_mapy').value;
    if(rozliseni <= 0) return;

    console.log('sending event');
    Mapa.rozliseni = rozliseni;
    tauri_event.emit('create-map', Mapa.rozliseni);
    change_submit_state();
}

const start_button_event = () => {
    console.log('start');
    button_type = 'stop';
    change_submit_state();


};

const stop_button_event = () => {
    console.log('stop');
    submit_button.style.visibility = 'hidden';
    button_type = 'start';


};

const change_submit_state = () => {
    switch (button_type) {
        case 'start':
            button_type = 'stop';
            submit_button.innerText = 'Start';
            submit_button.style.visibility = 'visible';
            submit_button.classList.remove('btn-danger');
            submit_button.classList.add('btn-primary');
            submit_button.onclick = start_button_event;
            break;
        case 'stop':
            submit_button.innerText = 'Stop';
            submit_button.style.visibility = 'visible';
            submit_button.classList.remove('btn-primary');
            submit_button.classList.add('btn-danger');
            submit_button.onclick = stop_button_event;
            break;
    }
};


// const invoke = window.__TAURI__.invoke;
// const tauri_event = window.__TAURI__.event;
// const { tauri } = require("@tauri-apps/api");
// const Mapa = {
//   rozliseni: 0,
//   policka: [],
//   mapa: document.getElementById('mapa'),
// };
// const napln_mapu = () => {
//   Mapa.mapa.innerHTML = '';
//   for (let i = 0; i < Mapa.rozliseni; i++) {
//     let radek = document.createElement('tr');
//     Mapa.mapa.appendChild(radek);
//     for (let j = 0; j < Mapa.rozliseni; j++) {
//       let policko = document.createElement('td');
//       policko.setAttribute('id', `td${i}${j}`);
//       if (Mapa.policka[i * Mapa.rozliseni + j]) {
//         policko.setAttribute('class', 'mapa_policko zive_policko');
//       } else {
//         policko.setAttribute('class', 'mapa_policko mrtve_policko');
//       }
//       radek.appendChild(policko);
//     }
//   }
// };
// const vytvor_mapu = () => {
//   Mapa.rozliseni = document.getElementById('rozliseni_mapy').value;
//   Mapa.policka = new Array(Mapa.rozliseni * Mapa.rozliseni).fill(true);
//   invoke('vytvor_mapu', { rozliseni: parseInt(Mapa.rozliseni) });
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
// const vytvor_mapu_button = document.getElementById('vytvor_mapu_button');
// const start_button = document.getElementById('start_button');
// let stav = false;
// vytvor_mapu_button.onclick = () => {
//     Mapa.rozliseni = document.getElementById('rozliseni_mapy').value;
//     Mapa.policka = new Array(Mapa.rozliseni*Mapa.rozliseni);
//     start_button.style.visibility = 'visible';
//     start_button.setAttribute('class', 'btn btn-primary');
//     napln_mapu();
//     invoke('vytvor_mapu', {rozliseni: parseInt(Mapa.rozliseni)});
// };
// huh.listen('update_table', (event) => {
//   Mapa.policka = event.payload;
//   console.log(event);
//   napln_mapu();
// });
// start_button.onclick = () => {
//     start_button.setAttribute('class', 'btn btn-danger');
//     start_button.innerText = 'Stop!';
// };
// 1. Funkce na vytvoreni mapy
// 2. Funkce na update mapy
// 3. 
// const invoke = window.__TAURI__.invoke;
// const tauri_event = window.__TAURI__.event;
// console.log('invoke is coming')
// invoke('vytvor_mapu', {rozliseni: 3 });
// console.log('invoke done')
// tauri_event.listen('initialize_map', event => {
//     console.log("got event");
//     console.log(event);
// });