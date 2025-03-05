import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import {
  GetEmailBaseTemplatesQuery,
  GetEmailBaseTemplateByLocaleQuery,
  GetWeeklyEmailTemplatesQuery,
  GetWeeklyEmailTemplateByLocaleQuery,
} from './queries';
import { mapSingleTypeWithLocalesToCollection, unwrapImageAttributes } from './mappings';

export async function getEmailBaseTemplates() {
  try {
    const { emailBaseTemplate } = await strapiGraphQLFetcher(GetEmailBaseTemplatesQuery);
    if (!emailBaseTemplate?.data) return [];

    return mapSingleTypeWithLocalesToCollection(emailBaseTemplate.data).map((e) =>
      unwrapImageAttributes(e, ['headerLogo', 'footerSmallLogo']),
    );
  } catch (err) {
    console.info(err);
    return [];
  }
}

export async function getEmailBaseTemplate(locale: string) {
  try {
    const { emailBaseTemplate } = await strapiGraphQLFetcher(GetEmailBaseTemplateByLocaleQuery, { locale });
    if (!emailBaseTemplate?.data) return [];

    const { id, attributes } = emailBaseTemplate.data;
    return unwrapImageAttributes({ id, ...attributes }, ['headerLogo', 'footerSmallLogo']);
  } catch (err) {
    console.info(err);
    return [];
  }
}

export async function getWeeklyEmailTemplates() {
  try {
    const { weeklyEmailTemplate } = await strapiGraphQLFetcher(GetWeeklyEmailTemplatesQuery);
    if (!weeklyEmailTemplate?.data) return [];

    return mapSingleTypeWithLocalesToCollection(weeklyEmailTemplate.data).map((e) =>
      unwrapImageAttributes(e, ['headerImage']),
    );
  } catch (err) {
    console.info(err);
    return [];
  }
}

export async function getWeeklyEmailTemplate(locale: string) {
  try {
    const { weeklyEmailTemplate } = await strapiGraphQLFetcher(GetWeeklyEmailTemplateByLocaleQuery, { locale });
    if (!weeklyEmailTemplate?.data) return [];

    const { id, attributes } = weeklyEmailTemplate.data;
    return unwrapImageAttributes({ id, ...attributes }, ['headerImage']);
  } catch (err) {
    console.info(err);
    return [];
  }
}
