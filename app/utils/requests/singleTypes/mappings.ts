import { ResultOf, TadaDocumentNode } from 'gql.tada';

type obj = ResultOf<TadaDocumentNode>;
export type SingleType<T extends obj> = { id: string; attributes: T };
export type SingleTypeWithLocalizations<T extends obj, R extends { id: string; attributes: T }> =
  | R
  | (R & {
      attributes: { localizations: { data: SingleType<T>[] } };
    });

export type MappedSingleType<T extends obj> = Pick<SingleType<T>, 'id'> & SingleType<T>['attributes'];

export const mapSingleTypeWithLocalesToCollection = <T extends obj, R extends { id: string; attributes: T }>({
  id,
  attributes,
}: SingleTypeWithLocalizations<T, R>): MappedSingleType<T>[] => {
  if ('localizations' in attributes) {
    const { localizations, ...rest } = attributes;
    const children = localizations?.data.flatMap(mapSingleTypeWithLocalesToCollection) ?? [];
    return [{ id, ...rest }, ...children];
  } else {
    return [{ id, ...attributes }];
  }
};

export const groupByLocale = <T extends { locale: string | null }>(collection: T[]): Record<string, T> => {
  return collection.reduce(
    (aggregate, entry) => (entry.locale ? { ...aggregate, [entry.locale]: entry } : aggregate),
    {},
  );
};

type ImageAttribute = {
  data: {
    attributes: {
      url: string;
    };
  } | null;
} | null;

export const unwrapImageAttributes = <T extends obj, R extends keyof MappedSingleType<T>>(
  attributes: MappedSingleType<T> & Record<R, ImageAttribute>,
  keys: R[],
): Omit<MappedSingleType<T>, R> & Record<R, string> => {
  return keys.reduce((acc, key) => {
    const { url } = attributes[key].data.attributes;
    return { ...acc, [key]: url };
  }, attributes);
};
