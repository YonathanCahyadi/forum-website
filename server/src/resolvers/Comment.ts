import { QueryOrder } from "@mikro-orm/core";
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
    const comments = await em.find(Comment, { post: threadId, deleted: false }, ["createdBy"], { createdAt: QueryOrder.DESC });

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
    const newComment = await em.find(Comment, { id: newCommentTemplate.id }, ["createdBy"]);

    return {
      data: newComment,
    };
  }

  @Mutation(() => CommentResponse)
  async deleteComment(@Arg("commentId") commentId: string, @Ctx() { em, auth }: AppContext): Promise<CommentResponse> {
    if (!auth.valid) {
      return {
        error: "Invalid Operation (Unauthorized Operation)",
      };
    }

    // check if comment is owned by the authorized user
    const comment = await em.findOne(Comment, { id: commentId }, ["createdBy"]);
    if (comment?.createdBy.id !== auth.userId) {
      return {
        error: "Invalid operation (Delete can only be done by the owner of the comment).",
      };
    }

    // delete comment
    await em.nativeUpdate(Comment, { id: commentId, deleted: false }, { deleted: true });

    // get the deleted comment
    const deletedComment = await em.find(Comment, { id: commentId, deleted: true }, ["createdBy"]);

    return {
      data: deletedComment,
    };
  }

  @Mutation(() => CommentResponse)
  async updateComment(
    @Arg("commentId") commentId: string,
    @Arg("newContent") newContent: string,
    @Ctx() { em, auth }: AppContext
  ): Promise<CommentResponse> {
    if (!auth.valid) {
      return {
        error: "Invalid Operation (Unauthorized Operation)",
      };
    }

    // check if the updated comment is made by the same authenticated user and comment is exists
    const comment = await em.findOne(Comment, { id: commentId, deleted: false, createdBy: auth.userId }, ["createdBy"]);
    if (!comment) {
      return {
        error: "Invalid operation (Comment not found).",
      };
    }

    if (comment?.createdBy.id !== auth.userId) {
      return {
        error: "Invalid operation (Update can only be done by the owner of the comment).",
      };
    }

    // update the comment with the new value
    comment.content = newContent;
    comment.updated = true;
    await em.flush();

    // get the newly updated comment
    const updatedComment = await em.find(Comment, { id: commentId }, ["createdBy"]);

    return {
      data: updatedComment,
    };
  }
}

export default CommentResolver;
