const express = require('express');
const bodyParser = require('body-parser');
const planificador = require('./planificador').planificar;
const parseWeather = require('./parseWeather').parseWeather;
const administrar = require('./administrador').administrar;
const request = require('request');
const app = express();

app.set("port", process.env.PORT || 3000);
//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => res.send("Bienvenido a la API"));
app.post("/planificar", planificar);

app.listen(app.get("port"), () => console.log("Escuchando en localhost:" + app.get("port") + "..."));


//Logica de la planificacion
function planificar(req, res) {
    
    const ntareas = req.body.tareas;
    console.log("El body es", req.body);

    console.log("Se van a realizar ", ntareas, " tareas");
    const tareas = generarTareas(ntareas);
    console.log("Las tareas al inicio son:", tareas);
    //Conseguir precios
    const precios = require('./data').precios;
    console.log('Los precios son', precios);
    //let respuesta = "Error!";
    //Llamar a weather
    request(
        'https://f7b578c7-303f-4229-9649-5d379512e703:vFQhGscUeS@twcservice.mybluemix.net:443/api/weather/v1/geocode/40.43/-3.82/forecast/hourly/48hour.json?units=m&language=en-US',
        function(err, response, body) {
            if(!err && response.statusCode == 200) {
                //console.log('body: ', response.body);
                const weatherResponse = JSON.parse(response.body);
                let weather = parseWeather(weatherResponse);
                //console.log(weatherResponse);
                
                let planificacion = planificador(tareas, precios, weather);
                console.log("La planificacion es:", planificacion);

                res.send("La planificacion es: " + JSON.stringify(planificacion, null, 2));
                peticionAlFront(precios, planificacion);
                //console.log("Has hecho algo despues de la respuesta!");
                
            } else {
                console.log("El status code es ", response.statusCode);
                console.log("error es: ", err);
                res.send("Error!");
            }
        }
    );
    //res.send("Peticion recibida!");
}

function generarTareas(n) {
    let tareas = [];
    for(let i = 0; i < n; i++) {
        tareas.push(Math.ceil((Math.random()+0.0001)*30));
    }
    tareas.sort()
    return tareas;
}

function peticionAlFront(precios, planificacion) {
    let horasParsed = [];
    let horas = Object.keys(planificacion);
    for(let i = 0; i < 24; i++) {
        if(horas.indexOf(String(i)) != -1)
            horasParsed[i] = 1;
        else
            horasParsed[i] = 0;
    }
    console.log("Para unas horas de", horas);
    console.log("Se ha parseado", horasParsed);
    request.post('http://mibase.mybluemix.net/api/machine',
    { json: {"index": 3,
             "myhours": horasParsed,
             "prices": precios}},
    function(error, response, body) {
        if(!error && response.statusCode == 200) {
            console.log("La peticion al front ha ido correctamente!");
            console.log("Administrando...");
            administrar(horasParsed, 1500); //Milisegundos por horas            
        } else {
            console.log("Error en la peticion a la API");
        }
    });
}