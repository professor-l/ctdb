export default class DataError extends Error {
  constructor(description: string) {
    super(description);
    this.name = "DataError";
  }
}