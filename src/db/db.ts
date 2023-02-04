import { User } from 'src/users/entities/user.entity';

class Store {
  users: User[];

  constructor() {
    this.users = [];
  }
}

export const store = new Store();
