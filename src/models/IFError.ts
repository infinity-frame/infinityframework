interface Meta {
  issuer: string;
  timestamp: string;
}

export class IFError {
  error: Error;
  meta: Meta;

  constructor(options: {
    error?: Error | undefined;
    message?: string;
    issuer?: string;
  }) {
    this.error = options.error || new Error(options.message);
    this.meta = {
      issuer: options.issuer ?? "GENERIC",
      timestamp: new Date().toISOString(),
    };
  }
}
