import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Form from "../components/form";
import Img from "react-image";
import "./topstyle.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";

const nextPageLogo =
  "https://icon-library.net/images/next-arrow-icon/next-arrow-icon-12.jpg";
class FirstPage extends Component {
  render() {
    return (
      <div>
        <p className="main-navigation">Please enter 2 numbers:</p>
        <br />
        <Form />
        <br />
        <Link to="/SecondPage/">
          <img src={nextPageLogo} width="50" height="50" />
        </Link>
      </div>
    );
  }
  getHeaderBS() {
    return "badge m-2 badge-light";
  }
}

export default FirstPage;
