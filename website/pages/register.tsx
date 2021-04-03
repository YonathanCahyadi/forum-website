import { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useRegisterMutation } from "../graphql/generated/graphql";
import withApolloProvider from "../lib/withApolloProvider";
import { __auth__, __userId__ } from "../constants";

const Register: React.FC = () => {
  const [register] = useRegisterMutation();

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
                register: { data, error, authorizationToken },
              },
            } = await register({
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
          Already have an account? <Link href="/login">Login</Link>
        </div>

        {error && <div className="form-info">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default withApolloProvider(Register);