import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

import { UnsavedChangesDialog } from './UnsavedChangesDialog';

interface CommentState {
  unsavedChangesDialog: React.ReactNode;
  state: {
    isEditing: (comment: CommentWithId) => boolean;
    isResponding: (comment: CommentWithId) => boolean;
  };
  interactions: {
    onStartEdit: (comment: CommentWithId) => void;
    onCancelEdit: ({ isDirty }: { isDirty: boolean }) => void;
    onSubmitEdit: () => void;
    onStartResponse: (comment: CommentWithId) => void;
    onSubmitResponse: () => void;
  };
}

interface CommentWithId {
  id: string;
}

interface CommentInteraction {
  type: 'edit' | 'respond';
  commentId: string;
}

const defaultState: CommentState = {
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

const CommentContext = createContext(defaultState);

export const CommentContextProvider = ({ children }: PropsWithChildren) => {
  const [interaction, setInteraction] = useState<CommentInteraction>();
  const [pendingInteraction, setPendingInteraction] = useState<CommentInteraction>();
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
    (comment: CommentWithId, interactionType: 'edit' | 'respond') => {
      // The same interaction is already in progress
      // (e.g. 'respond' was clicked again on the same comment)
      if (interaction?.type === interactionType && interaction.commentId === comment.id) {
        return;
      }
      if (interaction) {
        setPendingInteraction({ commentId: comment.id, type: interactionType });
        setOpenUnsavedChangesDialog(true);
      } else {
        setInteraction({ commentId: comment.id, type: interactionType });
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

  const contextObject: CommentState = {
    state: {
      isEditing: (comment: CommentWithId) => interaction?.type === 'edit' && interaction.commentId === comment.id,
      isResponding: (comment: CommentWithId) => interaction?.type === 'respond' && interaction.commentId === comment.id,
    },
    interactions: {
      onStartEdit: (comment: CommentWithId) => initiateInteraction(comment, 'edit'),
      onCancelEdit: ({ isDirty }) => tryDiscardOrPrompt({ showPrompt: isDirty ?? true }),
      onSubmitEdit: finalizeInteraction,
      onStartResponse: (comment: CommentWithId) => initiateInteraction(comment, 'respond'),
      onSubmitResponse: finalizeInteraction,
    },
    unsavedChangesDialog: dialog,
  };

  return <CommentContext.Provider value={contextObject}>{children}</CommentContext.Provider>;
};

const useComment = () => useContext(CommentContext);

export const useCommentState = () => {
  const comment = useComment();
  return comment.state;
};

export const useCommentInteractions = () => {
  const comment = useComment();
  return comment.interactions;
};

export const useUnsavedCommentChangesDialog = () => {
  const comment = useComment();
  return comment.unsavedChangesDialog;
};
