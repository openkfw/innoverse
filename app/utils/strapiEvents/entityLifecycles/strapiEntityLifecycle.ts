import { StrapiModel } from '../strapiEventHandler';

export interface StrapiEntry {
  id: string | number;
}

export class StrapiEntityLifecycle {
  model: StrapiModel;

  constructor(model: StrapiModel) {
    this.model = model;
  }
  public onCreate(_: StrapiEntry): Promise<void> {
    return Promise.resolve();
  }

  public onUpdate(_: StrapiEntry): Promise<void> {
    return Promise.resolve();
  }

  public onDelete(_: StrapiEntry): Promise<void> {
    return Promise.resolve();
  }

  public onPublish(_: StrapiEntry): Promise<void> {
    return Promise.resolve();
  }

  public onUnpublish(_: StrapiEntry): Promise<void> {
    return Promise.resolve();
  }

  public getRedisKey(id: string): string {
    return `${this.model}:${id}`;
  }
}
