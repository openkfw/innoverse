import getLogger from '@/utils/logger';
import { CollaborationQuestionLifecycle } from '@/utils/strapiEvents/entityLifecycles/collaborationQuestionLifecycle';
import { EventLifecycle } from '@/utils/strapiEvents/entityLifecycles/eventLifecycle';
import { OpportunityLifecycle } from '@/utils/strapiEvents/entityLifecycles/opportunityLifecycle';
import { ProjectLifecycle } from '@/utils/strapiEvents/entityLifecycles/projectLifecycle';
import { StrapiEntityLifecycle, StrapiEntry } from '@/utils/strapiEvents/entityLifecycles/strapiEntityLifecycle';
import { SurveyQuestionLifecycle } from '@/utils/strapiEvents/entityLifecycles/surveyQuestionLifecycle';
import { UpdateLifecycle } from '@/utils/strapiEvents/entityLifecycles/updateLifecycle';

const logger = getLogger();

type StrapiEvent = 'entry.create' | 'entry.update' | 'entry.delete' | 'entry.publish' | 'entry.unpublish';

export enum StrapiModel {
  UPDATE = 'update',
  EVENT = 'event',
  PROJECT = 'project',
  SURVEY_QUESTION = 'survey-question',
  OPPORTUNITY = 'opportunity',
  COLLABORATION_QUESTION = 'collaboration-question',
}

const entityLifecyclesByModelName: {
  [model: string]: StrapiEntityLifecycle;
} = {
  [StrapiModel.PROJECT]: new ProjectLifecycle(StrapiModel.PROJECT),
  [StrapiModel.OPPORTUNITY]: new OpportunityLifecycle(StrapiModel.OPPORTUNITY),
  [StrapiModel.SURVEY_QUESTION]: new SurveyQuestionLifecycle(StrapiModel.SURVEY_QUESTION),
  [StrapiModel.COLLABORATION_QUESTION]: new CollaborationQuestionLifecycle(StrapiModel.COLLABORATION_QUESTION),
  [StrapiModel.EVENT]: new EventLifecycle(StrapiModel.EVENT),
  [StrapiModel.UPDATE]: new UpdateLifecycle(StrapiModel.UPDATE),
};

export const onStrapiEvent = async (event: StrapiEvent, model: string, entry: StrapiEntry) => {
  if (!entityLifecyclesByModelName[model]) {
    logger.warn(`Received unhandled strapi event: Event=${event} Model=${model} EntryId=${entry.id}`);
    return Promise.resolve();
  }

  const entityLifecycle = entityLifecyclesByModelName[model];

  switch (event) {
    case 'entry.create':
      await entityLifecycle.onCreate(entry);
      return;
    case 'entry.update':
      await entityLifecycle.onUpdate(entry);
      return;
    case 'entry.delete':
      await entityLifecycle.onDelete(entry);
      return;
    case 'entry.publish':
      await entityLifecycle.onPublish(entry);
      return;
    case 'entry.unpublish':
      await entityLifecycle.onUnpublish(entry);
      return;
  }
};
