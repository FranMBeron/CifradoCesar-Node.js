var http=require('http');
var url=require('url');
var fs=require('fs');
var querystring = require('querystring');

var mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  :	'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

var servidor=http.createServer(function(pedido,respuesta){
    var objetourl = url.parse(pedido.url);
	var camino='public'+objetourl.pathname;
	if (camino=='public/')
		camino='public/index.html';
	encaminar(pedido,respuesta,camino);
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 8888;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
servidor.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});


function encaminar (pedido,respuesta,camino) {
	console.log(camino);
	switch (camino) {
		case 'public/recuperardatos': {
			recuperar(pedido,respuesta);
			break;
		}	
	    default : {  
			fs.exists(camino,function(existe){
				if (existe) {
					fs.readFile(camino,function(error,contenido){
						if (error) {
							respuesta.writeHead(500, {'Content-Type': 'text/plain'});
							respuesta.write('Error interno');
							respuesta.end();					
						} else {
							var vec = camino.split('.');
							var extension=vec[vec.length-1];
							var mimearchivo=mime[extension];
							respuesta.writeHead(200, {'Content-Type': mimearchivo});
							respuesta.write(contenido);
							respuesta.end();
						}
					});
				} else {
					respuesta.writeHead(404, {'Content-Type': 'text/html'});
					respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
					respuesta.end();
				}
			});	
		}
	}	
}


function recuperar(pedido,respuesta) {
    var info = '';
    pedido.on('data', function(datosparciales){
         info += datosparciales;
    });
    pedido.on('end', function(){
        var formulario = querystring.parse(info);
		respuesta.writeHead(200, {'Content-Type': 'text/html'});
        var resultado;
		var alfabeto=['a', 'b', 'c', 'd', 'e', 
						'f', 'g', 'h', 'i', 'j', 
						'k', 'l', 'm', 'n', 'o', 
						'p', 'q', 'r', 's', 't', 
						'u', 'v', 'w', 'x', 'y', 'z'];
		var respU =formulario['eod'];
		switch (respU)
			{
			 case "e":
			 	resultado = encriptar(formulario['posicion'], formulario['texto'], alfabeto);
			 break;
			 case "d":	
				resultado = desencriptar(formulario['posicion'], formulario['texto'], alfabeto);
			 break;
			 default:
				resultado = "El dato es correcto";
			}	
		var pagina='<!doctype html><html><head><meta http-equiv=”Content-Type” content=”text/html; charset=UTF-8″ /></head><body>'+
					'Resultado: '+'<br>'+resultado+'<br>'+
					'<a href="index.html">Volver</a>'+
					'</body></html>';
		respuesta.end(pagina);
    });	
}

function encriptar(posicion, texto, alfa)
	{
	 var resultado = [""];
	 var longitudTexto=parseInt(texto.length);
	 var longitudAlfabeto=parseInt(alfa.length);
	 var numCe =parseInt(posicion);
	 for (var i=0 ; i<longitudTexto ; i++)
		{
		 for (var j=0 ; j<longitudAlfabeto ; j++)
			{
			 if (j+numCe > longitudAlfabeto && texto[i] == alfa[j])
				{
				 var calc=parseInt(j + (numCe - longitudAlfabeto));
				 resultado += alfa[calc];
				}
			 if (texto[i]==" ")
				{
				 resultado += " ";
				}
			 else if (texto[i] == alfa[j])
				{
				 resultado += alfa[j + numCe];
				}
			}
		}
	 return resultado;
	}

function desencriptar (posicion, texto, alfa)
	{
	 var resultado = [""];
	 var longitudTexto=parseInt(texto.length);
	 var longitudAlfabeto=parseInt(alfa.length);
	 var numCe =parseInt(posicion);
	 for (var i=0 ; i<longitudTexto ; i++)
		{
		 for (var j=0 ; j<longitudAlfabeto ; j++)
			{
			 if (j-numCe < 0 && texto[i] == alfa[j])
				{
				 var calc=parseInt(j + (longitudAlfabeto - numCe));
				 resultado += alfa[calc];
				}
			 if (texto[i]==" ")
				{
				 resultado += " ";   
				}
			 else if (texto[i] == abc[j])
				{
				 resultado += alfa[j - numCe];
				}
			}
		}
	 return resultado;
	}

console.log('Servidor web iniciado');