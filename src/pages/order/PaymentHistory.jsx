import React, {createRef} from "react";
import { withRouter } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import moment from 'moment';
import Select from "react-select";
import { AiOutlineUpload } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
import Calendar from 'react-calendar';
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { RxDoubleArrowLeft, RxDoubleArrowRight, } from "react-icons/rx";
import Compressor from 'compressorjs';
import { Bars } from  'react-loader-spinner';
import axios from 'axios';
import {Helmet} from "react-helmet";

import Footer from "../../components/Footer/footer";
import "./PaymentHistory.css";

const paymentMethodOptions = [
    { value: "Debit Card", label: "Debit Card" },
    { value: "Credit Card", label: "Credit Card" },
    { value: "UPI", label: "UPI" },
    { value: "Net Banking", label: "Net Banking" },
    { value: "QR Scan", label: "QR Scan" }
  ] 

const today = new Date();
const minDate = new Date(2023, 7, 13);
var proofDoc = null;

class PaymentHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            paymentHistory: [],
            refundHistory: [],
            createRefundMode: false,
            transactionReferrenceNo: "",
            paymentMethod: "",
            unformattedDate: new Date(),
            transactionDate: "",
            proofDoc: null,
            errors:{},
            calenderModal: false,
            transactionChecked: false,
            loaderModal: false,
            APIStatus: "Fetching Data"
        }
    }
    async componentDidMount(){
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        this.setState({
            loaderModal: true,
            APIStatus: "Fetching Data"
        })
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
            this.getPaymentHistory(responseJson.userData[0].id);
        })
    }
    getPaymentHistory = async(userID) => {
        let user = {
            "user_id": userID
        }
        await fetch("https://nssbrecruitment.in/admin/api/get_payment_history.php", {
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
                paymentHistory: responseJson
            })
            this.getRefundHistory(userID);
        })
        
    }
    getRefundHistory = async(userID) => {
        let user = {
            "user_id": userID
        }
        await fetch("https://nssbrecruitment.in/admin/api/get_refund_history.php", {
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
                refundHistory: responseJson
            })
        })
        this.setState({
            loaderModal: false
        })
    }
    handleTransactionReferrance = (object) => {
        this.setState({ transactionReferrenceNo: object.target.value });
        setTimeout(() => {
            this.refundCheck()
        }, 100);
    }
    handlePaymentMethod = (data) => {
        if(data.value != undefined || data.value != "" || data.value != null){
            this.setState({ paymentMethod: data.value });
        }
        setTimeout(() => {
            this.refundCheck()
        }, 300);
    };
    changeDate = (dateStr) => {
        let errors = this.state.errors;
        if (dateStr != null && dateStr != "" && dateStr != undefined) {
          errors["transactionDate"] = null
          this.setState({ errors: errors});
        }
         else {
          errors["transactionDate"] = "Must not be empty";
          this.setState({ errors: errors});
        }
        let formattedDate = moment(dateStr, 'ddd MMM DD YYYY HH:mm:ss ZZ').format('Do MMMM, YYYY');
        this.setState({
          unformattedDate: dateStr,
          transactionDate: formattedDate,
          calenderModal: false
        })
        setTimeout(() => {
          this.refundCheck()
        }, 100);
    }
    handleProofDocument = (event) => {
        if(event.target.files[0]){
          if(event.target.files[0].type == "application/pdf"){
            if(event.target.files[0].size>3000000){
              this.setState({
                fileTooLargeModal: true
              })
            }
            else{
              this.setState({
                  proofDoc: event.target.files[0].name
              });
              proofDoc = event.target.files[0]
            }
            setTimeout(() => {
                this.refundCheck()
            }, 150);
          }
          else{
            const image = event.target.files[0];
            new Compressor(image, {
              quality: 0.1,
              success: (compressedResult) => { 
                if(compressedResult.size > 3000000){
                  this.setState({
                    fileTooLargeModal: true
                  })
                }
                else{
                  this.setState({
                    proofDoc: compressedResult.name
                  });
                  proofDoc = compressedResult
                }
              },
            });
            setTimeout(() => {
                this.refundCheck()
              }, 1200);
          }
        }
    }
    refundCheck = () => {
        const {transactionReferrenceNo, transactionDate, paymentMethod, proofDoc} = this.state;

        let transactionDateWarning = this.state.errors["transactionDate"];
        if(
            transactionDate != null && transactionDate != "" &&
            paymentMethod != null && paymentMethod != "" &&
            proofDoc != null && proofDoc != "" 
          ){
          if(transactionDateWarning == null)
          {
            this.setState({
                transactionChecked: true
            })
          }
          else{
            this.setState({
                transactionChecked: false
            })
          }
        }
        else{
          this.setState({
            transactionChecked: false
          })
        }
    }
    uploadProofFile = async() => {
        let random = Math.floor(Math.random() * 10000000) + 1;
        let userID = this.state.userData[0].id;
        let fullName = this.state.userData[0].full_name;
        const nameWithoutSpaces = fullName.replace(/\s/g, "");
        //let token = `nlztyJhbGdvIjoipzbWx0MyNTYiLCJ0eXBlIjoiSlUUIiwiZXhwOXJlIjoxNjkxNjQHODc1fQ==.eyJ180m!c2VyX2lkIjoxMywidGltZSI6iTY5MTY0Mzg3NX0=.JSdA1MmNiY2vwM2NkuiL\ksdfsNjMTVPOTdmMzI0YzljNzZiNWYyOWYyOWQ0MWE0ZTUzM2NiMTYyODkxM2Uw0ksMQ27==`
        const doc = proofDoc;
        const docExtension = doc.name.split('.').pop();
        this.setState({
            loaderModal: true,
            APIStatus: "Uploading Proof"
        })

        let file = proofDoc;
        let fileName = nameWithoutSpaces + '_Proof_' + userID + '_' + random + '.' + docExtension;
        const formData = new FormData();
        formData.append('document', file);
        formData.append('file_name', fileName);
        await axios.post('https://nssbrecruitment.in/admin/api/upload_refund_proof.php', formData)
        .then((responseJson) => {
            if(responseJson.data.docURL){
                this.createRefundRequest(responseJson.data.docURL);
            }
        })
        .catch(error => {
            console.log(error)
        });
    }
    createRefundRequest = async(proof_url) => {
    
        let userData = {
          "email_id": this.state.userData[0].email,
          "user_id": this.state.userData[0].id,
          "txnReferenceNo": this.state.transactionReferrenceNo,
          "txnDate": this.state.transactionDate,
          "payment_mode": this.state.paymentMethod,
          "status": "Under Review",
          "document_proof": proof_url
        }
        await fetch("https://nssbrecruitment.in/admin/api/initiate_refund.php", {
            method: "POST",
            body: JSON.stringify(userData),
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
            window.location.reload()
        })
    }
    formatTime = (dateStr) => {
        const { fontSize } = this.props;
        const formattedDateTime = moment(dateStr, "MMMM D, YYYY, HH:mm:ss").format("h:mmA, Do MMMM YYYY");
        return(
            <p className="txnID_subTxt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>{formattedDateTime}</p>
        )
    }
    navigateTo = (roll_no, token) => {
        let url = window.location.origin + "/order-status?roll_no=" + roll_no + "&token=" + token;
        window.location.replace(url)
    }
  render() {
    const { fontSize } = this.props;
    const { transactionReferrenceNo, transactionDate, paymentMethod, proofDoc} = this.state;
    return (
        <>
            <div className="paymentHistory_mainDiv">
                <Helmet>
                    <html lang="en" />  
                    <meta charSet="utf-8" />
                    <title>Nagaland Loan Tracking Portal | Payment & Refund History</title>
                    <meta name="description" content="One-Time-Registration Portal of Nagaland Staff Selection Board (NSSB)" />
                    <link rel="canonical" href="https://nssbrecruitment.in/" />
                </Helmet>
                <Modal
                    show={this.state.calenderModal}
                    backdrop="static"
                    keyboard={false}
                    centered
                    size="md"
                >
                    <ModalBody>
                    <div>
                        <IoClose
                            size={25}
                            className="closeIcon"
                            onClick={() => this.setState({ calenderModal: false })}
                        />
                        <p className="modal_header_text">Select Date of Transaction</p>
                        <br/>
                        <center>
                        <Calendar
                            className="calenderLayout"
                            onFocus={this.basicsCheck}
                            prevLabel={(<IoChevronBack size={20}/>)}
                            prev2Label={(<RxDoubleArrowLeft size={22}/>)}
                            next2Label={(<RxDoubleArrowRight size={22}/>)}
                            nextLabel={(<IoChevronForward size={20}/>)}
                            onChange={(e)=>this.changeDate(e)}
                            onBlur={this.basicsCheck}
                            value={this.state.unformattedDate}
                            maxDate={today}
                            minDate={minDate}
                        />
                        </center>
                    </div>
                    </ModalBody>
                </Modal>
                <Modal
                    show={this.state.fileTooLargeModal}
                    backdrop="static"
                    keyboard={false}
                    centered
                    size="md"
                >
                    <ModalBody>
                    <div style={{padding: 5}}>
                        <IoClose
                            size={25}
                            className="closeIcon"
                            onClick={() => this.setState({ fileTooLargeModal: false })}
                        />
                        <p className="login_header_text">File too large</p>
                        <center>
                        <p className="emailVerifyHeader_register">Transaction Proof Document</p>
                        <p className="verifyEmail_subheader_text">The selected Transaction Proof document should be less than 3Mb.</p>
                        </center>
                    </div>
                    </ModalBody>
                </Modal>
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
                    <p className="loaderText">Please Wait, {this.state.APIStatus}</p>
                </ModalBody>
                </Modal>
                <div>
                    <p className="login_header_text" style={{ fontSize: fontSize >28 ? `${fontSize}px` : '27px' }}>Payment History</p>
                    <p className="examTab_subTitle" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>Make sure the payments are marked as "PAID", or else your submission will be rejected.</p>
                    <div>
                        {
                            this.state.paymentHistory.map((item, key) =>(
                                <div className="paymentHistoryTabs" onClick={() => this.navigateTo(item.roll_no, item.token)}>
                                    <Row>
                                        <Col md={8} xs={12} sm={12}>
                                            <p className="txnID_Txt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}><span className="extraboldTxt2">Invoice ID:</span> {item.order_id}</p>
                                            {this.formatTime(item.initiate_date_time)}
                                        </Col>
                                        <Col md={4} xs={12} sm={12}>
                                            {
                                                item.is_pwd_applied == "true" ?
                                                <div className="paymentPaidBox">
                                                    <p className="paymentPaidBoxTxt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Paid</p>
                                                </div>
                                                :
                                                <>
                                                    {
                                                        item.authStatus === "0300" && item.refund_status === "NA" ?
                                                            <div className="paymentPaidBox">
                                                                <p className="paymentPaidBoxTxt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Paid</p>
                                                            </div>
                                                        :
                                                            <div className="paymentPendingBox">
                                                                <p className="paymentPendingBoxTxt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Pending / Retry</p>
                                                            </div>
                                                    }
                                                </>
                                            }
                                        </Col>
                                    </Row>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div>
                    <br/>
                    <p className="login_header_text" style={{ fontSize: fontSize >28 ? `${fontSize}px` : '27px' }}>Refund Request</p>
                    <p className="examTab_subTitle" style={{ fontSize: fontSize >=17 ? `${fontSize}px` : '17px' }}>Request for refund only if the amount was deducted and the status is pending. Refund will be initiated in 5-7 working days after reviewing.</p>
                    <div>
                        {
                            this.state.refundHistory.map((item, key) =>(
                                <div className="paymentHistoryTabs">
                                    <Row>
                                        <Col md={8} xs={12} sm={12}>
                                            <p className="txnID_Txt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}><span className="extraboldTxt2">Request ID:</span> #{item.id} (via {item.payment_mode})</p>
                                            <p className="txnID_subTxt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>{item.txnDate}</p>
                                        </Col>
                                        <Col md={4} xs={12} sm={12}>
                                            <div className="paymentPaidBox">
                                                <p className="paymentPaidBoxTxt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>{item.status}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            ))
                        }
                    </div>
                    {
                        this.state.createRefundMode ?
                            <div className="createRefundRequest">
                                <Row>
                                    <Col md={12} xs={12} sm={12}>
                                        <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Transaction Referrence No.</p>
                                        <input
                                            className="emailInput"
                                            type="text"
                                            placeholder= {"Optional"}
                                            onChange={this.handleTransactionReferrance}
                                            onFocus={this.handleTransactionReferrance}
                                            onBlur={this.refundCheck}
                                            value={transactionReferrenceNo}
                                        />
                                    </Col>
                                </Row>
                                <div className="registerInputMargin_2"></div>
                                <Row>
                                    <Col md={6} xs={12} sm={12}>
                                        <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Payment Mode</p>
                                        <Select
                                            onChange={this.handlePaymentMethod}
                                            onFocus={this.refundCheck}
                                            onBlur={this.refundCheck}
                                            value={paymentMethodOptions.find(
                                            (item) => item.value === paymentMethod
                                            )}
                                            placeholder={<div>Select</div>}
                                            options={paymentMethodOptions}
                                            styles={{
                                            control: (provided, state) => ({
                                                ...provided,
                                                height: 50,
                                                borderRadius: 8,
                                                marginTop: 5,
                                                borderWidth: state.isFocused ? 1 : 1,
                                                border: state.isFocused ? "1px solid #0783de" : "1px solid #C6C6C6"
                                            })
                                            }}
                                        />
                                    </Col>
                                    <Col md={6} xs={12} sm={12}>
                                        <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Date of Transaction</p>
                                        <div className="calender_div" onClick={() => this.setState({calenderModal: true})}>
                                            {
                                                transactionDate ? 
                                                <p className="dob_txt">{transactionDate}</p>
                                                :
                                                <p className="dob_txt">Select date of transaction</p>
                                            }
                                        </div>
                                        {  
                                            this.state.errors["transactionDate"] ? (
                                                <span
                                                    id="marginInputs"
                                                    className="validateErrorTxt registerInputMargin"
                                                >
                                                    {this.state.errors["transactionDate"]}
                                                </span>
                                            ) :
                                            <div className="registerInputMargin"></div>
                                        }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} xs={12} sm={12}>
                                        <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Upload Proof</p>
                                        <div className="calender_div">
                                            <div onClick={() => document.getElementById('proofDocumentInput').click()}>
                                                {
                                                this.state.proofDoc === null ?
                                                    <p className="dob_txt"><AiOutlineUpload size={20}/>  Select File (Only Images/PDF allowed)</p>
                                                :
                                                    <p className="dob_txt"><BsCheckCircleFill size={20} color="green"/>  {proofDoc}</p>
                                                }
                                            </div>
                                            <input
                                                type="file"
                                                id="proofDocumentInput"
                                                accept="image/jpg, image/jpeg, image/png, application/pdf"
                                                onFocus={this.handleProofDocument}
                                                onChange={this.handleProofDocument}
                                                onBlur={this.refundCheck}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} xs={6} sm={6}>
                                        <div className="changeEmail_button" onClick={() => this.setState({createRefundMode: false})}>
                                            <p className="login_signup_ques_text_blue">Close</p>
                                        </div>
                                    </Col>
                                    <Col md={6} xs={6} sm={6}>
                                        {
                                            this.state.transactionChecked ?
                                                <div className="login_button" onClick={this.uploadProofFile}>
                                                    <p className="login_signup_ques_text_white">Submit</p>
                                                </div>
                                            :
                                                <div className="login_button_disabled">
                                                    <p className="login_signup_ques_text_white">Submit</p>
                                                </div>
                                        }
                                    </Col>
                                </Row>
                                
                            </div>
                        :
                        <>
                            {
                                /*
                                    <div className="paymentHistory_skyblueBtnInactive" onClick={() => this.setState({createRefundMode: true})}>
                                        <p className="paymentHistory_skyblueBtn_txt">Create Refund Request</p>    
                                    </div>
                                */
                            }
                            <div className="paymentHistory_skyblueBtnInactive">
                                <p className="paymentHistory_skyblueBtn_txt">Refund Request</p>    
                            </div>
                        </>
                    }
                    
                </div>
            </div>
            <Footer/>
        </>
    );
  }
}

export default withRouter(PaymentHistory);