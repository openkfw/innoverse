import Stack from '@mui/material/Stack';

import { Tag } from '@/common/types';

import TagChip from '../common/TagChip';

interface ProjectTagsProps {
  tags: Tag[];
}

export const ProjectTags = (props: ProjectTagsProps) => {
  const { tags } = props;

  return (
    <Stack pt={4} mt={1} direction={'row'} flexWrap={'wrap'}>
      {tags.map((tag, i) => (
        <TagChip sx={{ marginRight: '13px', marginBottom: '13px' }} key={i} label={`#${tag.tag}`} />
      ))}
    </Stack>
  );
};
