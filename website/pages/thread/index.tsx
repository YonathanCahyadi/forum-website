import { useState } from "react";
import Button from "../../components/Button";
import Router from "next/router";
import { usePostThreadMutation } from "../../graphql/generated/graphql";
import withAppoloProvider from "../../lib/withApolloProvider";

const CreatePost: React.FC = () => {
  const [post] = usePostThreadMutation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="layout">
      <div className="form-container">
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
        <label>Content</label>
        <textarea className="new-thread-content" value={content} onChange={(e) => setContent(e.currentTarget.value)} />

        <Button
          name="Post"
          onClick={async () => {
            const {
              data: {
                postThread: { data, error },
              },
            } = await post({
              variables: {
                title,
                content,
              },
            });

            if (error) {
              setError(true);
              setErrorMessage(error);
            }

            if (data) {
              Router.push("/");
            }
          }}
        />

        {error && <div className="form-info">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default withAppoloProvider(CreatePost);
