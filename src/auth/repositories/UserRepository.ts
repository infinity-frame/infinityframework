import { Repository } from "./Repository.js";
import { User } from "../models/User.js";
import {
  Collection,
  Db,
  DeleteResult,
  ObjectId,
  UpdateFilter,
  UpdateResult,
} from "mongodb";
import { RepositoryException } from "../exceptions.js";

export interface CreateUser {
  username: string;
  passwordHash: string;
}

export interface UpdateUser {
  username?: string;
  passwordHash?: string;
}

export interface UserFilter {
  id?: string;
  username?: string;
}

export type UserRepository = Repository<
  User,
  CreateUser,
  UpdateUser,
  UserFilter
>;

/** MongoDB Repository */
interface MongoUserFilter {
  _id?: ObjectId;
  username?: string;
}

interface MongoUser {
  _id: ObjectId;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

export class MongoUserRepository implements UserRepository {
  static collectionName: string = "if-users";
  private UserCollection: Collection<MongoUser>;

  constructor(db: Db) {
    this.UserCollection = db.collection<MongoUser>(
      MongoUserRepository.collectionName
    );
  }

  private mapUser(mongoUser: MongoUser): User {
    return {
      id: mongoUser._id.toString(),
      createdAt: mongoUser.createdAt,
      username: mongoUser.username,
      passwordHash: mongoUser.passwordHash,
    };
  }

  private mapUserFilter(filter: UserFilter): MongoUserFilter {
    let _id: ObjectId | undefined;
    if (filter.id) {
      try {
        _id = new ObjectId(filter.id);
      } catch (err) {
        throw new RepositoryException(
          err,
          "Failed to cast id to Mongo ObjectId"
        );
      }
    }

    return { _id, username: filter.username };
  }

  public async create(inp: CreateUser): Promise<User> {
    const _id = new ObjectId();
    const createdAt = new Date();

    const mongoUser: MongoUser = {
      _id,
      createdAt,
      username: inp.username,
      passwordHash: inp.passwordHash,
    };

    try {
      await this.UserCollection.insertOne(mongoUser);
    } catch (err) {
      throw new RepositoryException(err);
    }

    return this.mapUser(mongoUser);
  }

  public async update(filter: UserFilter, inp: UpdateUser): Promise<number> {
    const mongoFilter: MongoUserFilter = this.mapUserFilter(filter);

    const updateFilter: UpdateFilter<MongoUser> = {
      $set: inp,
    };

    let res: UpdateResult;
    try {
      res = await this.UserCollection.updateMany(mongoFilter, updateFilter);
    } catch (err) {
      throw new RepositoryException(err);
    }

    return res.matchedCount;
  }

  public async find(filter?: UserFilter | undefined): Promise<User[]> {
    const mongoFilter = this.mapUserFilter(filter || {});

    let userDocs: MongoUser[];
    try {
      userDocs = await this.UserCollection.find(mongoFilter).toArray();
    } catch (err) {
      throw new RepositoryException(err);
    }

    const users = userDocs.map((user) => this.mapUser(user));
    return users;
  }

  public async delete(filter: UserFilter): Promise<number> {
    const mongoFilter = this.mapUserFilter(filter);

    let res: DeleteResult;
    try {
      res = await this.UserCollection.deleteMany(mongoFilter);
    } catch (err) {
      throw new RepositoryException(err);
    }

    return res.deletedCount;
  }
}
