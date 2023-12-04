import {
  CollaborationQuestionsResponse,
  CreateInnoUserResponse,
  GetInnoUserResponse,
  OpportunitiesResponse,
  ProjectData,
  ProjectResponse,
  ProjectsResponse,
  QuestionsResponse,
  SurveyQuestion,
  SurveyQuestionsResponse,
  Update,
  UpdatesResponse,
  UserQuery,
} from '@/common/strapiTypes';
import { Opportunity, Question, User } from '@/common/types';

import {
  getCollaborationQuestionsByProjectId,
  getOpportunitiesByProjectId,
  getQuestionsByProjectId,
  getSurveyQuestionsByProjectId,
  getUpdatesByProjectId,
} from './requests';

export enum STRAPI_QUERY {
  GetProjects,
  GetProjectById,
  GetInnoUserByEmail,
  CreateInnoUser,
  GetUpdatesByProjectId,
  GetOpportunitiesByProjectId,
  GetQuestionsByProjectId,
  GetSurveyQuestionsByProjectId,
  GetCollaborationQuestionsByProjectId,
}

function formatDate(value: string, locale = 'de-DE') {
  const date = new Date(value);
  const month = date.toLocaleString(locale, { month: 'long' });
  const year = date.toLocaleString(locale, { year: 'numeric' });
  return `${month} ${year}`;
}

function getCurrentDate(locale = 'de-DE') {
  const date = new Date();
  const day = date.toLocaleString(locale, { day: 'numeric' });
  const month = date.toLocaleString(locale, { month: 'long' });
  const year = date.toLocaleString(locale, { year: 'numeric' });
  return `${day}. ${month} ${year}`;
}

const userQuery = `
  data {
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

export const GetUpdatesByProjectIdQuery = `query GetUpdates($projectId: ID) {
  updates(filters: { project: { id: { eq: $projectId } } }) {
    data {
      attributes {
        date
        comment
        theme
        author {
          ${userQuery}
        }
      }
    }    
  }
}`;

export const GetOpportunitiesByProjectIdQuery = `query GetOpportunities($projectId: ID) {
  opportunities(filters: { project: { id: { eq: $projectId } } }) {
    data {
      attributes {
        title
        description 
        email
        expense
      }
    }    
  }
}`;

export const GetSurveyQuestionsByProjectIdQuery = `query GetSurveyQuestions($projectId: ID) {
  surveyQuestions(filters: { project: { id: { eq: $projectId } } }) {
    data {
      attributes {
        question
        responseOptions {
          responseOption
        } 
        votes
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
      attributes {
        title
        description
        authors {
          ${userQuery}
        }
      }
    }    
  }
}`;

export const GetProjectsQuery = `query GetProjects {
  projects(sort: "id:asc") {
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

export const withResponseTransformer = async (
  query: STRAPI_QUERY,
  data:
    | ProjectsResponse
    | ProjectResponse
    | GetInnoUserResponse
    | CreateInnoUserResponse
    | UpdatesResponse
    | OpportunitiesResponse
    | QuestionsResponse
    | CollaborationQuestionsResponse
    | SurveyQuestionsResponse,
) => {
  switch (query) {
    case STRAPI_QUERY.GetProjects:
      return await getStaticBuildFetchProjects(data as ProjectsResponse);
    case STRAPI_QUERY.GetProjectById:
      return getStaticBuildFetchProjectById(data as ProjectResponse);
    case STRAPI_QUERY.GetInnoUserByEmail:
      return getStaticBuildGetInnoUser(data as GetInnoUserResponse);
    case STRAPI_QUERY.CreateInnoUser:
      return getStaticBuildCreateInnoUser(data as CreateInnoUserResponse);
    case STRAPI_QUERY.GetUpdatesByProjectId:
      return getStaticBuildFetchUpdatesByProjectId(data as UpdatesResponse);
    case STRAPI_QUERY.GetOpportunitiesByProjectId:
      return getStaticBuildFetchOpportunitiesByProjectId(data as OpportunitiesResponse);
    case STRAPI_QUERY.GetQuestionsByProjectId:
      return getStaticBuildFetchQuestionsByProjectId(data as QuestionsResponse);
    case STRAPI_QUERY.GetCollaborationQuestionsByProjectId:
      return getStaticBuildFetchCollaborationQuestionsByProjectId(data as CollaborationQuestionsResponse);
    case STRAPI_QUERY.GetSurveyQuestionsByProjectId:
      return getStaticBuildFetchSurveyQuestionsByProjectId(data as SurveyQuestionsResponse);
    default:
      break;
  }
};

function getStaticBuildFetchSurveyQuestionsByProjectId(graphqlResponse: SurveyQuestionsResponse) {
  const surveyQuestions = graphqlResponse.data.surveyQuestions.data;
  return surveyQuestions.map((s) => {
    return { ...s.attributes };
  });
}

function getStaticBuildFetchCollaborationQuestionsByProjectId(graphqlResponse: CollaborationQuestionsResponse) {
  const questions = graphqlResponse.data.collaborationQuestions.data;

  const formattedQuestions = questions.map((question) => {
    const q = question.attributes;
    return {
      ...q,
      authors: q.authors.data.map((a: UserQuery) => {
        return {
          ...a.attributes,
          avatar:
            a.attributes.avatar.data &&
            `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${a.attributes.avatar.data.attributes.url}`,
        } as User;
      }),
    };
  });

  return formattedQuestions as Question[];
}

function getStaticBuildFetchQuestionsByProjectId(graphqlResponse: QuestionsResponse) {
  const questions = graphqlResponse.data.questions.data;

  const formattedQuestions = questions.map((question) => {
    const q = question.attributes;
    return {
      ...q,
      authors: q.authors.data.map((a: UserQuery) => {
        return {
          ...a.attributes,
          avatar:
            a.attributes.avatar.data &&
            `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${a.attributes.avatar.data.attributes.url}`,
        } as User;
      }),
    };
  });

  return formattedQuestions as Question[];
}

function getStaticBuildFetchUpdatesByProjectId(graphqlResponse: UpdatesResponse) {
  const updates = graphqlResponse.data.updates.data;

  const formattedUpdates = updates.map((update) => {
    const u = update.attributes;
    const author = u.author.data.attributes;
    return {
      comment: u.comment,
      date: u.date || getCurrentDate(),
      theme: u.theme,
      author: {
        name: author.name,
        avatar: author.avatar.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${author.avatar.data.attributes.url}`,
      },
    };
  });
  return formattedUpdates;
}

function getStaticBuildFetchOpportunitiesByProjectId(graphqlResponse: OpportunitiesResponse) {
  const opportunities = graphqlResponse.data.opportunities.data;
  return opportunities.map((o) => {
    return { ...o.attributes };
  });
}

function getStaticBuildCreateInnoUser(graphqlResponse: CreateInnoUserResponse) {
  const user = graphqlResponse.data.createInnoUser.data.attributes;

  return {
    ...user,
    avatar: user.avatar.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${user.avatar.data.attributes.url}`,
  };
}

function getStaticBuildGetInnoUser(graphqlResponse: GetInnoUserResponse) {
  if (graphqlResponse.data.innoUsers.data.length) {
    const user = graphqlResponse.data.innoUsers.data[0].attributes;

    return {
      ...user,
      avatar: user.avatar.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${user.avatar.data.attributes.url}`,
    };
  }
}

async function getStaticBuildFetchProjects(graphqlResponse: ProjectsResponse) {
  const formattedUpdates: Update[] = [];
  const formattedProjects = await Promise.all(
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
          avatar:
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
  );

  return {
    projects: formattedProjects,
    updates: formattedUpdates,
  };
}

async function getStaticBuildFetchProjectById(graphqlResponse: ProjectResponse) {
  const project = graphqlResponse.data.project.data;

  const { title, shortTitle, summary, image, status, projectStart, description, author, team } = project.attributes;

  const opportunities = (await getOpportunitiesByProjectId(project.id)) as Opportunity[];
  const questions = (await getQuestionsByProjectId(project.id)) as Question[];
  const surveyQuestions = (await getSurveyQuestionsByProjectId(project.id)) as SurveyQuestion[];
  const collaborationQuestions = (await getCollaborationQuestionsByProjectId(project.id)) as Question[];

  const updates = (await getUpdatesByProjectId(project.id)) as Update[];
  const formattedUpdates = updates.map((u) => {
    u.title = title || shortTitle;
    return u;
  });

  const formattedAuthor = {
    ...author.data.attributes,
    avatar:
      author.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${author.data.attributes.avatar.data.attributes.url}`,
  };

  const formattedTeam = team.data.map((t: UserQuery) => {
    return {
      ...t.attributes,
      avatar:
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
      projectStart: formatDate(projectStart),
      opportunities,
      surveyQuestions,
      description: formattedDescription,
      author: formattedAuthor,
      team: formattedTeam,
      image: image.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${image.data.attributes.url}`,
      updates: formattedUpdates,
      questions,
      collaborationQuestions,
    },
  };
}
