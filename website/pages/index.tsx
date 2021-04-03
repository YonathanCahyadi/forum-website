import { useEffect, useState } from "react";
import Feed from "../components/Feed";
import { __userId__ } from "../constants";
import { useGetAllThreadQuery } from "../graphql/generated/graphql";
import withApolloProvider from "../lib/withApolloProvider";

const Home: React.FC = () => {
  const { data, error, loading, fetchMore, variables } = useGetAllThreadQuery({ variables: { page: 0 } });

  const [userId, setUserId] = useState(null);
  useEffect(() => {
    setUserId(JSON.parse(localStorage.getItem(__userId__)));
  });

  if (error) return <div>{JSON.stringify(error, null, 2)}</div>;

  return (
    <div className="home">
      <Feed.Wraper>
        {data &&
          data.getAllThread.data.map((d) => (
            <Feed.Item
              key={`thread-${d.id}`}
              linkOnClick={`post/${d.id}`}
              id={d.id}
              date={new Date(d.updatedAt)}
              title={d.title}
              createdByUsername={d.createdBy.username}
              owner={d.createdBy.id === userId}
            />
          ))}
      </Feed.Wraper>
    </div>
  );
};

export default withApolloProvider(Home);
