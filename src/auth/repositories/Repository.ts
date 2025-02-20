export interface TokenSuite {
  generateToken(payload?: object): string;
}

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

export enum RepositoryErrorCodes {
  NOT_FOUND,
  ALREADY_EXISTS,
  /** In case of update or delete operation didn't receive enough parameters. */
  NO_PARAMS,
  /** In case mapping of a particular technology (like MongoDB ObjectIds) didn't work properly. */
  MAP,
  INTERNAL,
}

export class RepositoryError extends Error {
  constructor(
    public readonly code: RepositoryErrorCodes,
    public readonly originalError?: any
  ) {
    super();
  }
}
