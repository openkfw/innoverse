'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as m from '@/src/paraglide/messages.js';

import { CheckinQuestionWithVote } from '@/common/types';
import { toast } from 'react-toastify';
import { getCurrentCheckinQuestions } from '@/utils/requests/checkinQuestions/requests';

interface DailyCheckinVote {
  checkinQuestionId: string;
  vote: number;
}

interface DailyCheckinInterface {
  checkinQuestions: CheckinQuestionWithVote[];
  setCheckinQuestions: React.Dispatch<React.SetStateAction<CheckinQuestionWithVote[]>>;
  dailyCheckinVotes: DailyCheckinVote[];
  setDailyCheckinVotes: React.Dispatch<React.SetStateAction<DailyCheckinVote[]>>;
}

const defaultState: DailyCheckinInterface = {
  checkinQuestions: [],
  setCheckinQuestions: () => {},
  dailyCheckinVotes: [],
  setDailyCheckinVotes: () => {},
};

const DailyCheckinContext = createContext(defaultState);

export const DailyCheckinContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkinQuestions, setCheckinQuestions] = useState<CheckinQuestionWithVote[]>([]);
  const [dailyCheckinVotes, setDailyCheckinVotes] = useState<DailyCheckinVote[]>([]);
  useEffect(() => {
    async function loadAndSetCheckinQuestion() {
      const response = await getCurrentCheckinQuestions({});

      if (!response || !response.data) {
        toast.error(m.components_layout_checkinSection_saveCheckin_toastError());
      } else {
        setCheckinQuestions(response.data);
      }
    }

    loadAndSetCheckinQuestion();
  }, []);

  const contextObject: DailyCheckinInterface = {
    checkinQuestions,
    setCheckinQuestions,
    dailyCheckinVotes,
    setDailyCheckinVotes,
  };

  return <DailyCheckinContext.Provider value={contextObject}> {children}</DailyCheckinContext.Provider>;
};

export const useDailyCheckin = () => useContext(DailyCheckinContext);
