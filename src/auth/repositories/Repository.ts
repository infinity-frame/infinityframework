export interface Repository<TModel, TCreate, TUpdate, TFilter> {
  /** Creates and returns the created object. */
  create(inp: TCreate): Promise<TModel>;
  /** Finds all objects matching the filter. */
  find(filter?: TFilter): Promise<TModel[]>;
  /** Updates all objects meeting the filter and returns the updated (matched) count. */
  update(filter: TFilter, inp: TUpdate): Promise<number>;
  /** Deletes all object matching the filter and returns the deleted count. */
  delete(filter: TFilter): Promise<number>;
}
