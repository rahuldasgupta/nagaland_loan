import React from "react";
import { withRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import { Bars } from  'react-loader-spinner';
import {Helmet} from "react-helmet";
import ReCAPTCHA from 'react-google-recaptcha';

import Footer from "../../../components/Footer/footer";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css"

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {},
      users: [],
      isLoading: false,
      loaderModal: false,
      isCaptchaVerified: false,
      captchaToken: null,
      captchaWarnModal: false
    };
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }
  handleRecaptchaChange = () => {
    let token = this.captchaFunction.getValue();
    if(token){
      this.setState({
        isCaptchaVerified: true,
        captchaToken: token
      });
    }
  };
  navigateRegister(){
    this.props.history.push("/register");
  }
  handleEmail = (event) => {
    var re = /\S+@\S+\.\S+/;
    var result = re.test(event.target.value);
    let errors = this.state.errors;
    if(re.test(event.target.value))
    {
      errors["email"] = null
      this.setState({ errors: errors});
    }
    else{
      errors["email"] = "Invalid Email";
      this.setState({ errors: errors });
    }
    this.setState({
      email: event.target.value.toLowerCase(),
    });
  };
  handlePassword = (event) => {
    this.setState({
        password: event.target.value
    });
    let errors = this.state.errors;
    var password = this.state.password;
    var passwordLength = password.length;
    if (passwordLength > 6) {
        errors["password"] = null
        this.setState({ errors: errors});
    }
    else {
        errors["password"] = "Must be 8 or more characters";
        this.setState({ errors: errors });
    }
  };
  handleLogin = async () => {
    if(this.state.isCaptchaVerified){
      this.setState({
        loaderModal: true
      })
      const { email, password } = this.state;
      let emailTrimmed = email.trim();
      let user = {
        "email": emailTrimmed,
        "password": password
      };
      await fetch("https://csrnagaland.in/loanidan/api/login.php", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          Accept: "application/json,  */*",
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          loaderModal: false
        })
        if(responseJson.Status === "Account Does Not Exist"){
          toast.warn('Email ID does not exist', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
        else if(responseJson.Status === "Email and Password Do Not Match"){
          toast.warn('Password is incorrect', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
        else{
          this.storeData(responseJson);
        }
      })
    }
  }
  storeData = async (userData) => {
    localStorage.setItem("userData", JSON.stringify(userData));
    let url = window.location.origin + "/profile";
    window.location.replace(url)
  };
  async componentDidMount(){
    var userData = JSON.parse(localStorage.getItem('userData'));
    if(userData){
        this.props.history.push("/profile");
    }
  }
  forgotPasswordNavigate = () => {
    this.props.history.push("/reset-password");
  }
  render() {
    const { fontSize } = this.props;
    return (
        <>
          <div className="container-box_login">
            <Modal
              show={this.state.loaderModal}
              backdrop="static"
              keyboard={false}
              centered
              size="md"
              className="transaprentModal"
            >
              <ModalBody>
                <Bars
                  height="80"
                  width="80"
                  color="#fff"
                  ariaLabel="bars-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
                {
                  this.state.APIStatus === "Changing Password" ?
                    <p className="loaderText">Please Wait, Changing Password</p>
                    :
                    <></>
                }
                {
                  this.state.APIStatus === "Sending OTP" ?
                    <p className="loaderText">Please Wait, Sending Email OTP</p>
                    :
                    <></>
                }
              </ModalBody>
            </Modal>
            <Helmet>
                <html lang="en" />  
                <meta charSet="utf-8" />
                <title>Nagaland Loan Tracking Portal | Login</title>
                <meta name="description" content="One-Time-Registration Portal of Nagaland Staff Selection Board (NSSB)" />
                <link rel="canonical" href="https://nssbrecruitment.in/" />
            </Helmet>
              <div className="login_containerBox_inner">
                <p className="login_header_text" style={{ fontSize: fontSize >27 ? `${fontSize}px` : '27px' }}>Login</p>
                <div style={{marginTop:"4.5%"}}>
                  <p className="input_header_txt" style={{ fontSize: fontSize >16.3 ? `${fontSize}px` : '16.3px' }}>Email ID</p>
                  <input
                      className="emailInput"
                      type="text"
                      placeholder="Enter your Email ID"
                      onChange={this.handleEmail}
                      onFocus={this.handleEmail}
                      value={this.state.email}
                  />
                  {  
                      this.state.errors["email"] ? (
                          <span
                              id="marginInputs"
                              className="validateErrorTxt registerInputMargin"
                          >
                              {this.state.errors["email"]}
                          </span>
                      ) :
                      (
                          <div className="registerInputMargin"></div>
                      )
                  }
                  <p className="input_header_txt" style={{ fontSize: fontSize >16.3 ? `${fontSize}px` : '16.3px' }}>Password</p>
                  <input
                      className="emailInput"
                      type="password"
                      placeholder="Enter your password"
                      onChange={this.handlePassword}
                      onFocus={this.handlePassword}
                      value={this.state.password}
                  />
                  {  
                      this.state.errors["password"] ? (
                          <span
                              id="marginInputs"
                              className="validateErrorTxt registerInputMargin"
                          >
                              {this.state.errors["password"]}
                          </span>
                      ) :
                      (
                          <div className="registerInputMargin"></div>
                      )
                  }
                  <p className="login_ForgotPasswordText" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '15px' }} onClick={this.forgotPasswordNavigate}>Forgot Password?</p>
                  <center>
                    <ReCAPTCHA
                      ref={ref => (this.captchaFunction = ref)}
                      sitekey="6LfuaJonAAAAAKDObMmXzpa2XvQrIKcte44PGuV6"
                      onChange={this.handleRecaptchaChange}
                    />
                  </center>
                </div>
                <div className="login_button" onClick={() => this.handleLogin()}>
                    <p className="login_signup_ques_text_white">Log In</p>
                </div>
                <p className="signup_with" style={{ fontSize: fontSize >15 ? `${fontSize}px` : '14.5px' }}>Don't have an account?</p>
                <div className="social_button" onClick={() => this.navigateRegister()}>
                    <p className="login_signup_ques_text">Register</p>
                </div>
              </div>
          </div>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Footer/>
        </>
      
    )
  }
}
export default withRouter(Login);
