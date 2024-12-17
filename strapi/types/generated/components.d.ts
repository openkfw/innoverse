import type { Schema, Struct } from '@strapi/strapi';

export interface DescriptionDescription extends Struct.ComponentSchema {
  collectionName: 'components_description_descriptions';
  info: {
    description: '';
    displayName: 'Description';
  };
  attributes: {
    tags: Schema.Attribute.Component<'tags.tags', true> &
      Schema.Attribute.Required;
    text: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface ImageImage extends Struct.ComponentSchema {
  collectionName: 'components_image_images';
  info: {
    description: '';
    displayName: 'Slider-Image';
  };
  attributes: {
    projectFrom: Schema.Attribute.String;
    projectTo: Schema.Attribute.String;
    sliderImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    title: Schema.Attribute.String;
    year: Schema.Attribute.String;
  };
}

export interface ResponseOptionsResponseOptions extends Struct.ComponentSchema {
  collectionName: 'components_response_options_response_options';
  info: {
    description: '';
    displayName: 'responseOptions';
  };
  attributes: {
    responseOption: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SliderTextSliderText extends Struct.ComponentSchema {
  collectionName: 'components_slider_text_slider_texts';
  info: {
    description: '';
    displayName: 'Slider-Text';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    tags: Schema.Attribute.JSON;
    title: Schema.Attribute.String;
  };
}

export interface TagsTags extends Struct.ComponentSchema {
  collectionName: 'components_tags_tags';
  info: {
    description: '';
    displayName: 'tags';
  };
  attributes: {
    tag: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ThemeTheme extends Struct.ComponentSchema {
  collectionName: 'components_theme_themes';
  info: {
    displayName: 'Theme';
    icon: 'layer';
  };
  attributes: {
    theme: Schema.Attribute.String;
  };
}

export interface UserAuthor extends Struct.ComponentSchema {
  collectionName: 'components_user_authors';
  info: {
    description: '';
    displayName: 'user';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    department: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    role: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
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
