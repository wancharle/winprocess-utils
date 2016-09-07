'use strict';
var scan = require('./winprocess');
//console.log('Hello', scan.hello("World of Warcraft",new Buffer("ABC")));
//var pid = scan.getProcessIdByWindow("World of Warcraft")
//console.log("Process ID=",pid)

var VARIAVEL = "TESTEVAR==!!!"

console.log("\n\n======== TESTE LOCAL =========")
var teste1 = new scan.Process(process.pid)
teste1.open()
//var endereco = 0x153E0010
var endereco = teste1.scanBuffer(new Buffer("TESTEVAR"))
//wow.writeMemory(endereco+8, new Buffer("ccc"));
var i;
var memBuffer = teste1.readMemory(endereco, 13);
var lido=memBuffer.toString()
console.log("<",lido,">")
if (lido =="TESTEVAR==!!!"){console.log('leitura: ok!\n')}
teste1.writeMemory(endereco, new Buffer("FIM TESTE"));

memBuffer = teste1.readMemory(endereco, 13);
lido=memBuffer.toString()
console.log("<",lido,">")

if (lido =="FIM TESTE=!!!"){console.log('escrita: ok!\n')}

teste1.close()

