import Emittery from 'emittery';

export const EventEmitter = Emittery;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EventEmitter<T> = Emittery<T>;
export const eventEmitter = <T>() => new Emittery<T>();
