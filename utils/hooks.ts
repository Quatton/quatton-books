import { useEffect, useState } from "react";

export const useRandomColor = (): string => {
  const [color, setColor] = useState("");

  useEffect(() => {
    setColor(
      "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")
    );
  }, []);

  return color;
};
