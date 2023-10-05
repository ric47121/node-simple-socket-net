const net = require('net');

let arr = [] 
// Crear un servidor de sockets
const server = net.createServer((socket) => {
    console.log('Un cliente se ha conectado');

    arr.push(socket)

    // console.log(JSON.stringify(socket))
    console.log('_readableState.closed:', socket._readableState.closed)
    console.log('ID del socket:', socket.id)
    console.log('Dirección IP y puerto del socket:', socket.remoteAddress);
    // console.log('new sock', socket)
    // console.log('arr', arr)
    // Manejar datos recibidos desde el cliente
    socket.on('data', (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log('Mensaje recibido del cliente:', message);

            // Manejar diferentes tipos de mensajes
            if (message.type === 'name') {
                console.log('Nombre del cliente:', message.content);
            } else if (message.type === 'message') {
                let msj = message.user + ' dice: ' + message.content
                console.log(msj);

                // Enviar el mensaje a todos los clientes conectados
                const response = {
                    type: 'message',
                    content: msj
                };

                arr = arr.filter((object) => {
                  return object._readableState.closed != true;
                });
      
                // arr[0].write(JSON.stringify(response));

                // const sockets = server.getConnections();
                for (const s of arr) {
                  s.write(JSON.stringify(response));
                }

                // console.log(server)
                // Recorremos todos los sockets de clientes y enviamos el mensaje
                res = server.getConnections((err, count) => {
                    if (err) {
                        console.error('Error al obtener conexiones:', err);
                        return;
                    }

                    // server.clients.forEach((client) => {
                    //     if (client !== socket) {
                    //         client.write(JSON.stringify(response));
                    //     }
                    // });

                    console.log(`Hay ${count} clientes`);
                });

                // console.log(res)
                console.log('server.sockets', server.sockets)
            }
        } catch (error) {
            console.error('Error al manejar datos del cliente:', error);
        }
    });

    // Manejar la desconexión del cliente
    socket.on('end', () => {
        console.log('El cliente se ha desconectado');
    });

    // Manejar errores de socket
    socket.on('error', (error) => {
      if (error.code === 'ECONNRESET') {
          console.warn('El cliente cerró la conexión de forma inesperada');

          arr = arr.filter((object) => {
            return object._readableState.closed != true;
          });

          console.log('hay vivos en arr', arr.length)
          
          // console.log(JSON.stringify(arr))
          // arr[0].write();
      } else {
          console.error('Error en el socket:', error);
      }
  });
  
});

const PORT = 8777;

server.listen(PORT, () => {
    console.log(`Servidor de sockets escuchando en el puerto ${PORT}`);
});

// server.broadcast('Un cliente se ha conectado');