import { LineChart } from '@mui/x-charts/LineChart';

import { UserVote, VoteAverage } from '@/common/types';
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

  return (
    <LineChart
      xAxis={[{ scaleType: 'point', data: xAxisData }]}
      series={[
        {
          curve: 'linear',
          data: voteHistoryData,
          label: 'History per question',
        },
        {
          curve: 'linear',
          data: userHistoryData,
          label: 'Your vote',
        },
      ]}
      slotProps={{ legend: { hidden: false } }}
      tooltip={{ trigger: 'item' }}
      height={300}
      width={500}
    />
  );
};

export default CheckinLineChart;
