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
        update {
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
        collaboration
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
        update {
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
        question {
          title
          description
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

function getStaticBuildFeaturedSliderItemsTransformer(graphqlResponse: any) {
  return {
    pages: [1, 2, 3, 4],
  };
}

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
  const formattedNews: any[] = [];
  const formattedProjects = graphqlResponse.data.projects.data.map((project: any) => {
    const { title, summary, image, status, team, update } = project.attributes;

    const formattedUpdates = update.map((u: any) => {
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

    formattedNews.push(...formattedUpdates);
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
    news: formattedNews,
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
    update,
    question,
  } = project.attributes;

  const formattedUpdates = update.map((u: any) => {
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

  const formattedQuestion = question.map((q: any) => {
    return {
      ...q,
      author: q.author.map((a: any) => {
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
      description: formattedDescription,
      author: formattedAuthor,
      team: formattedTeam,
      question: formattedQuestion,
      image: `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${image.data.attributes.url}`,
      updates: formattedUpdates,
    },
  };
}
