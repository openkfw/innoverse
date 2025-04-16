'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { CheckinQuestion } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';
import { getCheckinQuestionsHistory, getCurrentCheckinQuestions } from '@/utils/requests/checkinQuestions/requests';

interface DailyCheckinVote {
  checkinQuestionId: string;
  vote: number;
}

interface DailyCheckinInterface {
  checkinQuestionsToAnswer: CheckinQuestion[];
  setCheckinQuestionsToAnswer: React.Dispatch<React.SetStateAction<CheckinQuestion[]>>;
  voteHistory: CheckinQuestion[];
  setVoteHistory: React.Dispatch<React.SetStateAction<CheckinQuestion[]>>;
  dailyCheckinVotes: DailyCheckinVote[];
  setDailyCheckinVotes: React.Dispatch<React.SetStateAction<DailyCheckinVote[]>>;
  refetchCheckinQuestions: () => void;
}

const defaultState: DailyCheckinInterface = {
  checkinQuestionsToAnswer: [],
  setCheckinQuestionsToAnswer: () => {},
  voteHistory: [],
  setVoteHistory: () => {},
  dailyCheckinVotes: [],
  setDailyCheckinVotes: () => {},
  refetchCheckinQuestions: () => {},
};

const DailyCheckinContext = createContext(defaultState);

export const DailyCheckinContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkinQuestionsToAnswer, setCheckinQuestionsToAnswer] = useState<CheckinQuestion[]>([]);
  const [voteHistory, setVoteHistory] = useState<CheckinQuestion[]>([]);

  const [dailyCheckinVotes, setDailyCheckinVotes] = useState<DailyCheckinVote[]>([]);

  useEffect(() => {
    async function loadAndSetCheckinQuestion() {
      await refetchCheckinQuestions();
    }

    loadAndSetCheckinQuestion();
  }, []);

  const refetchCheckinQuestions = async () => {
    const response = await getCurrentCheckinQuestions({});

    if (!response || !response.data || !response.data.length) {
      const res = await getCheckinQuestionsHistory({});
      if (!res || !res.data || !res.data.length) {
        toast.error(m.components_layout_checkinSection_saveCheckin_toastError()); //todo update toast
      } else {
        setVoteHistory(res.data);
        setCheckinQuestionsToAnswer([]);
      }
    } else {
      setCheckinQuestionsToAnswer(response.data);
    }
  };

  const contextObject: DailyCheckinInterface = {
    checkinQuestionsToAnswer,
    setCheckinQuestionsToAnswer,
    voteHistory,
    setVoteHistory,
    dailyCheckinVotes,
    setDailyCheckinVotes,
    refetchCheckinQuestions,
  };

  return <DailyCheckinContext.Provider value={contextObject}> {children}</DailyCheckinContext.Provider>;
};

export const useDailyCheckin = () => useContext(DailyCheckinContext);
