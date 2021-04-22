const fs = require("fs");
const PATH = "podaci.json";

//Citanje podataka iz jsona
let procitajPodatke = () => {
    let podaci = fs.readFileSync(PATH, (err, data) => {
        if (err) throw err
        return data;
    })
    return JSON.parse(podaci);
}

//Upisivanje podataka u json
let upisiPodatke = (data) => {
    fs.writeFileSync(PATH, JSON.stringify(data));
}

//Modul za citanje podataka
exports.sviPodaci = () => {
    return procitajPodatke();
}

//Modul za dodavanje novih podataka
exports.dodajPodatke = (noviPodatak) => {
    let id = 1;
    let podaci = this.sviPodaci();
    if (podaci.length > 0) {
        id = podaci[podaci.length - 1].id + 1;
    }
    noviPodatak.id = id;
    podaci.push(noviPodatak);
    upisiPodatke(podaci);
}

//Modul za pronalazenje podataka po njihovom id-u
exports.getPodaci = (id) => {
    return this.sviPodaci().find(podatak => podatak.id == id);
}

//Modul za azuriranje podataka po njihovom id-u
exports.azurirajPodatke = (id, noviPodatak) => {
    let podaci = this.sviPodaci();
    for (let i = 0; i < podaci.length; i++) {
        if (id == podaci[i].id) {
            noviPodatak.id = parseInt(id);
            podaci[i] = noviPodatak;
        }
    }
    upisiPodatke(podaci);
}

//Modul za filtriranje podataka po kategoriji proizoda
exports.getPodatakPoKategoriji = (kategorija) => {
    return this.sviPodaci().filter(podaci => podaci.kategorija.includes(kategorija));
}

//Modul za brisanje proizvoda po njihovom id-u
exports.obrisiPodatak = (id) => {
    upisiPodatke(this.sviPodaci().filter(podaci => podaci.id != id));
}