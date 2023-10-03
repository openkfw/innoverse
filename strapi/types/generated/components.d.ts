import type { Schema, Attribute } from '@strapi/strapi';

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

export interface SliderTextSliderText extends Schema.Component {
  collectionName: 'components_slider_text_slider_texts';
  info: {
    displayName: 'Slider-Text';
  };
  attributes: {
    Title: Attribute.String;
    Description: Attribute.RichText;
    Tags: Attribute.JSON;
  };
}

declare module '@strapi/strapi' {
  export module Shared {
    export interface Components {
      'image.image': ImageImage;
      'slider-text.slider-text': SliderTextSliderText;
    }
  }
}
