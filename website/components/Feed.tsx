import Link from "next/link";
import Router from "next/router";
import { User, useDeleteThreadMutation } from "../graphql/generated/graphql";
import Button from "./Button";

interface ItemProps {
  id: string;
  title: string;
  date: Date;
  linkOnClick?: string;

  createdByUsername: string;
  owner: boolean;
}

const Wraper: React.FC = ({ children }) => {
  return <div className="feeds">{children}</div>;
};

const Item: React.FC<ItemProps> = ({ id, title, createdByUsername, owner, date, linkOnClick }) => {
  const [deleteThread] = useDeleteThreadMutation();

  return (
    <Link href={linkOnClick ?? "/"}>
      <div className="feed-item">
        <sub>{date.toDateString()}</sub>
        <h2>{title}</h2>
        <sub>{createdByUsername}</sub>
        {owner && (
          <div>
            <>
              <Button name="Update" />
              <Button
                name="Delete"
                onClick={(e) => {
                  deleteThread({ variables: { threadId: id } });
                  e.preventDefault();
                  Router.reload();
                }}
              />
            </>
          </div>
        )}
      </div>
    </Link>
  );
};

export default {
  Wraper,
  Item,
};
