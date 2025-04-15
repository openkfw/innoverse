'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { CheckinQuestion } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';
import { getCurrentCheckinQuestions } from '@/utils/requests/checkinQuestions/requests';

interface DailyCheckinVote {
  checkinQuestionId: string;
  vote: number;
}

interface DailyCheckinInterface {
  checkinQuestions: CheckinQuestion[];
  setCheckinQuestions: React.Dispatch<React.SetStateAction<CheckinQuestion[]>>;
  dailyCheckinVotes: DailyCheckinVote[];
  setDailyCheckinVotes: React.Dispatch<React.SetStateAction<DailyCheckinVote[]>>;
  refetchCheckinQuestions: () => void;
}

const defaultState: DailyCheckinInterface = {
  checkinQuestions: [],
  setCheckinQuestions: () => {},
  dailyCheckinVotes: [],
  setDailyCheckinVotes: () => {},
  refetchCheckinQuestions: () => {},
};

const DailyCheckinContext = createContext(defaultState);

export const DailyCheckinContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkinQuestions, setCheckinQuestions] = useState<CheckinQuestion[]>([]);
  const [dailyCheckinVotes, setDailyCheckinVotes] = useState<DailyCheckinVote[]>([]);
  useEffect(() => {
    async function loadAndSetCheckinQuestion() {
      await refetchCheckinQuestions();
    }

    loadAndSetCheckinQuestion();
  }, []);

  const refetchCheckinQuestions = async () => {
    const response = await getCurrentCheckinQuestions({});

    if (!response || !response.data) {
      toast.error(m.components_layout_checkinSection_saveCheckin_toastError());
    } else {
      setCheckinQuestions(response.data);
    }
  };

  const contextObject: DailyCheckinInterface = {
    checkinQuestions,
    setCheckinQuestions,
    dailyCheckinVotes,
    setDailyCheckinVotes,
    refetchCheckinQuestions,
  };

  return <DailyCheckinContext.Provider value={contextObject}> {children}</DailyCheckinContext.Provider>;
};

export const useDailyCheckin = () => useContext(DailyCheckinContext);
