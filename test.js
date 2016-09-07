'use strict';
var scan = require('./winprocess');
console.log('Hello', scan.hello("World of Warcraft",new Buffer("ABC")));
var pid = scan.getProcessIdByWindow("World of Warcraft")
console.log("Process ID=",pid)

var wow = new scan.Process(pid)
wow.open()

var endereco = 0x153E0010
//var endereco = wow.scanBuffer(new Buffer("TESTEWAN"))
//wow.writeMemory(endereco+8, new Buffer("ccc"));
var i;
var memBuffer = wow.readMemory(endereco, 20);
for(i=0;i<20;i++) console.log(String.fromCharCode(memBuffer[i]));

wow.close()

