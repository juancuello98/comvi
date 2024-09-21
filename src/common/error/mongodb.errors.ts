export class MongoDuplicateKeyError extends Error {
    constructor(message: string) {
        super(message);
    }
    static isMongodbError(err: any): MongoDuplicateKeyError | Error {
        if (err.code === 11000) {
          return new MongoDuplicateKeyError('Duplicate key error.');
        }
        return err;
      }
}