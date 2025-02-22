export interface HashSuite {
  /** Hashes the incoming input. */
  hash(inp: string): Promise<string>;
  /** Compares the two hashes. */
  compare(plainText: string, hash: string): Promise<boolean>;
}
