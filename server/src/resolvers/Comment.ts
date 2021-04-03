import { threadId } from "node:worker_threads";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import AppContext from "../AppContext";
import { Comment } from "../entities/Comment";

@ObjectType()
class CommentResponse {
  @Field(() => [Comment], { nullable: true })
  data?: Comment[];

  @Field(() => String, { nullable: true })
  error?: string;
}

@Resolver()
class CommentResolver {
  @Query(() => CommentResponse)
  async getCommentsByThreadId(@Arg("threadId") threadId: string, @Ctx() { em }: AppContext): Promise<CommentResponse> {
    const comments = await em.find(Comment, { post: threadId });

    console.log(comments);

    return {
      data: comments,
    };
  }

  @Mutation(() => CommentResponse)
  async postComment(@Arg("threadId") threadId: string, @Arg("comment") comment: string, @Ctx() { em, auth }: AppContext): Promise<CommentResponse> {
    if (!auth.valid) {
      return {
        error: "Invalid Operation (need to login first).",
      };
    }

    const newCommentTemplate = em.create(Comment, { content: comment, post: threadId, createdBy: auth.userId });
    await em.persistAndFlush(newCommentTemplate);
    const newComment = await em.find(Comment, { id: newCommentTemplate.id });

    return {
      data: newComment,
    };
  }
}

export default CommentResolver;
