import Router from "next/router";
import { useState } from "react";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import { useLoginMutation } from "../graphql/generated/graphql";
import withApolloProvider from "../lib/withApolloProvider";
import Link from "next/link";
import { __auth__, __userId__ } from "../constants";

const Login: React.FC = () => {
  const [login] = useLoginMutation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="login">
      <div className="form-container">
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.currentTarget.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />

        <Button
          name="Submit"
          onClick={async () => {
            const {
              data: {
                login: { data, error, authorizationToken },
              },
            } = await login({
              variables: {
                username,
                password,
              },
            });

            if (error) {
              setError(true);
              setErrorMessage(error);
            }

            if (data) {
              localStorage.setItem(__userId__, JSON.stringify(data.id));
              localStorage.setItem(__auth__, JSON.stringify(authorizationToken));
              Router.push("/");
            }
          }}
        />

        <div className="other-info">
          Don't have an account? <Link href="/register">Register</Link>
        </div>

        {error && <div className="form-info">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default withApolloProvider(Login);
