"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ExperimentCreationContextType {
  orgId: string | null;
  templateId: string | null;
  assignedInviteId: string | null;
  source: "personal" | "org-template" | "org-assigned";
  setOrgId: (orgId: string | null) => void;
  setTemplateId: (templateId: string | null) => void;
  setAssignedInviteId: (inviteId: string | null) => void;
  setSource: (source: "personal" | "org-template" | "org-assigned") => void;
  clear: () => void;
}

const ExperimentCreationContext = createContext<ExperimentCreationContextType | undefined>(
  undefined
);

export function ExperimentCreationProvider({ children }: { children: ReactNode }) {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [assignedInviteId, setAssignedInviteId] = useState<string | null>(null);
  const [source, setSource] = useState<"personal" | "org-template" | "org-assigned">("personal");

  const clear = () => {
    setOrgId(null);
    setTemplateId(null);
    setAssignedInviteId(null);
    setSource("personal");
  };

  return (
    <ExperimentCreationContext.Provider
      value={{
        orgId,
        templateId,
        assignedInviteId,
        source,
        setOrgId,
        setTemplateId,
        setAssignedInviteId,
        setSource,
        clear,
      }}
    >
      {children}
    </ExperimentCreationContext.Provider>
  );
}

export function useExperimentCreation() {
  const context = useContext(ExperimentCreationContext);
  if (!context) {
    throw new Error("useExperimentCreation must be used within ExperimentCreationProvider");
  }
  return context;
}
