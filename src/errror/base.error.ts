export class BaseError extends Error {
    public statusCode!: number;
    public data!: string
    constructor(error: string) {
      super(error);
    }
  }