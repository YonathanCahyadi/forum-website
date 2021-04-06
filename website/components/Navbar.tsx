import Link from "next/link";
import Router from "next/router";
import withApolloProvider from "../lib/withApolloProvider";
import Button from "./Button";
import { useEffect, useState } from "react";
import { __auth__, __userId__, __user__ } from "../constants";

const Navbar: React.FC = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem(__user__)));
    setUserId(JSON.parse(sessionStorage.getItem(__userId__)));
    setAuthToken(JSON.parse(sessionStorage.getItem(__auth__)));
  });

  return (
    <nav>
      <Link href="/">
        <h1>Forum</h1>
      </Link>
      <ul>
        {user && userId && authToken ? (
          <>
            <li>
              <Link href="/thread">
                <Button name="Post Thread" />
              </Link>
            </li>
            <li>
              <Link href={`/user/${userId}`}>
                <Button name={user} />
              </Link>
            </li>
            <li>
              <Button
                name="Logout"
                onClick={() => {
                  // clear the session storage and refresh the pages
                  sessionStorage.clear();
                  Router.push("/");
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
