var express = require('express');
var podaciServer = require('rad-sa-podacima-modul');
var app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (request, response) => {
    response.send("Server radi!");
})

app.get('/svipodaci', (request, response) => {
    response.send(podaciServer.sviPodaci());
})

app.post('/dodajpodatke', (request, response) => {
    podaciServer.dodajPodatke(request.body)
    response.end("Uspesno ste dodali podatke!");
})

app.get('/getpodatakby/:id', (request, response) => {
    response.send(podaciServer.getPodaci(request.params["id"]));
})

app.post('/azurirajpodatke/:id', (request, response) => {
    podaciServer.azurirajPodatke(request.params["id"], request.body)
    response.end("Uspesno ste promenili podatke!")
})

app.delete('/obrisipodatak/:id', (request, response) => {
    podaciServer.obrisiPodatak(request.params["id"])
    response.end("Izbrisali ste podatke!");
})

app.get('/getpodacibykategorija', (request, response) => {
    response.send(podaciServer.getPodatakPoKategoriji(request.query["kategorija"]));
})

app.listen(port, () => { console.log(`Server je startovan na protu: ${port}`) });