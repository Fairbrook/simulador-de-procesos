import { ActionsTypes } from "context/actions";
import { GlobalContext } from "context/provider";
import { useCallback, useContext, useMemo } from "react";

export default function useGlobal() {
  const { dispatch, state } = useContext(GlobalContext);
  const allProcesses = useMemo(() => {
    const processes = state.active
      ? [state.active, ...state.ready]
      : [...state.ready];
    return processes.concat(state.blocked).concat(state.finished);
  }, [state]);
  const newProcess = useCallback(
    () => dispatch({ type: ActionsTypes.New }),
    [dispatch]
  );
  const finishWithError = useCallback(
    () => dispatch({ type: ActionsTypes.Error }),
    [dispatch]
  );
  const interrupt = useCallback(
    () => dispatch({ type: ActionsTypes.Interrupt }),
    [dispatch]
  );
  const tick = useCallback(
    () => dispatch({ type: ActionsTypes.Tick }),
    [dispatch]
  );
  const pause = useCallback(
    () => dispatch({ type: ActionsTypes.Pause }),
    [dispatch]
  );
  const play = useCallback(
    () => dispatch({ type: ActionsTypes.Continue }),
    [dispatch]
  );

  return {
    state,
    finishWithError,
    interrupt,
    tick,
    pause,
    play,
    newProcess,
    allProcesses,
  };
}
