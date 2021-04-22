const express = require("express");
const fs = require("fs");
const app = express();
const path = require('path');
const axios = require('axios');
const { response } = require("express");
const port = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Funkcija za citanje imena stranice
let procitajNazivStranice = (naziv) => {
    return fs.readFileSync(path.join(__dirname + "/views/" + naziv + ".html"), "utf-8");
}

//Index stranica
app.get("/", (req, res) => {
    res.send(procitajNazivStranice("index"));
})

//Prikazivanje svih podataka
app.get("/svipodaci", (req, res) => {
    axios.get("http://localhost:3000/svipodaci")
        .then(response => {
            let podaci = "";
            response.data.forEach(element => {
                podaci += `<div class="data">
                    <p><label>Naziv proizvoda: </label>${element.name}</p>
                    <p><label>Cena proizvoda: </label>${element.cena}</p>
                    <p><label>Kategoria proizvoda: </label>${element.kategorija}</p>
                    <p><label>Tagovi: </label>${element.tag}</p>
                    <a href="/obrisi/${element.id}">Obrisi</a>
                    <a href="/edit/${element.id}">Azuriraj</a>
                </div>`
            });
            res.send(procitajNazivStranice("svipodaci").replace("#{data}", podaci));
        })
        .catch(error => {
            console.log(error);
        });
})

//Filtriranje podataka
app.post("/filterpokategoriji", (req, res) => {
    axios.get(`http://localhost:3000/getpodacibykategorija?kategorija=${req.body.kategorija}`)
        .then(response => {
            let podaci = "";
            response.data.forEach(element => {
                podaci += `<div class="data">
            <div class="left"><label>Naziv proizvoda:</label>${element.name}</div>
            <div class="left"><label>Cena proizvoda:</label>${element.cena}</div>
            <div class="left"><label>Kategoria proizvoda:</label>${element.kategorija}</div>
            <div class="left"><label>Tagovi proizvoda:</label>${element.tag}</div>
            <a href="/obrisi/${element.id}">Obrisi</a>
            <a href="/azuriraj/${element.id}">Azuriraj</a>
            </div>`;
            })
            res.send(procitajNazivStranice("svipodaci").replace("#{data}", podaci));
        })
})

//Dodavanje novih podataka
app.get("/dodajpodatke", (req, res) => {
    res.send(procitajNazivStranice("forma"));
})

app.post("/upisipodatke", (req, res) => {
    axios.post("http://localhost:3000/dodajpodatke", {
        name: req.body.name,
        cena: req.body.cena,
        kategorija: req.body.kategorija,
        tag: req.body.tag
    })
    res.redirect("/svipodaci");
})

//Brisanje
app.get("/obrisi/:id", (req, res) => {
    axios.delete(`http://localhost:3000/obrisipodatak/${req.params["id"]}`)
    res.redirect("/svipodaci");
})

//Azuriranje
app.get("/edit/:id", (req, res) => {
    axios.get(`http://localhost:3000/svipodaci`)
        .then(response => {
            let podaci = ""
            response.data.forEach(element => {
                if (element.id == req.params["id"]) {
                    podaci += `<div id="update"><form action="/update/${element.id}" method="post">
            <div><label>Unesite novi naziv proizvoda:</label></div><div><input type="text" value="${element.name}" name="name"></div>
            <div><label>Unesite novu cenu proizvoda:</label></div><div><input type="text" value="${element.cena}" name="cena"></div>
            <div><label>Unesite nove tagove:</label></div><div><input type="text" value="${element.tag}" name="tag"></div>
            <div><label>Izaberite novu kategoriju proizvoda:</label></div><div><select name="kategorija" id="kategorija">
            <option value="Konzola">Konzola</option>
            <option value="Oprema">Oprema</option>
            <option value="Igra">Igra</option>
            </select></div>
            <button type="submit">Azuriraj</button>
        </form></div>`
                }
            })
            res.send(procitajNazivStranice("update").replace("#{data}", podaci))
        })
        .catch(error => {
            console.log(error)
        })
})

app.post("/update/:id", (req, res) => {
    axios.post(`http://localhost:3000/azurirajpodatke/${req.params["id"]}`, {

        name: req.body.name,
        cena: req.body.cena,
        kategorija: req.body.kategorija,
        tag: req.body.tag
    })
    res.redirect("/svipodaci");
})


app.listen(port, () => { console.log(`Klijent je na portu ${port}`) });