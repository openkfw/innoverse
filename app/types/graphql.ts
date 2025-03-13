import { initGraphQLTada } from 'gql.tada';

import type { introspection } from '@/types/strapi-graphql-env';

type StrapiTypes = introspection['types'];

type IsPartialSubset<T, U> = {
  [K in keyof T]: K extends keyof U ? (T[K] extends U[K] ? true : false) : false;
}[keyof T] extends false
  ? false
  : true;

type StrapiRequiredFieldType<R extends { name: string }> = {
  kind: 'NON_NULL';
  name: never;
  ofType: { kind: 'OBJECT'; name: R['name']; ofType: null };
};

type StrapiRequiredListFieldType<T extends { ofType: { kind: string; name: string; ofType: { name: string } } }> = {
  kind: 'NON_NULL';
  name: never;
  ofType: {
    kind: 'LIST';
    name: never;
    ofType: StrapiRequiredFieldType<T['ofType']['ofType']>;
  };
};

type NonNullableFieldsType = {
  [K in
    | 'team'
    | 'authors'
    | 'updates'
    | 'participants'
    | 'events'
    | 'innoUsers'
    | 'projects'
    | 'opportunities'
    | 'collaborationQuestions'
    | 'questions'
    | 'surveyQuestions']: {
    name: K;
    type: {
      kind: 'NON_NULL';
      name: never;
      ofType: {
        kind: 'LIST';
        name: never;
        ofType: { kind: 'OBJECT'; name: string; ofType: null };
      };
    };
  };
};

type StrapiEntityType = {
  kind: string;
  name: string;
  fields: NonNullableFieldsType;
};

type IntrospectionWithPatchedStrapiTypes = Omit<introspection, 'types'> & {
  types: {
    [K in keyof StrapiTypes]: StrapiTypes[K] extends { fields: unknown; kind: string; name: string }
      ? IsPartialSubset<StrapiTypes[K]['fields'], StrapiEntityType['fields']> extends true
        ? {
            kind: StrapiTypes[K]['kind'];
            name: StrapiTypes[K]['name'];
            fields: {
              [FieldName in keyof StrapiTypes[K]['fields']]: FieldName extends keyof StrapiEntityType['fields']
                ? {
                    name: FieldName;
                    type: StrapiRequiredListFieldType<
                      Extract<
                        StrapiTypes[K]['fields'][FieldName],
                        { type: { ofType: { kind: string; name: string; ofType: { name: string } } } }
                      >['type']
                    >;
                  }
                : StrapiTypes[K]['fields'][FieldName];
            };
          }
        : StrapiTypes[K]
      : StrapiTypes[K];
  };
};

export const graphql = initGraphQLTada<{
  introspection: IntrospectionWithPatchedStrapiTypes;
  scalars: {
    DateTime: Date | string;
    Date: Date;
  };
}>();
