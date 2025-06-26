import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import {
  GetEmailBaseTemplatesQuery,
  GetEmailBaseTemplateByLocaleQuery,
  GetWeeklyEmailTemplatesQuery,
  GetWeeklyEmailTemplateByLocaleQuery,
} from './queries';
import { mapSingleTypeWithLocalesToCollection } from './mappings';
import getLogger from '@/utils/logger';

const logger = getLogger();

export async function getEmailBaseTemplates() {
  try {
    const { emailBaseTemplate } = await strapiGraphQLFetcher(GetEmailBaseTemplatesQuery);
    return mapSingleTypeWithLocalesToCollection(emailBaseTemplate);
  } catch (err) {
    logger.info(err);
    return [];
  }
}

export async function getEmailBaseTemplate(locale: string) {
  try {
    const { emailBaseTemplate } = await strapiGraphQLFetcher(GetEmailBaseTemplateByLocaleQuery, { locale });
    return emailBaseTemplate;
  } catch (err) {
    logger.info(err);
    return [];
  }
}

export async function getWeeklyEmailTemplates() {
  try {
    const { weeklyEmailTemplate } = await strapiGraphQLFetcher(GetWeeklyEmailTemplatesQuery);
    return mapSingleTypeWithLocalesToCollection(weeklyEmailTemplate);
  } catch (err) {
    logger.info(err);
    return [];
  }
}

export async function getWeeklyEmailTemplate(locale: string) {
  try {
    const { weeklyEmailTemplate } = await strapiGraphQLFetcher(GetWeeklyEmailTemplateByLocaleQuery, { locale });
    return weeklyEmailTemplate;
  } catch (err) {
    logger.info(err);
    return [];
  }
}
