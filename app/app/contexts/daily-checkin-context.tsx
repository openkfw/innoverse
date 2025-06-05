'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { StatusCodes } from 'http-status-codes';

import { CheckinQuestion } from '@/common/types';
import { getCheckinQuestionsHistory, getCurrentCheckinQuestions } from '@/utils/requests/checkinQuestions/requests';

interface DailyCheckinVote {
  checkinQuestionId: string;
  vote: number;
}

interface DailyCheckinInterface {
  checkinQuestionsToAnswer: CheckinQuestion[];
  setCheckinQuestionsToAnswer: React.Dispatch<React.SetStateAction<CheckinQuestion[]>>;
  questionsHistory: CheckinQuestion[];
  setQuestionsHistory: React.Dispatch<React.SetStateAction<CheckinQuestion[]>>;
  dailyCheckinVotes: DailyCheckinVote[];
  setDailyCheckinVotes: React.Dispatch<React.SetStateAction<DailyCheckinVote[]>>;
  refetchCheckinQuestions: () => void;
}

const defaultState: DailyCheckinInterface = {
  checkinQuestionsToAnswer: [],
  setCheckinQuestionsToAnswer: () => {},
  questionsHistory: [],
  setQuestionsHistory: () => {},
  dailyCheckinVotes: [],
  setDailyCheckinVotes: () => {},
  refetchCheckinQuestions: () => {},
};

const DailyCheckinContext = createContext(defaultState);

export const DailyCheckinContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkinQuestionsToAnswer, setCheckinQuestionsToAnswer] = useState<CheckinQuestion[]>([]);
  const [questionsHistory, setQuestionsHistory] = useState<CheckinQuestion[]>([]);

  const [dailyCheckinVotes, setDailyCheckinVotes] = useState<DailyCheckinVote[]>([]);

  useEffect(() => {
    async function loadAndSetCheckinQuestion() {
      await refetchCheckinQuestions();
    }

    loadAndSetCheckinQuestion();
  }, []);

  const refetchCheckinQuestions = async () => {
    const questionResponse = await getCurrentCheckinQuestions();

    if (questionResponse.status === StatusCodes.OK) {
      setCheckinQuestionsToAnswer(questionResponse.data);
    } else {
      const historyResponse = await getCheckinQuestionsHistory();
      if (historyResponse.status === StatusCodes.OK) {
        setQuestionsHistory(historyResponse.data);
        setCheckinQuestionsToAnswer([]);
      }
    }
  };

  const contextObject: DailyCheckinInterface = {
    checkinQuestionsToAnswer,
    setCheckinQuestionsToAnswer,
    questionsHistory,
    setQuestionsHistory,
    dailyCheckinVotes,
    setDailyCheckinVotes,
    refetchCheckinQuestions,
  };

  return <DailyCheckinContext.Provider value={contextObject}> {children}</DailyCheckinContext.Provider>;
};

export const useDailyCheckin = () => useContext(DailyCheckinContext);
