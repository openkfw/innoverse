import {
  CollaborationQuestionsResponse,
  CreateInnoUserResponse,
  GetInnoUserResponse,
  OpportunitiesResponse,
  ProjectData,
  ProjectQuestionsResponse,
  ProjectResponse,
  ProjectsResponse,
  SurveyQuestion,
  SurveyQuestionsResponse,
  Update,
  UpdatesResponse,
  UserQuery,
} from '@/common/strapiTypes';
import { CollaborationQuestion, Comment, Opportunity, ProjectQuestion, User } from '@/common/types';
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
  GetUpdatesFilter,
  GetProjectById,
  GetInnoUser,
  CreateInnoUser,
  GetUpdatesByProjectId,
  GetOpportunitiesByProjectId,
  GetProjectQuestionsByProjectId,
  GetSurveyQuestionsByProjectId,
  GetCollaborationQuestionsByProjectId,
}

function formatDate(value: string, locale = 'de-DE') {
  const date = new Date(value);
  const month = date.toLocaleString(locale, { month: 'long' });
  const year = date.toLocaleString(locale, { year: 'numeric' });
  return `${month} ${year}`;
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

export const GetUpdatesQuery = `query GetUpdates($page: Int, $pageSize: Int) {
  updates(pagination: { page: $page, pageSize: $pageSize }) {
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
  updates(filters: { project: { id: { eq: $projectId } } }) {
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
    | ProjectQuestionsResponse
    | CollaborationQuestionsResponse
    | SurveyQuestionsResponse,
) => {
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
    case STRAPI_QUERY.GetOpportunitiesByProjectId:
      return getStaticBuildFetchOpportunitiesByProjectId(data as OpportunitiesResponse);
    case STRAPI_QUERY.GetProjectQuestionsByProjectId:
      return getStaticBuildFetchQuestionsByProjectId(data as ProjectQuestionsResponse);
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
          description: q.description,
          comments: formattedComments,
          authors: q.authors.data.map((a: UserQuery) => {
            return {
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
    const author = u.author.data.attributes;
    const projectId = update.attributes.project.data.id;
    const title = update.attributes.project.data.attributes.title;

    return {
      id: update.id,
      projectId,
      title,
      comment: u.comment,
      date: u.date || new Date(),
      topic: u.topic,
      author: {
        name: author.name,
        image: author.avatar.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${author.avatar.data.attributes.url}`,
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
    image: user.avatar.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${user.avatar.data.attributes.url}`,
  };
}

function getStaticBuildGetInnoUser(graphqlResponse: GetInnoUserResponse) {
  if (graphqlResponse.data.innoUsers.data.length) {
    const user = graphqlResponse.data.innoUsers.data[0].attributes;

    return {
      ...user,
      image: user.avatar.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${user.avatar.data.attributes.url}`,
    };
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

  const { title, shortTitle, summary, image, status, projectStart, description, author, team } = project.attributes;

  const opportunities = (await getOpportunitiesByProjectId(project.id)) as Opportunity[];
  const projectQuestions = (await getProjectQuestionsByProjectId(project.id)) as ProjectQuestion[];
  const surveyQuestions = (await getSurveyQuestionsByProjectId(project.id)) as SurveyQuestion[];
  const collaborationQuestions = (await getCollaborationQuestionsByProjectId(project.id)) as CollaborationQuestion[];
  const projectComments = (await getComments({ projectId: project.id })).data as Comment[];

  const updates = (await getUpdatesByProjectId(project.id)) as Update[];
  const formattedUpdates = updates.map((u) => {
    u.title = title || shortTitle;
    return u;
  });

  const formattedAuthor = {
    ...author.data.attributes,
    image:
      author.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${author.data.attributes.avatar.data.attributes.url}`,
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
      author: formattedAuthor,
      team: formattedTeam,
      image: image.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${image.data.attributes.url}`,
      updates: formattedUpdates,
      questions: projectQuestions,
      collaborationQuestions,
    },
  };
}
