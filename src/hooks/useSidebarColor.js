import { useState, useEffect } from "react";

export const useSidebarColor = () => {
  const [color, setColor] = useState("007380");

  useEffect(() => {
    const updateColor = () => {
      const val = getComputedStyle(document.documentElement)
        .getPropertyValue("--sidebar-teal")
        .trim()
        .replace("#", "");
      if (val) setColor(val);
    };

    updateColor();

    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => observer.disconnect();
  }, []);

  return color;
};
