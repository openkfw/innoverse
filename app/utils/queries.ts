export enum STRAPI_QUERY {
  GetProjects,
  GetProjectById,
}

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
          name
        }
        description {
          title
          summary
          text
          tags
        }
        updates {
          date
          comment
          theme
          author {
            name
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
         tags
         author {
           name
           role
           department
           avatar {
             data {
               attributes {
                 url
               }
             }
           }
         }
       }
       author {
           name
           role
           department
           avatar {
             data {
               attributes {
                 url
               }
             }
           }
       }
       team {
         name
         role
         department
         avatar {
           data {
             attributes {
               url
             }
           }
         }
       }
       updates {
         date
         comment
         theme
         author {
           name
           role
           department
           avatar {
             data {
               attributes {
                 url
               }
             }
           }
         }
       }
       collaboration {
         description
       }
       questions {
        title
        description
        authors {
          name
          role
          avatar {
            data {
              attributes {
                url
              }
            }
          }
        }
       }
       surveyQuestions {
        question
        responseOptions
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

export const withResponseTransformer = (query: STRAPI_QUERY, data: unknown) => {
  switch (query) {
    case STRAPI_QUERY.GetProjects:
      return getStaticBuildFetchProjects(data);
    case STRAPI_QUERY.GetProjectById:
      return getStaticBuildFetchProjectById(data);
    default:
      break;
  }
};

function getStaticBuildFetchProjects(graphqlResponse: any) {
  const formattedUpdates: any = [];
  const formattedProjects = graphqlResponse.data.projects.data.map((project: any) => {
    const { title, featured, projectStart, projectEnd, summary, image, status, team, updates, description } =
      project.attributes;

    const formattedUpdate = updates.map((u: any) => {
      return {
        title: description.title,
        comment: u.comment,
        date: u.date,
        theme: u.theme,
        author: {
          name: u.author.name,
          avatar: `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${u.author.avatar.data.attributes.url}`,
        },
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
      team,
      description: {
        ...description,
        tags: description.tags.tags,
      },
      image: `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${image.data.attributes.url}`,
    };
  });
  return {
    projects: formattedProjects,
    updates: formattedUpdates,
  };
}

function getStaticBuildFetchProjectById(graphqlResponse: any) {
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

  const formattedUpdates = updates.map((u: any) => {
    return {
      title,
      comment: u.comment,
      date: u.date,
      theme: u.theme,
      author: {
        name: u.author.name,
        avatar: `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${u.author.avatar.data.attributes.url}`,
      },
    };
  });

  const formattedAuthor = {
    ...author,
    avatar: `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${author.avatar.data.attributes.url}`,
  };

  const formattedTeam = team.map((t: any) => {
    return {
      ...t,
      avatar: `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${t.avatar.data.attributes.url}`,
    };
  });

  const formattedQuestions = questions.map((q: any) => {
    return {
      ...q,
      authors: q.authors.map((a: any) => {
        return {
          ...a,
          avatar: `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${a.avatar.data.attributes.url}`,
        };
      }),
    };
  });

  const formattedDescription = {
    ...description,
    tags: description.tags.tags,
    author: {
      ...description.author,
      avatar: `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${description.author.avatar.data.attributes.url}`,
    },
  };

  const formattedSurveyQuestions = surveyQuestions.map((q: any) => {
    return {
      ...q,
      responseOptions: q.responseOptions.responseOptions,
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
