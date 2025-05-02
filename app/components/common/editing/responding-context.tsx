'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { UnsavedChangesDialog } from './UnsavedChangesDialog';

interface ItemWithId {
  id: string;
}

interface Interaction {
  itemId: string;
}

type InteractionType = 'reply' | 'comment';

interface RespondingState {
  unsavedChangesDialog: {
    element: JSX.Element;
    isOpen: boolean;
  };
  state: {
    isResponding: (item: ItemWithId, type: InteractionType) => boolean;
  };
  interactions: {
    onStart: (item: ItemWithId, type: InteractionType) => void;
    onCancel: (args: { isDirty: boolean }) => void;
    onSubmit: (type: InteractionType) => void;
  };
}

const respondingDefaultState: RespondingState = {
  unsavedChangesDialog: {
    element: <></>,
    isOpen: false,
  },
  state: {
    isResponding: () => false,
  },
  interactions: {
    onStart: () => {},
    onCancel: () => {},
    onSubmit: () => {},
  },
};

export const RespondingContext = createContext(respondingDefaultState);

export function useRespondingContext(): RespondingState {
  const [replyInteractions, setReplyInteractions] = useState<Interaction[]>([]);
  const [commentInteraction, setCommentInteraction] = useState<Interaction | undefined>();
  const [pendingInteraction, setPendingInteraction] = useState<
    | {
        type: InteractionType;
        interaction: Interaction;
      }
    | undefined
  >();
  const [openUnsavedChangesDialog, setOpenUnsavedChangesDialog] = useState(false);

  const isResponding = useCallback(
    (item: ItemWithId, type: InteractionType): boolean => {
      if (type === 'reply') {
        return replyInteractions.some((interaction) => interaction.itemId === item.id);
      } else {
        return commentInteraction?.itemId === item.id;
      }
    },
    [replyInteractions, commentInteraction],
  );

  const finalizeInteraction = useCallback((type?: InteractionType) => {
    setOpenUnsavedChangesDialog(false);
    setPendingInteraction(undefined);
    if (!type || type === 'comment') setCommentInteraction(undefined);
  }, []);

  const dismissDialog = useCallback(() => {
    setOpenUnsavedChangesDialog(false);
    setPendingInteraction(undefined);
  }, []);
  const initiateInteraction = useCallback(
    (item: ItemWithId, type: InteractionType) => {
      const currentInteraction =
        type === 'reply' ? replyInteractions.find((i) => i.itemId === item.id) : commentInteraction;

      if (currentInteraction) {
        if (type === 'reply') {
          setReplyInteractions((prevInteractions) =>
            prevInteractions.filter((interaction) => interaction.itemId !== item.id),
          );
        } else {
          setPendingInteraction({ type, interaction: { itemId: item.id } });
          setOpenUnsavedChangesDialog(true);
        }
      } else {
        // If no interaction exists, add a new one
        if (type === 'reply') {
          setReplyInteractions((prevInteractions) => [...prevInteractions, { itemId: item.id }]);
        } else {
          setCommentInteraction({ itemId: item.id });
        }
        dismissDialog();
      }
    },
    [replyInteractions, commentInteraction, dismissDialog],
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
      const { type, interaction } = pendingInteraction;
      if (type === 'reply') {
        setReplyInteractions((prevInteractions) => [...prevInteractions, interaction]);
      }
      if (type === 'comment') {
        setCommentInteraction(interaction);
      }
    }
    dismissDialog();
  }, [pendingInteraction, dismissDialog]);

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

  return {
    state: {
      isResponding,
    },
    interactions: {
      onStart: initiateInteraction,
      onCancel: ({ isDirty }) => tryDiscardOrPrompt({ showPrompt: isDirty ?? true }),
      onSubmit: finalizeInteraction,
    },
    unsavedChangesDialog: {
      element: dialog,
      isOpen: openUnsavedChangesDialog,
    },
  };
}

export const useResponding = () => useContext(RespondingContext);
export const useRespondingState = () => useResponding().state;
export const useRespondingInteractions = () => useResponding().interactions;
