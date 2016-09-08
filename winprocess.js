'use strict';
var winprocess = require('./build/Release/scan');

var obj = {}
obj.getProcessIdByWindow = winprocess.getProcessIdByWindow;

function Process(pid){
	if (pid){
		var processo = new winprocess.Process(pid);
		return processo;
	}else{
		throw new Error('Informe um pid de processo em execução.');
	}
	return  
}

winprocess.Process.prototype.readNumeros = function (endereco,tamanho){
	var array = new Array();
	for (var i=0;i<tamanho;i++){
		array.push(this.readDouble(endereco+i*16));
	}
	return array;
}
winprocess.Process.prototype.writeNumeros = function (endereco,vetor){
	for (var i=0;i<vetor.length;i++){
		this.writeDouble(endereco+i*16, vetor[i]);
	}
}

obj.Process = Process;

module.exports = obj;

