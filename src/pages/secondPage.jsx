import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import MyTable from "../components/myTable";
import Img from "react-image";
import "./topstyle.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";

const previousPageLogo =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShIAoBeg92fsoCyn3sfIPJMh5MF-qPN6x7Mo2VLTPR1xSAmhFI&s";


class SecondPage extends Component {
  render() {
    return (
      <div>
        <p className="main-navigation">This is the updated table:</p>
        <br /> <br /> <br />
        <MyTable />
        <br />
        <Link to="/FirstPage/">
          <img src={previousPageLogo} width="50" height="50" />
        </Link>
      </div>
    );
  }

  getHeaderBS() {
    return "badge m-2 badge-light";
  }
}
export default SecondPage;
