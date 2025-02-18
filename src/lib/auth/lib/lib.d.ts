export interface HashSuite {
  /** Hashes the incoming input. */
  hash(inp: string): string;
  /** Compares the two hashes. */
  compare(plainText: string, hash: string): boolean;
}

export interface TokenSuite {
  generateToken(payload?: object): string;
}

export interface Repository<DTO, CreateDTO, UpdateDTO, FilterOptions> {
  /** Creates and returns the created object. */
  create(inp: CreateDTO): Promise<DTO>;
  /** Finds all objects matching the filter. */
  find(filter?: FilterOptions): Promise<DTO[]>;
  /** Updates all objects meeting the filter. */
  update(filter: FilterOptions, inp: CreateDTO): Promise<DTO>;
  /** Deletes all object matching the filter and returns the deleted count. */
  delete(filter: FilterOptions): Promise<number>;
}
