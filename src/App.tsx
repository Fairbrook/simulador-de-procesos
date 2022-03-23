import ActiveProcess from "components/molecules/ActiveProcess";
import BCPModal from "components/molecules/BCPModal";
import BlockedTable from "components/molecules/BlockedTable";
import FinishedTable from "components/molecules/FinishedTable";
import GlobalMetrics from "components/molecules/GlobalMetrics";
import ReadyTable from "components/molecules/ReadyTable";

import useGlobal from "hooks/useGlobal";
import { useEffect, useRef, useState } from "react";
import { State } from "types/GlobalState";
import "./App.css";

function App() {
  const {
    state,
    newProcess,
    tick,
    interrupt,
    pause,
    finishWithError,
    allProcesses,
    play,
  } = useGlobal();
  const timeout = useRef<NodeJS.Timer>();
  const [bcpOpen, setOpen] = useState(false);

  useEffect(() => {
    timeout.current = setInterval(() => tick(), 1000);
    const cb = (ev: KeyboardEvent) => {
      switch (ev.key) {
        case "n":
          return newProcess();
        case "w":
          return interrupt();
        case "b":
          pause();
          return setOpen(true);
        case "e":
          return finishWithError();
        case "p":
          return pause();
        case "c":
          return play();
      }
    };
    document.addEventListener("keydown", cb);
    return () => {
      document.removeEventListener("keydown", cb);
      if (timeout.current) {
        clearInterval(timeout.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.state === State.Finished && allProcesses.length) {
      setOpen(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.state]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="flex justify-between main w-full">
          <ReadyTable data={state.ready} className="mr-4" />
          <BlockedTable data={state.blocked} className="mr-4" />
          <FinishedTable data={state.finished} className="mr-4" />
        </div>
        <div className="w-full mt-10 flex-1 flex">
          <ActiveProcess
            process={state.active}
            className="w-6/12 border-2 border-green-100 border-solid rounded-md p-5"
          />
          <div className="flex-1">
            <GlobalMetrics state={state}></GlobalMetrics>
          </div>
        </div>
        <div className="absolute bottom-3"></div>
      </header>
      <BCPModal
        isOpen={bcpOpen}
        toggle={() => setOpen(false)}
        processes={allProcesses}
      />
    </div>
  );
}

export default App;
