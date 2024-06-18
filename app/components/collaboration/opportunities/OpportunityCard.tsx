'use client';

import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Grid from '@mui/material/Grid';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Opportunity } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { UserAvatar } from '@/components/common/UserAvatar';
import theme from '@/styles/theme';

import InteractionButton, { InteractionType } from '../../common/InteractionButton';

import { handleApplyForOpportunity, hasAppliedForOpportunity } from './actions';

interface OpportunityCardProps {
  opportunity: Opportunity;
  projectName: string;
}

const OpportunityCard = ({ opportunity, projectName }: OpportunityCardProps) => {
  const [hasApplied, setHasApplied] = useState(opportunity.hasApplied);
  const appInsights = useAppInsightsContext();

  const handleOpportunityApply = async () => {
    try {
      // Optimistic update
      setHasApplied((prev) => !prev);
      // Now wait for actual status and set it
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
              <UserAvatar sx={{ width: '10%' }} size={48} user={opportunity.contactPerson} allowAnimation />
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
            onClick={handleOpportunityApply}
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
