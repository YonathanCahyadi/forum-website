import Link from "next/link";
import Router from "next/router";
import withApolloProvider from "../lib/withApolloProvider";
import { useMeQuery } from "../graphql/generated/graphql";
import Button from "./Button";

const Navbar: React.FC = () => {
  const { data, error } = useMeQuery();

  return (
    <nav>
      <Link href="/">
        <h1>Forum</h1>
      </Link>
      <ul>
        {data?.me.data ? (
          <>
            <li>
              <Link href="/post">
                <Button name="Add Post" />
              </Link>
            </li>
            <li>
              <Link href="/login">
                <Button name={data.me.data.username} />
              </Link>
            </li>
            <li>
              <Button
                name="Logout"
                onClick={() => {
                  // clear the local storage and refresh the pages
                  localStorage.clear();
                  Router.reload();
                }}
              />
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">
                <Button name="Login" />
              </Link>
            </li>
            <li>
              <Link href="/register">
                <Button name="Register" />
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default withApolloProvider(Navbar);
