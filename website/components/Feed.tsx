import Link from "next/link";
import Router from "next/router";
import { useDeleteThreadMutation } from "../graphql/generated/graphql";
import Button from "./Button";

interface ItemProps {
  id: string;
  title: string;
  date: Date;
  linkOnClick?: string;
  createdByUsername: string;
  owned: boolean;
}

const Wraper: React.FC = ({ children }) => {
  return <div className="feeds">{children}</div>;
};

const Item: React.FC<ItemProps> = ({ id, title, createdByUsername, owned, date, linkOnClick }) => {
  const [deleteThread] = useDeleteThreadMutation();

  return (
    <div className="feed-item-container">
      <Link href={linkOnClick ?? "/"}>
        <div className="feed-item">
          <sub>{date.toDateString()}</sub>
          <h2>{title}</h2>
          <sub>{createdByUsername}</sub>
        </div>
      </Link>
      {owned && (
        <div className="feed-action-buttons-container">
          <Button
            name="Edit"
            onClick={async (e) => {
              e.preventDefault();
            }}
          />

          <Button
            name="Delete"
            onClick={async (e) => {
              const { data } = await deleteThread({ variables: { threadId: id } });
              e.stopPropagation();
              Router.reload();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default {
  Wraper,
  Item,
};
