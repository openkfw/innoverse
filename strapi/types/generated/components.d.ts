import type { Attribute, Schema } from '@strapi/strapi';

export interface DescriptionDescription extends Schema.Component {
  collectionName: 'components_description_descriptions';
  info: {
    description: '';
    displayName: 'Description';
  };
  attributes: {
    tags: Attribute.Component<'tags.tags', true> & Attribute.Required;
    text: Attribute.RichText & Attribute.Required;
  };
}

export interface ImageImage extends Schema.Component {
  collectionName: 'components_image_images';
  info: {
    description: '';
    displayName: 'Slider-Image';
  };
  attributes: {
    projectFrom: Attribute.String;
    projectTo: Attribute.String;
    sliderImage: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Attribute.String;
    year: Attribute.String;
  };
}

export interface ResponseOptionsResponseOptions extends Schema.Component {
  collectionName: 'components_response_options_response_options';
  info: {
    description: '';
    displayName: 'responseOptions';
  };
  attributes: {
    responseOption: Attribute.String & Attribute.Required;
  };
}

export interface SliderTextSliderText extends Schema.Component {
  collectionName: 'components_slider_text_slider_texts';
  info: {
    description: '';
    displayName: 'Slider-Text';
  };
  attributes: {
    description: Attribute.RichText;
    tags: Attribute.JSON;
    title: Attribute.String;
  };
}

export interface TagsTags extends Schema.Component {
  collectionName: 'components_tags_tags';
  info: {
    description: '';
    displayName: 'tags';
  };
  attributes: {
    tag: Attribute.String & Attribute.Required;
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

export interface UserAuthor extends Schema.Component {
  collectionName: 'components_user_authors';
  info: {
    description: '';
    displayName: 'user';
  };
  attributes: {
    avatar: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    department: Attribute.String;
    name: Attribute.String & Attribute.Required;
    role: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'description.description': DescriptionDescription;
      'image.image': ImageImage;
      'response-options.response-options': ResponseOptionsResponseOptions;
      'slider-text.slider-text': SliderTextSliderText;
      'tags.tags': TagsTags;
      'theme.theme': ThemeTheme;
      'user.author': UserAuthor;
    }
  }
}
