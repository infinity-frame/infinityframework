/** Internal exceptions */
export class RepositoryException extends Error {
  constructor(public readonly originalError: any, msg?: string) {
    super();
  }
}

/** Business logic exceptions */
export class ConflictException extends Error {
  constructor(msg?: string) {
    super(msg);
  }
}

export class NotFoundException extends Error {
  constructor(msg?: string) {
    super(msg);
  }
}

export class AuthenticationException extends Error {
  constructor(msg?: string) {
    super(msg);
  }
}

export class ValidationException extends Error {
  constructor(public readonly issues: Array<any>, msg?: string) {
    super(msg);
  }
}
