import {
  CollaborationQuestionsResponse,
  CreateInnoUserResponse,
  CreateProjectUpdateResponse,
  EventCountResponse,
  GetEventsResponse,
  GetInnoUserResponse,
  GetPlatformFeedbackCollaborationQuestionResponse,
  OpportunitiesResponse,
  OpportunityQuery,
  ProjectData,
  ProjectQuestionsResponse,
  ProjectResponse,
  ProjectsResponse,
  SurveyQuestion,
  SurveyQuestionsResponse,
  Update,
  UpdateOportunityParticipantsResponse,
  UpdateOpportunityResponse,
  UpdatesResponse,
  UserQuery,
} from '@/common/strapiTypes';
import { CollaborationQuestion, Event, Opportunity, ProjectQuestion, User } from '@/common/types';
import { getCollaborationComments } from '@/components/collaboration/comments/actions';
import { getComments } from '@/components/project-details/comments/actions';

import { getFulfilledResults } from './helpers';
import {
  getCollaborationQuestionsByProjectId,
  getOpportunitiesByProjectId,
  getProjectQuestionsByProjectId,
  getSurveyQuestionsByProjectId,
  getUpdatesByProjectId,
} from './requests';

export enum STRAPI_QUERY {
  GetProjects,
  GetUpdates,
  GetProjectById,
  GetInnoUser,
  CreateInnoUser,
  GetUpdatesByProjectId,
  GetOpportunitiesByProjectId,
  GetOpportunitiesId,
  GetProjectQuestionsByProjectId,
  GetSurveyQuestionsByProjectId,
  GetCollaborationQuestionsByProjectId,
  CreateProjectUpdate,
  GetEvents,
  CreateOpportunityParticipant,
  GetOpportunityParticipant,
  UpdateOpportunityParticipants,
  GetEventCount,
  GetPlatformFeedbackCollaborationQuestion,
}

function formatDate(value: string, locale = 'de-DE') {
  const date = new Date(value);
  const month = date.toLocaleString(locale, { month: 'long' });
  const year = date.toLocaleString(locale, { year: 'numeric' });
  return `${month} ${year}`;
}

const userQuery = `
  data {
    id
    attributes {
      providerId
      provider
      name
      role
      department
      email
      avatar {
        data {
          attributes {
            url
          }   
        }
      }
    }
  }
`;

export const CreateInnoUserQuery = `mutation PostInnoUser($providerId: String, $provider: String, $name: String!, $role: String, $department: String, $email: String, $avatarId: ID) {
  createInnoUser(data: { providerId: $providerId, provider: $provider,name: $name, role: $role, department: $department, email: $email, avatar: $avatarId}) {
    data {
      id
      attributes {
        providerId
        provider
        name
        role
        department
        email
        avatar {
          data {
            attributes {
              url
            }
          }
        }
      }
    }
  }
}
`;

export const GetInnoUserByEmailQuery = `query GetInnoUser($email: String) {
  innoUsers(filters: { email: { eq: $email } }) {
    data {
      id
      attributes {
        providerId
        provider
        name
        role
        department
        email
        avatar {
          data {
            attributes {
            url
            }
          }
        }
      }
    }  
  }  
}
`;

export const GetInnoUserByProviderIdQuery = `query GetInnoUser($providerId: String) {
  innoUsers(filters: { providerId: { eq: $providerId } }) {
    data {
      id
      attributes {
        providerId
        provider
        name
        role
        department
        email
        avatar {
          data {
            attributes {
            url
            }
          }
        }
      }
    }  
  }  
}
`;

export const GetUpdatesQuery = `query GetUpdates {
  updates(sort: "date:desc", pagination: { limit: 100 }) {
    data {
      id
      attributes {
        date
        comment
        topic
        author {
          ${userQuery}
        }
        project {
          data {
            id
            attributes {
              title
            }
          }
        }
      }
    }    
  }
}`;

export const GetUpdatesFilterQuery = (
  filterParams: string,
  filter: string,
  sort: string,
) => `query GetUpdatesFilter${filterParams} {
  updates (sort: "date:${sort}", ${filter})  {
    data {
      id
      attributes {
        date
        comment
        topic
        author {
          ${userQuery}
        }
        project {
          data {
            id
            attributes {
              title
            }
          }
        }
      }
    }    
  }
}`;

export const GetUpdatesByProjectIdQuery = `query GetUpdates($projectId: ID) {
  updates(sort: "date:desc", filters: { project: { id: { eq: $projectId } } }) {
    data {
      id
      attributes {
        date
        comment
        topic
        author {
          ${userQuery}
        }
        project {
          data {
            id
            attributes {
              title
            }
          }
        }
      }
    }    
  }
}`;

export const GetOpportunitiesByProjectIdQuery = `query GetOpportunities($projectId: ID) {
  opportunities(filters: { project: { id: { eq: $projectId } } }) {
    data {
      id
      attributes {
        title
        description 
        contactPerson {
          ${userQuery}
        }
        expense
        participants {
          ${userQuery}
        }
      }
    }    
  }
}`;

export const GetOpportunitiesByIdQuery = `query GetOpportunities($opportunityId: ID) {
  opportunities(filters: { id: { eq: $opportunityId } }) {
    data {
      id
      attributes {
        title
        description 
        contactPerson {
          ${userQuery}
        }
        expense
        participants {
          ${userQuery}
        }
      }
    }    
  }
}`;

export const GetSurveyQuestionsByProjectIdQuery = `query GetSurveyQuestions($projectId: ID) {
  surveyQuestions(filters: { project: { id: { eq: $projectId } } }) {
    data {
      id
      attributes {
        question
        responseOptions {
          responseOption
        } 
      }
    }    
  }
}`;

export const GetQuestionsByProjectIdQuery = `query GetQuestions($projectId: ID) {
  questions(filters: { project: { id: { eq: $projectId } } }) {
    data {
      attributes {
        title
        authors {
          ${userQuery}
        }
      }
    }    
  }
}`;

export const GetCollaborationQuestionsByProjectIdQuery = `query GetCollaborationQuestions($projectId: ID) {
  collaborationQuestions(filters: { project: { id: { eq: $projectId } } }) {
    data {
      id
      attributes {
        project {
          data {
            id
          }
        }
        title,
        isPlatformFeedback,
        description
        authors {
          ${userQuery}
        }
      }
    }    
  }
}`;

export const GetProjectsQuery = `query GetProjects {
  projects(sort: "updatedAt:desc", pagination: { limit: 80 }) {
    data {
      id
      attributes {
        title
        shortTitle
        featured
        summary
        projectStart
        status
        image {
          data {
            attributes {
              url
            }
          }
        }
        team {
          ${userQuery}
        }
        description {
          text
          tags {
            tag
          }
        }
      }
    }
  }
}
`;

export const GetProjectByIdQuery = `query GetProjectById($id: ID!) {
  project(id: $id) {
    data {
     id
     attributes {
       title
       shortTitle
       summary
       status
       projectStart
       image {
         data {
           attributes {
             url
           }
         }
       }
       description {
         text
         tags {
          tag
         }
       }
       author {
        ${userQuery}
       }
       team {
        ${userQuery}
       }
      }
     }
   }
 }
`;

export const GetFutureEventCountQuery = `
query getEventCount($projectId: ID!,$currentDate: DateTime){
  events(
    filters: { project: { id: { eq: $projectId } }, startTime: { gte: $currentDate }})
   {
    meta {
      pagination {
        total
      }
    }
  }
}
`;

export const GetUpcomingEventsQuery = `query GetUpcomingEvents($today: DateTime) {
  events(filters: {startTime: {gte: $today}}, sort: "startTime:asc") {
    data {
      id
      attributes {
        title
        startTime
      	endTime
        type
        description
        location
        author {
          ${userQuery}
        }
        Themes {
          theme
        }
        image {
          data {
            attributes {
              url
            }
          }
        }
        project {
          data {
            id
          }
        }
      }
    }
  }
}
`;

export const GetAllEventsFilterQuery = (filterParams: string, filter: string) =>
  `
query getAllProjectEvents${filterParams}{
  events(
    ${filter}
    )
   {
    data {
      id
      attributes {
        title
        startTime
      	endTime
        type
        description
        location
        author {
          ${userQuery}
        }
        Themes {
          theme
        }
        image {
          data {
            attributes {
              url
            }
          }
        }
        project {
          data {
            id
          }
        }
      }
    }
  }
}`;

export const CreateProjectUpdateQuery = `mutation PostProjectUpdate($projectId: ID!, $comment: String, $authorId: ID!, $date: Date) {
  createUpdate(data: { project: $projectId, comment: $comment, author: $authorId, date: $date }) {
    data {
      id
      attributes {
        comment
        topic
        date
        author {
          ${userQuery}
        }
        project {
          data {
            id
            attributes {
              title
            }
          }
        }
      }
    }
  }
}
`;

export const CreateOpportunityParticipantQuery = `
mutation PostInnoUser($providerId: String, $provider: String, $name: String!, $role: String, $department: String, $email: String, $avatarId: ID) {
  createInnoUser(data: { providerId: $providerId, provider: $provider,name: $name, role: $role, department: $department, email: $email, avatar: $avatarId}) {
    data {
      id
      attributes {
        providerId
        provider
        name
        role
        department
        email
        avatar {
          data {
            attributes {
              url
            }
          }
        }
      }
    }
  }
}

`;

export const GetOpportunityParticipantQuery = `
query GetOpportunities($opportunityId: ID, $userId: [ID]) {
  opportunities(filters: { id: { eq: $opportunityId }, participants: { id: { in: $userId } } }) {
    data {
      id
      attributes {
        title
        description 
        contactPerson {
          ${userQuery}
        }
        expense
        participants {
          ${userQuery}
        }
      }
    }    
  }
}
`;

export const UpdateOpportunityParticipantsQuery = `
query UpdateOpportunity($opportunityId: ID!, $userId: ID!) {
  updateOpportunityParticipants(id: $opportunityId, participantId: $userId) {
    data {
      id
      attributes {
        title
        description 
        contactPerson {
          ${userQuery}
        }
        expense
        participants {
          ${userQuery}
        }
      }
    }    
  }
}`;

export const GetPlatformFeedbackCollaborationQuestion = `query GetPlatformFeedbackCollaborationQuestion{
  collaborationQuestions(filters:{isPlatformFeedback:{eq:true}}) {
    data {
      id,
       attributes {
        project {
          data {
            id
          }
        }
      }
     
    }
  }
}
`;

type ResponseType<T extends STRAPI_QUERY> = T extends STRAPI_QUERY.GetProjects
  ? any
  : T extends STRAPI_QUERY.GetUpdates
    ? any
    : T extends STRAPI_QUERY.GetProjectById
      ? any
      : T extends STRAPI_QUERY.GetInnoUser
        ? any
        : T extends STRAPI_QUERY.CreateInnoUser
          ? any
          : T extends STRAPI_QUERY.GetUpdatesByProjectId
            ? any
            : T extends STRAPI_QUERY.GetOpportunitiesByProjectId
              ? Opportunity[]
              : T extends STRAPI_QUERY.GetProjectQuestionsByProjectId
                ? any
                : T extends STRAPI_QUERY.GetCollaborationQuestionsByProjectId
                  ? any
                  : T extends STRAPI_QUERY.GetSurveyQuestionsByProjectId
                    ? any
                    : T extends STRAPI_QUERY.GetOpportunitiesId
                      ? Opportunity[]
                      : T extends STRAPI_QUERY.CreateProjectUpdate
                        ? any
                        : T extends STRAPI_QUERY.GetEvents
                          ? any
                          : T extends STRAPI_QUERY.GetPlatformFeedbackCollaborationQuestion
                            ? Event[]
                            : never;

type ResponseTransformerData =
  | ProjectsResponse
  | ProjectResponse
  | GetInnoUserResponse
  | CreateInnoUserResponse
  | UpdatesResponse
  | OpportunitiesResponse
  | ProjectQuestionsResponse
  | CollaborationQuestionsResponse
  | SurveyQuestionsResponse
  | CreateProjectUpdateResponse
  | UpdateOpportunityResponse
  | UpdateOportunityParticipantsResponse
  | EventCountResponse
  | GetEventsResponse
  | GetPlatformFeedbackCollaborationQuestionResponse;

export const withResponseTransformer = async <T extends STRAPI_QUERY>(
  query: T,
  data: ResponseTransformerData,
): Promise<ResponseType<T>> => {
  return withResponseTransformerUntyped(query, data) as ResponseType<T>;
};

const withResponseTransformerUntyped = async <T extends STRAPI_QUERY>(query: T, data: ResponseTransformerData) => {
  switch (query) {
    case STRAPI_QUERY.GetProjects:
      return await getStaticBuildFetchProjects(data as ProjectsResponse);
    case STRAPI_QUERY.GetUpdates:
      return getStaticBuildFetchUpdates(data as UpdatesResponse);
    case STRAPI_QUERY.GetProjectById:
      return getStaticBuildFetchProjectById(data as ProjectResponse);
    case STRAPI_QUERY.GetInnoUser:
      return getStaticBuildGetInnoUser(data as GetInnoUserResponse);
    case STRAPI_QUERY.CreateInnoUser:
      return getStaticBuildCreateInnoUser(data as CreateInnoUserResponse);
    case STRAPI_QUERY.GetUpdatesByProjectId:
      return getStaticBuildFetchUpdates(data as UpdatesResponse);
    case STRAPI_QUERY.GetOpportunitiesId:
      return getStaticBuildFetchOpportunitiesByProjectId(data as OpportunitiesResponse);
    case STRAPI_QUERY.GetOpportunitiesByProjectId:
      return getStaticBuildFetchOpportunitiesByProjectId(data as OpportunitiesResponse);
    case STRAPI_QUERY.GetProjectQuestionsByProjectId:
      return getStaticBuildFetchQuestionsByProjectId(data as ProjectQuestionsResponse);
    case STRAPI_QUERY.GetCollaborationQuestionsByProjectId:
      return getStaticBuildFetchCollaborationQuestionsByProjectId(data as CollaborationQuestionsResponse);
    case STRAPI_QUERY.GetSurveyQuestionsByProjectId:
      return getStaticBuildFetchSurveyQuestionsByProjectId(data as SurveyQuestionsResponse);
    case STRAPI_QUERY.GetEventCount:
      return getStaticBuildFetchEventCount(data as EventCountResponse);
    case STRAPI_QUERY.CreateProjectUpdate:
      return getStaticBuildCreateProjectUpdate(data as CreateProjectUpdateResponse);
    case STRAPI_QUERY.GetEvents:
      return getStaticBuildFetchEvents(data as GetEventsResponse);
    case STRAPI_QUERY.CreateOpportunityParticipant:
      return getStaticBuildUpdateOpportunity(data as UpdateOpportunityResponse);
    case STRAPI_QUERY.GetOpportunityParticipant:
      return getStaticBuildGetOpportunityParticipant(data as OpportunitiesResponse);
    case STRAPI_QUERY.UpdateOpportunityParticipants:
      return getStaticBuildUpdateOpportunityParticipants(data as UpdateOportunityParticipantsResponse);
    case STRAPI_QUERY.GetPlatformFeedbackCollaborationQuestion:
      return getStaticBuildFetchPlatformFeedbackCollaborationQuestion(
        data as GetPlatformFeedbackCollaborationQuestionResponse,
      );
    default:
      // Will cause an error at build time if not all cases are covered above
      exhaustiveMatchingGuard(query);
      break;
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const exhaustiveMatchingGuard = (_: never): never => {
  throw new Error('This should not be reached');
};

function getStaticBuildFetchEventCount(graphqlResponse: EventCountResponse) {
  const EventCount = graphqlResponse.data.events.meta.pagination.total;
  return EventCount;
}
function getStaticBuildFetchPlatformFeedbackCollaborationQuestion(
  graphqlResponse: GetPlatformFeedbackCollaborationQuestionResponse,
) {
  if (graphqlResponse && graphqlResponse.data) {
    if (
      graphqlResponse.data.collaborationQuestions.data.length > 1 ||
      graphqlResponse.data.collaborationQuestions.data.length === 0
    ) {
      throw new Error('More than one or none platform feedback question found');
    }
    const {
      id: collaborationQuestionId,
      attributes: {
        project: {
          data: { id: projectId },
        },
      },
    } = graphqlResponse.data.collaborationQuestions.data[0];
    return {
      collaborationQuestionId,
      projectId,
    };
  }
}

function getStaticBuildFetchEvents(graphqlResponse: GetEventsResponse) {
  if (graphqlResponse && graphqlResponse.data) {
    return graphqlResponse.data.events.data.map((strapiEvent) => {
      const attributes = strapiEvent.attributes;
      const user = attributes.author.data;
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_ENDPOINT;
      const imagePath = attributes.image.data?.attributes.url;
      const projectId = attributes.project.data?.id;
      return {
        ...strapiEvent,
        ...attributes,
        startTime: attributes.startTime,
        endTime: attributes.endTime,
        author: {
          ...user,
          ...user?.attributes,
        },
        image: imagePath ? baseUrl + imagePath : null,
        themes: attributes.Themes.map((t) => t.theme),
        projectId,
      };
    });
  }
}

function getStaticBuildCreateProjectUpdate(graphqlResponse: CreateProjectUpdateResponse) {
  if (graphqlResponse && graphqlResponse.data) {
    const update = graphqlResponse.data.createUpdate.data;
    const author = update.attributes.author.data.attributes;
    return {
      ...update.attributes,
      author: {
        ...author,
        avatar: author.avatar.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${author.avatar.data.attributes.url}`,
      },
    };
  }
}

function mapUpdateOpportunity(opportunity: OpportunityQuery) {
  const contactPerson = opportunity.attributes.contactPerson.data;
  const participants = opportunity.attributes.participants.data;

  const mappedOpportunity = {
    id: opportunity.id,
    ...opportunity.attributes,
    contactPerson: contactPerson
      ? {
          ...contactPerson.attributes,
          image:
            contactPerson.attributes.avatar.data &&
            `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${contactPerson.attributes.avatar.data.attributes.url}`,
        }
      : null,
    participants:
      participants &&
      participants.map((participant) => {
        return {
          ...participant.attributes,
          image:
            participant.attributes.avatar.data &&
            `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${participant.attributes.avatar.data.attributes.url}`,
        };
      }),
  };
  return mappedOpportunity;
}

function getStaticBuildGetOpportunityParticipant(graphqlResponse: OpportunitiesResponse) {
  const opportunity = graphqlResponse.data.opportunities.data[0];
  if (opportunity) {
    return mapUpdateOpportunity(opportunity);
  }
}

function getStaticBuildUpdateOpportunity(graphqlResponse: UpdateOpportunityResponse) {
  const opportunity = graphqlResponse.data.updateOpportunity.data;
  if (opportunity) {
    return mapUpdateOpportunity(opportunity);
  }
}

function getStaticBuildUpdateOpportunityParticipants(graphqlResponse: UpdateOportunityParticipantsResponse) {
  const opportunity = graphqlResponse.data.updateOpportunityParticipants.data;
  if (opportunity) {
    return mapUpdateOpportunity(opportunity);
  }
}

function getStaticBuildFetchSurveyQuestionsByProjectId(graphqlResponse: SurveyQuestionsResponse) {
  const surveyQuestions = graphqlResponse.data.surveyQuestions.data;
  return surveyQuestions.map((s) => {
    return { id: s.id, ...s.attributes };
  });
}

async function getStaticBuildFetchCollaborationQuestionsByProjectId(graphqlResponse: CollaborationQuestionsResponse) {
  const questions = graphqlResponse.data.collaborationQuestions.data;
  let formattedQuestions: any = [];
  if (questions.length > 0) {
    const projectId = questions[0].attributes.project.data.id;

    formattedQuestions = await Promise.allSettled(
      questions.map(async (question) => {
        const q = question.attributes;

        const { data: formattedComments } = await getCollaborationComments({
          projectId,
          questionId: question.id,
        });

        return {
          id: question.id,
          title: q.title,
          isPlatformFeedback: q.isPlatformFeedback,
          description: q.description,
          comments: formattedComments,
          authors: q.authors.data.map((a: UserQuery) => {
            return {
              id: a.id,
              ...a.attributes,
              image:
                a.attributes.avatar.data &&
                `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${a.attributes.avatar.data.attributes.url}`,
            } as User;
          }),
        };
      }),
    ).then((results) => getFulfilledResults(results));
  }

  return formattedQuestions as CollaborationQuestion[];
}

function getStaticBuildFetchQuestionsByProjectId(graphqlResponse: ProjectQuestionsResponse) {
  const questions = graphqlResponse.data.questions.data;

  const formattedQuestions = questions.map((question) => {
    const q = question.attributes;

    return {
      id: question.id,
      title: q.title,
      authors: q.authors.data.map((a: UserQuery) => {
        return {
          id: a.id,
          ...a.attributes,
          image:
            a.attributes.avatar.data &&
            `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${a.attributes.avatar.data.attributes.url}`,
        } as User;
      }),
    };
  });

  return formattedQuestions as ProjectQuestion[];
}

function getStaticBuildFetchUpdates(graphqlResponse: UpdatesResponse) {
  const updates = graphqlResponse.data.updates.data;

  const formattedUpdates = updates.map((update) => {
    const u = update.attributes;
    const author = u.author.data;
    const project = u.project;

    return {
      id: update.id,
      projectId: project.data ? project.data.id : null,
      title: project.data ? project.data.attributes.title : '',
      comment: u.comment,
      date: u.date || new Date(),
      topic: u.topic,
      author: author
        ? {
            name: author.attributes.name,
            email: author.attributes.email,
            image:
              author.attributes.avatar.data &&
              `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${author.attributes.avatar.data.attributes.url}`,
          }
        : null,
    };
  });
  return formattedUpdates;
}

function getStaticBuildFetchOpportunitiesByProjectId(graphqlResponse: OpportunitiesResponse) {
  const opportunities = graphqlResponse.data.opportunities.data;
  if (opportunities && opportunities.length > 0) {
    return opportunities.map((o) => {
      const contactPerson = o.attributes.contactPerson.data;
      const participants = o.attributes.participants.data;
      return {
        id: o.id,
        ...o.attributes,
        contactPerson: contactPerson
          ? {
              ...contactPerson.attributes,
              image:
                contactPerson.attributes.avatar.data &&
                `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${contactPerson.attributes.avatar.data.attributes.url}`,
            }
          : null,
        participants: participants.map((participant) => {
          return {
            ...participant.attributes,
            image:
              participant.attributes.avatar.data &&
              `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${participant.attributes.avatar.data.attributes.url}`,
          };
        }),
      };
    });
  }
  return [];
}

function getStaticBuildCreateInnoUser(graphqlResponse: CreateInnoUserResponse) {
  if (graphqlResponse.data) {
    const user = graphqlResponse.data.createInnoUser.data.attributes;

    return {
      ...user,
      image: user.avatar.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${user.avatar.data.attributes.url}`,
    };
  }
}

function getStaticBuildGetInnoUser(graphqlResponse: GetInnoUserResponse) {
  if (graphqlResponse.data.innoUsers.data.length) {
    const user = graphqlResponse.data.innoUsers.data[0];

    return {
      id: user.id,
      ...user.attributes,
      image:
        user.attributes.avatar.data &&
        `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${user.attributes.avatar.data.attributes.url}`,
    } as User;
  }
}

async function getStaticBuildFetchProjects(graphqlResponse: ProjectsResponse) {
  const formattedUpdates: Update[] = [];
  const formattedProjects = await Promise.allSettled(
    graphqlResponse.data.projects.data.map(async (project: ProjectData) => {
      const { title, shortTitle, featured, projectStart, summary, image, status, team, description } =
        project.attributes;

      const updates = (await getUpdatesByProjectId(project.id)) as Update[];

      const formattedUpdate = updates.map((u) => {
        u.title = title || shortTitle;
        return u;
      });

      const formattedTeam = team.data.map((t: UserQuery) => {
        return {
          ...t.attributes,
          image:
            t.attributes.avatar.data &&
            `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${t.attributes.avatar.data.attributes.url}`,
        };
      });

      formattedUpdates.push(...formattedUpdate);
      return {
        id: project.id,
        featured,
        projectStart: formatDate(projectStart),
        title,
        shortTitle,
        summary,
        status,
        team: formattedTeam,
        description: {
          ...description,
          tags: description.tags,
        },
        image: image.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${image.data.attributes.url}`,
      };
    }),
  ).then((results) => getFulfilledResults(results));

  return {
    projects: formattedProjects,
    updates: formattedUpdates,
  };
}

async function getStaticBuildFetchProjectById(graphqlResponse: ProjectResponse) {
  const project = graphqlResponse.data.project.data;

  if (!project) throw new Error('Project not found');

  const { title, shortTitle, summary, image, status, projectStart, description, author, team } = project.attributes;

  const opportunities = (await getOpportunitiesByProjectId(project.id)) as Opportunity[];
  const projectQuestions = (await getProjectQuestionsByProjectId(project.id)) as ProjectQuestion[];
  const surveyQuestions = (await getSurveyQuestionsByProjectId(project.id)) as SurveyQuestion[];
  const collaborationQuestions = (await getCollaborationQuestionsByProjectId(project.id)) as CollaborationQuestion[];
  const projectComments = (await getComments({ projectId: project.id })).data;

  const updates = (await getUpdatesByProjectId(project.id)) as Update[];
  const formattedUpdates = updates.map((u) => {
    u.title = title || shortTitle;
    return u;
  });

  const formatAuthor = () => {
    if (author && author.data) {
      return {
        ...author.data.attributes,
        image:
          author.data.attributes.avatar.data &&
          `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${author.data.attributes.avatar.data.attributes.url}`,
      };
    }
  };

  const formattedTeam = team.data.map((t: UserQuery) => {
    return {
      ...t.attributes,
      image:
        t.attributes.avatar.data &&
        `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${t.attributes.avatar.data.attributes.url}`,
    };
  });

  const formattedDescription = {
    ...description,
    tags: description.tags,
  };

  return {
    project: {
      id: project.id,
      title,
      shortTitle,
      summary,
      status,
      comments: projectComments,
      projectStart: formatDate(projectStart),
      opportunities,
      surveyQuestions,
      description: formattedDescription,
      author: formatAuthor(),
      team: formattedTeam,
      image: image.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${image.data.attributes.url}`,
      updates: formattedUpdates,
      questions: projectQuestions,
      collaborationQuestions,
    },
  };
}
