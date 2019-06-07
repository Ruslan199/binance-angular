import { ResponseModel } from "../response.model";
import { WebSocketData } from "./websocket-data-response.model";

export class WebsocketResponse extends ResponseModel {
    public k: WebSocketData;
}