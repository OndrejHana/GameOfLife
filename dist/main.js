const invoke = window.__TAURI__.invoke;
const huh = window.__TAURI__.event;

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

const vytvor_mapu = () => {
    Mapa.rozliseni = document.getElementById('rozliseni_mapy').value;
    Mapa.policka = new Array(Mapa.rozliseni*Mapa.rozliseni).fill(true);
    invoke('vytvor_mapu', {rozliseni: parseInt(Mapa.rozliseni)});
};
document.getElementById('vytvor_mapu_button').onclick = vytvor_mapu;

huh.listen('update_table', event => {
    Mapa.policka = event.payload;
    console.log(event);
    napln_mapu();
});