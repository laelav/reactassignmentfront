import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.css";
import Form from "./components/form";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";
import FirstPage from "./pages/firstPage";
import SecondPage from "./pages/secondPage";
import ApolloClient from 'apollo-boost';
import {ApolloProvider, Query} from 'react-apollo';
import gql from 'graphql-tag';
const client = new ApolloClient({
  uri: "https://reactassignmentserver.herokuapp.com/graphql"
});

const addQuery = gql`
  {
    mutation {
      createEvent(
        eventInput: { num1: "$this.state.num1", num2: "$this.state.num2" }
      ) {
        _id
        num1
        num2
        addition
        multiply
      }
    }
  }
`;

class App extends Component {
  render() {
    return <Router>
    <ApolloProvider client={client}>
    <Switch>
    <Route exact path="/" component={FirstPage}/>
    <Route exact path="/FirstPage" component={FirstPage}/>
    <Route exact path="/SecondPage" component={SecondPage}/>
    </Switch>
    </ApolloProvider>
    </Router>
  }
}
export default App;
