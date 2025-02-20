import {
  Collection,
  Db,
  DeleteResult,
  ObjectId,
  UpdateFilter,
  UpdateResult,
} from "mongodb";
import { Session } from "../models/Session.js";
import { Repository } from "./Repository.js";
import { RepositoryException } from "../exceptions.js";

export interface CreateSession {
  token: string;
  userId: string;
}

export interface UpdateSession {
  lastUsed?: Date;
}

export interface SessionFilter {
  id?: string;
  token?: string;
  userId?: string;
}

export type SessionRepository = Repository<
  Session,
  CreateSession,
  UpdateSession,
  SessionFilter
>;

/** MongoDB implementation */
interface MongoSessionFilter {
  _id?: ObjectId;
  token?: string;
  userId?: string;
}

interface MongoSession {
  _id: ObjectId;
  token: string;
  userId: string;
  lastUsed: Date;
}

export class MongoSessionRepository implements SessionRepository {
  static collectionName: string = "if-sessions";
  private SessionCollection: Collection<MongoSession>;

  constructor(db: Db) {
    this.SessionCollection = db.collection(
      MongoSessionRepository.collectionName
    );
  }

  private mapFilter(filter: SessionFilter): MongoSessionFilter {
    let _id: ObjectId | undefined;
    if (typeof filter.id !== "undefined") {
      try {
        _id = new ObjectId(filter.id);
      } catch (err) {
        throw new RepositoryException(
          err,
          "Failed to cast id to Mongo ObjectId"
        );
      }
    }

    return { _id, token: filter.token, userId: filter.userId };
  }

  private mapSession(mongoSession: MongoSession): Session {
    return {
      id: mongoSession._id.toString(),
      lastUsed: mongoSession.lastUsed,
      userId: mongoSession.userId,
      token: mongoSession.token,
    };
  }

  public async create(inp: CreateSession): Promise<Session> {
    const _id = new ObjectId();
    const lastUsed = new Date();

    const sessionDoc: MongoSession = {
      _id,
      lastUsed,
      token: inp.token,
      userId: inp.userId,
    };

    try {
      await this.SessionCollection.insertOne(sessionDoc);
    } catch (err) {
      throw new RepositoryException(err);
    }

    return this.mapSession(sessionDoc);
  }

  public async find(filter?: SessionFilter | undefined): Promise<Session[]> {
    const mongoFilter = this.mapFilter(filter || {});

    let sessionDocs: MongoSession[];
    try {
      sessionDocs = await this.SessionCollection.find(mongoFilter).toArray();
    } catch (err) {
      throw new RepositoryException(err);
    }

    return sessionDocs.map((sessionDoc) => this.mapSession(sessionDoc));
  }

  public async update(
    filter: SessionFilter,
    inp: UpdateSession
  ): Promise<number> {
    const mongoFilter = this.mapFilter(filter);

    const updateFilter: UpdateFilter<MongoSession> = { $set: inp };

    let res: UpdateResult<MongoSession>;
    try {
      res = await this.SessionCollection.updateMany(mongoFilter, updateFilter);
    } catch (err) {
      throw new RepositoryException(err);
    }

    return res.matchedCount;
  }

  public async delete(filter: SessionFilter): Promise<number> {
    const mongoFilter = this.mapFilter(filter);

    let res: DeleteResult;
    try {
      res = await this.SessionCollection.deleteMany(mongoFilter);
    } catch (err) {
      throw new RepositoryException(err);
    }

    return res.deletedCount;
  }
}
