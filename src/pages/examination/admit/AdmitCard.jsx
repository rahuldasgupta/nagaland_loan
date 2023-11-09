import React from "react";
import { withRouter } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Helmet} from "react-helmet";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import { Bars } from  'react-loader-spinner';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import axios from 'axios';
import { BsCircle, BsCheckCircleFill, BsInfoCircle } from "react-icons/bs";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import Checkbox from '@mui/material/Checkbox';
import { ToastContainer, toast } from "react-toastify";

import sample from "../../../assets/sample.pdf"
import '../examination.css'
import Footer from "../../../components/Footer/footer";
import "react-toastify/dist/ReactToastify.css";

class AdmitCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      examinationData: [],
      loaderModal: false,
      confirmationModal: false,
      notLoggedInModal: true,
      isTOC: true,
      userData: {},
      admitCartDetails: {},
      docsWarningModal: false,
      missingPassport: false,
      missingSignature: false,
      authStatus: "",
      notAppliedModal: false
    };
    this.tocUpdate = this.tocUpdate.bind(this);
  }
  componentDidMount(){
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    var userData = JSON.parse(localStorage.getItem('userData'));
    if(userData){
      this.setState({
        notLoggedInModal: false,
        loaderModal: true
      })
      this.getUserData(userData[0].id, userData[0].auth_bearer_token)
    }
    else{
        this.setState({
            notLoggedInModal: true
        });
    }
  }
  getUserData = async(userID, token) => {
    let user = {
        "user_id": userID
    }
    await fetch("https://nssbrecruitment.in/admin/api/get_user_details.php", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            Accept: "application/json,  */*",
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
        if(responseJson.Status && responseJson.Status == "Invalid Token"){
            localStorage.clear();
            this.props.history.push("/login");
        }
        this.setState({
          userData: responseJson.userData[0],
        })
        if(responseJson.userData[0].passport_photo == ""){
          this.setState({docsWarningModal: true, missingPassport: true})
        }
        if(responseJson.userData[0].signature_docs == ""){
          this.setState({docsWarningModal: true, missingSignature: true})
        }
        this.getAdmitCardDetails(userID, token)
    })
  }
  getAdmitCardDetails = async(userID, token) => {
    let user = {
      "user_id": userID
    }
    await fetch("https://nssbrecruitment.in/admin/api/admit_card_generate_details.php", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            Accept: "application/json,  */*",
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
        if(responseJson.Status && responseJson.Status == "Invalid Token"){
            localStorage.clear();
            this.props.history.push("/login");
        }
        if(responseJson[0]){
          this.setState({
            admitCartDetails: responseJson[0],
            authStatus: responseJson[0].authStatus,
            loaderModal: false
          })
          if(responseJson[0].is_pwd_applied == "true"){
            this.setState({
              authStatus: "0300"
            })
          }
        }
        else{
          this.setState({
            loaderModal: false,
            notAppliedModal: true
          })
        }
    })
  }
  generateAdmitCard = async() => {
    toast.success("Downloading Admit Card", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
    const { userData, admitCartDetails } = this.state;
    const existingPdfBytes = await this.fetchPDF(sample);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
    const passportURL = userData.passport_photo;

    let passportResponse = await axios.get(passportURL, {
        responseType: 'arraybuffer',
    });
    const passportBytes = passportResponse.data;

    var uint = new Uint8Array(passportBytes);
    var format;
    if (uint.length >= 2) {
        if (uint[0] === 0xFF && uint[1] === 0xD8) {
          format = 'image/jpeg';
        } else if (uint[0] === 0x89 && uint[1] === 0x50) {
          format = 'image/png';
        }
    }
  
    let passport;
    if (format === 'image/png') {
        passport = await pdfDoc.embedPng(passportBytes);
    } else if (format === 'image/jpeg') {
        passport = await pdfDoc.embedJpg(passportBytes);
    } else {
        console.error('Unsupported image format');
        return;
    }


    //For SIGNATURE
    const signatureURL = userData.signature_docs

    let signatureResponse = await axios.get(signatureURL, {
        responseType: 'arraybuffer',
    });
    const signatureBytes = signatureResponse.data;

    var uint = new Uint8Array(signatureBytes);
    var format;
    if (uint.length >= 2) {
        if (uint[0] === 0xFF && uint[1] === 0xD8) {
          format = 'image/jpeg';
        } else if (uint[0] === 0x89 && uint[1] === 0x50) {
          format = 'image/png';
        }
    }
  
    let signature;
    if (format === 'image/png') {
        signature = await pdfDoc.embedPng(signatureBytes);
    } else if (format === 'image/jpeg') {
        signature = await pdfDoc.embedJpg(signatureBytes);
    } else {
        console.error('Unsupported image format');
        return;
    }

    // Add image to the first page of the PDF
    const firstPage = pdfDoc.getPages()[0];
    
    firstPage.drawImage(passport, {
      x: 422,
      y: 490,
      width: 120, 
      height: 129,
    });
    firstPage.drawImage(signature, {
        x: 67,
        y: 157,
        width: 140,
        height: 80,
    });
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    firstPage.drawText(admitCartDetails.roll_no, {
      x: 222.5,
      y: 607, 
      color: rgb(0, 0, 0),
      font: font,
      size: 12,
    });
    firstPage.drawText(userData.full_name, {
      x: 223,
      y: 585,
      color: rgb(0, 0, 0),
      font: font,
      size: 12
    });
    firstPage.drawText(admitCartDetails.date_of_birth, {
        x: 223,
        y: 562,
        color: rgb(0, 0, 0),
        font: font,
        size: 12
    });
    firstPage.drawText(userData.father_name, {
        x: 223,
        y: 538.5,
        color: rgb(0, 0, 0),
        font: font,
        size: 12
    });
    firstPage.drawText(userData.tribe, {
        x: 223,
        y: 516.5,
        color: rgb(0, 0, 0),
        font: font,
        size: 12
    });
    {
      admitCartDetails.is_pwd_applied == "true" ?
        firstPage.drawText(admitCartDetails.pwd_category, {
          x: 223, 
          y: 495,
          color: rgb(0, 0, 0),
          font: font,
          size: 12
        })
      :
        <></>
    }
    firstPage.drawText("21-10-2023", {
      x: 80,
      y: 407,
      color: rgb(0, 0, 0),
      font: font,
      size: 11
    });
    firstPage.drawText("09:00 AM to 12:00PM", {
        x: 174,
        y: 407,
        color: rgb(0, 0, 0),
        font: font,
        size: 11
    });
    let address = admitCartDetails.exam_centres;
    const parts = address.split(/,|\./);
    firstPage.drawText(parts[0] + ",", {
      x: 305,
      y: 415,
      color: rgb(0, 0, 0),
      font: font,
      size: 11
    });
    let town = parts[2] ? parts[1].trim() + ", " + parts[2].trim() : parts[1].trim()
    firstPage.drawText(town + ", Nagaland", {
      x: 305,
      y: 400,
      color: rgb(0, 0, 0),
      font: font,
      size: 11
    });
    // Save modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

    // Trigger download
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(modifiedPdfBlob);
    downloadLink.download = 'admit_card.pdf';
    downloadLink.click();
  }
  fetchPDF = async (url) => {
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    return data;
  };
  tocUpdate(e) {
    this.setState({ isTOC: !e.target.checked });
  }
  render() {
    const { fontSize } = this.props;
    const { isTOC, userData, admitCartDetails, missingPassport, missingSignature, authStatus } = this.state;
    return (
      <div style={{ fontSize: `${fontSize}px` }}>
        <Helmet>
            <html lang="en" />  
            <meta charSet="utf-8" />
            <title>Nagaland Loan Tracking Portal | Admit Card</title>
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
            </ModalBody>
        </Modal>
        <Modal
            show={this.state.notLoggedInModal}
            backdrop="static"
            keyboard={false}
            centered
            size="md"
        >
            <ModalBody>
              <div style={{padding: 5}}>
                <p className="login_header_text">Warning</p>
                <center>
                  <p className="emailVerifyHeader_register" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>You're not logged in</p>
                  <p className="viewExam_WarnModalSubtitles" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '15px' }}>In order to generate Admit Card for the examination, you must be logged in.</p>
                  <div className="changeEmail_button" onClick={()=> this.props.history.push("/login")}>
                      <p className="login_signup_ques_text_blue">Login</p>
                  </div>
                </center>
              </div>
            </ModalBody>
        </Modal>
        <Modal
            show={this.state.confirmationModal}
            backdrop="static"
            keyboard={false}
            centered
            size="lg"
        >
          <ModalBody>
            <div className="disclaimerDiv">
              <IoClose
                  size={25}
                  className="closeIcon"
                  onClick={() => this.setState({ confirmationModal: false, })}
              />
              <p className="login_header_text" style={{ fontSize: fontSize >28 ? `${fontSize}px` : '27px' }}>Confirmation</p>
              <p className="admit_subTitle" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Kindly review the fields below as you submitted during One-Time-Registration.</p>
              <Row>
                <Col md={9} xs={6} sm={6}>
                  <div>
                    <p className="admit_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Full Name: <span className="admit_subheader_txt">{userData.full_name}</span></p>
                    <p className="admit_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Father's Name: <span className="admit_subheader_txt">{userData.father_name}</span></p>
                    <p className="admit_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Date of Birth: <span className="admit_subheader_txt">{admitCartDetails.date_of_birth}</span></p>
                    <p className="admit_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Tribe: <span className="admit_subheader_txt">{userData.tribe}</span></p>
                    <p className="admit_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Gender: <span className="admit_subheader_txt">{userData.gender}</span></p>
                    <p className="admit_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>PwD Category: <span className="admit_subheader_txt">{admitCartDetails.is_pwd_applied == "true" ? admitCartDetails.pwd_category : "No"}</span></p>
                  </div>
                </Col>
                <Col md={3} xs={6} sm={6}>
                  <div className="emptyPasstport_Admit">
                    <center>
                      <img src={userData.passport_photo} className="passport_img" alt="Passport Photo" />
                    </center>
                  </div>
                  <div className="emptySignature_Admit">
                    <center>
                      <img src={userData.signature_docs} className="signature_img" alt="Signature" />
                    </center>
                  </div>
                </Col>
              </Row>
              {
                authStatus == "0300" ?
                <>
                  <div className="admit_checkBox">
                    <Checkbox
                        checked={!isTOC}
                        onChange={this.tocUpdate}
                        icon={<BsCircle size={20} className="chbk-icons"/>}
                        checkedIcon={<BsCheckCircleFill size={20} className="chbk-icons"/>}
                    />
                    <span className="disclaimerTxt">I agree that <b>all the information submitted above are correct.</b></span>
                  </div>
                  {
                    this.state.isTOC ?
                      <div className="login_button_disabled">
                        <p className="login_signup_ques_text_white">Agree to the instructions above</p>
                      </div>
                    :
                      <div className="login_button" onClick={this.generateAdmitCard}>
                        <p className="login_signup_ques_text_white">Generate & Download</p>
                      </div>
                  }
                </>
                :
                <>
                  <div className="OTR_SuccessfulMessageWarn admit_WarnBox">
                      <p className="OTR_SuccessfulMessageTxt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Your payment was not successful. Kindly contact NSSB Helpline <a href={"tel:" + "+919366495971"}><span className="admit_profileTxt">(+91-9366495971)</span></a> for futher assistance.</p>
                  </div>
                  <div className="login_button_disabled">
                    <p className="login_signup_ques_text_white">Generate Admit Card</p>
                  </div>
                </>
              }
              
            </div>
          </ModalBody>
        </Modal>
        <Modal
            show={this.state.docsWarningModal}
            backdrop="static"
            keyboard={false}
            centered
            size="md"
        >
            <ModalBody>
              <div style={{padding: 5}}>
                <p className="login_header_text">Warning</p>
                <center>
                  <p className="admit_missingNotice" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>
                    {
                      missingPassport && missingSignature ?
                      "Passport Photo & Signature are"
                      :
                      <>
                        {
                          missingPassport ? "Passport Photo is" : "Signature is"
                        }
                      </>
                    } not uploaded
                  </p>
                  <p className="viewExam_WarnModalSubtitles" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '15px' }}>
                    In order to generate Admit Card, you must upload your
                    {
                      missingPassport && missingSignature ?
                      " Passport Photo & Signature in "
                      :
                      <>
                        {
                          missingPassport ? " Passport Photo in " : " Signature in "
                        }
                      </>
                    }
                    <span onClick={() => this.props.history.push("/profile")} className="admit_profileTxt">Profile</span>
                    </p>
                  <div className="changeEmail_button" onClick={()=> this.props.history.push("/profile")}>
                      <p className="login_signup_ques_text_blue">Edit Information in Profile</p>
                  </div>
                </center>
              </div>
            </ModalBody>
        </Modal>
        <Modal
            show={this.state.notAppliedModal}
            backdrop="static"
            keyboard={false}
            centered
            size="md"
        >
            <ModalBody>
              <div style={{padding: 5}}>
                <p className="login_header_text">Warning</p>
                <center>
                  <p className="admit_missingNotice" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>
                    You are ineligible
                  </p>
                  <p className="viewExam_WarnModalSubtitles" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '15px' }}>
                    As you have not applied for the Clerical & Allied Services Examination 2023, you are ineligible to generate Admit Card.
                  </p>
                  <br className="counter_br"/>
                </center>
              </div>
            </ModalBody>
        </Modal>
        <div className="settings_body">
            <p className="login_header_text">Admit Card</p>
            <p className="examTab_subTitle" style={{ fontSize: fontSize >=17 ? `${fontSize}px` : '17px' }}>Make sure you've submitted your passport photo & signature correct.</p>
            <Row>
                <Col md={4}>
                    <div className="examTabs">
                        <p className="examTab_title" style={{ fontSize: fontSize >=17 ? `${fontSize}px` : '16px' }}>Clerical & Allied Services Examination 2023 Advertisement No.NSSB/EXAM-4/CASE/2023</p>
                        <p className="emailVerifyHeader_register">Admit Card Available</p>
                        <p className="examTab_LastDate" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>Exam Date: 21st October, 2023</p>
                        <div className="login_button_admitCard" onClick={() => this.setState({confirmationModal: true})}>
                          <p className="login_signup_ques_text_white">Generate Admit Card</p>
                        </div>
                    </div>  
                </Col>             
            </Row>
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
      </div>
    )
  }
}
export default withRouter(AdmitCard);