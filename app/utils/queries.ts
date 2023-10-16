export enum STRAPI_QUERY {
  StaticBuildGetFeaturedSliderItemsQuery,
  StaticBuildGetProjectIds,
  StaticBuildFetchProjectIds,
  GetProjectsSummaryQuery,
  GetProjectByIdQuery,
}

export const StaticBuildGetFeaturedSliderItemsQuery = `query GetFeaturedSliderItems {
  items {
    data {
      id,
      attributes {
        title,
        text{
          title,
          description,
          tags
        }
        image{
          sliderImage{
            data{
              attributes{
                url,
              }
            }
          }
          projectTo
          projectFrom
          year
        }
      }
    }
  }
}`;

export const StaticBuildGetProjectIdsQuery = `query GetFeaturedSliderItems {
  items {
    data {
      id,
      attributes {
        title,
        text{
          title,
          description,
          tags
        }
        image{
          sliderImage{
            data{
              attributes{
                url,
              }
            }
          }
          projectTo
          projectFrom
          year
        }
      }
    }
  }
}`;

export const GetFeaturedProjectsQuery = `query GetProjectSummary {
  projects {
    data {
      id
      attributes {
        title
        summary
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

export const GetProjectsSummaryQuery = `query GetProjectSummary {
  projects {
    data {
      id
      attributes {
        title
        summary
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
        headline
        text
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
    case STRAPI_QUERY.StaticBuildGetFeaturedSliderItemsQuery:
      return getStaticBuildFetchProjectIds(data);
    case STRAPI_QUERY.StaticBuildFetchProjectIds:
      return getStaticBuildFetchProjectIds(data);
    case STRAPI_QUERY.GetProjectsSummaryQuery:
      return getStaticBuildFetchProjectSummary(data);
    case STRAPI_QUERY.GetProjectByIdQuery:
      return getStaticBuildFetchProjectById(data);
    default:
      break;
  }
};

// function getStaticBuildFeaturedSliderItemsTransformer(graphqlResponse: any) {
//   return {
//     pages: [1, 2, 3, 4],
//   };
// }

function getStaticBuildFetchProjectIds(graphqlResponse: any) {
  const formattedItems = graphqlResponse.data.items.data.map((item: any) => {
    const {
      title,
      text: { description, tags },
      image: { sliderImage, projectTo, projectFrom, year },
    } = item.attributes;

    return {
      image: {
        image: `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${sliderImage.data.attributes.url}`,
        title: title,
        projectFrom,
        projectTo,
        year,
      },
      text: {
        title,
        tags: tags.tags,
        description: description,
      },
    };
  });

  return {
    items: formattedItems,
  };
}

function getStaticBuildFetchProjectSummary(graphqlResponse: any) {
  const formattedUpdates: any[] = [];
  const formattedProjects = graphqlResponse.data.projects.data.map((project: any) => {
    const { title, summary, image, status, team, updates } = project.attributes;

    const formattedUpdate = updates.map((u: any) => {
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

    formattedUpdates.push(...formattedUpdate);
    return {
      id: project.id,
      title,
      summary,
      status,
      team,
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
      author: q.authors.map((a: any) => {
        return {
          ...a,
          avatar: `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${a.avatar.data.attributes.url}`,
        };
      }),
    };
  });

  const formattedDescription = {
    ...description,
    author: {
      ...description.author,
      avatar: `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${description.author.avatar.data.attributes.url}`,
    },
  };

  return {
    project: {
      id: project.id,
      title,
      summary,
      status,
      projectStart,
      projectEnd,
      collaboration,
      surveyQuestions,
      jobs,
      description: formattedDescription,
      author: formattedAuthor,
      team: formattedTeam,
      image: `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${image.data.attributes.url}`,
      updates: formattedUpdates,
      questions: formattedQuestions,
    },
  };
}
