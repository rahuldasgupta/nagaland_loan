import React from "react";
import { withRouter, Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import moment from 'moment';
import {Helmet} from "react-helmet";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import { Bars } from  'react-loader-spinner';
import Lottie from 'react-lottie';

import youtube from '../../assets/youtube.json'; 
import './examination.css'
import Footer from "../../components/Footer/footer";

class Examination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      examinationData: [],
      loaderModal: true
    };
  }
  componentDidMount(){
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    this.getExaminationDetails()
  }
  getExaminationDetails = async() => {
    await fetch(`https://nssbrecruitment.in/admin/api/examination.php`, {
        method: 'GET',
        })
        .then((response) => response.json())
        .then((responseJson) => {
            let arr = responseJson;
            const reversedArr = arr.reverse();
            this.setState({
                examinationData: reversedArr
            });
            this.setState({
              loaderModal: false
            })
        })
        .catch((error) => {
          console.error(error);
        });
  }
  renderLastDate = (item, fontSize) => {
    const registrationLastDate = item.ending_date_reg;
    const formattedDate = moment(registrationLastDate).format('Do MMMM, YYYY');

    const targetDate = moment(registrationLastDate, 'YYYY-MM-DD HH:mm:ss');
    const today = moment();
    const numberOfDays = targetDate.diff(today, 'days');


    //LAST DAY CALCULATIONS
    const now = moment();
    const fourPM = moment().set({ hour: 16, minute: 0, second: 0, millisecond: 0 });
    const duration = moment.duration(fourPM.diff(now));
    const hours = duration.hours();
    const minutes = duration.minutes();
    const formattedTimeLeft = `${hours} hours, ${minutes} mins`;
    return(
        <>
          {
            numberOfDays >0 ?
            <>
              {/*<p className="examTab_LastDate" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>Last Date: {formattedDate} {"("}{numberOfDays} days remaining{")"}</p>*/}
              <p className="examTab_LastDate" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>Last Date: Today at 4PM {"("}{formattedTimeLeft} left{")"}</p>
            </>
            :
            <p className="examTab_LastDate" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>Last Date: {formattedDate}</p>
          }
        </>
    )
  }
  renderExamDate = (item, fontSize) => {
    const registrationLastDate = item.exam_start_date;
    const formattedDate = moment(registrationLastDate).format('Do MMMM, YYYY');
    return(
        <>
          <p className="examTab_LastDate" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>Exam Date: {formattedDate}</p>
        </>
    )
  }
  handleNavigation = (examID) => {
    localStorage.setItem("examID", examID);
    this.props.history.push("/view-examination");
  }
  render() {
    const { fontSize } = this.props;
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: youtube,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    }
    const animationStyles = {
      width: '60px',
      height: '60px',
    };
    return (
      <div style={{ fontSize: `${fontSize}px` }}>
        <Helmet>
            <html lang="en" />  
            <meta charSet="utf-8" />
            <title>NSSB: Nagaland Staff Selection Board - Registration Portal | Examinations</title>
            <meta name="description" content="One-Time-Registration Portal of Nagaland Staff Selection Board (NSSB)" />
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
            </ModalBody>
        </Modal>
        <div className="settings_body">
            <p className="login_header_text">Examinations</p>
            <p className="examTab_subTitle" style={{ fontSize: fontSize >=17 ? `${fontSize}px` : '17px' }}>Make sure you've submitted all your educational documents & certificates to be eligible.</p>
            <Row>
              <Col md={4} xs={12} sm={12}>
                <div className="forMobile">
                  <div className="lottieContainer_5" onClick={() => window.open("https://www.youtube.com/watch?v=xxYFMCqLx4k", "_blank")}>
                    <Row>
                        <Col md={2} xs={2} sm={2}>
                            <Lottie options={defaultOptions}  style={animationStyles} />
                        </Col>
                        <Col md={10} xs={10} sm={10} className="lottieDivTxt4">
                            <p className="lottieDivTxt4"> Tutorial: How to apply in NSSB Portal</p>
                        </Col>
                    </Row>
                  </div>
                </div>
                <div className="lottieContainer_5 forPC" onClick={() => window.open("https://www.youtube.com/watch?v=xxYFMCqLx4k", "_blank")}>
                    <Row>
                        <Col md={2} xs={2} sm={2}>
                            <Lottie options={defaultOptions}  style={animationStyles} />
                        </Col>
                        <Col md={10} xs={10} sm={10} className="lottieDivTxt5">
                            <p className="lottieDivTxt5"> Tutorial: How to apply in NSSB Portal</p>
                        </Col>
                    </Row>
                </div>
              </Col>
            </Row>
            <Row>
                {
                    this.state.examinationData.map((item, key) =>(
                        <Col md={4} key={key}>
                            <div className="examTabs">
                              <p className="examTab_title" style={{ fontSize: fontSize >=17 ? `${fontSize}px` : '16px' }}>{item.exam_name}</p>
                              {
                                  item.is_active == "True" ?
                                      <p className="emailVerifyHeader_register">Registration Ongoing</p>
                                  :
                                    <p className="examRegistrationClosed">Registration Closed</p>
                              }
                              {this.renderLastDate(item, fontSize)}
                              {this.renderExamDate(item, fontSize)}
                              {
                                  item.is_active == "True" ?
                                      <div className="login_button" onClick={() => this.handleNavigation(item.exam_code)}>
                                          <p className="login_signup_ques_text_white">View Details</p>
                                      </div>
                                  :
                                      <div className="login_button_disabled">
                                          <p className="login_signup_ques_text_white">Closed</p>
                                      </div>
                              }
                            </div>
                        </Col>
                    ))
                }                
            </Row>
        </div>
        <Footer/>
      </div>
    )
  }
}
export default withRouter(Examination);