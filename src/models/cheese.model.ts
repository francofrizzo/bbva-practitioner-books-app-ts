import {User} from '@loopback/authentication-jwt';
import {belongsTo, Entity, model, property} from '@loopback/repository';

@model()
export class Cheese extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  age: number;

  @property({
    type: 'string',
    required: true,
  })
  hardness: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @belongsTo(() => User, undefined, {hidden: true})
  userId: number;

  constructor(data?: Partial<Cheese>) {
    super(data);
  }
}

export interface CheeseRelations {
  // describe navigational properties here
}

export type CheeseWithRelations = Cheese & CheeseRelations;
