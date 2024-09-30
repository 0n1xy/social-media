import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from '@/graphql/typeDefs';
import { resolvers } from '@/graphql/resolvers';
import ConnectDB from '@/services/MongoDB_Service';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000; // Use environment variable or fallback to 3000

// Middleware to parse JSON
app.use(express.json());

const startServer = async () => {
  try {
    // Initialize MongoDB connection
    const db = new ConnectDB();
    await db.connect();

    // Create an instance of ApolloServer
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        return { req }; // You can add more context if needed
      },
    });

    // Start the Apollo Server
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });

    // Start the Express server
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`GraphQL endpoint available at http://localhost:${port}/graphql`);
    });

  } catch (error) {
    console.error('Error starting the server:', error); // Log any startup errors
  }
}

startServer();
