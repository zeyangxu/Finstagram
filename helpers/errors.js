class InvalidSessionError extends Error {
  constructor(sessionID, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidSessionError);
    }

    this.name = 'InvalidSessionError';
    // Custom debugging information
    this.sessionID = sessionID;
    this.date = new Date();
  }
}
exports.InvalidSessionError = InvalidSessionError;
class TagUserVisibilityError extends Error {
  constructor(username, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TagUserVisibilityError);
    }

    this.name = 'TagUserVisibilityError';
    // Custom debugging information
    this.username = username;
    this.date = new Date();
  }
}
exports.TagUserVisibilityError = TagUserVisibilityError;
