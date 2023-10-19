import React from "react";
import { withRouter, Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from 'react-multi-carousel';
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { TfiLocationPin } from "react-icons/tfi";
import { BsCalendarDate } from "react-icons/bs";
import Fade from 'react-reveal/Fade';
import { ToastContainer, toast } from "react-toastify";
import {Helmet} from "react-helmet";

import application from "../../assets/application.png"
import notifications from "../../assets/notifications.png"
import downloads from "../../assets/downloads.png"
import exam from "../../assets/exam.png"
import building from "../../assets/building.png"
import vacancy from "../../assets/vacancy.png"
import exams from "../../assets/exams.png"
import exam_2 from "../../assets/exam_2.png"
import workshop from "../../assets/icon/workshop.png"
import top_badge from "../../assets/top_badge.png";

import MapComponent from './mapComponent'
import 'react-multi-carousel/lib/styles.css';
import "./Home.css";
import Footer from "../../components/Footer/footer";
import "react-toastify/dist/ReactToastify.css";


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone: "",
      message: "",
      errors: {},
      isInfoModal: false
    };
    this.handleName = this.handleName.bind(this);
    this.handlePhone = this.handlePhone.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.sendContact = this.sendContact.bind(this);
    this.toastFunct = this.toastFunct.bind(this);
    this.successToast = this.successToast.bind(this);
    this.warnToast = this.warnToast.bind(this);
  }
  componentDidMount(){
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }
  handleName(event) {
    let errors = this.state.errors;
    let name = event.target.value.length
    if (name>1) {
      errors["name"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["name"] = "Must not be empty";
      this.setState({ errors: errors});
    }
    this.setState({
      name: event.target.value,
    });
  }
  handlePhone(object) {
    if (object.target.value.length <= object.target.maxLength) {
      this.setState({ phone: object.target.value });
    }
    let errors = this.state.errors;
    var phoneLength = object.target.value.length;
    if (phoneLength === 11 || phoneLength === 10 ) {
      errors["phone"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["phone"] = "Must be 10 digits";
      this.setState({ errors: errors});
    }
  }
  handleMessage(event) {
    let errors = this.state.errors;
    let message = event.target.value.length
    if (message>14) {
      errors["message"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["message"] = "Must be at least 15 characters";
      this.setState({ errors: errors});
    }
    this.setState({ message: event.target.value });
  }
  sendContact = async () => {
    const {name, phone, message, errors} = this.state;
    let nameWarning = this.state.errors["name"];
    let phoneWarning = this.state.errors["phone"];
    let messageWarning = this.state.errors["message"];
    if(name != "" && phone != "" && message != ""){
      if(nameWarning == null && phoneWarning == null && messageWarning == null)
      {
        this.toastFunct();
        let dataObj = {
          "name": this.state.name,
          "phone": this.state.phone,
          "message": this.state.message
        }
        await fetch("https://nssbrecruitment.in/admin/api/add_helpdesk.php", {
          method: "POST",
          body: JSON.stringify(dataObj),
          headers: {
              Accept: "application/json,  */*",
              "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.Status === "Helpdesk Added") {
              this.successToast();
            }
            this.setState({
              name: "",
              message: "",
              phone: ""
            })
           
        })
        .catch(function (error) {
          console.log(error);
        });
      }
      else{
        this.warnToast();
      }
    }
    else{
      this.warnToast();
    }
  };
  toastFunct() {
    toast.info("Sending ..", {
      position: "bottom-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  }
  successToast() {
    toast.success("Inquiry submitted successfully", {
      position: "bottom-center",
      autoClose: 2700,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  }
  warnToast() {
    toast.warn("Form Data Invalid", {
      position: "bottom-center",
      autoClose: 2700,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  }
  render() {
    const { fontSize } = this.props;
    //const latitude = 25.7047669;
    //const longitude = 94.1065582;
    return (
      <div style={{ fontSize: `${fontSize}px` }}>
        <Helmet>
          <html lang="en" />  
          <meta charSet="utf-8" />
          <title>Nagaland Loan Tracking Portal</title>
          <meta name="description" content="One-Time-Registration Portal of Nagaland Staff Selection Board (NSSB)" />
          <link rel="canonical" href="https://nssbrecruitment.in/" />
        </Helmet>
        <div className="about_div_1">
          <div className="dashbaord_div_1_inner">
            <h1 className="dashbaord_div_1_inner_txt" >Nagaland Loan Tracking Portal</h1>
            <h2 className="home_box_1_para_white" style={{ fontSize: fontSize >=17 ? `${fontSize}px` : '17px' }}>Apply & track your loan application progress with ease. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sapien quam, aliquam non augue id, tempus convallis urna. In hac habitasse platea dictumst. Duis sed sapien cursus, hendrerit turpis nec, accumsan nisl.</h2>
            <button className="requestQuote">
              <a className="href_reports" href="#tabs">Know More</a>
            </button>
          </div>
        </div>
          <div className="home-content-body">
            <Row>
              <Col md={3} xs={12} sm={12}>
                <Link to="/login">
                  <div className='cards'>
                    <div className="card">
                      <div className="card-body-2">
                        <img src={application}/>
                        <h2>One-Time-Registration</h2>
                        <p className="careCards_txt">Nagaland Loan Tracking Portal simplifies the process of registering, creating profile, uploading documents & tracking loan application.</p>
                      </div>
                    </div>
                  </div> 
                </Link>
              </Col>
              <Col md={3} xs={12} sm={12}>
                <Link to="/examination">
                  <div className='cards'>
                    <div className="card">
                      <div className="card-body-2">
                        <img src={exam}/>
                        <h2>Tracking</h2>
                        <p className="careCards_txt">View all the on-going updates on your loan application and check your eligiblity before applying.</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </Col>
              <Col md={3} xs={12} sm={12}>
                <div className='cards'>
                  <div className="card">
                    <div className="card-body-2">
                      <img src={notifications}/>
                      <h2>Notifications</h2>
                      <p className="careCards_txt">Find all the notifications and updates about recent events/announcements here. Make sure you check notifications frequent.</p>
                    </div>
                  </div>
                </div> 
              </Col>
              <Col md={3} xs={12} sm={12}>
                <Link to="/admit-card">
                  <div className='cards'>
                    <div className="card">
                      <div className="card-body-2">
                        <img src={downloads}/>
                        <h2>Forms & Downloads</h2>
                        <p className="careCards_txt">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sapien quam, aliquam non augue id, tempus convallis urna.</p>
                      </div>
                    </div>
                  </div>
                </Link> 
              </Col>
            </Row>
            <Row style={{marginTop: "2%"}} id="tabs">
              <Col md={8} xs={12} sm={12}>
                <p className="home_box_1_title" >Nagaland Loan Tracking Portal</p>
                <p className="home_box_1_para" style={{ fontSize: fontSize >=17 ? `${fontSize}px` : '17px' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sapien quam, aliquam non augue id, tempus convallis urna. In hac habitasse platea dictumst. Duis sed sapien cursus, hendrerit turpis nec, accumsan nisl. Sed vitae tellus eget leo pretium scelerisque. Nullam finibus varius turpis, ut placerat sapien consectetur ac. Curabitur vulputate mollis elit, a vulputate nisi ultrices eu.<br/><br/>Ut commodo a quam vulputate mollis. Fusce pulvinar tortor eget sagittis ultrices. Curabitur varius est sit amet lacus feugiat, ut aliquam purus mollis. Praesent semper dui ac augue laoreet vestibulum. Vestibulum egestas justo nec dignissim sagittis. Nam mattis quam nec nisi sollicitudin porttitor. Nullam ut bibendum risus. Pellentesque augue odio, tincidunt nec neque ut, elementum placerat augue. Pellentesque id elit at tellus interdum condimentum. In quis laoreet nisl. Cras et est nec erat laoreet lacinia quis a neque. Nullam mattis orci rutrum sem placerat rhoncus.
                </p>
                <button className="requestQuote">
                  Know more
                </button>
              </Col>
              <Col md={4} xs={12} sm={12}>
                <div className="home-content-body_right">
                  <img src={top_badge} className="home-content-body_right_img"/>
                  <br clear="all" />
                  <div className="home-content-body_right_inner scroll">
                    <div>
                      <p className="home-content-body_right_inner_header" style={{ fontSize: fontSize >=17 ? `${fontSize}px` : '17px' }}>Sample event title for Nagaland Loan Apply Portal</p>
                      <Row style={{marginTop: 5}}>
                        <Col md={1} xs={1} sm={1}>
                          <BsCalendarDate
                            size={20}
                          />
                        </Col>
                        <Col xs={7} sm={7} style={{marginTop: 2}}>
                          <span>May 9th, 2023</span>
                        </Col>
                      </Row>
                      <hr/>
                      <p className="home-content-body_right_inner_header" style={{ fontSize: fontSize >=17 ? `${fontSize}px` : '17px' }}>Sample event title for Nagaland Loan Apply Portal</p>
                      <Row style={{marginTop: 5}}>
                        <Col md={1} xs={1} sm={1}>
                          <BsCalendarDate
                            size={20}
                          />
                        </Col>
                        <Col xs={7} sm={7} style={{marginTop: 2}}>
                          <span>April 20th, 2023</span>
                        </Col>
                      </Row>
                      <hr/>
                      <p className="home-content-body_right_inner_header" style={{ fontSize: fontSize >=17 ? `${fontSize}px` : '17px' }}>Sample event title for Nagaland Loan Apply Portal</p>
                      <Row style={{marginTop: 5}}>
                        <Col md={1} xs={1} sm={1}>
                          <BsCalendarDate
                            size={20}
                          />
                        </Col>
                        <Col xs={7} sm={7} style={{marginTop: 2}}>
                          <span>April 12th, 2023</span>
                        </Col>
                      </Row>
                      <hr/>
                      <p className="home-content-body_right_inner_header" style={{ fontSize: fontSize >=17 ? `${fontSize}px` : '17px' }}>Sample event title for Nagaland Loan Apply Portal</p>
                      <Row style={{marginTop: 5}}>
                        <Col md={1} xs={1} sm={1}>
                          <BsCalendarDate
                            size={20}
                          />
                        </Col>
                        <Col xs={7} sm={7} style={{marginTop: 2}}>
                          <span>April 12th, 2023</span>
                        </Col>
                      </Row>
                      <hr/>
                      <p className="home-content-body_right_inner_header" style={{ fontSize: fontSize >=17 ? `${fontSize}px` : '17px' }}>Sample event title for Nagaland Loan Apply Portal</p>
                      <Row style={{marginTop: 5}}>
                        <Col md={1} xs={1} sm={1}>
                          <BsCalendarDate
                            size={20}
                          />
                        </Col>
                        <Col xs={7} sm={7} style={{marginTop: 2}}>
                          <span>March 29th, 2023</span>
                        </Col>
                      </Row>
                      <hr/>
                      <p className="home-content-body_right_inner_header" style={{ fontSize: fontSize >=17 ? `${fontSize}px` : '17px' }}>Sample event title for Nagaland Loan Apply Portal</p>
                      <Row style={{marginTop: 5}}>
                        <Col md={1} xs={1} sm={1}>
                          <BsCalendarDate
                            size={20}
                          />
                        </Col>
                        <Col xs={7} sm={7} style={{marginTop: 2}}>
                          <span>March 7th, 2023</span>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col md={6}>
                <MapComponent/>
                {/*<iframe
                  title="Map"
                  frameBorder="0"
                  style={{ border: 0 }}
                  className="embeddedMap"
                  src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBttNovQQfTde-VkUHOugPWUrgr9DkmmaU&center=${latitude},${longitude}&zoom=17`}
                  allowFullScreen
                 ></iframe>*/}
              </Col>
              <Col md={6}>
                <Fade bottom duration={800} cascade>
                <div className="home-content-body_4_inner1">
                    <p className="home_box_1_title_black">Helpdesk</p>
                    <p className="home_box_1_para_black" style={{ fontSize: fontSize >=17 ? `${fontSize}px` : '17px' }}>Fill up the form and our team will get back to you in 1-3 working days.</p>
                    <div className="contact-icon-first-home">
                      <Row>
                        <Col md={1} xs={1} sm={1}>
                          <FaPhoneAlt
                            size={22}
                            className="loc-icons"
                          />
                        </Col>
                        <Col md={5} xs={10} sm={10}>
                          <a href={"tel:" + "++91370221180"}>
                            <p className="contact-div1-subtitle-home number" style={{ fontSize: fontSize >=16 ? `${fontSize}px` : '16px' }}>+91-370-221180</p>
                          </a>
                        </Col>
                      </Row>
                    </div>
                    <div className="contact-icon-second-home">
                      <Row>
                        <Col md={1} xs={1} sm={1}>
                          <IoIosMail
                            size={28}
                            className="loc-icons"
                          />
                        </Col>
                        <Col md={4} xs={10} sm={10}>
                          <p className="contact-div1-subtitle-home number" style={{ fontSize: fontSize >=16 ? `${fontSize}px` : '16px' }} onClick={() => window.location = 'mailto:info.idan-ngl@gov.in'}>info.idan-ngl@gov.in</p>
                        </Col>
                      </Row>
                    </div>
                    <>
                      <input
                        className="in-cus-ct input_"
                        type="text"
                        placeholder="Name"
                        enterKeyHint="next"
                        value={this.state.name}
                        onChange={this.handleName}
                        onFocus={this.handleName}
                      />
                      {
                        this.state.errors["name"] ? (
                          <p id="marginInputs" className="loginErrorTxt">
                            {this.state.errors["name"]}
                          </p>
                        ) : (
                          <div className="emptyErrorMargins"></div>
                        )
                      }
                      <input
                        className="in-cus-ct input_"
                        placeholder="Phone Number"
                        onChange={this.handlePhone}
                        onFocus={this.handlePhone}
                        value={this.state.phone}
                        type = "number" maxLength = "10"
                      />
                      {
                        this.state.errors["phone"] ? (
                          <p id="marginInputs" className="loginErrorTxt">
                            {this.state.errors["phone"]}
                          </p>
                        ) : (
                          <div className="emptyErrorMargins"></div>
                        )
                      }
                      <textarea
                        className="in-cus-ct messageInput"
                        type="text"
                        placeholder="Message"
                        rows="4"
                        value={this.state.message}
                        onFocus={this.handleMessage}
                        onChange={this.handleMessage}
                      />
                      {
                        this.state.errors["message"] ? (
                          <p id="marginInputs" className="loginErrorTxt">
                            {this.state.errors["message"]}
                          </p>
                        ) : (
                          <div className="emptyErrorMargins_TextBox"></div>
                        )
                      }
                      <center>
                        <button className="requestQuote" onClick={this.sendContact}>
                            Submit
                        </button>
                      </center>
                    </>
                  </div>
                </Fade>
              </Col>
            </Row>
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
          </div>
          <Footer/>
      </div>
    )
  }
}

export default withRouter(Home);
