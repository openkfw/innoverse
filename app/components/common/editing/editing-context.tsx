'use client';

import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

import { UnsavedChangesDialog } from './UnsavedChangesDialog';

interface EditingState {
  unsavedChangesDialog: JSX.Element;
  state: {
    isEditing: (item: ItemWithId) => boolean;
    isResponding: (item: ItemWithId) => boolean;
  };
  interactions: {
    onStartEdit: (item: ItemWithId) => void;
    onCancelEdit: ({ isDirty }: { isDirty: boolean }) => void;
    onSubmitEdit: () => void;
    onStartResponse: (item: ItemWithId) => void;
    onSubmitResponse: () => void;
  };
}

interface ItemWithId {
  id: string;
}

interface Interaction {
  type: 'edit' | 'respond';
  itemId: string;
}

const defaultState: EditingState = {
  unsavedChangesDialog: <></>,
  state: {
    isEditing: () => false,
    isResponding: () => false,
  },
  interactions: {
    onStartEdit: () => {},
    onCancelEdit: () => {},
    onSubmitEdit: () => {},
    onStartResponse: () => {},
    onSubmitResponse: () => {},
  },
};

const EditingContext = createContext(defaultState);

export const EditingContextProvider = ({ children }: PropsWithChildren) => {
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
    (item: ItemWithId, interactionType: 'edit' | 'respond') => {
      // The same interaction is already in progress
      // (e.g. 'respond' was clicked again on the same comment)
      if (interaction?.type === interactionType && interaction.itemId === item.id) {
        return;
      }
      if (interaction) {
        setPendingInteraction({ itemId: item.id, type: interactionType });
        setOpenUnsavedChangesDialog(true);
      } else {
        setInteraction({ itemId: item.id, type: interactionType });
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
      isEditing: (item: ItemWithId) => interaction?.type === 'edit' && interaction.itemId === item.id,
      isResponding: (item: ItemWithId) => interaction?.type === 'respond' && interaction.itemId === item.id,
    },
    interactions: {
      onStartEdit: (item: ItemWithId) => initiateInteraction(item, 'edit'),
      onCancelEdit: ({ isDirty }) => tryDiscardOrPrompt({ showPrompt: isDirty ?? true }),
      onSubmitEdit: finalizeInteraction,
      onStartResponse: (item: ItemWithId) => initiateInteraction(item, 'respond'),
      onSubmitResponse: finalizeInteraction,
    },
    unsavedChangesDialog: dialog,
  };

  return <EditingContext.Provider value={contextObject}>{children}</EditingContext.Provider>;
};

const useEditing = () => useContext(EditingContext);

export const useEditingState = () => {
  const editing = useEditing();
  return editing.state;
};

export const useEditingInteractions = () => {
  const editing = useEditing();
  return editing.interactions;
};

export const useUnsavedEditingChangesDialog = () => {
  const editing = useEditing();
  return editing.unsavedChangesDialog;
};
