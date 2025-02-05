import React from "react";
import { ApolloProvider, useQuery, gql } from "@apollo/client";

const GET_USER = gql`
  query {
    me {
      id
      username
      email
    }
  }
`;

const UserProfile = () => {
  const { data, loading, error } = useQuery(GET_USER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>{data.me.username}</h2>
      <p>{data.me.email}</p>
    </div>
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <UserProfile />
  </ApolloProvider>
);

export default App;
