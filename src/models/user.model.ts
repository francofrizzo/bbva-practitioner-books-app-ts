import {Entity, hasOne, model, property} from '@loopback/repository';
import {UserCredentials} from './user-credentials.model';

@model({
  settings: {
    strict: false,
  },
})
export class User extends Entity {
  // must keep it
  @property({
    type: 'number',
    id: true,
    generated: false,
    updateOnly: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  realm?: string;

  // must keep it
  @property({
    type: 'string',
  })
  username?: string;

  // must keep it
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'boolean',
  })
  emailVerified?: boolean;

  @property({
    type: 'string',
  })
  verificationToken?: string;

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  // Define well-known properties here

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
