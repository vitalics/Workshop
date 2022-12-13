// filename: app1/pages/login.ts
export type User = {
  username: string;
  password: string;
}

export class Login {
  async login(user: User) {
    console.log('APP1. LoginPage. USER:', user);
  }
}
