import { useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ObjectType, Project, ProjectQuestion } from '@/common/types';
import NewsItemThread from '@/components/newsPage/threads/NewsItemThread';
import * as m from '@/src/paraglide/messages.js';

const ProjectCommentsSection = ({ project }: { project: Project }) => {
  const [questions] = useState<ProjectQuestion[]>(project.questions);

  return (
    <Stack sx={containerStyles} direction="column">
      <Stack>
        <Typography variant="overline" color="primary.light">
          {m.components_projectdetails_comments_commentsSection_opinion()}
        </Typography>

        <List sx={listStyle}>
          {questions.map((question, i) => (
            <ListItem key={i}>
              <ListItemText
                primary={
                  <Typography variant="body1" color="text.primary" sx={{ fontWeight: 700 }}>
                    {question.title}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Stack>

      <NewsItemThread
        entry={{
          item: project,
          type: ObjectType.PROJECT,
        }}
        enableCommenting={true}
        showCommentCount={true}
        maxNumberOfComments={5}
      />
    </Stack>
  );
};

export default ProjectCommentsSection;

// Comment  Section Styles
const containerStyles = {
  mt: 3,
  ml: 1,
};

const listStyle = {
  listStyleType: 'decimal',
  pl: 2,
  '& .MuiListItem-root': {
    display: 'list-item',
    fontFamily: 'SlabReg',
    fontWeight: 700,
    pl: 0,
  },
};
