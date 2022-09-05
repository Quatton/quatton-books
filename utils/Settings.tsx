import React, { createContext, ReactNode } from "react";
import { useLocalStorage } from "./Storage";

export type Settings = {
  lang: string;
};

const initialValue = {
  settings: {
    lang: "en",
  },
  setSettings: (settings: Settings) => {},
};

export const SettingContext = createContext(initialValue);

export default function SettingProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>("settings", {
    lang: "en",
  });

  return (
    <SettingContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingContext.Provider>
  );
}
