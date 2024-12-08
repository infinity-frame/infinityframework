/** More restrictive variantion of Semantic versioning, allowing only 3 version numerical values MAJOR.MINOR.PATCH. */
export class Version {
  /** Complete version number for displaying in X.X.X format. */
  public full: String;
  /** Major version numerical identifier. */
  public major: number;
  /** Minor version numerical identifier. */
  public minor: number;
  /** Patch version numerical identifier. */
  public patch: number;

  constructor(input: string) {
    const inputarr = input.split(".");
    if (inputarr.length !== 3) {
      throw new Error(
        `Invalid version - ${input}. Review docs for guidelines on restrictive semantic versioning.`
      );
    }

    this.major = parseInt(inputarr[0], 10);
    if (this.major < 0) {
      throw new Error(
        `Invalid version, negative version are not allowed - ${input}.`
      );
    }
    this.minor = parseInt(inputarr[0], 10);
    if (this.minor < 0) {
      throw new Error(
        `Invalid version, negative version are not allowed - ${input}.`
      );
    }
    this.patch = parseInt(inputarr[0], 10);
    if (this.patch < 0) {
      throw new Error(
        `Invalid version, negative version are not allowed - ${input}.`
      );
    }

    this.full = inputarr.join(".");
  }
}
