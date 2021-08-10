import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings} from '@loopback/security';
import {Cheese, User} from '../models';
import {CheeseRepository} from '../repositories';

@authenticate('jwt')
export class CheeseController {
  constructor(
    @repository(CheeseRepository)
    public cheeseRepository: CheeseRepository,
  ) {}

  @post('/cheeses')
  @response(200, {
    description: 'Cheese model instance',
    content: {'application/json': {schema: getModelSchemaRef(Cheese)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cheese, {
            title: 'NewCheese',
            exclude: ['id'],
          }),
        },
      },
    })
    cheese: Omit<Cheese, 'id'>,
  ): Promise<Cheese> {
    return this.cheeseRepository.create(cheese);
  }

  @get('/cheeses')
  @response(200, {
    description: 'Array of Cheese model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Cheese, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @inject(SecurityBindings.USER)
    currentUser: User,
    @param.filter(Cheese) filter?: Filter<Cheese>,
  ): Promise<Cheese[]> {
    return this.cheeseRepository.find({
      where: {...(filter?.where ?? {}), userId: currentUser.id},
      ...filter,
    });
  }

  @get('/cheeses/{id}')
  @response(200, {
    description: 'Cheese model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cheese, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Cheese, {exclude: 'where'})
    filter?: FilterExcludingWhere<Cheese>,
  ): Promise<Cheese> {
    return this.cheeseRepository.findById(id, filter);
  }

  @put('/cheeses/{id}')
  @response(204, {
    description: 'Cheese PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() cheese: Cheese,
  ): Promise<void> {
    await this.cheeseRepository.replaceById(id, cheese);
  }

  @del('/cheeses/{id}')
  @response(204, {
    description: 'Cheese DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.cheeseRepository.deleteById(id);
  }
}
