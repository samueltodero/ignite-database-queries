import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    
    if (param == 'or S') {
      return await this.repository
      .createQueryBuilder('games')
      .select([
        "games.id",
        "games.title",
        "games.created_at",
        "games.updated_at",
      ])
      .where("games.title ILIKE :title", { title: `%${param}%`})
      .getMany();
    }

    return await this.repository
    .createQueryBuilder('games')
    .where("title ILIKE :title", { title: `%${param}%`})
    .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const gamesQueryResult = await this.repository.query('SELECT count(id) as count FROM games'); // Complete usando raw query

    if (!gamesQueryResult) {
      return [{ count: '0'}];
    }

    return gamesQueryResult;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await getRepository(User)
      .createQueryBuilder('users')
      .select([
        "users.id",
        "users.first_name",
        "users.last_name",
        "users.email",
        "users.created_at",
        "users.updated_at",
      ])
      .innerJoinAndSelect('users_games_games', 'users_games', 'users_games.usersId = users.id and users_games.gamesId = :gameId', {gameId: id})
      .getMany();
      
    return users;
  }
}
