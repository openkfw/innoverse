import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';

import { ResponseOption } from '@/common/types';
import palette from '@/styles/palette';

interface SurveyVoteComponentProps {
  response: ResponseOption;
  selectedOption: string | undefined;
  fillPercentage: number;
}
export const SurveyVoteComponent = (props: SurveyVoteComponentProps) => {
  const { response, selectedOption, fillPercentage } = props;
  const generateLabel = () =>
    selectedOption ? `${response.responseOption} • ${fillPercentage}%` : response.responseOption;

  return (
    <>
      <ToggleButton value={response.responseOption}>
        <StyledChip
          label={generateLabel()}
          key={response.responseOption}
          voteshown={(!!selectedOption).toString()}
          isselectedoption={(selectedOption === response.responseOption).toString()}
          fillpercentage={fillPercentage}
        />
      </ToggleButton>
    </>
  );
};

const StyledChip = styled(Chip)<{ voteshown: string; isselectedoption: string; fillpercentage: number }>(({
  voteshown,
  isselectedoption,
  fillpercentage,
  theme,
}) => {
  const voteColor = isselectedoption === 'true' ? palette.statistics?.main : palette.statistics?.light;
  const background = voteshown
    ? `linear-gradient(to right, ${voteColor} ${fillpercentage}%, rgba(0, 0, 0, 0.08)  ${fillpercentage}%)`
    : palette.statistics?.dark;

  return {
    display: 'flex',
    width: '100%',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: '100px',
    fontSize: '13px',
    fontWeight: '400',
    color: theme.palette.common.black,
    background,
    ':hover': {
      color: theme.palette.common.black,
      background: palette.statistics?.main,
    },
    [theme.breakpoints.down('md')]: {
      ':hover': 'none',
    },
  };
});
