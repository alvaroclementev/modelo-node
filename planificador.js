/*const precioLuz = [60.43, 55, 50.99, 50.03, 49.75, 49.75, 50,
    53.89, 57.97, 61.61, 62.69, 62.61, 61.84, 61.61, 60.53,
    49.59, 45.11, 47.65, 60.51, 56.26, 52.54, 47.3,
    44.54, 41.69];

const weather = [];

for(let i = 0; i < 24; i++) {
    weather[i] = Math.random() * 3;
}

const tareas = [1, 2, 3, 4, 5, 6];
console.log("El planning para los datos es: ", JSON.stringify(planificar(tareas, precioLuz, weather), null, 2));
*/
exports.planificar = function (tareas, precioLuz, weather) {
    function calcularCoste(precioLuz, weather) {
        const coste = [];
        let maxLength = Math.max(precioLuz.length, weather.length);
    
        for(let i = 0; i < 24; i++) {
            coste.push(3*precioLuz[i] + weather[i]);
        }
    
        return coste;
    } 
    
    //Selecciona las horas cuya funcion de costes definida en costes es minima
    const horas = tareas.length;
    let costes = calcularCoste(precioLuz, weather);
    let sorted = costes.slice(0);
    sorted.sort();
    //console.log("Costes es:", JSON.stringify(costes, null, 2));
    //console.log("Sorted es:", JSON.stringify(sorted, null, 2));
    let mins = sorted.slice(0, horas);
    //console.log("Mins es:", JSON.stringify(mins, null, 2));
    //console.log("Y la longitud es ", mins.length);
    
    plan = mins.map( (value) => costes.indexOf(value));
    plan.sort(); //Si se quieren las horas ordenadas
    
    //Forma
    planning = {};
    plan.forEach(function(element, index) {
        planning[plan[index]] = tareas[index];
    }, this);

    return planning;
    
}

 
