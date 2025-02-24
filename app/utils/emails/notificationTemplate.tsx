import * as React from 'react';
import { Column, Heading, Hr, Img, Link, Row, Section, Text } from '@react-email/components';

import BaseTemplate, { baseUrl, EmailTemplateProps } from './baseTemplate';

interface NotificationEmailProps {
  includeUnsubscribe: NonNullable<EmailTemplateProps['includeUnsubscribe']>;
  posts?: { id: number; content: string }[];
  news?: { id: number; content: string }[];
  lang?: string;
}

export const NotificationEmail = ({
  includeUnsubscribe,
  lang = 'de',
  posts = [],
  news = [],
}: NotificationEmailProps) => (
  <BaseTemplate includeUnsubscribe={includeUnsubscribe} lang={lang} preview="Weekly News and Initiatives Notifications">
    <Section style={header}>
      <Row>
        <Column style={headerContent}>
          <Heading style={headerContentTitle}>InnoVerse</Heading>
          <Text style={headerContentSubtitle}>Weekly News and Initiatives Notifications</Text>
        </Column>
        <Column style={headerImageContainer}>
          <Img
            style={headerImage}
            width={340}
            src={`${baseUrl}/_next/image?url=http%3A%2F%2Flocalhost%3A1337%2Fuploads%2Flarge_energy_01_f18f4955c0.png&w=1080&q=75`}
          />
        </Column>
      </Row>
    </Section>

    <Section style={content}>
      <Heading as="h2" style={title}>
        New Posts
      </Heading>
      {posts.map((post) => (
        <Text style={paragraph}>{post.content}</Text>
      ))}

      <Hr style={divider} />

      <Heading as="h2" style={title}>
        News
      </Heading>
      {news.map((newsItem) => (
        <Text style={paragraph}>{newsItem.content}</Text>
      ))}
    </Section>
  </BaseTemplate>
);

export default NotificationEmail;

const title = {
  margin: '0 0 15px',
  fontWeight: 'bold',
  fontSize: '21px',
  lineHeight: '21px',
  color: '#0c0d0e',
};

const paragraph = {
  fontSize: '15px',
  lineHeight: '21px',
  color: '#3c3f44',
};

const headerContent = { padding: '20px 30px 15px' };

const headerContentTitle = {
  color: '#fff',
  fontSize: '27px',
  fontWeight: 'bold',
  lineHeight: '27px',
};

const headerContentSubtitle = {
  color: '#fff',
  fontSize: '17px',
};

const headerImageContainer = {
  padding: '30px 10px',
};

const headerImage = {
  maxWidth: '100%',
};

const divider = {
  margin: '30px 0',
};

const content = {
  padding: '30px 30px 40px 30px',
};

const header = {
  borderRadius: '5px 5px 0 0',
  display: 'flex',
  flexDireciont: 'column',
  backgroundColor: '#2b2d6e',
};

const buttonContainer = {
  marginTop: '24px',
  display: 'block',
};

const button = {
  backgroundColor: '#0095ff',
  border: '1px solid #0077cc',
  fontSize: '17px',
  lineHeight: '17px',
  padding: '13px 17px',
  borderRadius: '4px',
  maxWidth: '120px',
  color: '#fff',
};
