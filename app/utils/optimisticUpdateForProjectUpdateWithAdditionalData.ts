import { Emoji, Reaction, ReactionCount } from '@/components/collaboration/emojiReactions/emojiReactionTypes';
import { StatusCodes } from 'http-status-codes';
import { EventWithAdditionalData, ObjectType, ProjectUpdateWithAdditionalData } from '@/common/types';

type OptimisticUpdateParams = {
  currentState: EventWithAdditionalData | ProjectUpdateWithAdditionalData;
  setCurrentState: (state: EventWithAdditionalData | ProjectUpdateWithAdditionalData) => void;
  performOperation: () => Promise<{ status: number; data?: Reaction }>;
  emoji: Emoji;
  operation: 'upsert' | 'delete';
  handleError: (error: Error) => void;
};

export async function optimisticUpdateForProjectUpdate({
  currentState,
  setCurrentState,
  performOperation,
  emoji,
  operation,
  handleError,
}: OptimisticUpdateParams): Promise<Reaction | undefined> {
  const previousState = JSON.parse(JSON.stringify(currentState));

  try {
    const newState = updateProjectUpdateState(currentState, emoji, operation);
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

function updateProjectUpdateState(
  state: EventWithAdditionalData | ProjectUpdateWithAdditionalData,
  emoji: Emoji,
  operation: 'upsert' | 'delete',
): EventWithAdditionalData | ProjectUpdateWithAdditionalData {
  let newReactions = [...state.reactionCount];
  const currentEmojiIndex = newReactions.findIndex((r) => r.emoji.shortCode === emoji.shortCode);
  const userReactionIndex = state.reactionForUser
    ? newReactions.findIndex((r) => r.emoji.shortCode === state.reactionForUser?.shortCode)
    : -1;

  if (operation === 'upsert') {
    if (userReactionIndex > -1 && state.reactionForUser?.shortCode !== emoji.shortCode) {
      newReactions[userReactionIndex].count--;
      if (newReactions[userReactionIndex].count === 0) {
        newReactions.splice(userReactionIndex, 1);
      }
    }
    if (currentEmojiIndex > -1) {
      newReactions[currentEmojiIndex].count++;
    } else {
      newReactions.push({ count: 1, emoji });
    }
  } else if (operation === 'delete' && currentEmojiIndex > -1) {
    newReactions[currentEmojiIndex].count--;
    if (newReactions[currentEmojiIndex].count === 0) {
      newReactions.splice(currentEmojiIndex, 1);
    }
  }

  const updatedReactionForUser =
    operation === 'upsert'
      ? {
          ...emoji,
          id: 'temp-id',
          reactedBy: 'temp-user-id',
          createdAt: new Date(),
          objectId: state.id,
          objectType: ObjectType.UPDATE,
        }
      : null;

  return { ...state, reactionCount: newReactions, reactionForUser: updatedReactionForUser };
}
