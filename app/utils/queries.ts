export enum STRAPI_QUERY {
  StaticBuildGetFeaturedSliderItemsQuery,
  StaticBuildGetProjectIds,
  StaticBuildFetchProjectIds,
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

export const withResponseTransformer = (query: STRAPI_QUERY, data: unknown) => {
  switch (query) {
    case STRAPI_QUERY.StaticBuildGetFeaturedSliderItemsQuery:
      return getStaticBuildFetchProjectIds(data);
    case STRAPI_QUERY.StaticBuildFetchProjectIds:
      return getStaticBuildFetchProjectIds(data);
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
