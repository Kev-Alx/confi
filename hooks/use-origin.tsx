import { useEffect, useState } from "react";

//This hook is to get the window object from a server component
export const useOrigin = () => {
  const [mounted, setMounted] = useState(false);
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return "";
  }
  return origin;
};
