/// <reference types="ws" />
/// <reference types="rxjs" />

import { Data } from "ws";
import { Observable } from "rxjs";

declare class WebSocketClient {
  observable: Observable<Data>;
  constructor(address: string);
  send(data: any): Promise<void>;
  close(): Promise<void>;
}

declare class MistyEventObserver {
  constructor(robotIp: string);

  startObserving(
    eventName: string,
    eventType: Misty.EventType,
    options?: Partial<Exclude<Misty.SubscribeMessage, 'Operation' | 'Type' | 'EventName'>>
  ): Observable<any>;

  stopObserving(eventName: string): Promise<void>;
  destroy(): Promise<void>;
}

declare class MistyRestApiClient {
  constructor(robotIp: string);

  getRaw(endpoint: string, params?: object): Promise<Response>;
  get<T>(endpoint: string, params?: object): Promise<T>;
  post<T>(endpoint: string, body: BodyInit): Promise<T>;
  postJSON<T>(endpoint: string, data: object): Promise<T>;
}

declare class MistyFeat {
  protected _robotIp: string;
  protected _mistyClient: MistyRestApiClient;
  protected _eventObserver: MistyEventObserver | null;

  protected _exec<T>(procedure: () => Promise<T>, options?: object): Promise<T>;
  protected _cleanup(): Promise<void>;
  protected _initEventObserver(): MistyEventObserver;
  protected _updateExpression(fileName: string): Promise<void>;
  protected _resetExpression(): Promise<void>;
  protected _updateArmPosition(leftArmPosition: number, rightArmPosition: number): Promise<void>
  protected _resetArmPosition(): Promise<void>;
}

declare class MistyAction extends MistyFeat {
  do(params: object, options?: object): Promise<void>;
  protected _do(params: object): Promise<void>;
}

declare class MistyPerception<T, S> extends MistyFeat {
  start(options: object): Promise<T>;
  stop(): Promise<S>;

  protected _start(): Promise<T>;
  protected _stop(): Promise<S>;
}

declare namespace Misty {
  interface SubscribeMessage {
    Operation: string;
    Type: EventType;
    EventName: string;
    DebounceMs: number;
    Message: string | null;
    ReturnProperty: string | null;
    EventConditions: EventCondition[];
  }

  type EventType =
    | 'TimeOfFlight'
    | 'FaceRecognition'
    | 'LocomotionCommand'
    | 'HaltCommand'
    | 'SelfState'
    | 'WorldState';

  interface EventCondition {
    Property: string;
    Inequality: string;
    Value: string;
  }
}