import { hashPassword, verifyPassword } from '../../src/lib/password';

describe('Password Utilities (Unit Tests)', () => {
  const plainPassword = 'SafePassword123!';

  test('hashPassword produces a valid bcrypt hash', async () => {
    const hash = await hashPassword(plainPassword);
    expect(hash).not.toBe(plainPassword);
  });

  test('verifyPassword returns true for a correct password', async () => {
    const hash = await hashPassword(plainPassword);
    // Updated to match your function: verifyPassword(hash, plainPassword)
    const isValid = await verifyPassword(hash, plainPassword); 
    expect(isValid).toBe(true);
  });

  test('verifyPassword returns false for a wrong password', async () => {
    const hash = await hashPassword(plainPassword);
    // Updated to match your function: verifyPassword(hash, wrongPassword)
    const isInvalid = await verifyPassword(hash, 'WrongPass!');
    expect(isInvalid).toBe(false);
  });

  test('verifyPassword returns false for an empty or malformed hash', async () => {
    // Updated to match your function: verifyPassword(invalidHash, plainPassword)
    const isInvalid = await verifyPassword('invalid-hash-string', plainPassword);
    const isValidEmpty = await verifyPassword('', plainPassword);
    
    expect(isInvalid).toBe(false);
    expect(isValidEmpty).toBe(false);
  });
});