import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    // uri: 'http://localhost/api/rest/public/index.php/graphql', // Замените на ваш GraphQL endpoint
    uri: 'http://ging93.atwebpages.com/api/rest/public/index.php/graphql', // Замените на ваш GraphQL endpoint
  }),
  cache: new InMemoryCache(),
});

const ApolloProviderWrapper = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default ApolloProviderWrapper;
export { client };