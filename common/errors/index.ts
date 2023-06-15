export class IncorrectObjectError extends Error {
  constructor() {
    super("Object is incorrect.");
  }
}

export class GenericError extends Error {
  constructor() {
    super("An unknown issue has occured.");
  }
}

export class ObjectNotFoundError extends Error {
  constructor() {
    super("No such object exists.");
  }
}
