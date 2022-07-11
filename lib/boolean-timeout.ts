import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export default function useBooleanTimeout(
  timeout = 5000
): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [isActive, setIsActive] = useState<boolean>(false);
  const isActiveTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isActive) {
      isActiveTimeout.current = setInterval(() => {
        setIsActive(false);
      }, timeout);
    } else {
      if (isActiveTimeout.current) {
        clearInterval(isActiveTimeout.current);
        isActiveTimeout.current = null;
      }
    }

    return () => {
      clearInterval(isActiveTimeout.current as NodeJS.Timeout);
    };
  }, [isActive]);
  return [isActive, setIsActive];
}
