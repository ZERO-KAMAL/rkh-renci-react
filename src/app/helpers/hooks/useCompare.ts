import { useEffect, useRef } from "react";

const useCompare = (val: any) => {
  const prevVal = usePrevious(val)
  return prevVal !== val
}

const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default useCompare
