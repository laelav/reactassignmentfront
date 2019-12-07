import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import { useMutation } from "@apollo/react-hooks";
import { addQuery, showQuery } from "./myQueries";

const client = new ApolloClient({
  uri: "https://reactassignmentserver.herokuapp.com/graphql",
  cache: new InMemoryCache()
});

class Form extends Component {
  state = {
    num1: "",
    num2: ""
  };

  mySubmitHandler = event => {
    event.preventDefault();
    if (this.state.num1 == "" || this.state.num2 == "") {
      event.preventDefault();
      alert("You must enter a number in all fields!");
    } else {
      client
        .mutate({
          mutation: addQuery,
          fetchPolicy: "no-cache",
          variables: {
            num1: this.state.num1.toString(),
            num2: this.state.num2.toString()
          },
          refetchQueries: [{ query: showQuery }]
        })
        .then(resData => {
          console.log(resData);
        })
        .catch(err => {
          console.log(err);
        });

      event.target.num1.value = "";
      event.target.num2.value = "";
      this.setState({ [event.target.num1.name]: "" });
      this.setState({ [event.target.num2.name]: "" });
    }
  };

  myChangeHandler = event => {
    let nam = event.target.name;
    let val = event.target.value.trim();
    if (nam === "num1" || nam === "num2") {
      if (!Number(val) && val != "") {
        event.target.value = val.substring(0, val.length - 1);
        this.setState({ [nam]: val.substring(0, val.length - 1) });
        event.preventDefault();
        alert("You must enter a number");
      } else {
        event.target.value = val;
        this.setState({ [nam]: val.trim() });
      }
    }
  };
  render() {
    return (
      <form onSubmit={this.mySubmitHandler}>
        <br />
        <p className={this.getBadgeBS()}>Number #1: </p>
        <input
          className={this.getTextBS()}
          type="text"
          name="num1"
          onChange={this.myChangeHandler}
        />
        <br />
        <p className={this.getBadgeBS()}>Number #2: </p>
        <input
          className={this.getTextBS()}
          type="text"
          name="num2"
          onChange={this.myChangeHandler}
        />
        <br />
        <input
          type="submit"
          disabled={!(this.state.num1 && this.state.num2)}
          className={this.getButtonBS()}
        />
      </form>
    );
  }

  getBadgeBS() {
    return "badge m-2 badge-info";
  }
  getTextBS() {
    return "text m-2 badge-white";
  }
  getButtonBS() {
    return "btn m-2 btn-dark btn-sm";
  }
}

export default Form;
