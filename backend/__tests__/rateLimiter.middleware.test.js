const { contentSpamGuard } = require('../src/middleware/rateLimiter');

describe('contentSpamGuard', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test('silently accepts when honeypot field is filled', () => {
    req.body = { website: 'http://spam.com', name: 'Bot', email: 'bot@bot.com', message: 'spam' };

    contentSpamGuard(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Thank you for your submission.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('silently accepts when form is filled too fast (under 3 seconds)', () => {
    req.body = { _formTs: String(Date.now() - 1000), name: 'Fast', email: 'f@f.com', message: 'fast' };

    contentSpamGuard(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Thank you for your submission.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next for legitimate first submission', () => {
    req.body = { name: 'Legit User ' + Date.now(), email: 'legit@test.com', message: 'Hello unique ' + Date.now() };

    contentSpamGuard(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('blocks duplicate content submission', () => {
    const body = { name: 'Dupe', email: 'dupe@test.com', message: 'exact same content for dedup test' };
    req.body = { ...body };

    // First call should pass
    contentSpamGuard(req, res, next);
    expect(next).toHaveBeenCalled();

    // Reset mocks
    next.mockClear();
    res.status.mockClear();
    res.json.mockClear();

    // Second call with same content should be blocked
    req.body = { ...body };
    contentSpamGuard(req, res, next);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(next).not.toHaveBeenCalled();
  });

  test('allows submission when _formTs shows enough time passed', () => {
    req.body = { _formTs: String(Date.now() - 5000), name: 'Slow user ' + Date.now(), email: 's@s.com', message: 'thoughtful msg ' + Date.now() };

    contentSpamGuard(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
