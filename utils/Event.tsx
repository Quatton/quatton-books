import EventEmitter from "events";
import React, { createContext, ReactNode } from "react";

export type Settings = {
  lang: string;
};

const emitter = new EventEmitter();
export const EventContext = createContext(emitter);

export default function EventProvider({ children }: { children: ReactNode }) {
  return (
    <EventContext.Provider value={emitter}>{children}</EventContext.Provider>
  );
}
