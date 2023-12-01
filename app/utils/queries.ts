import {
  CreateInnoUserResponse,
  GetInnoUserResponse,
  ProjectData,
  ProjectResponse,
  ProjectsResponse,
  Question,
  SurveyQuestion,
  Update,
  UpdateQuery,
  UserQuery,
} from '@/common/strapiTypes';

export enum STRAPI_QUERY {
  GetProjects,
  GetProjectById,
  GetInnoUserByEmail,
  CreateInnoUser,
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
        updates {
          date
          comment
          theme
          author {
            ${userQuery}
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
       updates {
         date
         comment
         theme
         author {
          ${userQuery}
         }
       }
       collaboration {
         description
       }
       questions {
        title
        description
        authors {
          ${userQuery}
        }
       }
       surveyQuestions {
        question
        responseOptions {
          responseOption
        }
        votes
       }
       opportunities {
        title
        description 
        email
       }
     }
   }
 }
}`;

export const withResponseTransformer = (
  query: STRAPI_QUERY,
  data: ProjectsResponse | ProjectResponse | GetInnoUserResponse | CreateInnoUserResponse,
) => {
  switch (query) {
    case STRAPI_QUERY.GetProjects:
      return getStaticBuildFetchProjects(data as ProjectsResponse);
    case STRAPI_QUERY.GetProjectById:
      return getStaticBuildFetchProjectById(data as ProjectResponse);
    case STRAPI_QUERY.GetInnoUserByEmail:
      return getStaticBuildGetInnoUser(data as GetInnoUserResponse);
    case STRAPI_QUERY.CreateInnoUser:
      return getStaticBuildCreateInnoUser(data as CreateInnoUserResponse);
    default:
      break;
  }
};

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

function getStaticBuildFetchProjects(graphqlResponse: ProjectsResponse) {
  const formattedUpdates: Update[] = [];
  const formattedProjects = graphqlResponse.data.projects.data.map((project: ProjectData) => {
    const { title, shortTitle, featured, projectStart, summary, image, status, team, updates, description } =
      project.attributes;

    const formattedUpdate = (updates as unknown as UpdateQuery[]).map((u: UpdateQuery) => {
      const author = u.author.data.attributes;
      return {
        title: title || shortTitle,
        comment: u.comment,
        date: u.date,
        theme: u.theme,
        author: {
          name: author.name,
          avatar:
            author.avatar.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${author.avatar.data.attributes.url}`,
        },
      };
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
  });

  return {
    projects: formattedProjects,
    updates: formattedUpdates,
  };
}

function getStaticBuildFetchProjectById(graphqlResponse: ProjectResponse) {
  const project = graphqlResponse.data.project.data;

  const {
    title,
    shortTitle,
    summary,
    image,
    status,
    projectStart,
    collaboration,
    description,
    author,
    team,
    updates,
    questions,
    surveyQuestions,
    opportunities,
  } = project.attributes;

  const formattedUpdates = (updates as unknown as UpdateQuery[]).map((u: UpdateQuery) => {
    const author = u.author.data;
    return {
      title,
      comment: u.comment,
      date: u.date,
      theme: u.theme,
      author: {
        ...author.attributes,
        avatar: author && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${author.attributes.avatar.data.attributes.url}`,
      },
    };
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

  const formattedQuestions = questions.map((q: Question) => {
    return {
      ...q,
      authors: q.authors.data.map((a: UserQuery) => {
        return {
          ...a.attributes,
          avatar:
            a.attributes.avatar.data &&
            `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${a.attributes.avatar.data.attributes.url}`,
        };
      }),
    };
  });

  const formattedDescription = {
    ...description,
    tags: description.tags,
  };

  const formattedSurveyQuestions =
    surveyQuestions &&
    surveyQuestions.map((q: SurveyQuestion) => {
      return {
        ...q,
        responseOptions: q.responseOptions,
      };
    });

  return {
    project: {
      id: project.id,
      title,
      shortTitle,
      summary,
      status,
      projectStart: formatDate(projectStart),
      collaboration,
      opportunities,
      surveyQuestions: formattedSurveyQuestions,
      description: formattedDescription,
      author: formattedAuthor,
      team: formattedTeam,
      image: image.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${image.data.attributes.url}`,
      updates: formattedUpdates,
      questions: formattedQuestions,
    },
  };
}
