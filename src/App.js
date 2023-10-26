import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from './components/Navbar/index';

import Home from "./pages/home/Home";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import ForgotPassword from "./pages/auth/forgotPassword/ForgotPassword";
import Profile from "./pages/profile/Profile";
import about from "./pages/about/about";

//import cancellation_policy from "./pages/policies/cancellationPolicy";
//import feesPolicy from "./pages/policies/feesPolicy";
import faq from "./pages/faq/faq";


import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontSize: parseInt(localStorage.getItem("fontSize")) || 17,
    };
  }
  componentDidMount() {
    this.updateLocalStorageFontSize();
    if (window.innerWidth <= 768) {
      this.resetFontSize();
    }
  }
  updateLocalStorageFontSize = () => {
    localStorage.setItem("fontSize", this.state.fontSize);
  };
  increaseFontSize = () => {
    this.setState((prevState) => ({
      fontSize: prevState.fontSize + 1,
    }), this.updateLocalStorageFontSize);
  };
  decreaseFontSize = () => {
    this.setState((prevState) => ({
      fontSize: prevState.fontSize - 1,
    }), this.updateLocalStorageFontSize);
  };
  resetFontSize = () => {
    this.setState({
      fontSize: 16,
    }, this.updateLocalStorageFontSize);
  };
  render() {
    const { fontSize } = this.state;
    return (
      <Router>
        <Navbar increaseFontSize={this.increaseFontSize} resetFontSize={this.resetFontSize} decreaseFontSize={this.decreaseFontSize}/>
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => <Home {...props} fontSize={fontSize} />}
          />
          <Route
            exact
            path="/login"
            render={(props) => <Login {...props} fontSize={fontSize} />}
          />
          <Route
            exact
            path="/register"
            render={(props) => <Register {...props} fontSize={fontSize} />}
          />
          <Route
            exact
            path="/reset-password"
            render={(props) => <ForgotPassword {...props} fontSize={fontSize} />}
          />
          <Route
            exact
            path="/profile"
            render={(props) => <Profile {...props} fontSize={fontSize} />}
          />
          <Route path="/about" component={about} />
        </Switch>
      </Router>
    );
  }
}

export default App;