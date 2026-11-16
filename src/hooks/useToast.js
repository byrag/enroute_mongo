import { useState, useRef, useCallback } from "react";

// One toast message at a time; auto-hides after `duration` ms.
export default function useToast(duration = 3200) {
  const [state, setState] = useState({ message: "", visible: false });
  const timer = useRef();

  const toast = useCallback(
    (message) => {
      setState({ message, visible: true });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setState((s) => ({ ...s, visible: false })), duration);
    },
    [duration]
  );

  return { toast, message: state.message, visible: state.visible };
}
