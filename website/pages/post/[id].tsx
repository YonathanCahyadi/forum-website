import { ApolloError, ApolloQueryResult } from "@apollo/client";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Navbar from "../../components/Navbar";
import { GetThreadByIdDocument, GetThreadByIdQuery, Thread } from "../../graphql/generated/graphql";
import client from "../../lib/apollo";

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const id = ctx.params.id as string;

  const { data, error = null }: ApolloQueryResult<GetThreadByIdQuery> = await client().query({
    query: GetThreadByIdDocument,
    variables: { id },
  });

  return {
    props: {
      data: data.getThreadById.data[0] || null,
    },
  };
};

interface PostProps {
  data: Thread;
}

const Post: React.FC<PostProps> = ({ data }) => {
  if (!data) {
    return <div>Error</div>;
  }

  return (
    <div className="thread">
      <div className="thread-content">
        <sub>{data.createdBy.username}</sub>

        <h1>{data.title}</h1>

        <sub>
          {new Date(data.createdAt).toDateString()} {data.updated && <pre>| updated</pre>}
        </sub>

        <main>{data.content}</main>

        <div className="comment-container">
          <h3>Comments</h3>
          {data.comments.length === 0 ? "No Comment" : "Comment Found"}
        </div>
      </div>
    </div>
  );
};

export default Post;
