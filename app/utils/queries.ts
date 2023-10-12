export enum STRAPI_QUERY {
  StaticBuildGetFeaturedSliderItemsQuery,
  StaticBuildGetProjectIds,
  StaticBuildFetchProjectIds,
  GetProjectsSummaryQuery,
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

export const withResponseTransformer = (query: STRAPI_QUERY, data: unknown) => {
  switch (query) {
    case STRAPI_QUERY.StaticBuildGetFeaturedSliderItemsQuery:
      return getStaticBuildFetchProjectIds(data);
    case STRAPI_QUERY.StaticBuildFetchProjectIds:
      return getStaticBuildFetchProjectIds(data);
    case STRAPI_QUERY.GetProjectsSummaryQuery:
      return getStaticBuildFetchProjectSummary(data);
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
