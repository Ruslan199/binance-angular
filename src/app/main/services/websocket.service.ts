import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class WebSocketService 
{
    //private depthStream: WebSocket = new WebSocket('wss://stream.binance.com:9443/ws/gvtbtc@depth');
    //private depthStream2: WebSocket = new WebSocket('wss://stream.binance.com:9443/ws/iotxbtc@depth');
    private depthStream: WebSocket = new WebSocket('wss://stream.binance.com:9443');
    private depthStream2: WebSocket = new WebSocket('wss://stream.binance.com:9443');
    private depthStreamData: WebSocket; //= new WebSocket('ws://localhost:5001/notifications');

    private _depthStreamMessage: BehaviorSubject<MessageEvent> = new BehaviorSubject<MessageEvent>(null);
    public depthStreamMessage: Observable<MessageEvent> = this._depthStreamMessage.asObservable();

    private _depthStreamMessage2: BehaviorSubject<MessageEvent> = new BehaviorSubject<MessageEvent>(null);
    public depthStreamMessage2: Observable<MessageEvent> = this._depthStreamMessage2.asObservable();

    private _depthStreamMessage3: BehaviorSubject<MessageEvent>  = new BehaviorSubject<MessageEvent>(null);
    public depthStreamMessage3: Observable<MessageEvent> = this._depthStreamMessage3.asObservable();

    public subscriptions: any[]=[];

    constructor()
    {
        
        this.depthStream.onopen = () =>{
            this.depthStream.onmessage = (msg) => {
                this._depthStreamMessage.next(msg);
                
            }
        }  

    }

    public openDepthStream(symbol: string, interval: string): void{

      this.depthStream.close();
      this.depthStream2.close();
      
      this.depthStream = new WebSocket(`wss://stream.binance.com:9443/ws/${ symbol.toLowerCase() }@kline_${ interval }`);
      this.depthStream2 = new WebSocket(`wss://stream.binance.com:9443/ws/${ symbol.toLowerCase() }@ticker`);

        this.depthStream.onopen = () => {
          this.depthStream.onmessage = (msg) => {
            this._depthStreamMessage.next(msg);
        }
    };

         this.depthStream2.onopen = () => {
            this.depthStream2.onmessage = (msg) => {
              this._depthStreamMessage2.next(msg);
            }
        };

    }

    public openDepthStreamData(): void{

       //this.depthStreamData = new WebSocket('ws://188.225.24.69:5000/notifications');
       this.depthStreamData = new WebSocket('ws://localhost:5001/notifications');
      // this.depthStreamData.close();

       // this.depthStreamData = new WebSocket(`ws://localhost:5001/notifications`);

          this.depthStreamData.onopen = () => {
            this.depthStreamData.onmessage = (msg) => {
              this._depthStreamMessage3.next(msg);
          }
      };
  
      }
      public dispose(){ 
          this.subscriptions.forEach(subscription =>subscription.unsubscribe());
      }
}
