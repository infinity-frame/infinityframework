import { Repository } from "./Repository.js";
import { User } from "../models/User.js";
import {
  Collection,
  Db,
  DeleteResult,
  MongoError,
  MongoServerError,
  ObjectId,
  UpdateFilter,
  UpdateResult,
} from "mongodb";
import { ConflictException, RepositoryException } from "../exceptions.js";

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

class MongoUserRepository implements UserRepository {
  static collectionName: string = "if-users";
  public readonly UserCollection: Collection<MongoUser>;

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
    const mongoFilter: MongoUserFilter = {};
    if (typeof filter.id !== "undefined") {
      try {
        mongoFilter._id = new ObjectId(filter.id);
      } catch (err) {
        throw new RepositoryException(
          err,
          "Failed to cast id to Mongo ObjectId"
        );
      }
    }

    if (typeof filter.username !== "undefined")
      mongoFilter.username = filter.username;

    return mongoFilter;
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
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new ConflictException();
      }
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

export async function MongoUserRepositoryFactory(db: Db) {
  const repository = new MongoUserRepository(db);

  /** Build the username unique index. */
  const indexes = await repository.UserCollection.indexes();
  if (
    typeof indexes.find(
      (indexDescription) => indexDescription.name === "username_uniqueness"
    ) === "undefined"
  ) {
    await repository.UserCollection.createIndex(
      { username: 1 },
      { unique: true, name: "username_uniqueness" }
    );
  }

  return repository;
}
