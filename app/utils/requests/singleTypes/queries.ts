import { graphql } from '@/types/graphql';

const EmailBaseTemplateFragment = graphql(`
  fragment EmailBaseTemplate on EmailBaseTemplateEntity @_unmask {
    id
    attributes {
      footerActivityNote
      footerContactUs
      footerPrivacy
      footerAddress
      footerUnsubscribe
      footerEmailSettings
      footerSmallLogo {
        data {
          attributes {
            url
            formats
          }
        }
      }
      headerLogo {
        data {
          attributes {
            url
            formats
          }
        }
      }
      locale
    }
  }
`);

const EmailBaseTemplateWithLocalizationsFragment = graphql(
  `
    fragment EmailBaseTemplateWithLocalizations on EmailBaseTemplateEntity @_unmask {
      ...EmailBaseTemplate
      attributes {
        localizations {
          data {
            ...EmailBaseTemplate
          }
        }
      }
    }
  `,
  [EmailBaseTemplateFragment],
);

export const GetEmailBaseTemplatesQuery = graphql(
  `
    query GetAllEmailBaseTemplates {
      emailBaseTemplate {
        data {
          ...EmailBaseTemplateWithLocalizations
        }
      }
    }
  `,
  [EmailBaseTemplateWithLocalizationsFragment],
);

export const GetEmailBaseTemplateByLocaleQuery = graphql(
  `
    query GetEmailBaseTemplate($locale: I18NLocaleCode) {
      emailBaseTemplate(locale: $locale) {
        data {
          ...EmailBaseTemplate
        }
      }
    }
  `,
  [EmailBaseTemplateFragment],
);

const WeeklyEmailTemplateFragment = graphql(`
  fragment WeeklyEmailTemplate on WeeklyEmailTemplateEntity @_unmask {
    id
    attributes {
      subject
      preview
      headerTitle
      headerSubtitle
      headerImage {
        data {
          attributes {
            url
            formats
          }
        }
      }
      locale
    }
  }
`);

const WeeklyEmailTemplateWithLocalizationsFragment = graphql(
  `
    fragment WeeklyEmailTemplateWithLocalizations on WeeklyEmailTemplateEntity @_unmask {
      ...WeeklyEmailTemplate
      attributes {
        localizations {
          data {
            ...WeeklyEmailTemplate
          }
        }
      }
    }
  `,
  [WeeklyEmailTemplateFragment],
);

export const GetWeeklyEmailTemplatesQuery = graphql(
  `
    query GetAllWeeklyEmailTemplates {
      weeklyEmailTemplate {
        data {
          ...WeeklyEmailTemplateWithLocalizations
        }
      }
    }
  `,
  [WeeklyEmailTemplateWithLocalizationsFragment],
);

export const GetWeeklyEmailTemplateByLocaleQuery = graphql(
  `
    query GetWeeklyEmailTemplate($locale: I18NLocaleCode) {
      weeklyEmailTemplate(locale: $locale) {
        data {
          ...WeeklyEmailTemplate
        }
      }
    }
  `,
  [WeeklyEmailTemplateFragment],
);
