'use client';
import { createContext, useContext, useState } from 'react';

import { Mention } from '@/common/types';

interface MentionsContextInterface {
  mentions: Mention[] | null;
  setMentions: React.Dispatch<React.SetStateAction<Mention[] | null>>;
}

const defaultState: MentionsContextInterface = {
  mentions: null,
  setMentions: () => {},
};

const MentionsContext = createContext<MentionsContextInterface>(defaultState);

export const MentionsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [mentions, setMentions] = useState<Mention[] | null>(null);

  const contextValue: MentionsContextInterface = { mentions, setMentions };
  return <MentionsContext.Provider value={contextValue}>{children}</MentionsContext.Provider>;
};

export const useMentions = () => useContext(MentionsContext);
