'use strict';
var scan = require('./winprocess');
//console.log('Hello', scan.hello("World of Warcraft",new Buffer("ABC")));
function teste1(){
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

}
teste1()
function wow(){
var pid = scan.getProcessIdByWindow("World of Warcraft")
	console.log("Process ID=",pid)
	var teste1 = new scan.Process(pid)
	teste1.open()
	var endereco = teste1.scanDouble(2863311531)
	console.log('search1',endereco)
	var endereco = teste1.scanDoubleList(16,2863311531,86331153,633115,3311)
	console.log('search2',endereco)
	var valor = teste1.readDouble(endereco+16*3);
	console.log('valor=',valor, teste1.readDouble(endereco+16*4), teste1.readDouble(endereco+16*5),teste1.readDouble(endereco+16*6))
	teste1.writeDouble(endereco+16*5,27)
	console.log('valor=',valor, teste1.readDouble(endereco+16*4), teste1.readDouble(endereco+16*5),teste1.readDouble(endereco+16*6))
	
	teste1.close()
	
}
wow()


//memBuffer = teste1.dwordBuffer(2863311531,2863311530+1);
//for(i=0;i<32;i++)console.log(memBuffer[i])

