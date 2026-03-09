const validate = require('../src/middleware/validation');
const { validationResult } = require('express-validator');

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test('calls next when there are no errors', () => {
    validationResult.mockReturnValue({ isEmpty: () => true });

    validate(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('returns 400 with errors when validation fails', () => {
    const errors = [{ msg: 'Email is required', path: 'email' }];
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => errors,
    });

    validate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: errors,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
