import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { Tag } from '@/common/types';
import CustomChip from '@/components/common/CustomChip';
import theme from '@/styles/theme';

const FeaturedProjectContent = (props: { title: string; tags: Tag[]; summary: string; projectId: string }) => {
  const { title, tags, summary, projectId } = props;

  return (
    <Box sx={wrapperStyles}>
      <Typography variant="overline" sx={featuredTypographyStyles}>
        Featured
      </Typography>
      <Link href={`/projects/${projectId}`} style={{ ...linkStyle }}>
        <Typography sx={titleStyles} variant="h2">
          {title}
        </Typography>
      </Link>
      <Box>
        <List aria-label="tags" sx={listStyles}>
          {tags?.map((el, id) => (
            <ListItem key={id} sx={listItemStyles}>
              <CustomChip label={el.tag} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Typography variant="body1" sx={descriptionStyles}>
        {summary}
      </Typography>
    </Box>
  );
};

export default FeaturedProjectContent;

// Featured Project Content Styles
const wrapperStyles = {
  textAlign: 'left',
  width: '100%',
};

const featuredTypographyStyles = {
  display: 'block',
  marginLeft: 6 / 8,
  fontSize: 12,
  fontFamily: '***FONT_REMOVED***',
};

const titleStyles = {
  maxWidth: '100%',
  display: 'inline-block',
  overflowWrap: 'break-word',
  whiteSpace: 'pre-wrap',
  marginLeft: 6 / 8,
  marginTop: 7 / 8,
  marginBottom: 3,
  hyphens: 'auto',
  WebkitHyphens: 'auto',
  MsHyphens: 'auto',
  MozHyphens: 'auto',
  WebkitLocale: 'de-DE',
  locale: 'de-DE',

  fontSize: {
    lg: 55,
    md: 35,
    sm: 35,
    xs: 25,
  },

  [theme.breakpoints.down('sm')]: {
    marginBottom: 2,
  },
};

const listStyles = {
  display: 'inline-flex',
  flexWrap: 'wrap',
  columnGap: 1,
  rowGap: 0,
  padding: 0,
  margin: 0,
};

const listItemStyles = {
  paddingLeft: 0,
  paddingRight: 0,
  width: 'fit-content',
};

const descriptionStyles = {
  marginLeft: 6 / 8,
  marginTop: 3,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 6,
};

const linkStyle = {
  textDecoration: 'none',
};
