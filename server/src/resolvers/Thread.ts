import { QueryOrder } from "@mikro-orm/core";
import { Arg, ArgsType, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import AppContext from "../AppContext";
import { Comment } from "../entities/Comment";
import { Thread } from "../entities/Thread";

@ObjectType()
class ThreadResponse {
  @Field(() => [Thread], { nullable: true })
  data?: Thread[];

  @Field(() => String, { nullable: true })
  error?: string;
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
      ["createdBy", "comments"],
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

    if (threads.length === 0) {
      return {
        error: "Thread not found",
      };
    }

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

    // check if the updated post is made by the same authenticated user and the post is exists
    const post = await em.findOne(Thread, { id: threadId, deleted: false }, ["createdBy"]);
    if (!post) {
      return {
        error: "Invalid operation (Thread not found).",
      };
    }

    if (post?.createdBy.id !== auth.userId) {
      return {
        error: "Invalid operation (Update can only be done by the owner of the thread).",
      };
    }

    // update the post
    post.title = title;
    post.content = content;
    post.updated = true;

    await em.flush();

    // get the updated post
    const updatedPost = await em.find(Thread, { id: threadId }, ["createdBy", "comments"]);

    return {
      data: updatedPost,
    };
  }

  @Mutation(() => ThreadResponse)
  async deleteThread(@Arg("threadId") threadId: string, @Ctx() { em, auth }: AppContext): Promise<ThreadResponse> {
    if (!auth.valid) {
      return {
        error: "Invalid operation (Please login first).",
      };
    }

    // check if the updated thread is made by the same authenticated user
    const thread = await em.findOne(Thread, { id: threadId }, ["createdBy"]);

    if (!thread) {
      return {
        error: "Invalid operation (Thread not found).",
      };
    }

    if (thread?.createdBy.id !== auth.userId) {
      return {
        error: "Invalid operation (Delete can only be done by the owner of the thread).",
      };
    }

    // delete thread
    await em.nativeUpdate(Thread, { id: threadId, deleted: false }, { deleted: true });

    // delete comment on related to the thread
    await em.nativeUpdate(Comment, { post: threadId }, { deleted: true });

    return {
      data: [thread],
    };
  }
}
