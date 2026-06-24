"use client";

import {
    createContext,
    useCallback,
    useContext,
    useState,
    ReactNode,
} from "react";

type UnsavedChangesContextValue = {
    isDirty: boolean;
    markDirty: () => void;
    markSaved: () => void;
    requestNavigation: (onConfirm: () => void) => void;
    confirmOpen: boolean;
    closeDialog: () => void;
    confirm: () => void;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(
    null,
);

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
    const [isDirty, setIsDirty] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(
        null,
    );
    const [confirmOpen, setConfirmOpen] = useState(false);

    const markDirty = useCallback(() => setIsDirty(true), []);
    const markSaved = useCallback(() => setIsDirty(false), []);

    const requestNavigation = useCallback(
        (onConfirm: () => void) => {
            if (!isDirty) {
                onConfirm();
                return;
            }
            setPendingAction(() => onConfirm);
            setConfirmOpen(true);
        },
        [isDirty],
    );

    const closeDialog = () => {
        setConfirmOpen(false);
        setPendingAction(null);
    };

    const confirm = () => {
        if (pendingAction) {
            pendingAction();
        }
        setConfirmOpen(false);
        setPendingAction(null);
        setIsDirty(false);
    };

    return (
        <UnsavedChangesContext.Provider
            value={{
                isDirty,
                markDirty,
                markSaved,
                requestNavigation,
                confirmOpen,
                closeDialog,
                confirm,
            }}
        >
            {children}
        </UnsavedChangesContext.Provider>
    );
}

export function useUnsavedChanges() {
    const ctx = useContext(UnsavedChangesContext);
    if (!ctx) {
        throw new Error(
            "useUnsavedChanges must be used within UnsavedChangesProvider",
        );
    }
    return ctx;
}
