import { HTTP_STATUS_CODE } from "../../utils/http-status-codes.js"; 

export function resSuccess(message, status, statusCode, data) {
  return {
    status,
    response: message,
    status_code: statusCode || HTTP_STATUS_CODE.OK,
    data: data,
  };
}

export function resError(message, status, statusCode) {
  return {
    status,
    response: message,
    status_code: statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
    data: null,
  };
}
