export type UserData = {
  id: number;
  email: string;
  username: string;
};

/**
 * User Domain Entity
 * Encapsulates user identity and business rules
 */
export class User {
  readonly id: number;
  readonly email: string;
  readonly username: string;

  constructor(data: UserData) {
    this.id = data.id;
    this.email = data.email;
    this.username = data.username;
  }

  /**
   * Validates email format
   */
  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  /**
   * Checks if username meets minimum requirements
   */
  hasValidUsername(): boolean {
    return this.username.length >= 3 && this.username.length <= 50;
  }

  /**
   * Returns display name (username or email if unavailable)
   */
  getDisplayName(): string {
    return this.username || this.email.split('@')[0];
  }
}

export default User;
