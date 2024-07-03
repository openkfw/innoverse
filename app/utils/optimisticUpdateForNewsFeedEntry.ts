import { Emoji, Reaction, ReactionCount } from '@/components/collaboration/emojiReactions/emojiReactionTypes';
import { StatusCodes } from 'http-status-codes';
import { NewsFeedEntry } from '@/common/types';

type OptimisticUpdateParams = {
  currentState: NewsFeedEntry;
  setCurrentState: (state: NewsFeedEntry) => void;
  performOperation: () => Promise<{ status: number; data?: Reaction }>;
  emoji: Emoji;
  operation: 'upsert' | 'delete';
  handleError: (error: Error) => void;
};

export async function optimisticUpdateForNewsFeedEntry({
  currentState,
  setCurrentState,
  performOperation,
  emoji,
  operation,
  handleError,
}: OptimisticUpdateParams): Promise<Reaction | undefined> {
  const previousState = JSON.parse(JSON.stringify(currentState));

  try {
    const newState = updateNewsFeedEntryState(currentState, emoji, operation);
    setCurrentState(newState);

    const result = await performOperation();
    if (result.status !== StatusCodes.OK) {
      throw new Error(`Backend failed with status: ${result.status}`);
    }

    return result.data;
  } catch (error: any) {
    console.error('Operation failed:', error);
    setCurrentState(previousState);
    handleError(error);
  }
}

function updateNewsFeedEntryState(state: NewsFeedEntry, emoji: Emoji, operation: 'upsert' | 'delete'): NewsFeedEntry {
  let newReactions = [...(state.item.reactions || [])];
  const currentEmojiIndex = newReactions.findIndex((r) => r.shortCode === emoji.shortCode);
  const userReactionIndex = state.item.reactionForUser
    ? newReactions.findIndex((r) => r.shortCode === state.item.reactionForUser?.shortCode)
    : -1;

  if (operation === 'upsert') {
    if (userReactionIndex > -1 && state.item.reactionForUser?.shortCode !== emoji.shortCode) {
      newReactions.splice(userReactionIndex, 1);
    }
    if (currentEmojiIndex > -1) {
      newReactions[currentEmojiIndex] = {
        ...newReactions[currentEmojiIndex],
        id: 'temp-id',
        reactedBy: 'temp-user-id',
        createdAt: new Date(),
        objectId: state.item.id,
        objectType: state.type,
      };
    } else {
      newReactions.push({
        id: 'temp-id',
        reactedBy: 'temp-user-id',
        createdAt: new Date(),
        objectId: state.item.id,
        objectType: state.type,
        nativeSymbol: emoji.nativeSymbol,
        shortCode: emoji.shortCode,
      });
    }
  } else if (operation === 'delete' && currentEmojiIndex > -1) {
    newReactions.splice(currentEmojiIndex, 1);
  }

  const updatedReactionForUser =
    operation === 'upsert'
      ? {
          ...emoji,
          id: 'temp-id',
          reactedBy: 'temp-user-id',
          createdAt: new Date(),
          objectId: state.item.id,
          objectType: state.type,
        }
      : null;

  return {
    ...state,
    item: {
      ...state.item,
      reactions: newReactions,
      reactionForUser: updatedReactionForUser,
    } as any,
  };
}
