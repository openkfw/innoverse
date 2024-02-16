import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Opportunity } from '@/common/types';
import AvatarIcon from '@/components/common/AvatarIcon';
import { TooltipContent } from '@/components/project-details/TooltipContent';

import InteractionButton, { InteractionType } from '../../common/InteractionButton';
import { StyledTooltip } from '../../common/StyledTooltip';

import { handleApplyForOpportunity, hasAppliedForOpportunity } from './actions';

interface OpportunityCardProps {
  opportunity: Opportunity;
  projectName: string;
}

const OpportunityCard = ({ opportunity, projectName }: OpportunityCardProps) => {
  const [hasApplied, setHasApplied] = useState(false);

  const handleOpportunityApply = async () => {
    await handleApplyForOpportunity({ opportunityId: opportunity.id });
    const { data } = await hasAppliedForOpportunity({ opportunityId: opportunity.id });
    setHasApplied(data);
  };

  useEffect(() => {
    const getAppliedForOpportunity = async () => {
      const { data } = await hasAppliedForOpportunity({ opportunityId: opportunity.id });
      setHasApplied(data);
    };
    getAppliedForOpportunity();
  }, []);

  return (
    <Grid container item spacing={5} xs={12}>
      <Grid
        container
        item
        xs={6}
        direction="column"
        spacing={2}
        sx={{ paddingRight: '100px', alignSelf: 'flex-start' }}
      >
        <Grid item>
          <Typography variant="h5" color="secondary.contrastText">
            {opportunity.title}
          </Typography>
          <Typography variant="body1" color="secondary.contrastText">
            {opportunity.description}
          </Typography>
          <Typography variant="overline" color="primary.main" display="flex">
            Aufwand: {opportunity.expense}
          </Typography>
          {opportunity.contactPerson && (
            <>
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
            </>
          )}
        </Grid>
      </Grid>

      <Grid container item xs={5} direction="column" spacing={1} ml="4px">
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
