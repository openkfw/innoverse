import type { Schema, Attribute } from '@strapi/strapi';

export interface UserAuthor extends Schema.Component {
  collectionName: 'components_user_authors';
  info: {
    displayName: 'user';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    role: Attribute.String & Attribute.Required;
    avatar: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    department: Attribute.String;
  };
}

export interface ThemeTheme extends Schema.Component {
  collectionName: 'components_theme_themes';
  info: {
    displayName: 'Theme';
    icon: 'layer';
  };
  attributes: {
    theme: Attribute.String;
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

export interface ImageImage extends Schema.Component {
  collectionName: 'components_image_images';
  info: {
    displayName: 'Slider-Image';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    sliderImage: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    projectFrom: Attribute.String;
    projectTo: Attribute.String;
    year: Attribute.String;
  };
}

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

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'user.author': UserAuthor;
      'theme.theme': ThemeTheme;
      'tags.tags': TagsTags;
      'slider-text.slider-text': SliderTextSliderText;
      'response-options.response-options': ResponseOptionsResponseOptions;
      'image.image': ImageImage;
      'description.description': DescriptionDescription;
    }
  }
}
