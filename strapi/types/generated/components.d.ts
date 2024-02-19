import type { Schema, Attribute } from '@strapi/strapi';

export interface DescriptionDescription extends Schema.Component {
  collectionName: 'components_description_descriptions';
  info: {
    displayName: 'Description';
    description: '';
  };
  attributes: {
    text: Attribute.RichText & Attribute.Required;
    tags: Attribute.Component<'tags.tags', true> & Attribute.Required;
  };
}

export interface ImageImage extends Schema.Component {
  collectionName: 'components_image_images';
  info: {
    displayName: 'Slider-Image';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    sliderImage: Attribute.Media;
    projectFrom: Attribute.String;
    projectTo: Attribute.String;
    year: Attribute.String;
  };
}

export interface ResponseOptionsResponseOptions extends Schema.Component {
  collectionName: 'components_response_options_response_options';
  info: {
    displayName: 'responseOptions';
    description: '';
  };
  attributes: {
    responseOption: Attribute.String & Attribute.Required;
  };
}

export interface SliderTextSliderText extends Schema.Component {
  collectionName: 'components_slider_text_slider_texts';
  info: {
    displayName: 'Slider-Text';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.RichText;
    tags: Attribute.JSON;
  };
}

export interface TagsTags extends Schema.Component {
  collectionName: 'components_tags_tags';
  info: {
    displayName: 'tags';
    description: '';
  };
  attributes: {
    tag: Attribute.String & Attribute.Required;
  };
}

export interface UserAuthor extends Schema.Component {
  collectionName: 'components_user_authors';
  info: {
    displayName: 'user';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    role: Attribute.String & Attribute.Required;
    avatar: Attribute.Media;
    department: Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Shared {
    export interface Components {
      'description.description': DescriptionDescription;
      'image.image': ImageImage;
      'response-options.response-options': ResponseOptionsResponseOptions;
      'slider-text.slider-text': SliderTextSliderText;
      'tags.tags': TagsTags;
      'user.author': UserAuthor;
    }
  }
}
