import {
  CollaborationQuestionsResponse,
  CreateInnoUserResponse,
  CreateProjectUpdateResponse,
  EventCountResponse,
  GetEventsResponse,
  GetInnoUserResponse,
  GetPlatformFeedbackCollaborationQuestionResponse,
  ImageType,
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
  UpdateQuery,
  UpdatesResponse,
  UserQuery,
} from '@/common/strapiTypes';
import {
  BasicProject,
  CollaborationQuestion,
  Event,
  Opportunity,
  ProjectByIdQueryResult,
  ProjectQuestion,
  ProjectsQueryResult,
  ProjectUpdate,
  User,
} from '@/common/types';
import { getProjectCollaborationComments } from '@/components/collaboration/comments/actions';
import { getProjectComments } from '@/components/project-details/comments/actions';

import { getPromiseResults } from './helpers';
import {
  getCollaborationQuestionsByProjectId,
  getOpportunitiesByProjectId,
  getProjectQuestionsByProjectId,
  getProjectsUpdates,
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

export const SORT_OPTION = {
  UPDATED_AT_ASC: 'updatedAt:asc',
  UPDATED_AT_DESC: 'updatedAt:desc',
  TITLE_ASC: 'title:asc',
};

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

export const GetEventsQuery = `query GetEvents($startingFrom: Date) {
  events(filters: {date: {gte: $startingFrom}}, sort: "${SORT_OPTION.UPDATED_AT_ASC}") {
    data {
      id
      attributes {
        title
        date
        start_time
      	end_time
        type
        description
        location
        author {
          ${userQuery}
        }
        image {
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

export const GetUpdatesQuery = `query GetUpdates ($limit: Int) {
  updates(sort: "${SORT_OPTION.UPDATED_AT_DESC}", pagination: { limit: $limit }) {
    data {
      id
      attributes {
        comment
        topic
        updatedAt
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
  updates (sort: "updatedAt:${sort}", ${filter})  {
    data {
      id
      attributes {
        comment
        topic
        updatedAt
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
  updates(sort: "${SORT_OPTION.UPDATED_AT_DESC}", filters: { project: { id: { eq: $projectId } } }) {
    data {
      id
      attributes {
        comment
        topic
        updatedAt
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

export const GetProjectsQuery = (sort = SORT_OPTION.UPDATED_AT_DESC) => `query GetProjects {
  projects(sort: "${sort}", pagination: { limit: 80 }) {
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
}`;

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

export const CreateProjectUpdateQuery = `mutation PostProjectUpdate($projectId: ID!, $comment: String, $authorId: ID!) {
  createUpdate(data: { project: $projectId, comment: $comment, author: $authorId }) {
    data {
      id
      attributes {
        comment
        topic
        updatedAt
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
query GetOpportunities($opportunityId: ID, $userId: [String]) {
  opportunities(filters: { id: { eq: $opportunityId }, participants: { providerId: { in: $userId } } }) {
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

// This map defines which methods perform the transformation for each STRAPI_QUERY-type
const responseTransformers = {
  [STRAPI_QUERY.GetProjects]: getStaticBuildFetchProjects,
  [STRAPI_QUERY.GetUpdates]: getStaticBuildFetchUpdates,
  [STRAPI_QUERY.GetProjectById]: getStaticBuildFetchProjectById,
  [STRAPI_QUERY.GetInnoUser]: getStaticBuildGetInnoUser,
  [STRAPI_QUERY.CreateInnoUser]: getStaticBuildCreateInnoUser,
  [STRAPI_QUERY.GetOpportunitiesByProjectId]: getStaticBuildFetchOpportunitiesByProjectId,
  [STRAPI_QUERY.GetProjectQuestionsByProjectId]: getStaticBuildFetchQuestionsByProjectId,
  [STRAPI_QUERY.GetCollaborationQuestionsByProjectId]: getStaticBuildFetchCollaborationQuestionsByProjectId,
  [STRAPI_QUERY.GetSurveyQuestionsByProjectId]: getStaticBuildFetchSurveyQuestionsByProjectId,
  [STRAPI_QUERY.CreateProjectUpdate]: getStaticBuildCreateProjectUpdate,
  [STRAPI_QUERY.GetEvents]: getStaticBuildFetchEvents,
  [STRAPI_QUERY.CreateOpportunityParticipant]: getStaticBuildUpdateOpportunity,
  [STRAPI_QUERY.GetOpportunityParticipant]: getStaticBuildGetOpportunityParticipant,
  [STRAPI_QUERY.UpdateOpportunityParticipants]: getStaticBuildUpdateOpportunityParticipants,
  [STRAPI_QUERY.GetPlatformFeedbackCollaborationQuestion]: getStaticBuildGetPlatformFeedbackCollaborationQuestion,
  [STRAPI_QUERY.GetEventCount]: getStaticBuildFetchEventCount,
};

// This type generates the type of the first ('data') parameter of the tranformer method
// as well as its return type
type TransformerMethodTypes = {
  [K in keyof typeof responseTransformers]: {
    data: Parameters<(typeof responseTransformers)[K]>[0];
    result: ReturnType<(typeof responseTransformers)[K]>;
  };
};

export async function withResponseTransformer<K extends keyof TransformerMethodTypes>(
  transformerType: K,
  data: TransformerMethodTypes[K]['data'],
): Promise<TransformerMethodTypes[K]['result']> {
  // Get transformer method from map
  const transformer = responseTransformers[transformerType] as (
    data: TransformerMethodTypes[K]['data'],
  ) => TransformerMethodTypes[K]['result'];
  // Call transformer method
  return await transformer(data);
}

function getStaticBuildFetchEventCount(graphqlResponse: EventCountResponse) {
  const EventCount = graphqlResponse.data.events.meta.pagination.total;
  return EventCount;
}

function getStaticBuildGetPlatformFeedbackCollaborationQuestion(
  graphqlResponse: GetPlatformFeedbackCollaborationQuestionResponse,
): { collaborationQuestionId: string; projectId: string } {
  const question = graphqlResponse.data.collaborationQuestions.data[0];
  return {
    collaborationQuestionId: question.id,
    projectId: question.attributes.project.data.id,
  };
}

function getStaticBuildFetchEvents(graphqlResponse: GetEventsResponse): Event[] {
  return graphqlResponse.data.events.data.map((strapiEvent) => {
    const attributes = strapiEvent.attributes;
    const author = attributes.author.data;
    const projectId = attributes.project.data.id;
    return {
      ...strapiEvent,
      ...attributes,
      startTime: attributes.startTime,
      endTime: attributes.endTime,
      author: author && mapToUser(author),
      image: mapToImageUrl(attributes.image),
      themes: attributes.Themes.map((t) => t.theme),
      projectId,
    };
  });
}

function getStaticBuildCreateProjectUpdate(graphqlResponse: CreateProjectUpdateResponse): ProjectUpdate {
  const update = graphqlResponse.data.createUpdate.data;
  return mapToProjectUpdate(update);
}

function getStaticBuildGetOpportunityParticipant(graphqlResponse: OpportunitiesResponse): Opportunity | undefined {
  const opportunities = graphqlResponse.data.opportunities.data;
  if (opportunities.length <= 0) {
    return undefined;
  }
  const opportunity = opportunities[0];
  return mapToOpportunity(opportunity);
}

function getStaticBuildUpdateOpportunity(graphqlResponse: UpdateOpportunityResponse): Opportunity {
  const opportunity = graphqlResponse.data.updateOpportunity.data;
  return mapToOpportunity(opportunity);
}

function getStaticBuildUpdateOpportunityParticipants(
  graphqlResponse: UpdateOportunityParticipantsResponse,
): Opportunity {
  const opportunity = graphqlResponse.data.updateOpportunityParticipants.data;
  return mapToOpportunity(opportunity);
}

function getStaticBuildFetchSurveyQuestionsByProjectId(graphqlResponse: SurveyQuestionsResponse): SurveyQuestion[] {
  const surveyQuestions = graphqlResponse.data.surveyQuestions.data;
  return surveyQuestions.map((s) => {
    return { id: s.id, ...s.attributes, votes: [] };
  });
}

async function getStaticBuildFetchCollaborationQuestionsByProjectId(
  graphqlResponse: CollaborationQuestionsResponse,
): Promise<CollaborationQuestion[]> {
  const questions = graphqlResponse.data.collaborationQuestions.data;

  if (questions.length <= 0) {
    return [];
  }

  const projectId = questions[0].attributes.project.data.id;
  const getQuestions = questions.map(async (question) => {
    const q = question.attributes;

    const { data: comments } = await getProjectCollaborationComments({
      projectId,
      questionId: question.id,
    });

    return {
      id: question.id,
      title: q.title,
      isPlatformFeedback: q.isPlatformFeedback,
      description: q.description,
      comments: comments ?? [],
      authors: q.authors.data.map(mapToUser),
    };
  });

  return await getPromiseResults(getQuestions);
}

function getStaticBuildFetchQuestionsByProjectId(graphqlResponse: ProjectQuestionsResponse): ProjectQuestion[] {
  const questions = graphqlResponse.data.questions.data;

  return questions.map((question) => {
    const q = question.attributes;

    return {
      id: question.id,
      title: q.title,
      authors: q.authors.data.map(mapToUser),
    };
  });
}

function getStaticBuildFetchUpdates(graphqlResponse: UpdatesResponse): ProjectUpdate[] {
  const updates = graphqlResponse.data.updates.data;
  return updates.map(mapToProjectUpdate);
}

function getStaticBuildFetchOpportunitiesByProjectId(graphqlResponse: OpportunitiesResponse): Opportunity[] {
  const opportunities = graphqlResponse.data.opportunities.data;

  return opportunities.map((o) => {
    const contactPerson = o.attributes.contactPerson.data;
    const participants = o.attributes.participants.data;

    return {
      id: o.id,
      ...o.attributes,
      contactPerson: contactPerson ? mapToUser(contactPerson) : undefined,
      participants: participants.map(mapToUser),
    };
  });
}

function getStaticBuildCreateInnoUser(graphqlResponse: CreateInnoUserResponse): User {
  const user = graphqlResponse.data.createInnoUser;
  return mapToUser(user.data);
}

function getStaticBuildGetInnoUser(graphqlResponse: GetInnoUserResponse): User {
  const user = graphqlResponse.data.innoUsers.data[0];
  return mapToUser(user);
}

async function getStaticBuildFetchProjects(graphqlResponse: ProjectsResponse): Promise<ProjectsQueryResult> {
  const getProjects = graphqlResponse.data.projects.data.map(async (project: ProjectData) => {
    const basicProject = mapToBasicProject(project);
    return basicProject;
  });

  const updates = await getProjectsUpdates(10);
  const projects = await getPromiseResults(getProjects);

  return {
    projects: projects,
    updates: updates || [],
  };
}

async function getStaticBuildFetchProjectById(graphqlResponse: ProjectResponse): Promise<ProjectByIdQueryResult> {
  const project = graphqlResponse.data.project.data;

  if (!project) throw new Error('Project not found');

  const { title, shortTitle } = project.attributes;

  const opportunities = (await getOpportunitiesByProjectId(project.id)) as Opportunity[];
  const projectQuestions = (await getProjectQuestionsByProjectId(project.id)) as ProjectQuestion[];
  const surveyQuestions = (await getSurveyQuestionsByProjectId(project.id)) as SurveyQuestion[];
  const collaborationQuestions = (await getCollaborationQuestionsByProjectId(project.id)) as CollaborationQuestion[];
  const projectComments = (await getProjectComments({ projectId: project.id })).data;

  const updates = (await getUpdatesByProjectId(project.id)) as Update[];
  updates.forEach((update) => (update.title = title || shortTitle));

  const basicProject = mapToBasicProject(project);

  return {
    ...basicProject,
    opportunities,
    questions: projectQuestions,
    surveyQuestions,
    collaborationQuestions,
    comments: projectComments || [],
    updates,
  };
}

function mapToBasicProject(project: ProjectData): BasicProject {
  const { image, projectStart, description, author, team, ...other } = project.attributes;

  return {
    id: project.id,
    ...other,
    projectStart: formatDate(projectStart),
    description: description,
    author: author ? mapToUser(author.data) : undefined,
    team: team.data.map(mapToUser),
    image: mapToImageUrl(image),
  };
}

function mapToOpportunity(opportunityQuery: OpportunityQuery): Opportunity {
  const attributes = opportunityQuery.attributes;
  const contactPerson = attributes.contactPerson.data;
  const participants = attributes.participants.data;
  return {
    id: opportunityQuery.id,
    ...attributes,
    contactPerson: contactPerson && mapToUser(contactPerson),
    participants: participants && participants.map(mapToUser),
  };
}

function mapToProjectUpdate(updateQuery: UpdateQuery): ProjectUpdate {
  const attributes = updateQuery.attributes;
  const author = attributes.author.data;
  const project = attributes.project;

  return {
    id: updateQuery.id,
    projectId: project.data ? project.data.id : '',
    title: project.data ? project.data.attributes.title : '',
    comment: attributes.comment,
    topic: attributes.topic,
    updatedAt: attributes.updatedAt,
    author: mapToUser(author),
  };
}

function mapToUser(userQuery: UserQuery): User {
  const attributes = userQuery.attributes;

  return {
    id: userQuery.id,
    ...attributes,
    image: mapToImageUrl(attributes.avatar),
  };
}

function mapToImageUrl(image: ImageType | undefined): string | undefined {
  if (!image?.data) return undefined;
  return `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${image.data.attributes.url}`;
}
