import { GenericError } from "@common/errors";

export function makeGetResourceResponse(resource: any) {
  return {
    statusCode: 200,
    body: JSON.stringify(resource),
  };
}

export function makeResourceCreatedAsyncResponse(resourceId: string) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: {
        id: resourceId,
      },
    }),
  };
}

export function makeNotFoundResponse() {
  return {
    statusCode: 404,
    body: JSON.stringify({
      message: "Not found",
    }),
  };
}

export function makeCreatedResponse() {
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "ok",
    }),
  };
}

export function makeNoContentSuccessResponse() {
  return {
    statusCode: 204,
    body: JSON.stringify({
      message: "ok",
    }),
  };
}

export function makeGenericErrorResponse() {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: new GenericError().message,
    }),
  };
}

export function makeBadRequestResponse() {
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Bad request",
    }),
  };
}
