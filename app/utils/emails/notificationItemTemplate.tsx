import * as React from 'react';
import { Column, Img, Link, Row, Section, Text } from '@react-email/components';

import { User } from '@/common/types';
import { renderEventType } from '@/components/landing/eventsSection/EventCardHeader';
import { formatDateSpan } from '@/components/project-details/events/EventTimeDate';

import { formatDateWithTimestamp } from '../helpers';

type BaseItemProps = {
  baseUrl: string;
  baseImageUrl: string;
  updatedAt?: Date;
  reactions: { emoji: string; count: number }[];
  project?: { documentId: string; title: string } | null;
  projectFollowed?: boolean;
};

export type PostItemProps = BaseItemProps & {
  author: User | false;
  comment: string;
};

type UpdateItemProps = PostItemProps & {
  newsType: 'update';
};

type SurveyQuestionItemProps = BaseItemProps & {
  newsType: 'surveyQuestion';
  question: string;
};

type CollaborationQuestionItemProps = BaseItemProps & {
  newsType: 'collaborationQuestion';
  title: string;
  description: string;
};

type EventItemProps = BaseItemProps & {
  newsType: 'event';
  title: string;
  startTime: Date | string;
  endTime: Date | string | null;
  type: string | null;
  description: string | null;
  location: string | null;
  image: { url: string } | null;
};

export type NewsItemProps = UpdateItemProps | EventItemProps | SurveyQuestionItemProps | CollaborationQuestionItemProps;

const BookmarkAddedOutlinedIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" style={bookmarkIconStyle}>
    <path d="M17 11v6.97l-5-2.14-5 2.14V5h6V3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V11zm.83-2L15 6.17l1.41-1.41 1.41 1.41 3.54-3.54 1.41 1.41z"></path>
  </svg>
);

const BookmarkAddOutlinedIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" style={bookmarkIconStyle}>
    <path d="M17 11v6.97l-5-2.14-5 2.14V5h6V3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V11zm4-4h-2v2h-2V7h-2V5h2V3h2v2h2z"></path>
  </svg>
);

const bookmarkIconStyle = {
  color: '#266446',
  width: '22px',
  height: '20px',
  padding: '6px',
};

const ImageAvatar = (url: string) => <Img src={url} width={40} height={40} style={{ borderRadius: '50%' }} />;

const InitialsAvatar = (name: string) => (
  <div
    style={{
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#bdbdbd',
      border: '2px solid white',
    }}
  >
    <Row>
      <Column
        style={{
          textAlign: 'center',
          width: '100%',
          fontFamily: 'SansDefaultMed, Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: '0.8rem',
          lineHeight: '32px',
        }}
      >
        {name
          .split(' ')
          .map((part) => part.charAt(0).toUpperCase())
          .slice(0, 2)
          .join('')}
      </Column>
    </Row>
  </div>
);

const ProjectTag = (baseUrl: string, id: string, name: string, subscribed = false) => (
  <Link style={{ display: 'inline-block' }} href={`${baseUrl}/projects/${id}`}>
    <Row
      style={{
        textDecoration: 'none',
        border: '1px solid #d8dfe3',
        borderRadius: '2px',
        padding: '0',
        width: 'auto',
        tableLayout: 'auto',
      }}
    >
      <Column
        style={{
          borderRight: '1px solid #d8dfe3',
          padding: '3px 16px',
          color: '#266446',
          fontFamily: 'SansDefaultMed',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '24px',
          letterSpacing: '0.15px',
          height: '26px',
          display: 'inline-block',
        }}
      >
        {name}
      </Column>
      {subscribed ? (
        <Column style={{ backgroundColor: '#D4FCCA', height: '32px', width: '34px', display: 'inline-block' }}>
          <BookmarkAddedOutlinedIcon />
        </Column>
      ) : (
        <Column style={{ height: '32px', width: '34px', display: 'inline-block' }}>
          <BookmarkAddOutlinedIcon />
        </Column>
      )}
    </Row>
  </Link>
);

const Footer = (props: Pick<BaseItemProps, 'baseUrl' | 'reactions' | 'project' | 'projectFollowed'>) => (
  <Row style={{ marginTop: '12px' }}>
    {props.reactions.map(({ emoji, count }) => (
      <Column key={emoji} style={{ width: '52px' }}>
        <Text style={reactionStyle}>
          {emoji}
          <span style={reactionCountStyle}>{count}</span>
        </Text>
      </Column>
    ))}
    {props.project && (
      <Column style={{ textAlign: 'right' }}>
        {ProjectTag(props.baseUrl, props.project.documentId, props.project.title, props.projectFollowed)}
      </Column>
    )}
  </Row>
);

export const PostItem = (props: PostItemProps) => (
  <Section style={wrapperStyle}>
    {!!props.author && (
      <Row style={headerStyle}>
        <Column style={{ display: 'inline-block', maxHeight: '40px', maxWidth: '56px', marginRight: '8px' }}>
          {props.author.image
            ? ImageAvatar(props.baseImageUrl + props.author.image)
            : InitialsAvatar(props.author.name)}
        </Column>
        <Column style={{ display: 'inline-block' }}>
          <Text style={usernameStyle}>{props.author.name}</Text>
        </Column>
        {props.updatedAt && (
          <Column style={{ textAlign: 'right' }}>
            <Text style={timestampStyle}>{formatDateWithTimestamp(props.updatedAt)}</Text>
          </Column>
        )}
      </Row>
    )}

    <Row>
      <Text style={postContentStyle}>{props.comment}</Text>
    </Row>

    <Footer {...props} />
  </Section>
);

export const NewsItem = (item: NewsItemProps) => {
  switch (item.newsType) {
    case 'update':
      return <PostItem {...item} />;
    case 'event':
      return <EventItem {...item} />;
    case 'surveyQuestion':
      return <SurveyQuestionItem {...item} />;
    case 'collaborationQuestion':
      return <CollaborationQuestionItem {...item} />;
    default:
      return null;
  }
};

export const SurveyQuestionItem = (props: SurveyQuestionItemProps) => (
  <Section style={wrapperStyle}>
    <Row>
      <Text style={surveyTitleStyle}>{props.question}</Text>
    </Row>
    <Row>
      <Column valign="middle" style={surveyPlaceholderContainerStyle}>
        <Text style={surveyPlaceholderStyle}>
          Antwortmöglichkeiten und Ergebnisse auf InnoVerse verfügbar (hier&nbsp;klicken)
        </Text>
      </Column>
    </Row>
    <Footer {...props} />
  </Section>
);

export const CollaborationQuestionItem = (props: CollaborationQuestionItemProps) => (
  <Section style={wrapperStyle}>
    <Row>
      <Text style={questionTitleStyle}>{props.title}</Text>
    </Row>

    <Row>
      <Text style={questionDescriptionStyle}>{props.description}</Text>
    </Row>

    <Footer {...props} />
  </Section>
);

export const EventItem = (props: EventItemProps) => (
  <Section style={wrapperStyle}>
    <Row>
      <Column valign="top" style={{ width: '60px', textAlign: 'center' }}>
        <Text style={eventDateDayStyle}>{new Date(props.startTime).getDate()}</Text>
        <Text style={eventDateMonthStyle}>
          {new Date(props.startTime).toLocaleString('default', { month: 'short' })}{' '}
        </Text>
      </Column>
      <Column valign="top" style={{ paddingTop: '8px', paddingLeft: '16px' }}>
        <Text style={eventInfoStyle}>
          {formatDateSpan(new Date(props.startTime), new Date(props.endTime ?? props.startTime))}
        </Text>
        {props.location && <Text style={eventInfoStyle}>{props.location}</Text>}
        {props.type && <Text style={eventInfoStyle}> {renderEventType(props.type)} </Text>}
      </Column>
    </Row>
    <Row style={{ marginTop: '12px' }}>
      {props.image && (
        <Column style={{ width: '270px' }}>
          <Img width={280} src={props.image?.url} style={{ width: '270px', height: '132px' }} />
        </Column>
      )}
      <Column valign="top" style={{ textAlign: 'left' }}>
        <Text style={eventTitleStyle}>{props.title}</Text>
      </Column>
    </Row>
    <Footer {...props} />
  </Section>
);

const wrapperStyle = {
  marginTop: '16px',
  padding: '32px',
  boxShadow:
    '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
  borderRadius: '8px',
  background: '#FFF',
};

const textStyle = {
  margin: 0,
};

const headerStyle = {
  ...textStyle,
  width: '100%',
  maxHeight: '40px',
};

const usernameStyle = {
  ...textStyle,
  fontFamily: 'SansDefaultMed, Helvetica, Arial, sans-serif',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: '175%',
  letterSpacing: '0.15px',
  color: '#004267',
  fontSize: '14px',
};

const timestampStyle = {
  ...textStyle,
  display: 'inline-block',
  fontFamily: 'SansDefaultMed, Helvetica, Arial, sans-serif',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '166%',
  letterSpacing: '0.4px',
  fontSize: '12px',
};

const postContentStyle = {
  ...textStyle,
  marginTop: '8px',
  fontFamily: 'SlabReg',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '150%',
};

const reactionStyle = {
  margin: 0,
  paddingTop: '3px',
  border: '1px solid #D8DFE3',
  borderRadius: '1px',
  fontFamily: 'SansDefaultMed, Helvetica, Arial, sans-serif',
  fontSize: '14px',
  lineHeight: '1.75',
  width: '48px',
  height: '28px',
  textAlign: 'center' as const,
};

const reactionCountStyle = {
  margin: 0,
  color: '#2D3134',
  fontSize: '12px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '166%',
  letterSpacing: '0.4px',
};

const eventDateDayStyle = {
  margin: '0',
  fontFamily: 'SansHeadingsBold,Arial Black,Arial Bold,Gadget,sans-serif',
  fontStyle: 'bold',
  fontWeight: '1000',
  lineHeight: '120%',
  letterSpacing: '-0.5px',
  color: '#266446',
  fontSize: '48px',
};

const eventDateMonthStyle = {
  margin: '0',
  fontFamily: 'SansDefaultMed, Helvetica, Arial, sans-serif',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '166%',
  letterSpacing: '0.4px',
  color: '#2D3134',
  textTransform: 'uppercase' as const,
  fontSize: '12px',
  textAlign: 'center' as const,
};

const eventInfoStyle = {
  margin: '0',
  fontFamily: 'SansDefaultMed, Helvetica, Arial, sans-serif',
  fontStyle: 'normal',
  fontWeight: '500',
  lineHeight: '1.5',
  letterSpacing: '0.15px',
  color: '#2D3134',
  fontSize: '14px',
};

const eventTitleStyle = {
  margin: '0',
  marginLeft: '24px',
  fontFamily: 'SansDefaultBold,Arial Black,Arial Bold,Gadget,sans-serif',
  color: '#2D3134',
  fontStyle: 'normal',
  fontWeight: '900',
  lineHeight: '140%',
  letterSpacing: '-0.5px',
  fontSize: '16px',
};

const questionTitleStyle = {
  margin: '0',
  marginBottom: '16px',
  fontFamily: 'SansDefaultBold,Arial Black,Arial Bold,Gadget,sans-serif',
  color: '#000000',
  fontStyle: 'normal',
  fontWeight: '1000',
  lineHeight: '133.4%',
  letterSpacing: '-0.5px',
  fontSize: '24px',
};

const questionDescriptionStyle = {
  margin: '0',
  fontFamily: 'SlabReg',
  color: '#000000',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '133.4%',
  letterSpacing: '0.15px',
  fontSize: '24px',
};

const surveyTitleStyle = {
  margin: '0',
  marginBottom: '16px',
  fontFamily: 'SansDefaultBold,Arial Black,Arial Bold,Gadget,sans-serif',
  color: '#000000',
  fontStyle: 'normal',
  fontWeight: '1000',
  lineHeight: '133.4%',
  letterSpacing: '-0.5px',
  fontSize: '20px',
};

const surveyPlaceholderContainerStyle = {
  margin: '0',
  marginBottom: '16px',
  padding: '16px',
  background: 'rgba(0, 90, 140, 0.10)',
  width: '500px',
  maxWidth: '100%',
  height: '120px',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const surveyPlaceholderStyle = {
  margin: '0',
  fontFamily: 'SansDefaultMed, Helvetica, Arial, sans-serif',
  fontSize: '12px',
  fontWeight: '400',
  lineHeight: '166%',
  letterSpacing: '0.4px',
  color: '#266446',
};
