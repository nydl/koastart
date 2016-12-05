/**
 * Created by Yun on 2015-12-19.
 */

const MESSAGES = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  409: 'Conflict',
  500: 'Server Internal'
};

export default class ErrCode extends Error {
  constructor(code, message) {
    super(message || MESSAGES[code]);
    this.code = code;
  }
}