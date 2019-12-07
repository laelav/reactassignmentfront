import gql from "graphql-tag";

const showQuery = gql`
  {
    events {
      _id
      num1
      num2
      addition
      multiply
    }
  }
`;

const addQuery = gql`
    mutation($num1: String!, $num2: String!) {
      createEvent(eventInput: { num1: $num1, num2: $num2 }) {
        _id
        num1
        num2
        addition
        multiply
      }
    }
`;

export{showQuery, addQuery};