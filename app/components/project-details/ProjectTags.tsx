import Stack from '@mui/material/Stack';

import TagChip from '../common/TagChip';

interface ProjectTagsProps {
  tags: string[];
}

export const ProjectTags = (props: ProjectTagsProps) => {
  const { tags } = props;

  return (
    <Stack sx={{ width: 662 }} spacing={4} pt={4} mt={1}>
      <Stack direction="row" spacing={1}>
        {tags.map((tag, i) => (
          <TagChip key={i} label={`#${tag}`} />
        ))}
      </Stack>
    </Stack>
  );
};
