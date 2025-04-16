import { LineChart } from '@mui/x-charts/LineChart';

interface CheckinLineChartProps {
  voteHistory: {
    createdAt: string | Date;
    vote: number;
  }[];
}

const CheckinLineChart = ({ voteHistory }: CheckinLineChartProps) => {
  const xAxisData = voteHistory.map((item) =>
    new Date(item.createdAt).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
  );

  const yAxisData = voteHistory.map((item) => item.vote);

  return (
    <LineChart
      xAxis={[{ scaleType: 'point', data: xAxisData }]}
      series={[
        {
          curve: 'linear',
          data: yAxisData,
          label: 'Vote',
        },
      ]}
      slotProps={{ legend: { hidden: true } }}
      tooltip={{ trigger: 'item' }}
      height={250}
      width={400}
    />
  );
};

export default CheckinLineChart;
