'use server';

import * as React from 'react';
import { Column, Heading, Hr, Img, Row, Section, Text } from '@react-email/components';

import BaseTemplate, { EmailTemplateProps } from './baseTemplate';
import { PostItem, type PostItemProps, NewsItem, type NewsItemProps } from './notificationItemTemplate';
import { clientConfig } from '@/config/client';

const baseImageUrl = clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT;

interface NotificationEmailProps {
  includeUnsubscribe: NonNullable<EmailTemplateProps['includeUnsubscribe']>;
  posts?: PostItemProps[];
  news?: NewsItemProps[];
  content: {
    headerTitle: string;
    headerSubtitle: string;
    headerImage: { url: string } | null;
  } & EmailTemplateProps['content'];
}

export const NotificationEmail = async ({
  includeUnsubscribe,
  content,
  posts = [],
  news = [],
}: NotificationEmailProps) => (
  <BaseTemplate includeUnsubscribe={includeUnsubscribe} content={content}>
    <Section style={header}>
      <Row>
        <Column style={headerContent}>
          <Heading style={headerContentTitle}>{content.headerTitle}</Heading>
          <Text style={headerContentSubtitle}>{content.headerSubtitle}</Text>
        </Column>
        <Column style={headerImageContainer}>
          <Img style={headerImage} width={340} src={baseImageUrl + content.headerImage?.url} />
        </Column>
      </Row>
    </Section>

    <Section style={contentStyle}>
      <Heading as="h2" style={title}>
        Posts
      </Heading>
      {posts.map((post, i) => (
        <PostItem key={i} {...post} />
      ))}

      <Hr style={divider} />

      <Heading as="h2" style={title}>
        News
      </Heading>
      {news.map((newsItem, i) => (
        <NewsItem key={i} {...newsItem} />
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
  color: '#fff',
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

const contentStyle = {
  borderRadius: '0 0 5px 5px',
  padding: '30px 30px 40px 30px',
  backgroundColor: '#004267',
};

const header = {
  borderRadius: '5px 5px 0 0',
  backgroundColor: '#004267',
};
