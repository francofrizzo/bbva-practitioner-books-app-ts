import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Cheese, CheeseRelations} from '../models';

export class CheeseRepository extends DefaultCrudRepository<
  Cheese,
  typeof Cheese.prototype.id,
  CheeseRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Cheese, dataSource);
  }
}
