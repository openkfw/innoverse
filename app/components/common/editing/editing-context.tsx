'use client';

import React, { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

import { UnsavedChangesDialog } from './UnsavedChangesDialog';

interface EditingState {
  unsavedChangesDialog: {
    element: JSX.Element;
    isOpen: boolean;
  };
  state: {
    isEditing: (item: ItemWithId) => boolean;
  };
  interactions: {
    onStart: (item: ItemWithId) => void;
    onCancel: ({ isDirty }: { isDirty: boolean }) => void;
    onSubmit: () => void;
  };
}

interface ItemWithId {
  id: string;
}

interface Interaction {
  itemId: string;
}

const defaultState: EditingState = {
  unsavedChangesDialog: {
    element: <></>,
    isOpen: false,
  },
  state: {
    isEditing: () => false,
  },
  interactions: {
    onStart: () => {},
    onCancel: () => {},
    onSubmit: () => {},
  },
};

const EditingContext = createContext(defaultState);
const RespondingContext = createContext(defaultState);

export const EditingContextProvider = ({ children }: PropsWithChildren) => (
  <EditingContext.Provider value={useEditingContext()}>
    <RespondingContext.Provider value={useEditingContext()}>{children}</RespondingContext.Provider>
  </EditingContext.Provider>
);

function useEditingContext() {
  const [interaction, setInteraction] = useState<Interaction>();
  const [pendingInteraction, setPendingInteraction] = useState<Interaction>();
  const [openUnsavedChangesDialog, setOpenUnsavedChangesDialog] = useState(false);

  const finalizeInteraction = useCallback(() => {
    setOpenUnsavedChangesDialog(false);
    setInteraction(undefined);
    setPendingInteraction(undefined);
  }, []);

  const dismissDialog = useCallback(() => {
    setOpenUnsavedChangesDialog(false);
    setPendingInteraction(undefined);
  }, []);

  const initiateInteraction = useCallback(
    (item: ItemWithId) => {
      if (interaction?.itemId === item.id) {
        setInteraction(undefined);
        return;
      }
      if (interaction) {
        setPendingInteraction({ itemId: item.id });
        setOpenUnsavedChangesDialog(true);
      } else {
        setInteraction({ itemId: item.id });
        dismissDialog();
      }
    },
    [interaction, dismissDialog],
  );

  const tryDiscardOrPrompt = useCallback(
    ({ showPrompt }: { showPrompt: boolean }) => {
      if (showPrompt) {
        setOpenUnsavedChangesDialog(true);
      } else {
        finalizeInteraction();
      }
    },
    [finalizeInteraction],
  );

  const applyPendingOrFinalize = useCallback(() => {
    if (pendingInteraction) {
      setInteraction(pendingInteraction);
      dismissDialog();
    } else {
      finalizeInteraction();
    }
  }, [pendingInteraction, dismissDialog, finalizeInteraction]);

  const dialog = useMemo(
    () => (
      <UnsavedChangesDialog
        open={openUnsavedChangesDialog}
        onProceed={applyPendingOrFinalize}
        onDismiss={dismissDialog}
      />
    ),
    [openUnsavedChangesDialog, applyPendingOrFinalize, dismissDialog],
  );

  const contextObject: EditingState = {
    state: {
      isEditing: (item: ItemWithId) => interaction?.itemId === item.id,
    },
    interactions: {
      onStart: (item: ItemWithId) => initiateInteraction(item),
      onCancel: ({ isDirty }) => tryDiscardOrPrompt({ showPrompt: isDirty ?? true }),
      onSubmit: finalizeInteraction,
    },
    unsavedChangesDialog: {
      element: dialog,
      isOpen: openUnsavedChangesDialog,
    },
  };

  return contextObject;
}

const useEditing = () => useContext(EditingContext);
const useResponding = () => useContext(RespondingContext);

export const useEditingState = () => {
  const editing = useEditing();
  return editing.state;
};

export const useEditingInteractions = () => {
  const editing = useEditing();
  return editing.interactions;
};

export const useRespondingState = () => {
  const responding = useResponding();
  return responding.state;
};

export const useRespondingInteractions = () => {
  const responding = useResponding();
  return responding.interactions;
};

export const useUnsavedChangesDialog = () => {
  const editing = useEditing();
  const responding = useResponding();
  const editingDialog = editing.unsavedChangesDialog;
  const respondingDialog = responding.unsavedChangesDialog;
  return editingDialog.isOpen ? editingDialog.element : respondingDialog.element;
};
