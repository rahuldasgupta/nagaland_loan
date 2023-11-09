import React from "react";
import { withRouter } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OtpInput from 'react-otp-input';
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import { Bars } from  'react-loader-spinner';
import {Helmet} from "react-helmet";
import ReCAPTCHA from 'react-google-recaptcha';

import Footer from "../../../components/Footer/footer";
import "react-toastify/dist/ReactToastify.css";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      switchView: "Email Enter",
      passwordSubmitChecked: false,
      basicsChecked: false,
      userID: null,
      email: "",
      password: "",
      confirmPassword: "",
      errors: {},
      users: [],
      isLoading: false,
      countDown: 30,
      isCountDownStarted: false,
      enteredOTP: "",
      responseOTP: "",
      loaderModal: false,
      APIStatus: "Sending OTP",
      isCaptchaVerified: false,
      captchaToken: null
    };
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
    this.submitEmail = this.submitEmail.bind(this);
  }
  navigateLogin(){
    let url = window.location.origin + "/login";
    window.location.replace(url)
  }
  handleRecaptchaChange = () => {
    let token = this.captchaFunction.getValue();
    if(token){
      this.setState({
        isCaptchaVerified: true,
        captchaToken: token
      });
    }
    setTimeout(() => {
      this.basicsCheck()
    }, 400);
  };
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
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
  };
  basicsCheck = () => {
    const {email} = this.state;
    let emailWarning = this.state.errors["email"];

    if(email != null && email != "" && this.state.isCaptchaVerified){
      if(emailWarning == null)
      {
        this.setState({
          basicsChecked: true
        })
      }
      else{
        this.setState({
          basicsChecked: false
        })
      }
    }
    else{
      this.setState({
        basicsChecked: false
      })
    }
  }
  submitEmail = async () => {
    if(this.state.isCaptchaVerified){
      this.setState({
        loaderModal: true,
        APIStatus: "Sending OTP"
      })
      let email = this.state.email;
      let emailTrimmed = email.trim();
      let user = {
        "email": emailTrimmed,
      };
      await fetch("https://nssbrecruitment.in/admin/api/forget_password_email.php", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          Accept: "application/json,  */*",
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + "eyJhbGdvIjoiSFMyNTYiLCJ0eXBlIjoiSldUIiwiZXhwaXJlIjoxNjkxNjQ2MTc4fQ==.eyJ1c2VyX2lkIjoxNCwidGltZSI6MTY5MTY0NjE3OH0=.ZmNkZmM5MGRmODI1NGUwMzY0MmZkMWE1NWVjMzE5YzIyMGJlMzRjNTA5MjJkZGU2MTFkNGRjM2VlYWI2OGJmMg=="
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          loaderModal: false
        })
        if(responseJson.Status === "False"){
          toast.warn("Email ID does not exist", {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        }
        else{
          this.setState({
            userID: responseJson[0].id,
            responseOTP: responseJson[0].otp,
            switchView: "OTP Enter"
          })
          window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        }
      })
    }
  }
  handleOTPChange = (otp) => {
    let errors = this.state.errors;
    errors["incorrectOTP"] = null
    this.setState({ enteredOTP: otp, errors: errors });
  }
  verifyOTP = () => {
    let errors = this.state.errors;
    let responseOTP = this.state.responseOTP;
    let enteredOTP = this.state.enteredOTP;

    if(enteredOTP == responseOTP){
      errors["incorrectOTP"] = null
      this.setState({
        errors: errors,
        switchView: "New Password Enter"
      })
    }
    else{
      errors["incorrectOTP"] = "OTP entered is incorrect";
      this.setState({ errors: errors});
    }
  }
  resendOTP = async() => {
    toast.success("OTP Sent to " + this.state.email, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
    this.setState({
      isCountDownStarted: true,
    })
    this.countdownTimer();

    let email = this.state.email;
    let emailTrimmed = email.trim();
    let user = {
      "email": emailTrimmed,
    };
    await fetch("https://nssbrecruitment.in/admin/api/forget_password_email.php", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        Accept: "application/json,  */*",
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + "eyJhbGdvIjoiSFMyNTYiLCJ0eXBlIjoiSldUIiwiZXhwaXJlIjoxNjkxNjQ2MTc4fQ==.eyJ1c2VyX2lkIjoxNCwidGltZSI6MTY5MTY0NjE3OH0=.ZmNkZmM5MGRmODI1NGUwMzY0MmZkMWE1NWVjMzE5YzIyMGJlMzRjNTA5MjJkZGU2MTFkNGRjM2VlYWI2OGJmMg=="
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.Status === "False"){
        toast.warn("Email ID does not exist", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
      }
      else{
        this.setState({
          responseOTP: responseJson[0].otp
        })
      }
    })
  }
  countdownTimer = () => {
    if(this.state.countDown > 0){
      this.setState({
        countDown: this.state.countDown-1
      })
      setTimeout(() => {
        this.countdownTimer()
      }, 1000);
    }
    else{
      this.setState({
        isCountDownStarted: false,
        countDown: 30
      })
    }
  }


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
    if (this.state.confirmPassword === event.target.value) {
      errors["confirmPassword"] = null
      this.setState({ errors: errors});
    }
    else {
        errors["confirmPassword"] = "Password does not match";
        this.setState({ errors: errors });
    }
    setTimeout(() => {
      this.passwordSubmitCheck()
    }, 100);
  };
  handleConfirmPassword = (event) => {
    this.setState({
      confirmPassword: event.target.value
    });
    let errors = this.state.errors;
    var password = this.state.password;
    if (password === event.target.value) {
        errors["confirmPassword"] = null
        this.setState({ errors: errors});
    }
    else {
        errors["confirmPassword"] = "Password does not match";
        this.setState({ errors: errors });
    }
    setTimeout(() => {
      this.passwordSubmitCheck()
    }, 100);
  };
  passwordSubmitCheck = () => {
    const {password, confirmPassword} = this.state;

    let confirmPasswordWarning = this.state.errors["confirmPassword"];
    let passwordWarning = this.state.errors["password"];

    if(password != null && password != "" && confirmPassword != null && confirmPassword != "" ){
      if(confirmPasswordWarning == null && passwordWarning == null)
      {
        this.setState({
          passwordSubmitChecked: true
        })
      }
      else{
        this.setState({
          passwordSubmitChecked: false
        })
      }
    }
    else{
      this.setState({
        passwordSubmitChecked: false
      })
    }
  }
  updatePassword = async() => {
    this.setState({
      loaderModal: true,
      APIStatus: "Changing Password"
    })
    let userID = this.state.userID;
    let password = this.state.password;
    let user = {
      "user_id": userID,
      "new_password": password
    };
    await fetch("https://nssbrecruitment.in/admin/api/change_password.php", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        Accept: "application/json,  */*",
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + "eyJhbGdvIjoiSFMyNTYiLCJ0eXBlIjoiSldUIiwiZXhwaXJlIjoxNjkxNTc2ODY1fQ==.eyJ1c2VyX2lkIjoxMiwidGltZSI6MTY5MTU3Njg2NX0=.ZmE1MGM2NzNjZWExMjUwYjdmMDFkOTJlOWY2NzJkYTM1Mjc3MzFkNDJmOWJmMDIzYTM4M2MzNjgwMGNiNjA3Mg=="
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        loaderModal: false,
      })
      this.storeData(responseJson)
    })
  }
  storeData = async (userData) => {
    let response = []
    response.push(userData)
    localStorage.setItem("userData", JSON.stringify(response));
    this.props.history.push("/profile");
    window.location.reload();
  };
  async componentDidMount(){
    var userData = JSON.parse(localStorage.getItem('userData'));
    if(userData){
        this.props.history.push("/profile");
    }
  }
  render() {
    const { fontSize } = this.props;
    return (
        <>
          <div className="container-box_login">
              <Helmet>
                  <html lang="en" />  
                  <meta charSet="utf-8" />
                  <title>Nagaland Loan Tracking Portal | Forgot Password</title>
                  <meta name="description" content="One-Time-Registration Portal of Credit Outreach Facilitation Unit (COFU) : Nagaland" />
                  <link rel="canonical" href="https://nssbrecruitment.in/" />
              </Helmet>
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
              <div className="login_containerBox_inner">
                {
                    this.state.switchView === "Email Enter" ?
                    <>
                        <p className="login_header_text" style={{ fontSize: fontSize >27 ? `${fontSize}px` : '27px' }}>Forgot Password</p>
                        <div style={{marginTop:"4.5%"}}>
                        <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Email ID</p>
                        <input
                            className="emailInput"
                            type="text"
                            placeholder="Enter your registered Email ID"
                            onChange={this.handleEmail}
                            onFocus={this.handleEmail}
                            onBlur={this.basicsCheck}
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
                                <></>
                            )
                        }
                        </div>
                        <center>
                          <br/>
                          <ReCAPTCHA
                            ref={ref => (this.captchaFunction = ref)}
                            sitekey="6LfuaJonAAAAAKDObMmXzpa2XvQrIKcte44PGuV6"
                            onChange={this.handleRecaptchaChange}
                          />
                        </center>
                        {
                          this.state.basicsChecked ?
                            <div className="login_button" onClick={() => this.submitEmail()}>
                                <p className="login_signup_ques_text_white">Send OTP</p>
                            </div>
                          :
                            <div className="login_button_disabled">
                                <p className="login_signup_ques_text_white">Send OTP</p>
                            </div>
                        }
                        <br/>
                        <hr className="forgotPassword_hr"/>
                        <p onClick={this.navigateLogin} className="forgotPassword_Back">Back</p>
                    </>
                    :
                    <></>
                }
                {
                    this.state.switchView === "OTP Enter" ?
                        <>
                            <p className="login_header_text" style={{ fontSize: fontSize >28 ? `${fontSize}px` : '27px' }}>Verify Email</p>
                            <center>
                                <p className="emailVerifyHeader_register" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>{this.state.email}</p>
                                <p className="verifyEmail_subheader_text" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>OTP has been sent on the registered Email ID. Check Inbox/Spam folder</p>
                            </center>
                            <div className="otp_input_center">
                              <OtpInput
                                  value={this.state.enteredOTP}
                                  onChange={this.handleOTPChange}
                                  isInputNum={true}
                                  inputStyle={{  
                                      width: '2.3em',  
                                      height: '2.3em',  
                                      margin: '20px 1rem',  
                                      fontSize: '1.5rem',
                                      color: "#ababab",
                                      borderRadius: 8,  
                                      border: '2px solid #ababab',      
                                  }}
                                  focusStyle={{
                                      border: '2px solid #0783de', 
                                  }}
                                  numInputs={4}
                                  separator={<span>-</span>}
                              />
                            </div>
                            <center>
                              {  
                                  this.state.errors["incorrectOTP"] ? (
                                      <span
                                          id="marginInputs"
                                          className="otpERROR_register"
                                      >
                                          {this.state.errors["incorrectOTP"]}
                                      </span>
                                  ) :
                                  <></>
                              }
                            </center>
                            <Row>
                            <Col md={6} sm={6} xs={6}>
                                <div className="changeEmail_button" onClick={()=> this.setState({switchView: "Email Enter", enteredOTP: ""})}>
                                    <p className="login_signup_ques_text_blue">Change Email</p>
                                </div>
                            </Col>
                            <Col md={6} sm={6} xs={6}>
                                {
                                    this.state.enteredOTP.length === 4 ?
                                    <div className="login_button" onClick={this.verifyOTP}>
                                        <p className="login_signup_ques_text_white">Verify</p>
                                    </div>
                                    :
                                    <>
                                    {
                                        this.state.isCountDownStarted ?
                                        <div className="login_button_disabled">
                                            <p className="login_signup_ques_text_white">Wait {this.state.countDown} secs</p>
                                        </div>
                                        :
                                        <div className="login_button"  onClick={this.resendOTP}>
                                            <p className="login_signup_ques_text_white">Resend</p>
                                        </div>
                                    }
                                    </>
                                }
                            </Col>
                            </Row>
                        </>
                    :
                        <></>
                }
                {
                    this.state.switchView === "New Password Enter" ?
                    <>
                        <p className="login_header_text" style={{ fontSize: fontSize >28 ? `${fontSize}px` : '27px' }}>Change Password</p>
                        <div style={{marginTop:"4.5%"}}>
                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>New Password</p>
                            <input
                                className="emailInput"
                                type="password"
                                placeholder="Minimum 8 characters"
                                onChange={this.handlePassword}
                                onFocus={this.handlePassword}
                                onBlur={this.passwordSubmitCheck}
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
                                <div className="registerInputMargin"></div>
                            }
                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Confirm New Password</p>
                            <input
                                className="emailInput"
                                type="password"
                                placeholder="Minimum 8 characters"
                                onChange={this.handleConfirmPassword}
                                onFocus={this.handleConfirmPassword}
                                onBlur={this.passwordSubmitCheck}
                                value={this.state.confirmPassword}
                            />
                            {  
                                this.state.errors["confirmPassword"] ? (
                                    <span
                                        id="marginInputs"
                                        className="validateErrorTxt registerInputMargin"
                                    >
                                        {this.state.errors["confirmPassword"]}
                                    </span>
                                ) :
                                <></>
                            }
                            {
                                this.state.passwordSubmitChecked ?
                                <div className="login_button" onClick={this.updatePassword}>
                                    <p className="login_signup_ques_text_white">Submit</p>
                                </div>
                                :
                                <div className="login_button_disabled">
                                    <p className="login_signup_ques_text_white">Submit</p>
                                </div>
                            }
                        </div>
                    </>
                    :
                    <></>
                }
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
export default withRouter(ForgotPassword);
