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

const userQuery = `
  data {
    attributes {
      gitlabId
      azureId
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

export const CreateInnoUserQuery = `mutation PostInnoUser($gitlabId: String, $azureId: String, $name: String!, $role: String, $department: String, $email: String, $avatarId: ID) {
  createInnoUser(data: { gitlabId: $gitlabId, azureId: $azureId,name: $name, role: $role, department: $department, email: $email, avatar: $avatarId}) {
    data {
      id
      attributes {
        gitlabId
        azureId
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
        gitlabId
        azureId
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
        featured
        summary
        projectStart
        projectEnd
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
          title
          summary
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
       summary
       status
       projectStart
       projectEnd
       image {
         data {
           attributes {
             url
           }
         }
       }
       description {
         title
         summary
         text
         tags {
          tag
         }
         author {
          ${userQuery}
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
       jobs {
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
  const user = graphqlResponse.data.innoUsers.data[0].attributes;

  return {
    ...user,
    avatar: user.avatar.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${user.avatar.data.attributes.url}`,
  };
}

function getStaticBuildFetchProjects(graphqlResponse: ProjectsResponse) {
  const formattedUpdates: Update[] = [];
  const formattedProjects = graphqlResponse.data.projects.data.map((project: ProjectData) => {
    const { title, featured, projectStart, projectEnd, summary, image, status, team, updates, description } =
      project.attributes;

    const formattedUpdate = (updates as unknown as UpdateQuery[]).map((u: UpdateQuery) => {
      const author = u.author.data.attributes;

      return {
        title: description.title,
        comment: u.comment,
        date: u.date,
        theme: u.theme,
        author: {
          ...author,
          avatar:
            author.avatar.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${author.avatar.data.attributes.url}`,
        },
      };
    });

    const formattedTeam = team.data.map((t: UserQuery) => {
      return {
        ...t.attributes,
      };
    });

    formattedUpdates.push(...formattedUpdate);
    return {
      id: project.id,
      featured,
      projectStart,
      projectEnd,
      title,
      summary,
      status,
      team: formattedTeam,
      description: {
        ...description,
        tags: description.tags,
      },
      image: `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${image.data.attributes.url}`,
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
    summary,
    image,
    status,
    projectStart,
    projectEnd,
    collaboration,
    description,
    author,
    team,
    updates,
    questions,
    surveyQuestions,
    jobs,
  } = project.attributes;

  const formattedUpdates = (updates as unknown as UpdateQuery[]).map((u: UpdateQuery) => {
    const author = u.author.data.attributes;
    return {
      title,
      comment: u.comment,
      date: u.date,
      theme: u.theme,
      author: {
        ...author,
        avatar: author.avatar.data && `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${author.avatar.data.attributes.url}`,
      },
    };
  });

  const formattedAuthor = {
    ...author.data.attributes,
    avatar:
      author.data.attributes.avatar.data &&
      `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${author.data.attributes.avatar.data.attributes.url}`,
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
    author: {
      ...description.author,
      avatar:
        description.author.data.attributes.avatar.data &&
        `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${description.author.data.attributes.avatar.data.attributes.url}`,
    },
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
      summary,
      status,
      projectStart,
      projectEnd,
      collaboration,
      jobs,
      surveyQuestions: formattedSurveyQuestions,
      description: formattedDescription,
      author: formattedAuthor,
      team: formattedTeam,
      image: `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${image.data.attributes.url}`,
      updates: formattedUpdates,
      questions: formattedQuestions,
    },
  };
}
