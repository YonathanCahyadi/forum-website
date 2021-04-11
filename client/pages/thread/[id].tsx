import { ApolloQueryResult } from "@apollo/client";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Comment from "../../components/Comment";
import {
  GetThreadByIdDocument,
  GetThreadByIdQuery,
  Thread,
  useAddViewMutation,
  useDeleteThreadMutation,
  useGetCommentsByThreadIdQuery,
  useUpdateThreadMutation,
} from "../../graphql/generated/graphql";
import client from "../../lib/apollo";
import withAppoloProvider from "../../lib/withApolloProvider";

import { __auth__, __userId__, __time_before_counted_as_view__ } from "../../env";

import Head from "next/head";
import { useEffect, useState } from "react";
import Router from "next/router";
import Link from "next/link";
import Button from "../../components/Button";

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const id = ctx.params.id as string;
  const editing = ctx.query.edit ?? false;

  const { data, error = null }: ApolloQueryResult<GetThreadByIdQuery> = await client().query({
    query: GetThreadByIdDocument,
    variables: { id },
  });

  return {
    props: {
      threadData: data.getThreadById.data[0],
      editing,
    },
  };
};

interface PostProps {
  threadData: Thread;
  editing: boolean;
}

const Post: React.FC<PostProps> = ({ threadData, editing }) => {
  const { data: commentDatas, loading: commentLoading } = useGetCommentsByThreadIdQuery({ variables: { threadId: threadData.id } });
  const [userId, setUserId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const [threadTitle, setThreadTitle] = useState(threadData.title);
  const [threadContent, setThreadContent] = useState(threadData.content);

  const [currentlyEditing, setCurrentlyEditing] = useState(editing);
  const [allowedToEdit, setAllowedToEdit] = useState(false);

  const [deleteThread] = useDeleteThreadMutation();
  const [updateThread] = useUpdateThreadMutation();
  const [addView] = useAddViewMutation();

  useEffect(() => {
    setUserId(JSON.parse(sessionStorage.getItem(__userId__)));
    setAuthToken(JSON.parse(sessionStorage.getItem(__auth__)));

    setAllowedToEdit(threadData.createdBy.id === JSON.parse(sessionStorage.getItem(__userId__)));

    //update view to the Thread
    const timeout = setTimeout(async () => {
      const { data } = await addView({ variables: { threadId: threadData.id } });

      if (!data) {
        console.log("Error Updating Views");
      }
    }, __time_before_counted_as_view__);

    // if the user view the thread in less than the specified amount it should not count as a view
    return clearTimeout(timeout);
  }, []);

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
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />

        <title>{threadData.title}</title>
      </Head>

      <div className="thread">
        <div className="thread-content">
          <Link href={`/user/${threadData.createdBy.id}`}>
            <sub className="thread-username">{threadData.createdBy.username}</sub>
          </Link>

          <h1>
            {!allowedToEdit || !currentlyEditing ? (
              threadTitle
            ) : (
              <textarea value={threadTitle} onChange={(e) => setThreadTitle(e.currentTarget.value)} disabled={!allowedToEdit || !currentlyEditing} />
            )}
          </h1>

          <sub>
            {new Date(threadData.createdAt).toDateString()} {threadData.updated && <pre>| edited</pre>}
          </sub>

          <main>
            <textarea
              value={threadContent}
              onChange={(e) => setThreadContent(e.currentTarget.value)}
              disabled={!allowedToEdit || !currentlyEditing}
            />
          </main>

          {allowedToEdit && !currentlyEditing && (
            <div>
              <Button name="Edit" onClick={() => setCurrentlyEditing((prev) => !prev)} />
              <Button
                name="Delete"
                onClick={async () => {
                  const { data } = await deleteThread({ variables: { threadId: threadData.id } });

                  if (data) {
                    Router.push("/");
                  }
                }}
              />
            </div>
          )}

          {allowedToEdit && currentlyEditing && (
            <div>
              <Button
                name="Update"
                onClick={async () => {
                  const { data } = await updateThread({ variables: { threadId: threadData.id, title: threadTitle, content: threadContent } });

                  if (data) {
                    Router.reload();
                  }
                }}
              />
              <Button name="Cancel" onClick={() => setCurrentlyEditing((prev) => !prev)} />
            </div>
          )}

          <div className="thread-comments">
            <Comment.Wrapper heading={true} loading={commentLoading}>
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
                    creatorId={comment.createdBy.id}
                  />
                ))
              )}

              <Comment.Post threadId={threadData.id} loggedIn={authToken !== null} />
            </Comment.Wrapper>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAppoloProvider(Post);
