const request = require('request');

exports.administrar = function(planificacion, ms) {
    console.log("Dentro de administrar!");
    for(let i = 0; i < 24; i++){
        
        setTimeout(() => {
            console.log(i, " iteracion");
            console.log("planificacion es: ",planificacion);
            let now = planificacion[i];
            let prev = null
            if(i == 0) {
                hacerRequest(planificacion[i]);
            } else {
                prev = planificacion[i-1];
                if(now == 1){
                    if(prev == 0 || prev == null)
                        hacerRequest(1); //Encender Maquina
                } else {
                    if(prev == 1)
                        hacerRequest(0); //Apagar Maquina
                }
            }
                
            
            
        }, i*ms);
        
    }
    setTimeout(() => {
        hacerRequest(0);
    }, 24*ms);
    
    function hacerRequest(control){
        request.post('http://mibase.mybluemix.net/api/machine',
        { json: { "index": 1,
                  "newdata": control} },
        function(error, response, body) {
            if(!error && response.statusCode == 200) {
                console.log('Se ha enviado la peticion para controlar la maquina!');
            } else {
                console.log('El codigo de estado es', response.statusCode);
                console.log('El error es', error);
            }
        });
    }

    function admin(){
        
    }
}

