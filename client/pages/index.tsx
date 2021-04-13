import { useEffect, useState } from "react";
import Feed from "../components/Feed";
import Spinner from "../components/Spinner";
import Head from "next/head";
import { __userId__ } from "../env";
import { Exact, GetAllThreadQuery, Thread, useGetAllThreadQuery } from "../graphql/generated/graphql";
import withApolloProvider from "../lib/withApolloProvider";
import Button from "../components/Button";
import { QueryResult } from "@apollo/client";

const Home: React.FC = () => {
  const { data, error, loading, fetchMore, variables, previousData }: any = useGetAllThreadQuery({ variables: { limit: 1 } });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(JSON.parse(sessionStorage.getItem(__userId__)));
  }, []);

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
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
          {/* Need to fix the cache in Apollo Client if what to refractor it */}
          {data.getAllThread.map((threadData) => {
            return threadData.data.map((thread) => {
              return (
                <Feed.Item
                  key={`thread-${thread.id}`}
                  linkOnClick={`thread/${thread.id}`}
                  id={thread.id}
                  date={new Date(thread.updatedAt)}
                  title={thread.title}
                  createdByUsername={thread.createdBy.username}
                  owned={thread.createdBy.id === userId}
                  edited={thread.updated}
                  views={thread.views}
                />
              );
            });
          })}
          {/* {data.getAllThread[0].data.length !== 0 ? (
            data.getAllThread[0].data.map((thread) => (
              <Feed.Item
                key={`thread-${thread.id}`}
                linkOnClick={`thread/${thread.id}`}
                id={thread.id}
                date={new Date(thread.updatedAt)}
                title={thread.title}
                createdByUsername={thread.createdBy.username}
                owned={thread.createdBy.id === userId}
                edited={thread.updated}
                views={thread.views}
              />
            ))
          ) : (
            <div>No Thread is Active.</div>
          )} */}
        </Feed.Wraper>

        <div className="actions-container">
          <Button
            name="Load More"
            onClick={async () => {
              try {
                const { data: newData, error, loading } = await fetchMore({
                  variables: { limit: 1, cursor: data.getAllThread[0].data[data.getAllThread[0].data.length - 1].createdAt },
                });
              } catch (err) {
                console.log(err);
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default withApolloProvider(Home);
