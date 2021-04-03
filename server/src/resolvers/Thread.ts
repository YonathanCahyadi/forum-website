import { QueryOrder } from "@mikro-orm/core";
import { Arg, ArgsType, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import AppContext from "../AppContext";
import { Thread } from "../entities/Thread";

@ObjectType()
class ThreadResponse {
  @Field(() => [Thread], { nullable: true })
  data?: Thread[];

  @Field(() => String, { nullable: true })
  error?: string;
}

@ArgsType()
class GetAllThreadArg {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  page?: number;
}

@Resolver()
export class ThreadResolver {
  private limitPerPage = 10;

  @Query(() => ThreadResponse)
  async getAllThread(@Arg("page", () => Int, { defaultValue: 0 }) page: number, @Ctx() { em }: AppContext): Promise<ThreadResponse> {
    if (page < 0) {
      return {
        error: "Page cannot be less than 0.",
      };
    }

    const threads = await em.find(
      Thread,
      { deleted: false },
      ["createdBy"],
      { updatedAt: QueryOrder.DESC },
      this.limitPerPage,
      page * this.limitPerPage
    );

    return {
      data: threads,
    };
  }

  @Query(() => ThreadResponse)
  async getThreadById(@Arg("threadId") threadId: string, @Ctx() { em }: AppContext): Promise<ThreadResponse> {
    const threads = await em.find(Thread, { id: threadId, deleted: false }, ["createdBy", "comments"]);
    return {
      data: threads,
    };
  }

  @Mutation(() => ThreadResponse)
  async postThread(@Arg("title") title: string, @Arg("content") content: string, @Ctx() { em, auth }: AppContext): Promise<ThreadResponse> {
    // if not authenticated
    if (!auth.valid) {
      return {
        error: "Invalid operation (Please login first).",
      };
    }

    const newThreadTemplate = em.create(Thread, { title, content, createdBy: auth.userId });
    await em.persistAndFlush(newThreadTemplate);

    // find the new thread and populate the createdBy and comments
    const newThread = await em.find(Thread, { id: newThreadTemplate.id }, ["createdBy", "comments"]);

    return {
      data: newThread,
    };
  }

  @Mutation(() => ThreadResponse)
  async updateThread(
    @Arg("threadId") threadId: string,
    @Arg("title") title: string,
    @Arg("content") content: string,
    @Ctx() { em, auth }: AppContext
  ): Promise<ThreadResponse> {
    // check if user is authorized
    if (!auth.valid) {
      return {
        error: "Invalid operation (Please login first).",
      };
    }

    // check if the updated post is made by the same authenticated user
    const post = await em.findOne(Thread, { id: threadId }, ["createdBy"]);
    if (post?.createdBy.id !== auth.userId) {
      return {
        error: "Invalid operation (Update can only be done by the owner of the thread).",
      };
    }

    // update the post
    await em.nativeUpdate(Thread, { id: threadId, deleted: false }, { title, content, updated: true });

    // get the new post
    const newPost = await em.find(Thread, { id: threadId }, ["createdBy", "comments"]);

    return {
      data: newPost,
    };
  }

  @Mutation(() => ThreadResponse)
  async deleteThread(@Arg("threadId") threadId: string, @Ctx() { em, auth }: AppContext): Promise<ThreadResponse> {
    if (!auth.valid) {
      return {
        error: "Invalid operation (Please login first).",
      };
    }

    // check if the updated post is made by the same authenticated user
    const post = await em.findOne(Thread, { id: threadId }, ["createdBy"]);
    if (post?.createdBy.id !== auth.userId) {
      return {
        error: "Invalid operation (Delete can only be done by the owner of the thread).",
      };
    }

    // delete post
    await em.nativeUpdate(Thread, { id: threadId, deleted: false }, { deleted: true });

    // get the deleted thread
    const deletedThread = await em.find(Thread, { id: threadId, deleted: true }, ["createdBy", "comments"]);

    return {
      data: deletedThread,
    };
  }
}
