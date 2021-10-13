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
import {Book, User} from '../models';
import {BookRepository} from '../repositories';

@authenticate('jwt')
export class BookController {
  constructor(
    @repository(BookRepository)
    public bookRepository: BookRepository,
  ) {}

  @post('/books')
  @response(200, {
    description: 'Book model instance',
    content: {'application/json': {schema: getModelSchemaRef(Book)}},
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUser: User,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {
            title: 'NewBook',
            exclude: ['id', 'userId'],
          }),
        },
      },
    })
    book: Omit<Book, 'id' | 'userId'>,
  ): Promise<Book> {
    return this.bookRepository.create({...book, userId: currentUser.id});
  }

  @get('/books')
  @response(200, {
    description: 'Array of Book model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Book, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @inject(SecurityBindings.USER)
    currentUser: User,
    @param.filter(Book) filter?: Filter<Book>,
  ): Promise<Book[]> {
    return this.bookRepository.find({
      where: {...(filter?.where ?? {}), userId: currentUser.id},
      ...filter,
    });
  }

  @get('/books/{id}')
  @response(200, {
    description: 'Book model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Book, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Book, {exclude: 'where'})
    filter?: FilterExcludingWhere<Book>,
  ): Promise<Book> {
    return this.bookRepository.findById(id, filter);
  }

  @put('/books/{id}')
  @response(204, {
    description: 'Book PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() book: Book,
  ): Promise<void> {
    await this.bookRepository.replaceById(id, book);
  }

  @del('/books/{id}')
  @response(204, {
    description: 'Book DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.bookRepository.deleteById(id);
  }
}
