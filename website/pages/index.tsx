import { useEffect, useState } from "react";
import Feed from "../components/Feed";
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

  return (
    <div className="layout">
      <Feed.Wraper>
        {data &&
          data.getAllThread.data.map((d) => (
            <Feed.Item
              key={`thread-${d.id}`}
              linkOnClick={`thread/${d.id}`}
              id={d.id}
              date={new Date(d.updatedAt)}
              title={d.title}
              createdByUsername={d.createdBy.username}
              owned={d.createdBy.id === userId}
            />
          ))}
      </Feed.Wraper>
    </div>
  );
};

export default withApolloProvider(Home);
