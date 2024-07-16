import { useState } from 'react';
import { StatusCodes } from 'http-status-codes';

import {
  EventWithAdditionalData,
  NewsFeedEntry,
  ObjectType,
  ProjectUpdateWithAdditionalData,
  Reaction,
} from '@/common/types';
import { handleReaction } from '@/components/collaboration/emojiReactions/cards/actions';
import { Emoji } from '@/components/collaboration/emojiReactions/emojiReactionTypes';

interface Operation {
  type: OperationType;
  promise: Promise<unknown>;
}

type OperationType = 'upsert' | 'delete';

interface OptimisticReactionsProps<T> {
  objectId: string;
  objectType: ObjectType;
  currentState: T;
  setCurrentState: (entry: T) => void;
  applyReactionOffline: (currentState: T, emoji: Emoji, operation: OperationType) => T;
}

export function useOptimisticReactions<T>({
  objectId,
  objectType,
  currentState,
  setCurrentState,
  applyReactionOffline,
}: OptimisticReactionsProps<T>) {
  const [pendingOperations, setPendingOperations] = useState<Operation[]>([]);

  const applyReaction = async ({ emoji, operation }: { emoji: Emoji; operation: OperationType }) => {
    const previousState = currentState;

    try {
      const updatedState = applyReactionOffline(currentState, emoji, operation);
      setCurrentState(updatedState);

      if (operation === 'delete') {
        await awaitPendingOperation({ type: 'upsert' });
      }

      const result = await applyReactionOnline({ emoji, operation });

      if (result.status !== StatusCodes.OK) {
        throw new Error(`Backend failed with status: ${result.status}`);
      }

      return result.data;
    } catch (error: unknown) {
      console.error('Operation failed:', error);
      setCurrentState(previousState);
      throw error;
    }
  };

  const applyReactionOnline = async ({ emoji, operation }: { emoji: Emoji; operation: OperationType }) => {
    const promise = handleReaction({
      objectId,
      objectType,
      emoji,
      operation,
    });

    const pendingOperation = addPendingOperation({ type: operation, promise });
    const result = await promise;
    removePendingOperation(pendingOperation);
    return result;
  };

  const awaitPendingOperation = async ({ type }: { type: OperationType }) => {
    const pendingOperation = pendingOperations.findLast((o) => o.type === type);
    if (pendingOperation) {
      await pendingOperation.promise;
    }
  };

  const addPendingOperation = ({ type, promise }: Operation) => {
    const pendingOperation = { type, promise };
    setPendingOperations((operations) => [...operations, pendingOperation]);
    return pendingOperation;
  };

  const removePendingOperation = (operation: Operation) => {
    setPendingOperations((operations) => operations.filter((o) => o !== operation));
  };

  return {
    applyReaction,
  };
}

export function applyNewsFeedReactionOffline(
  entry: NewsFeedEntry,
  emoji: Emoji,
  operation: 'upsert' | 'delete',
): NewsFeedEntry {
  const reactions = entry.item.reactions;
  const reactionWithoutUserReactions = reactions?.filter((r) => r.id !== entry.item.reactionForUser?.id);

  if (operation === 'upsert') {
    const userReaction = createUserReaction({ objectId: entry.item.id, objectType: entry.type, emoji });
    const updatedReactions = [...(reactionWithoutUserReactions ?? []), userReaction];
    return createNewsFeedEntry(entry, updatedReactions, userReaction);
  }

  return createNewsFeedEntry(entry, reactionWithoutUserReactions);
}

export function applyItemReactionOffline(
  item: EventWithAdditionalData | ProjectUpdateWithAdditionalData,
  emoji: Emoji,
  operation: 'upsert' | 'delete',
): EventWithAdditionalData | ProjectUpdateWithAdditionalData {
  const reactionCount = item.reactionCount;
  const userReactionIdx = reactionCount.findIndex((r) => r.emoji.shortCode === item.reactionForUser?.shortCode);

  // Remove user reaction
  if (userReactionIdx > -1) {
    reactionCount[userReactionIdx].count--;
    if (reactionCount[userReactionIdx].count === 0) {
      reactionCount.splice(userReactionIdx, 1);
    }
  }

  if (operation === 'delete') {
    return createItem(item, reactionCount);
  }

  // Add new reaction
  const emojiIdx = reactionCount.findIndex((r) => r.emoji.shortCode === emoji.shortCode);

  if (emojiIdx > -1) {
    reactionCount[emojiIdx].count++;
  } else {
    reactionCount.push({ emoji, count: 1 });
  }

  const userReaction = createUserReaction({ objectId: item.id, objectType: ObjectType.UPDATE, emoji });
  return createItem(item, reactionCount, userReaction);
}

function createNewsFeedEntry(entry: NewsFeedEntry, reactions?: Reaction[], reactionForUser?: Reaction): NewsFeedEntry {
  return {
    ...entry,
    item: {
      ...entry.item,
      reactions,
      reactionForUser,
    },
  } as NewsFeedEntry;
}

function createItem(
  item: EventWithAdditionalData | ProjectUpdateWithAdditionalData,
  reactionCount: EventWithAdditionalData['reactionCount'],
  reactionForUser?: Reaction,
) {
  return {
    ...item,
    reactionCount,
    reactionForUser,
  };
}

function createUserReaction({
  objectId,
  objectType,
  emoji,
}: {
  objectId: string;
  objectType: ObjectType;
  emoji: Emoji;
}): Reaction {
  return {
    id: 'temp-id',
    reactedBy: 'temp-user-id',
    createdAt: new Date(),
    objectId: objectId,
    objectType: objectType,
    nativeSymbol: emoji.nativeSymbol,
    shortCode: emoji.shortCode,
  };
}
