export enum STRAPI_QUERY {
  GetFeaturedSliderItems,
}

export const GetFeaturedSliderItemsQuery = `query GetFeaturedSliderItems {
  items {
    data {
      id,
      attributes {
        title,
        Text{
          Title,
          Description,
          Tags
        }
        Image{
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
    case STRAPI_QUERY.GetFeaturedSliderItems:
      return getFeaturedSliderItemsTransformer(data);
    default:
      break;
  }
};

function getFeaturedSliderItemsTransformer(graphqlResponse: any) {
  const formattedItems = graphqlResponse.data.items.data.map((item: any) => {
    const {
      title,
      Text: { Title, Description, Tags },
      Image: { sliderImage, projectTo, projectFrom, year },
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
        title: Title,
        tags: Tags.tags,
        description: Description,
      },
    };
  });

  return {
    items: formattedItems,
  };
}
