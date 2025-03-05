import { graphql } from '@/types/graphql';

const EmailBaseTemplateFragment = graphql(`
  fragment EmailBaseTemplate on EmailBaseTemplate @_unmask {
    documentId
    footerActivityNote
    footerContactUs
    footerPrivacy
    footerAddress
    footerUnsubscribe
    footerEmailSettings
    footerSmallLogo {
      url
      formats
    }
    headerLogo {
      url
      formats
    }
    locale
  }
`);

const EmailBaseTemplateWithLocalizationsFragment = graphql(
  `
    fragment EmailBaseTemplateWithLocalizations on EmailBaseTemplate @_unmask {
      ...EmailBaseTemplate
      localizations {
        ...EmailBaseTemplate
      }
    }
  `,
  [EmailBaseTemplateFragment],
);

export const GetEmailBaseTemplatesQuery = graphql(
  `
    query GetAllEmailBaseTemplates {
      emailBaseTemplate {
        ...EmailBaseTemplateWithLocalizations
      }
    }
  `,
  [EmailBaseTemplateWithLocalizationsFragment],
);

export const GetEmailBaseTemplateByLocaleQuery = graphql(
  `
    query GetEmailBaseTemplate($locale: I18NLocaleCode) {
      emailBaseTemplate(locale: $locale) {
        ...EmailBaseTemplate
      }
    }
  `,
  [EmailBaseTemplateFragment],
);

const WeeklyEmailTemplateFragment = graphql(`
  fragment WeeklyEmailTemplate on WeeklyEmailTemplate @_unmask {
    documentId
    subject
    preview
    headerTitle
    headerSubtitle
    headerImage {
      url
      formats
    }
    locale
  }
`);

const WeeklyEmailTemplateWithLocalizationsFragment = graphql(
  `
    fragment WeeklyEmailTemplateWithLocalizations on WeeklyEmailTemplate @_unmask {
      ...WeeklyEmailTemplate
      localizations {
        ...WeeklyEmailTemplate
      }
    }
  `,
  [WeeklyEmailTemplateFragment],
);

export const GetWeeklyEmailTemplatesQuery = graphql(
  `
    query GetAllWeeklyEmailTemplates {
      weeklyEmailTemplate {
        ...WeeklyEmailTemplateWithLocalizations
      }
    }
  `,
  [WeeklyEmailTemplateWithLocalizationsFragment],
);

export const GetWeeklyEmailTemplateByLocaleQuery = graphql(
  `
    query GetWeeklyEmailTemplate($locale: I18NLocaleCode) {
      weeklyEmailTemplate(locale: $locale) {
        ...WeeklyEmailTemplate
      }
    }
  `,
  [WeeklyEmailTemplateFragment],
);
