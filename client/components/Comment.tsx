import Button from "./Button";
import { useState } from "react";
import { usePostCommentMutation, useDeleteCommentMutation, useUpdateCommentMutation } from "../graphql/generated/graphql";
import Link from "next/link";
import Router from "next/router";
import Spinner from "./Spinner";

interface CommentsWrapperProps {
  loading: boolean;
  heading: boolean;
}

const Wrapper: React.FC<CommentsWrapperProps> = ({ children, heading, loading }) => {
  return (
    <div className="comments-container">
      {heading && <h3>Comments</h3>}
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

interface CommentsItemProps {
  id: string;
  username: string;
  content: string;
  createdAt: Date;
  owned: boolean;
  edited: boolean;
  creatorId: string;
}

const Item: React.FC<CommentsItemProps> = ({ username, content, createdAt, owned, id, edited, creatorId }) => {
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();

  const [updating, setUpdating] = useState(false);
  const [value, setValue] = useState(content);

  return (
    <div className="comment">
      <Link href={`/user/${creatorId}`}>
        <h5 className="comment-username">{username}</h5>
      </Link>
      <sub>
        {createdAt.toDateString()} {edited && <pre>| edited</pre>}
      </sub>
      {/* <div className="comment-content">{content}</div> */}
      <textarea className="comment-content" value={value} disabled={!updating} onChange={(e) => setValue(e.currentTarget.value)} />
      {owned && (
        <div className="comment-action-buttons-container">
          {!updating ? (
            <>
              <Button name="Edit" onClick={() => setUpdating((prev) => !prev)} />
              <Button
                name="Delete"
                onClick={async () => {
                  const { data } = await deleteComment({ variables: { commentId: id } });

                  if (data.deleteComment.error) {
                  }

                  if (data.deleteComment.data) {
                    Router.reload();
                  }
                }}
              />
            </>
          ) : (
            <>
              <Button name="Cancel" onClick={() => setUpdating((prev) => !prev)} />
              <Button
                name="Update"
                onClick={async () => {
                  const { data, errors } = await updateComment({ variables: { commentId: id, newContent: value } });

                  if (data.updateComment.error) {
                  }

                  if (data.updateComment.data) {
                    setUpdating(false);
                  }
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

interface PostCommentProps {
  threadId: string;
  loggedIn: boolean;
}

const Post: React.FC<PostCommentProps> = ({ threadId, loggedIn }) => {
  const [postComment] = usePostCommentMutation();
  const [comment, setComment] = useState("");

  return (
    <div className="comment-add-container">
      {loggedIn ? (
        <>
          <textarea value={comment} onChange={(e) => setComment(e.currentTarget.value)} />
          <Button
            name="Add Comment"
            onClick={async () => {
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

const Blank: React.FC = () => {
  return <div>No Comment</div>;
};

export default {
  Wrapper,
  Item,
  Post,
  Blank,
};
