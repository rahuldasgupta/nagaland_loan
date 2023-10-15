import React, {createRef} from "react";
import { withRouter } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import html2canvas from 'html2canvas';
import { BiDownload } from "react-icons/bi";
import moment from 'moment';
import { LuUser } from "react-icons/lu";
import { BsGenderMale, BsGenderFemale, BsCalendar3 } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { MdOutlineEmail } from "react-icons/md";
import { Bars } from  'react-loader-spinner';
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import {Helmet} from "react-helmet";

import Footer from "../../components/Footer/footer";
import "./orderStatus.css";


const queryParams =  new URLSearchParams(window.location.search);

class orderStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            transactionResponse : {},
            status: "Success",
            examID: 2,
            transactionDate: "",
            transactionTime: "",
            isPWDCandidate: "",
            appliedPosts: [],
            loaderModal: true
        }
        this.componentRef = createRef();
    }
    async componentDidMount(){
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        var userData = JSON.parse(localStorage.getItem('userData'));
        if(userData){
            this.getUserData(userData[0].id, userData[0].auth_bearer_token)
        }
        else{
            this.props.history.push("/login");
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
                userData: responseJson.userData,
            })
            this.getTransactionResponse();
        })
    }
    getTransactionResponse = async() => {
        let roll_no = queryParams.get("roll_no");
        let token = queryParams.get("token");

        let details = {
            "roll_no": roll_no,
            "token": token
        }
        await fetch("https://nssbrecruitment.in/admin/api/get_transactions_details.php", {
            method: "POST",
            body: JSON.stringify(details),
            headers: {
                Accept: "application/json,  */*",
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson && responseJson.Status == "Record Does Not Exist or Mismatched"){
                this.props.history.push("/payment-history");
            }
            else if(responseJson && responseJson.length>0 && this.state.userData[0].id == responseJson[0].user_id){
                const dateString = responseJson[0].initiate_date_time;
                const formattedDate = moment(dateString, "MMMM D, YYYY, HH:mm:ss").format("Do MMM, YYYY")
                const formattedDateTime = moment(dateString, "MMMM D, YYYY, HH:mm:ss").format("h:mmA, Do MMMM YYYY");
                let jobTitlesString = responseJson[0].post_name;
                let jobTitlesArray = jobTitlesString.split(", ");
                this.setState({
                    transactionResponse: responseJson[0],
                    transactionDate: formattedDate,
                    transactionTime: formattedDateTime,
                    appliedPosts: jobTitlesArray,
                    isPWDCandidate: responseJson[0].is_pwd_applied,
                    loaderModal: false
                })
            }
            else{
                this.props.history.push("/payment-history");
            }
        })
    }
    takeScreenshot = () => {
        const element = this.componentRef.current;
        html2canvas(element).then((canvas) => {
          const link = document.createElement('a');
          link.href = canvas.toDataURL();
          link.download = 'NSSB_Receipt.png';
          link.click();
        });
    };
    retryTransaction = () => {
        let roll_no = queryParams.get("roll_no");
        let token = queryParams.get("token");
        let url = "https://nssbrecruitment.in/admin/api/payment.php?roll_no="+ roll_no + "&token=" + token;
        window.location.replace(url)
    }
  render() {
    const {transactionResponse} = this.state;
    return (
        <>
            <div className="orderStatus_mainDiv">
                <Helmet>
                    <html lang="en" />  
                    <meta charSet="utf-8" />
                    <title>Nagaland Loan Tracking Portal | Download Receipt</title>
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
                        <p className="loaderText">Please Wait, Fetching Invoice</p>
                    </ModalBody>
                </Modal>
                {
                    this.state.loaderModal == false ?
                        <>
                            {
                                this.state.isPWDCandidate == "true"?
                                    <div className="orderStatus_innerDiv" ref={this.componentRef}>
                                        <div className="orderStatus_innerGreenDiv">
                                            <Row>
                                                <Col md={4} sm={6} xs={6}>
                                                    <p className="orderStatus_innerDiv_receipt">Receipt</p>
                                                    <p className="orderStatus_innerDiv_dateTime">{this.state.transactionDate}</p>
                                                </Col>
                                                <Col md={8} sm={6} xs={6}>
                                                    <p className="orderStatus_innerDiv_receipt_right">₹0.00</p>
                                                    <p className="orderStatus_innerDiv_dateTime_right">Paid</p>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="orderStatus_innerWhiteDiv">
                                            <Row>
                                                <Col md={6} sm={12} xs={12}>
                                                    <p className="orderStatus_innerWhiteDiv_orderID"><span className="boldTxt">Invoice ID:</span> {transactionResponse.order_id}</p>
                                                    <p className="orderStatus_innerWhiteDiv_dateTime">{this.state.transactionTime}</p>
                                                </Col>
                                                <Col md={6} sm={12} xs={12}>
                                                    <button className="downloadTransaction" onClick={this.takeScreenshot}>
                                                        <span className="searchBtn_txt"><BiDownload size={22} className="BiDownload-icon"/>Download  </span>
                                                    </button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6} sm={12} xs={12}>
                                                    <p className="orderStatus_candidateDetailsHeader">Candidate Details</p>
                                                    <p className="orderStatus_candidateDetailsTxt"><LuUser size={16} className="LuUser"/> {this.state.userData[0].full_name}</p>
                                                    <p className="orderStatus_candidateDetailsTxt">{this.state.userData[0].gender == "MALE" ? <BsGenderMale size={16} className="LuUser"/> : <BsGenderFemale size={16} className="LuUser"/> }  {this.state.userData[0].gender}</p>
                                                    <p className="orderStatus_candidateDetailsTxt"><BsCalendar3 size={16} className="LuUser"/> {transactionResponse.date_of_birth}</p>
                                                    <p className="orderStatus_candidateDetailsTxt"><SlLocationPin size={16} className="LuUser"/> {this.state.userData[0].town}, {this.state.userData[0].district}</p>
                                                    <p className="orderStatus_candidateDetailsTxt"><MdOutlineEmail size={16} className="LuUser"/> {this.state.userData[0].email}</p>
                                                    <p className="orderStatus_candidateDetailsHeader">Other Details</p>
                                                    <p className="orderStatus_candidateDetailsTxt">Is PwD Candidate? <span className="extraboldTxt">{transactionResponse.is_pwd_applied == "true" ? " YES": " NO"}</span></p>
                                                    <p className="orderStatus_candidateDetailsTxt">Is Government Employee? <span className="extraboldTxt">{transactionResponse.is_govt_applied == "true" ? " YES": " NO"}</span></p>
                                                    
                                                </Col>
                                                <Col md={6} sm={12} xs={12}>
                                                    <p className="orderStatus_candidateDetailsHeader_right">Posts Applied</p>
                                                    {
                                                        this.state.appliedPosts.map((item, key) =>(
                                                            <>
                                                                <p className="orderStatus_candidateDetailsTxt_right">{item}</p>
                                                            </>
                                                        ))
                                                    }
                                                    <p className="orderStatus_candidateDetailsHeader_right">Exam Centers</p>
                                                    <p className="orderStatus_candidateDetailsTxt_right">First Preference: {transactionResponse.centre_1}</p>
                                                    <p className="orderStatus_candidateDetailsTxt_right">Second Preference: {transactionResponse.centre_2}</p>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                :
                                    <>
                                        {
                                            transactionResponse.authStatus == "0300" && transactionResponse.refund_status == "NA" ?
                                                <div className="orderStatus_innerDiv" ref={this.componentRef}>
                                                    <div className="orderStatus_innerGreenDiv">
                                                        <Row>
                                                            <Col md={4} sm={6} xs={6}>
                                                                <p className="orderStatus_innerDiv_receipt">Receipt</p>
                                                                <p className="orderStatus_innerDiv_dateTime">{this.state.transactionDate}</p>
                                                            </Col>
                                                            <Col md={8} sm={6} xs={6}>
                                                                <p className="orderStatus_innerDiv_receipt_right">₹300.0</p>
                                                                <p className="orderStatus_innerDiv_dateTime_right">Paid</p>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="orderStatus_innerWhiteDiv">
                                                        <Row>
                                                            <Col md={6} sm={12} xs={12}>
                                                                <p className="orderStatus_innerWhiteDiv_orderID"><span className="boldTxt">Invoice ID:</span> {transactionResponse.order_id}</p>
                                                                <p className="orderStatus_innerWhiteDiv_dateTime">{this.state.transactionTime}</p>
                                                            </Col>
                                                            <Col md={6} sm={12} xs={12}>
                                                                <button className="downloadTransaction" onClick={this.takeScreenshot}>
                                                                    <span className="searchBtn_txt"><BiDownload size={22} className="BiDownload-icon"/>Download  </span>
                                                                </button>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md={6} sm={12} xs={12}>
                                                                <p className="orderStatus_candidateDetailsHeader">Candidate Details</p>
                                                                <p className="orderStatus_candidateDetailsTxt"><LuUser size={16} className="LuUser"/> {this.state.userData[0].full_name}</p>
                                                                <p className="orderStatus_candidateDetailsTxt">{this.state.userData[0].gender == "MALE" ? <BsGenderMale size={16} className="LuUser"/> : <BsGenderFemale size={16} className="LuUser"/> }  {this.state.userData[0].gender}</p>
                                                                <p className="orderStatus_candidateDetailsTxt"><BsCalendar3 size={16} className="LuUser"/> {transactionResponse.date_of_birth}</p>
                                                                <p className="orderStatus_candidateDetailsTxt"><SlLocationPin size={16} className="LuUser"/> {this.state.userData[0].town}, {this.state.userData[0].district}</p>
                                                                <p className="orderStatus_candidateDetailsTxt"><MdOutlineEmail size={16} className="LuUser"/> {this.state.userData[0].email}</p>
                                                                <p className="orderStatus_candidateDetailsHeader">Other Details</p>
                                                                <p className="orderStatus_candidateDetailsTxt">Is PwD Candidate? <span className="extraboldTxt">{transactionResponse.is_pwd_applied == "true" ? " YES": " NO"}</span></p>
                                                                <p className="orderStatus_candidateDetailsTxt">Is Government Employee? <span className="extraboldTxt">{transactionResponse.is_govt_applied == "true" ? " YES": " NO"}</span></p>
                                                                
                                                            </Col>
                                                            <Col md={6} sm={12} xs={12}>
                                                                <p className="orderStatus_candidateDetailsHeader_right">Posts Applied</p>
                                                                {
                                                                    this.state.appliedPosts.map((item, key) =>(
                                                                        <>
                                                                            <p className="orderStatus_candidateDetailsTxt_right">{item}</p>
                                                                        </>
                                                                    ))
                                                                }
                                                                <p className="orderStatus_candidateDetailsHeader_right">Exam Centers</p>
                                                                <p className="orderStatus_candidateDetailsTxt_right">First Preference: {transactionResponse.centre_1}</p>
                                                                <p className="orderStatus_candidateDetailsTxt_right">Second Preference: {transactionResponse.centre_2}</p>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                                :
                                                <div className="orderStatus_innerDiv" ref={this.componentRef}>
                                                    <div className="orderStatus_innerYellowDiv">
                                                        <Row>
                                                            <Col md={4} sm={6} xs={6}>
                                                                <p className="orderStatus_innerDiv_receipt">Receipt</p>
                                                                <p className="orderStatus_innerDiv_dateTime">{this.state.transactionDate}</p>
                                                            </Col>
                                                            <Col md={8} sm={6} xs={6}>
                                                                <p className="orderStatus_innerDiv_receipt_right">₹300.0</p>
                                                                <p className="orderStatus_innerDiv_dateTime_right">Pending</p>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="orderStatus_innerWhiteDiv">
                                                        <p className="pendingTxt">You're payment is PENDING. Click "RETRY PAYMENT", or else your application will be rejected.</p>
                                                        <p className="pendingTxt2">If ₹300 is already deducted, still click "RETRY PAYMENT" & try again. And for the failed payment, you can request for refund.</p>
                                                        <Row>
                                                            <Col md={6} sm={12} xs={12}>
                                                                <p className="orderStatus_innerWhiteDiv_orderID"><span className="boldTxt">Invoice ID:</span> {transactionResponse.order_id}</p>
                                                                <p className="orderStatus_innerWhiteDiv_dateTime">{this.state.transactionTime}</p>
                                                            </Col>
                                                            <Col md={6} sm={12} xs={12}>
                                                                {
                                                                    /*
                                                                        <button className="retryTransaction" onClick={this.retryTransaction}>
                                                                            <span className="searchBtn_txt">Retry Payment</span>
                                                                        </button>
                                                                    */
                                                                }
                                                                <button className="retryTransactionInactive">
                                                                    <span className="searchBtn_txt">Retry Payment</span>
                                                                </button>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md={6} sm={12} xs={12}>
                                                                <p className="orderStatus_candidateDetailsHeader">Candidate Details</p>
                                                                <p className="orderStatus_candidateDetailsTxt"><LuUser size={16} className="LuUser"/> {this.state.userData[0].full_name}</p>
                                                                <p className="orderStatus_candidateDetailsTxt">{this.state.userData[0].gender == "MALE" ? <BsGenderMale size={16} className="LuUser"/> : <BsGenderFemale size={16} className="LuUser"/> }  {this.state.userData[0].gender}</p>
                                                                <p className="orderStatus_candidateDetailsTxt"><BsCalendar3 size={16} className="LuUser"/> {transactionResponse.date_of_birth}</p>
                                                                <p className="orderStatus_candidateDetailsTxt"><SlLocationPin size={16} className="LuUser"/> {this.state.userData[0].town}, {this.state.userData[0].district}</p>
                                                                <p className="orderStatus_candidateDetailsTxt"><MdOutlineEmail size={16} className="LuUser"/> {this.state.userData[0].email}</p>
                                                                <p className="orderStatus_candidateDetailsHeader">Other Details</p>
                                                                <p className="orderStatus_candidateDetailsTxt">Is PwD Candidate? <span className="extraboldTxt">{transactionResponse.is_pwd_applied == "true" ? " YES": " NO"}</span></p>
                                                                <p className="orderStatus_candidateDetailsTxt">Is Government Employee? <span className="extraboldTxt">{transactionResponse.is_govt_applied == "true" ? " YES": " NO"}</span></p>
                                                                
                                                            </Col>
                                                            <Col md={6} sm={12} xs={12}>
                                                                <p className="orderStatus_candidateDetailsHeader_right">Posts Applied</p>
                                                                {
                                                                    this.state.appliedPosts.map((item, key) =>(
                                                                        <>
                                                                            <p className="orderStatus_candidateDetailsTxt_right">{item}</p>
                                                                        </>
                                                                    ))
                                                                }
                                                                <p className="orderStatus_candidateDetailsHeader_right">Exam Centers</p>
                                                                <p className="orderStatus_candidateDetailsTxt_right">First Preference: {transactionResponse.centre_1}</p>
                                                                <p className="orderStatus_candidateDetailsTxt_right">Second Preference: {transactionResponse.centre_2}</p>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                        }
                                    </>
                            }
                        </>
                        
                    :
                        <></>
                }
            </div>
            <Footer/>
        </>
    );
  }
}

export default withRouter(orderStatus);