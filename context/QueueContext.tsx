import { createContext, useContext, useState, ReactNode } from "react";

export type Office = {
  id: string;
  name: string;
};

export const OFFICES: Office[] = [
  { id: "1", name: "مكتب بريد وهران المركزي" },
  { id: "2", name: "مكتب بريد تلمسان" },
  { id: "3", name: "مكتب بريد سيدي بلعباس" },
  { id: "4", name: "مكتب بريد مستغانم" },
  { id: "5", name: "مكتب بريد وهران الغربي" },
];

type QueueContextType = {
  offices: Office[];
  selectedOffice: Office | null;
  myTicketNumber: number | null;
  nowServing: number;
  manualMode: boolean;
  setSelectedOffice: (office: Office) => void;
  setMyTicketNumber: (n: number) => void;
  setNowServing: (n: number | ((prev: number) => number)) => void;
  setManualMode: (v: boolean) => void;
  incrementNowServing: () => void;
};

const QueueContext = createContext<QueueContextType | null>(null);

export function QueueProvider({ children }: { children: ReactNode }) {
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [myTicketNumber, setMyTicketNumber] = useState<number | null>(null);
  const [nowServing, setNowServing] = useState(60);
  // When true the employee dashboard is in control — auto-simulation pauses
  const [manualMode, setManualMode] = useState(false);

  function incrementNowServing() {
    setNowServing((n) => n + 1);
  }

  return (
    <QueueContext.Provider
      value={{
        offices: OFFICES,
        selectedOffice,
        myTicketNumber,
        nowServing,
        manualMode,
        setSelectedOffice,
        setMyTicketNumber,
        setNowServing,
        setManualMode,
        incrementNowServing,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const ctx = useContext(QueueContext);
  if (!ctx) throw new Error("useQueue must be used inside QueueProvider");
  return ctx;
}
