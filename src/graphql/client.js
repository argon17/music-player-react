import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { GET_QUEUED_SONGS } from './queries';

const typeDefs = gql`

  type Song{
    id: uuid!
    title: String!
    artist: String!
    thumbnail: String!
    duration: Float!
    url: String!
  }

  input SongInput{
    id: uuid!
    title: String!
    artist: String!
    thumbnail: String!
    duration: Float!
    url: String!
  }
  type Query{
    queue: [Song]!
  }

  type Mutation{
    addOrRemoveFromQueue(input: SongInput!): [Song]!
  }

`;


const client = new ApolloClient({
    link: new WebSocketLink({
      uri: 'wss://react-music-player-argon.herokuapp.com/v1/graphql',
      options: {
        reconnect: true
      }
    }),
    cache: new InMemoryCache(),
    typeDefs,
    resolvers: {
      Mutation: {
        addOrRemoveFromQueue: (_, { input }, { cache }) => {
          const queryResults = cache.readQuery({
            query: GET_QUEUED_SONGS
          })
          if(queryResults){
            const {queue} = queryResults
            const isInQueue = queue.some( song => song.id === input.id )
            const newQueue = isInQueue ? 
              queue.filter(song => song.id !== input.id )
              : [...queue, input ]
            cache.writeQuery({
              query: GET_QUEUED_SONGS,
              data: {queue: newQueue}
            })
            return newQueue
          }
          return []
        }
      }
    }
  });


  const localQueue = localStorage.getItem('queue')
  const hasQueue = Boolean(localQueue);

  client.writeQuery({
    query: GET_QUEUED_SONGS,
    data: {
      queue: hasQueue ? JSON.parse(localQueue) : []
  },
  });

  export default client;