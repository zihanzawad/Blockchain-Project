const { validateUser } = require(".");

test('test if user exists in database', () => {
    expect(validateUser('emaildoesntexist@test.com','password')).toBe(false);
});