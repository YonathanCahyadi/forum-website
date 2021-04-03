import { ApolloQueryResult } from "@apollo/client";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Comment from "../../components/Comment";
import {
  GetThreadByIdDocument,
  GetThreadByIdQuery,
  Thread,
  useGetCommentsByThreadIdQuery,
  usePostCommentMutation,
} from "../../graphql/generated/graphql";
import client from "../../lib/apollo";
import withAppoloProvider from "../../lib/withApolloProvider";
import { useEffect, useState } from "react";
import { __auth__ } from "../../constants";
import Spinner from "../../components/Spinner";

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const id = ctx.params.id as string;

  const { data, error = null }: ApolloQueryResult<GetThreadByIdQuery> = await client().query({
    query: GetThreadByIdDocument,
    variables: { id },
  });

  return {
    props: {
      threadData: data.getThreadById.data[0] || null,
    },
  };
};

interface PostProps {
  threadData: Thread;
}

const Post: React.FC<PostProps> = ({ threadData }) => {
  const { data: commentDatas, loading: commentLoading } = useGetCommentsByThreadIdQuery({ variables: { threadId: threadData.id } });

  if (!threadData) {
    return <div>Error</div>;
  }

  return (
    <div className="thread">
      <div className="thread-content">
        <sub>{threadData.createdBy.username}</sub>

        <h1>{threadData.title}</h1>

        <sub>
          {new Date(threadData.createdAt).toDateString()} {threadData.updated && <pre>| updated</pre>}
        </sub>

        <main>{threadData.content}</main>
        <Comment.Wrapper loading={commentLoading}>
          {commentDatas?.getCommentsByThreadId.data.length === 0 ? (
            <div>No Comment</div>
          ) : (
            commentDatas?.getCommentsByThreadId.data.map((comment) => (
              <Comment.Item
                key={`comment-${comment.id}`}
                username={comment.createdBy.username}
                content={comment.content}
                createdAt={comment.createdAt}
              />
            ))
          )}

          <Comment.Post threadId={threadData.id} />
        </Comment.Wrapper>
      </div>
    </div>
  );
};

export default withAppoloProvider(Post);
