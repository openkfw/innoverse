import { useEffect, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Opportunity } from '@/common/types';
import AvatarIcon from '@/components/common/AvatarIcon';
import { errorMessage } from '@/components/common/CustomToast';
import { TooltipContent } from '@/components/project-details/TooltipContent';
import theme from '@/styles/theme';

import InteractionButton, { InteractionType } from '../../common/InteractionButton';
import { StyledTooltip } from '../../common/StyledTooltip';

import { handleApplyForOpportunity, hasAppliedForOpportunity } from './actions';

interface OpportunityCardProps {
  opportunity: Opportunity;
  projectName: string;
}

const OpportunityCard = ({ opportunity, projectName }: OpportunityCardProps) => {
  const [hasApplied, setHasApplied] = useState(false);
  const appInsights = useAppInsightsContext();

  const handleOpportunityApply = async () => {
    try {
      await handleApplyForOpportunity({ opportunityId: opportunity.id });
      const { data } = await hasAppliedForOpportunity({ opportunityId: opportunity.id });
      setHasApplied(data ?? false);
    } catch (error) {
      console.error('Failed to apply for the opportunity:', error);
      errorMessage({ message: 'Applying for the opportunity failed. Please try again.' });
      appInsights.trackException({
        exception: new Error('Failed to apply for the opportunity.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  useEffect(() => {
    const getAppliedForOpportunity = async () => {
      try {
        const { data } = await hasAppliedForOpportunity({ opportunityId: opportunity.id });
        setHasApplied(data ?? false);
      } catch (error) {
        console.error('Failed to check application status:', error);
        errorMessage({ message: 'Failed to check if you have already applied. Please try again.' });
        appInsights.trackException({
          exception: new Error('Failed to check opportunity application status.', { cause: error }),
          severityLevel: SeverityLevel.Error,
        });
      }
    };
    getAppliedForOpportunity();
  }, [opportunity.id]);

  const leftGridStyles: SxProps = {
    paddingRight: '2em',
    [theme.breakpoints.down('md')]: {
      paddingRight: 0,
      paddingBottom: '2em',
    },
  };

  const rightGridStyles: SxProps = {
    paddingLeft: '2em',
    [theme.breakpoints.down('md')]: {
      paddingLeft: 0,
    },
  };

  return (
    <Grid container item>
      <Grid container item direction="column" xs={12} md={6} spacing={2} sx={leftGridStyles}>
        <Grid item>
          <Typography variant="h5" color="secondary.contrastText">
            {opportunity.title}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1" color="secondary.contrastText">
            {opportunity.description}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="overline" color="primary.main">
            Aufwand: {opportunity.expense}
          </Typography>
        </Grid>

        {opportunity.contactPerson && (
          <Grid item>
            <Typography variant="overline" color="primary.main">
              Contact Person
            </Typography>
            {opportunity.contactPerson ? (
              <Box sx={{ width: '10%' }}>
                <StyledTooltip
                  arrow
                  title={<TooltipContent projectName={projectName} teamMember={opportunity.contactPerson} />}
                  placement="bottom"
                >
                  <AvatarIcon user={opportunity.contactPerson} size={48} allowAnimation />
                </StyledTooltip>
              </Box>
            ) : (
              <Typography variant="caption" color="text.disabled">
                Niemand zugewiesen
              </Typography>
            )}
          </Grid>
        )}
      </Grid>

      <Grid container item direction="column" xs={12} md={6} rowSpacing={1} sx={rightGridStyles}>
        <Grid item>
          <InteractionButton
            isSelected={hasApplied}
            projectName={projectName}
            interactionType={InteractionType.OPPORTUNITY_APPLY}
            onClick={() => handleOpportunityApply()}
          />
        </Grid>
        <Grid item>
          <InteractionButton projectName={projectName} interactionType={InteractionType.RECOMMEND} disabled />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default OpportunityCard;
