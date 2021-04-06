import { ApolloQueryResult } from "@apollo/client";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import Comment from "../../components/Comment";
import Feed from "../../components/Feed";
import { __userId__ } from "../../env";
import { GetUserByIdDocument, GetUserByIdQuery, User } from "../../graphql/generated/graphql";
import client from "../../lib/apollo";
import withApolloProvider from "../../lib/withApolloProvider";

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const id = ctx.params.id;

  const { data }: ApolloQueryResult<GetUserByIdQuery> = await client().query({
    query: GetUserByIdDocument,
    variables: { userId: id },
  });

  if (data.getUserById.error) {
    console.log(data.getUserById.error);
  }

  return {
    props: {
      userData: data.getUserById.data || null,
    },
  };
};

interface UserPageProps {
  userData: User;
}

const UserPage: React.FC<UserPageProps> = ({ userData }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(JSON.parse(sessionStorage.getItem(__userId__)));
  });

  return (
    <div className="user-layout">
      {/* <pre>{JSON.stringify(userData, null, 2)}</pre> */}

      <fieldset className="user-threads-container">
        <legend>Posted Threads</legend>
        <Feed.Wraper>
          {userData.threads.length !== 0 ? (
            userData.threads.map((thread) => (
              <Feed.Item
                key={`thread-${thread.id}`}
                title={thread.title}
                createdByUsername={userData.username}
                id={thread.id}
                date={new Date(thread.createdAt)}
                owned={userId === userData.id}
                linkOnClick={`/thread/${thread.id}`}
              />
            ))
          ) : (
            <div>No Thread</div>
          )}
        </Feed.Wraper>
      </fieldset>

      <fieldset className="user-comments-container">
        <legend>Posted Comments</legend>
        <Comment.Wrapper heading={false} loading={false}>
          {userData.comments.length !== 0 ? (
            userData.comments.map((comment) => (
              <Comment.Item
                owned={userId === userData.id}
                key={`comment-${comment.id}`}
                edited={comment.updated}
                content={comment.content}
                id={comment.id}
                createdAt={new Date(comment.createdAt)}
                username={userData.username}
                creatorId={userData.id}
              />
            ))
          ) : (
            <Comment.Blank />
          )}
        </Comment.Wrapper>
      </fieldset>

      <div className="user-infos-container">
        <h2>{userData.username}</h2>
        <div className="user-infos">
          <div className="user-info">
            <h5>Created At:</h5>
            <div className="user-info-ans">{new Date(userData.createdAt).toDateString()} </div>
          </div>
          <div className="user-info">
            <h5>Threads Count: </h5>
            <div className="user-info-ans">{userData.threads.length}</div>
          </div>
          <div className="user-info">
            <h5>Comments Count: </h5>
            <div className="user-info-ans">{userData.comments.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withApolloProvider(UserPage);
