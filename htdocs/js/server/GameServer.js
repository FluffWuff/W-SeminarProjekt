/*import * as express from 'express';
import * as serveStatic from 'serve-static';
import * as ws from 'ws';

type ClientData = {
    socket: ws,
    id: number,
    color: number,
    x: number,
    y: number
}

export class GameServer {

    myexpress: express.Express = express();
    wsServer: ws.Server;

    clients: ClientData[] = [];
    socketToClientDataMap: Map<ws, ClientData> = new Map();

    constructor() {
        this.myexpress.use(serveStatic('./htdocs/'));
        const server = this.myexpress.listen(5600);
        console.log("Starting server, listening on port 5600.");

        this.wsServer = new ws.Server({ noServer: true });

        let that = this;

        /**
         * To open a websocket connection a client send a http upgrade-request to the http-server.
         * The http-server then passes the underlying tcp-connection to the websocket server.
         */
/*server.on('upgrade', (request, socket, head) => {
    that.wsServer.handleUpgrade(request, socket, head, socket => {

        that.onWebSocketConnect(socket);

        socket.on('message', (message: ws.Data) => {
            that.onWebSocketClientMessage(socket, message);
        })

        socket.on('close', () => {
            that.onWebSocketClientClosed(socket);
        })

    });
});

}

/**
* This event handler is called whenever a client connnects
* @param socket
*/ /*
onWebSocketConnect(socket: ws) {

}

onWebSocketClientMessage(clientSocket: ws, messageJson: ws.Data) {

   let message: ClientMessage = JSON.parse(<string>messageJson);
   let clientData: ClientData = this.socketToClientDataMap.get(clientSocket);


   switch (message.type) {
       case "newClient":
           clientData = {
               id: this.clients.length + 1,
               color: message.color,
               x: message.x,
               y: message.y,
               socket: clientSocket
           };
           this.clients.push(clientData);
           this.socketToClientDataMap.set(clientSocket, clientData);

           let newClientMessage: ServerMessageNewClient = {
               type: "newClient",
               color: message.color,
               x: message.x,
               y: message.y,
               id: clientData.id
           }

           // Mach den neuen Client bei allen anderen bekannt:
           this.sendToAllClientsExceptOne(clientSocket, newClientMessage);

           // Mach dem neuen Client alle anderen bekannt:
           for (let client of this.clients) {
               if (client.socket != clientSocket) {

                   let ncm: ServerMessageNewClient = {
                       type: "newClient",
                       id: client.id,
                       color: client.color,
                       x: client.x,
                       y: client.y
                   }

                   clientSocket.send(JSON.stringify(ncm));
               }
           }

           break;

       case "sendCoordinates":

           let sco: ServerMessageSendCoordinates = {
               type: "sendCoordinates",
               id: clientData.id,
               x: message.x,
               y: message.y
           };

           this.sendToAllClientsExceptOne(clientSocket, sco);
           clientData.x = message.x;
           clientData.y = message.y;
           break;
   }


}

onWebSocketClientClosed(clientSocket: ws) {
   let clientData: ClientData = this.socketToClientDataMap.get(clientSocket);

   let cgo: ServerMessageClientGone = {
       id: clientData.id,
       type: "clientGone"
   }

   this.sendToAllClientsExceptOne(clientSocket, cgo);

   this.socketToClientDataMap.delete(clientSocket);
   this.clients.splice(this.clients.indexOf(clientData), 1);
}


sendToAllClientsExceptOne(dontSendToclientSocket: ws, message: ServerMessage) {
   let messageAsJson = JSON.stringify(message);

   for (let client of this.clients) {
       if (client.socket != dontSendToclientSocket) {
           client.socket.send(messageAsJson);
       }
   }
}


}

new GameServer();
*/ 
//# sourceMappingURL=GameServer.js.map