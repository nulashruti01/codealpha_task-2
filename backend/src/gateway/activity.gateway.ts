import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ActivityGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    client.join('activity');
  }

  handleDisconnect(client: Socket) {
    client.leave('activity');
  }

  broadcastEvent(event: string, payload: unknown) {
    this.server.to('activity').emit(event, payload);
  }
}
