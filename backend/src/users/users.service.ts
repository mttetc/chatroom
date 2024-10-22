import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

export interface User {
  id: string;
  name: string;
  password?: string;
}

@Injectable()
export class UsersService {
  private users: Map<string, User> = new Map();
  private anonymousUsers: Map<string, User> = new Map();

  async findOne(name: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.name === name);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.get(id) || this.anonymousUsers.get(id);
  }

  async create(
    name: string,
    password: string
  ): Promise<Omit<User, 'password'>> {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id,
      name,
      password: hashedPassword,
    };
    this.users.set(id, newUser);
    const { password: _, ...result } = newUser;
    return result;
  }

  createAnonymous(id?: string): Omit<User, 'password'> {
    if (id && this.anonymousUsers.has(id)) {
      return this.anonymousUsers.get(id)!;
    }
    const newId = id || uuidv4();
    const anonymousName = `Anonymous-${newId.slice(0, 8)}`;
    const anonymousUser: User = { id: newId, name: anonymousName };
    this.anonymousUsers.set(newId, anonymousUser);
    return anonymousUser;
  }

  getAllUsers(): Omit<User, 'password'>[] {
    const regularUsers = Array.from(this.users.values()).map(
      ({ password, ...user }) => user
    );
    const anonymousUsers = Array.from(this.anonymousUsers.values());
    return [...regularUsers, ...anonymousUsers];
  }

  removeUser(id: string): void {
    this.users.delete(id);
    this.anonymousUsers.delete(id);
  }

  clearInactiveAnonymousUsers(activeIds: string[]): void {
    for (const [id, user] of this.anonymousUsers.entries()) {
      if (!activeIds.includes(id)) {
        this.anonymousUsers.delete(id);
      }
    }
  }
}
