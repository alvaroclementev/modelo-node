const rp = require('request-promise');
const cheerio = require('cheerio');
const tableParser = require('cheerio-tableparser');

// http://www.tarifadeluz.com/

exports.Scraper = {
    requestData: function() {
        return rp('http://www.tarifadeluz.com/');
    },
    
    getPriceData: function(html) {
        let prices = [];
        let $ = cheerio.load(html);
        tableParser($);
        //console.log($('tbody[align=center]').children().eq(1).children().eq(1).children().first().text());
        let tableRef = $('tbody[align=center]').parent();
        let table = tableRef.parsetable(false, false, true);
        //console.log(table)
        let tarifaGeneral = table[1];
        tarifaGeneral.shift(); //Eliminar el primero
        tarifaGeneral = tarifaGeneral.map((precioString) => parseFloat(precioString.slice(0,5)));
        
        //console.log(tarifaGeneral)
        prices = prices.concat(tarifaGeneral);
        console.log('The prices parsed are', prices);
        return prices;
    }
};

    

