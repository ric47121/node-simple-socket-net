const readline = require('readline');
const net = require('net');

const client = new net.Socket();

// const HOST = 'localhost'
const HOST = '206.189.202.173'

const user = {
    name: '',
    message: ''
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Pedir al usuario que ingrese su nombre
rl.question('Por favor, ingrese su nombre: ', (name) => {
    user.name = name;

    // Conectar al servidor
    client.connect(8777, HOST, () => {
        console.log('Conectado al servidor');

        // Enviar el nombre al servidor
        const initialMessage = {
            type: 'name',
            content: user.name
        };
        client.write(JSON.stringify(initialMessage));
    });

    // Enviar datos al servidor
    rl.on('line', (input) => {
        // Enviar el mensaje al servidor en formato JSON
        const message = {
            type: 'message',
            user: user.name,
            content: input
        };
        client.write(JSON.stringify(message));
    });

    // Manejar datos recibidos del servidor
    client.on('data', (data) => {
        console.log('Mensaje del servidor:', data.toString());
    });

    // Manejar la desconexión del servidor
    client.on('close', () => {
        console.log('Desconectado del servidor');
        rl.close();
    });
});

rl.on('close', () => {
    console.log('Aplicación cerrada');
    process.exit(0);
});
