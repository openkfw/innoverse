import useMediaQuery from '@mui/material/useMediaQuery';
import { LineChart } from '@mui/x-charts/LineChart';

import { UserVote, VoteAverage } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { formatDateToString } from '@/utils/helpers';

interface CheckinLineChartProps {
  voteHistory: VoteAverage[];
  userVoteHistory: UserVote[];
}

const CheckinLineChart = ({ voteHistory, userVoteHistory }: CheckinLineChartProps) => {
  const xAxisData = [...voteHistory, ...userVoteHistory]
    .map((item) => formatDateToString(item.answeredOn))
    .filter((value, index, self) => self.indexOf(value) === index);

  const voteHistoryMap = Object.fromEntries(
    voteHistory.map((item) => [formatDateToString(item.answeredOn), item._avg.vote]),
  );

  const userVoteHistoryMap = Object.fromEntries(
    userVoteHistory.map((item) => [formatDateToString(item.answeredOn), item.vote]),
  );

  const voteHistoryData = xAxisData.map((date) => voteHistoryMap[date] ?? null);
  const userHistoryData = xAxisData.map((date) => userVoteHistoryMap[date] ?? null);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const width = isSmallScreen ? 300 : 500;
  const height = isSmallScreen ? 250 : 300;

  return (
    <LineChart
      xAxis={[{ scaleType: 'point', data: xAxisData }]}
      series={[
        {
          curve: 'linear',
          data: voteHistoryData,
          label: m.components_layout_checkinSection_voteHistory_label_history(),
        },
        {
          curve: 'linear',
          data: userHistoryData,
          label: m.components_layout_checkinSection_voteHistory_label_userVote(),
        },
      ]}
      slotProps={{ legend: { hidden: false } }}
      tooltip={{ trigger: 'item' }}
      height={height}
      width={width}
    />
  );
};

export default CheckinLineChart;
