import { ApolloQueryResult } from "@apollo/client";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Comment from "../../components/Comment";
import { GetThreadByIdDocument, GetThreadByIdQuery, Thread, useGetCommentsByThreadIdQuery } from "../../graphql/generated/graphql";
import client from "../../lib/apollo";
import withAppoloProvider from "../../lib/withApolloProvider";

import { __auth__, __userId__ } from "../../constants";

import Head from "next/head";
import { useEffect, useState } from "react";

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
  const [userId, setUserId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    setUserId(JSON.parse(sessionStorage.getItem(__userId__)));
    setAuthToken(JSON.parse(sessionStorage.getItem(__auth__)));
  });

  if (!threadData) {
    return <div>Error</div>;
  }

  return (
    <>
      <Head>
        <meta name="title" content={`${threadData.title}`} />
        <meta name="description" content={`${threadData.content.slice(0, 49)}`} />
        <meta name="keywords" content={`${threadData.title.split(" ")}`} />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />

        <title>{threadData.title}</title>
      </Head>

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
              <Comment.Blank />
            ) : (
              commentDatas?.getCommentsByThreadId.data.map((comment) => (
                <Comment.Item
                  key={`comment-${comment.id}`}
                  id={comment.id}
                  username={comment.createdBy.username}
                  content={comment.content}
                  createdAt={new Date(comment.createdAt)}
                  owned={comment.createdBy.id === userId}
                  edited={comment.updated}
                />
              ))
            )}

            <Comment.Post threadId={threadData.id} loggedIn={authToken !== null} />
          </Comment.Wrapper>
        </div>
      </div>
    </>
  );
};

export default withAppoloProvider(Post);
