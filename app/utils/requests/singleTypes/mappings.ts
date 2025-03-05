import { ResultOf, TadaDocumentNode } from 'gql.tada';

type obj = ResultOf<TadaDocumentNode>;
export type SingleType<T> = { documentId: string } & T;
export type SingleTypeWithLocalizations<T extends obj> = SingleType<T> & { localizations?: (SingleType<T> | null)[] };

export const mapSingleTypeWithLocalesToCollection = <T extends obj>(
  attributes: SingleTypeWithLocalizations<T> | null,
): SingleType<T>[] => {
  if (!attributes) return [];
  const children = attributes.localizations?.flatMap(mapSingleTypeWithLocalesToCollection) ?? [];
  delete attributes.localizations;
  return [attributes, ...children];
};

export const groupByLocale = <T extends { locale: string | null }>(collection: T[]): Record<string, T> => {
  return collection.reduce(
    (aggregate, entry) => (entry.locale ? { ...aggregate, [entry.locale]: entry } : aggregate),
    {},
  );
};
