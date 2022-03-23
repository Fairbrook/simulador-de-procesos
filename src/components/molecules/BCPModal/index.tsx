import Modal from "components/atoms/Modal";
import ProcessRow from "components/atoms/ProcessRow";
import { Process } from "types/Process";

export interface BCPModalProps {
  isOpen: boolean;
  toggle: () => any;
  processes: Process[];
}

export default function BCPModal({ processes, isOpen, toggle }: BCPModalProps) {
  return (
    <Modal open={isOpen} setOpen={toggle}>
      <div className="flex justify-between">
        <h1 className="text-4xl">Bloque de control de procesos</h1>
        <h1
          onClick={toggle}
          className="text-xl bg-red-300 rounded-full h-8 w-8 flex items-center justify-center cursor-pointer"
        >
          X
        </h1>
      </div>
      {processes.map((process) => (
        <ProcessRow process={process} />
      ))}
    </Modal>
  );
}
