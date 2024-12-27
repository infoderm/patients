import Emittery from 'emittery';

export type EventEmitter<T> = Emittery<T>;
export const EventEmitter = Emittery;
export const eventEmitter = <T>() => new Emittery<T>();
