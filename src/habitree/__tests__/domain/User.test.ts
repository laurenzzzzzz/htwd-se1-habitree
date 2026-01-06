import { User } from '../../domain/entities/User';

describe('User Entity', () => {
  describe('constructor', () => {
    it('should_create_user_with_valid_data', () => {
      const userData = { id: 1, email: 'test@example.com', username: 'testuser' };
      const user = new User(userData);

      expect(user.id).toBe(1);
      expect(user.email).toBe('test@example.com');
      expect(user.username).toBe('testuser');
    });

    it('should_create_user_with_minimum_valid_username', () => {
      const userData = { id: 1, email: 'test@example.com', username: 'abc' };
      const user = new User(userData);

      expect(user.username).toBe('abc');
      expect(user.hasValidUsername()).toBe(true);
    });

    it('should_create_user_with_maximum_valid_username', () => {
      const userData = { id: 1, email: 'test@example.com', username: 'a'.repeat(50) };
      const user = new User(userData);

      expect(user.username.length).toBe(50);
      expect(user.hasValidUsername()).toBe(true);
    });
  });

  describe('isValidEmail', () => {
    it('should_return_true_when_email_is_valid', () => {
      const user = new User({ id: 1, email: 'valid@example.com', username: 'testuser' });
      expect(user.isValidEmail()).toBe(true);
    });

    it('should_return_true_for_email_with_subdomain', () => {
      const user = new User({ id: 1, email: 'user@mail.example.com', username: 'testuser' });
      expect(user.isValidEmail()).toBe(true);
    });

    it('should_return_true_for_email_with_plus_sign', () => {
      const user = new User({ id: 1, email: 'user+tag@example.com', username: 'testuser' });
      expect(user.isValidEmail()).toBe(true);
    });

    it('should_return_false_when_email_has_no_at_sign', () => {
      const user = new User({ id: 1, email: 'invalidemail.com', username: 'testuser' });
      expect(user.isValidEmail()).toBe(false);
    });

    it('should_return_false_when_email_has_no_domain', () => {
      const user = new User({ id: 1, email: 'user@', username: 'testuser' });
      expect(user.isValidEmail()).toBe(false);
    });

    it('should_return_false_when_email_has_no_tld', () => {
      const user = new User({ id: 1, email: 'user@example', username: 'testuser' });
      expect(user.isValidEmail()).toBe(false);
    });

    it('should_return_false_when_email_has_spaces', () => {
      const user = new User({ id: 1, email: 'user @example.com', username: 'testuser' });
      expect(user.isValidEmail()).toBe(false);
    });

    it('should_return_false_when_email_is_empty', () => {
      const user = new User({ id: 1, email: '', username: 'testuser' });
      expect(user.isValidEmail()).toBe(false);
    });
  });

  describe('hasValidUsername', () => {
    it('should_return_true_when_username_has_minimum_length', () => {
      const user = new User({ id: 1, email: 'test@example.com', username: 'abc' });
      expect(user.hasValidUsername()).toBe(true);
    });

    it('should_return_true_when_username_has_maximum_length', () => {
      const user = new User({ id: 1, email: 'test@example.com', username: 'a'.repeat(50) });
      expect(user.hasValidUsername()).toBe(true);
    });

    it('should_return_true_when_username_is_within_valid_range', () => {
      const user = new User({ id: 1, email: 'test@example.com', username: 'validuser123' });
      expect(user.hasValidUsername()).toBe(true);
    });

    it('should_return_false_when_username_is_too_short', () => {
      const user = new User({ id: 1, email: 'test@example.com', username: 'ab' });
      expect(user.hasValidUsername()).toBe(false);
    });

    it('should_return_false_when_username_is_too_long', () => {
      const user = new User({ id: 1, email: 'test@example.com', username: 'a'.repeat(51) });
      expect(user.hasValidUsername()).toBe(false);
    });

    it('should_return_false_when_username_is_empty', () => {
      const user = new User({ id: 1, email: 'test@example.com', username: '' });
      expect(user.hasValidUsername()).toBe(false);
    });
  });

  describe('getDisplayName', () => {
    it('should_return_username_when_username_exists', () => {
      const user = new User({ id: 1, email: 'test@example.com', username: 'testuser' });
      expect(user.getDisplayName()).toBe('testuser');
    });

    it('should_return_email_prefix_when_username_is_empty', () => {
      const user = new User({ id: 1, email: 'john.doe@example.com', username: '' });
      expect(user.getDisplayName()).toBe('john.doe');
    });

    it('should_return_username_when_both_username_and_email_exist', () => {
      const user = new User({ id: 1, email: 'different@example.com', username: 'preferredname' });
      expect(user.getDisplayName()).toBe('preferredname');
    });
  });
});
