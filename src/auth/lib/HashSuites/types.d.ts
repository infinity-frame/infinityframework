export interface HashSuite {
  /** Hashes the incoming input. */
  hash(inp: string): string;
  /** Compares the two hashes. */
  compare(plainText: string, hash: string): boolean;
}
