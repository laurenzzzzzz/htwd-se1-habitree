export interface IAuthApiRepository {
  login(email: string, password: string): Promise<{ token: string; user: any }>;
  register(username: string, email: string, password: string): Promise<{ token: string; user: any }>;
}

export default IAuthApiRepository;
