import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import bull from '@/components/common/bull';
import { StyledTooltip } from '@/components/common/StyledTooltip';

interface VisibleContributorsProps {
  contributors: string[];
}

interface HiddenContributorsTooltipProps {
  hiddenContributors: string[];
}

const HiddenContributorsTooltip: React.FC<HiddenContributorsTooltipProps> = ({ hiddenContributors }) => {
  // todo - pending design for this section
  return (
    <Box display="flex" flexDirection="row" flexWrap="wrap">
      {hiddenContributors.map((contributor, index) => (
        <Typography variant="caption" key={index}>
          {contributor}
          {index < hiddenContributors.length - 1 ? ', ' : ''}
        </Typography>
      ))}
    </Box>
  );
};

const VisibleContributors: React.FC<VisibleContributorsProps> = ({ contributors }) => {
  const [visibleContributors, setVisibleContributors] = useState<React.ReactNode>('');

  useEffect(() => {
    const containerWidth = 418;
    let currentWidth = 0;
    let hiddenCount = 0;
    const result: React.ReactNode[] = [];

    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.height = 'auto';
    tempDiv.style.width = 'auto';
    tempDiv.style.whiteSpace = 'nowrap';
    document.body.appendChild(tempDiv);

    contributors.forEach((contributor, index) => {
      tempDiv.innerText = contributor;
      const textWidth = tempDiv.offsetWidth;

      if (currentWidth + textWidth < containerWidth) {
        result.push(<span key={`${contributor}-${index}`}>{contributor}</span>);
        currentWidth += textWidth;

        if (index < contributors.length - 1) {
          tempDiv.innerText = contributors[index + 1];
          const nextContributorWidth = tempDiv.offsetWidth;

          if (currentWidth + nextContributorWidth < containerWidth) {
            result.push(React.cloneElement(bull, { key: `bull-${index}` }));
          }
        }
      } else {
        hiddenCount++;
      }
    });

    document.body.removeChild(tempDiv);

    if (hiddenCount > 0) {
      const hiddenContributors = contributors.slice(-hiddenCount);
      result.push(React.cloneElement(bull, { key: `bull-last` }));
      result.push(
        <StyledTooltip
          title={<HiddenContributorsTooltip hiddenContributors={hiddenContributors} />}
          arrow
          key={`tooltip-${hiddenCount}`}
        >
          <span>{` +${hiddenCount}`}</span>
        </StyledTooltip>,
      );
    }

    setVisibleContributors(result);
  }, [contributors]);

  return (
    <Typography variant="caption" component="div">
      {visibleContributors}
    </Typography>
  );
};

export default VisibleContributors;