import Button from "./Button";
import { useEffect, useState } from "react";
import { usePostCommentMutation } from "../graphql/generated/graphql";
import Link from "next/link";
import Router from "next/router";
import { __auth__ } from "../constants";
import Spinner from "./Spinner";

interface CommentsItemProps {
  username: string;
  content: string;
  createdAt: string;
}

interface CommentsWrapperProps {
  loading: boolean;
}

const Wrapper: React.FC<CommentsWrapperProps> = ({ children, loading }) => {
  return (
    <div className="comments-container">
      <h3>Comments</h3>
      {loading ? (
        <div className="comments-loading">
          <Spinner />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

const Item: React.FC<CommentsItemProps> = ({ username, content, createdAt }) => {
  return (
    <div className="comment">
      <h5>{username}</h5>
      <sub>{new Date(createdAt).toDateString()}</sub>
      <div className="comment-content">{content}</div>
    </div>
  );
};

interface PostCommentProps {
  threadId: string;
}

const Post: React.FC<PostCommentProps> = ({ threadId }) => {
  const [postComment] = usePostCommentMutation();
  const [comment, setComment] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = JSON.parse(localStorage.getItem(__auth__));
    setLoggedIn(authToken !== null);
  });

  return (
    <div className="comment-add-container">
      {loggedIn ? (
        <>
          <textarea value={comment} onChange={(e) => setComment(e.currentTarget.value)} />
          <Button
            name="Add Comment"
            onClick={async (e) => {
              const { data } = await postComment({ variables: { threadId, comment } });

              if (data.postComment.error) {
                console.log(data.postComment.error);
              }

              if (data.postComment.data) {
                Router.reload();
              }
            }}
          />
        </>
      ) : (
        <div className="info-comment">
          Need to <Link href="/login">Login</Link> First to Comment
        </div>
      )}
    </div>
  );
};

export default {
  Wrapper,
  Item,
  Post,
};
