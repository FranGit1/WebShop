export class User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: number;

  constructor() {
    this.id = '';
    this.username = '';
    this.password = '';
    this.name = '';
    this.email = '';
    this.role = 0;
  }
}
