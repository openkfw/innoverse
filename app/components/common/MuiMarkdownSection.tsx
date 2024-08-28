import MuiMarkdown, { getOverrides, Overrides } from 'mui-markdown';

interface MuiMarkdownSectionProps {
  text: string | undefined;
}

export default function MuiMarkdownSection(props: MuiMarkdownSectionProps) {
  return <MuiMarkdown overrides={muiMarkdownOverrides as Overrides}>{props.text}</MuiMarkdown>;
}

const muiMarkdownOverrides = {
  ...getOverrides(),
  p: {
    component: 'p',
    props: {
      style: { color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  code: {
    component: 'code',
    props: {
      style: { color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  h1: {
    component: 'h1',
    props: {
      style: {
        scrollMargin: '5em',
        color: 'text.primary',
        lineHeight: '30px',
        fontFamily: 'SansHeadingsMed',
        fontWeight: 400,
        fontSize: '36px',
      },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  h2: {
    component: 'h2',
    props: {
      style: { scrollMargin: '5em', color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  h3: {
    component: 'h3',
    props: {
      style: { scrollMargin: '5em', color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  img: {
    component: 'img',
    props: {
      style: {
        maxWidth: '100%',
        height: 'auto',
        padding: '1em',
        objectFit: 'contain',
      },
    } as React.HTMLProps<HTMLImageElement>,
  },
  a: {
    component: 'a',
    props: {
      target: '_blank',
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  //If there is nothing but text in the description, it will be a span component.
  span: {
    component: 'p',
    props: {
      style: { color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
};
