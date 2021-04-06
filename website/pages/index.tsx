import { useEffect, useState } from "react";
import Feed from "../components/Feed";
import Spinner from "../components/Spinner";
import Head from "next/head";
import { __userId__ } from "../env";
import { useGetAllThreadQuery } from "../graphql/generated/graphql";
import withApolloProvider from "../lib/withApolloProvider";

const Home: React.FC = () => {
  const { data, error, loading, fetchMore, variables } = useGetAllThreadQuery({ variables: { page: 0 } });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(JSON.parse(sessionStorage.getItem(__userId__)));
  });

  if (error) return <div>{JSON.stringify(error, null, 2)}</div>;
  if (loading) return <Spinner />;

  return (
    <>
      <Head>
        <meta name="title" content="Forum Website" />
        <meta name="description" content={`A forum website where you can post any things. Express your voices.`} />
        <meta name="keywords" content={`A forum website where you can post any things. Express your voices.`} />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />

        <title>Forum Website</title>
      </Head>
      <div className="layout">
        <Feed.Wraper>
          {data.getAllThread.data.length !== 0 ? (
            data.getAllThread.data.map((d) => (
              <Feed.Item
                key={`thread-${d.id}`}
                linkOnClick={`thread/${d.id}`}
                id={d.id}
                date={new Date(d.updatedAt)}
                title={d.title}
                createdByUsername={d.createdBy.username}
                owned={d.createdBy.id === userId}
                edited={d.updated}
              />
            ))
          ) : (
            <div>No Thread is Active.</div>
          )}
        </Feed.Wraper>
      </div>
    </>
  );
};

export default withApolloProvider(Home);
