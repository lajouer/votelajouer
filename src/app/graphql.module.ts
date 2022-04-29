import { NgModule } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

const uri = 'https://lajouerdb.herokuapp.com/v1/graphql'; // <-- add the URL of the GraphQL server here
const authHeader = new HttpHeaders()
  .set('X-Hasura-Access-Key', 'something_secret')
  .set('X-Hasura-admin-secret', '"rk3Jm~GQfAxfx:')
  .set('Content-Type', 'application/json');
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({ uri, headers: authHeader }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }
