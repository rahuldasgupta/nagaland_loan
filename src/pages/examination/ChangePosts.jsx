import React from "react";
import { withRouter, Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import { BsCheckCircleFill } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { Bars } from  'react-loader-spinner';
import {Helmet} from "react-helmet";
import Lottie from 'react-lottie';

import clipmarkJSON from '../../assets/clipmark.json'; 
import checkmark from '../../assets/checkmark.json'; 
import downloadPDF from "../../assets/downloadPDF.png";
import './examination.css'
import Footer from "../../components/Footer/footer";

class ChangePosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      postsArr: [],
      postDetails: [],
      examID: "",
      activeTab: "",
      activeItemCode: "",
      activeDept: "",
      postRequirements: [],
      userEducations: [],
      userCertifications: [],
      isIndigenous: false,
      category: "General",
      
      isCurrentPostEligible: false,
      didEligibiltyChecked: false,

      notLoggedInModal: false,
      doesEducationExists: false,
      disclaimerModal: false,
      appliedArr: [],
      roll_no: '',
      loaderModal: false,
      changeAppliedModal: false,
      transactionToken: ''
    };
  }
  componentDidMount(){
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    if(this.props.location.state && this.props.location.state.roll_no!= "" && this.props.location.state.transactionToken){
        this.setState({
            roll_no: this.props.location.state.roll_no,
            transactionToken: this.props.location.state.transactionToken
        })
        var examID = localStorage.getItem('examID');
        if(examID){
            this.setState({examID})
            this.getPosts(examID)
        
            var userData = JSON.parse(localStorage.getItem('userData'));
            if(userData){
                this.checkApplied(userData[0].id, examID, userData[0].auth_bearer_token)
            }
            else{
                this.setState({
                    notLoggedInModal: true
                });
            }
        }
        else{
            this.props.history.push("/examination");
        }
    }
    else{
        this.props.history.push("/examination");
    }
  }
  checkApplied = async(userID, examID, token) => {
    this.getUserData(userID, token)
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
            isIndigenous:  responseJson.userData[0].is_indegeneous == "Yes" ? true : false,
            category: responseJson.userData[0].tribe_category != "" ? responseJson.userData[0].tribe_category : "General"
        })
        if(this.state.userData[1].education_details.length > 0 || this.state.userData[2].certificate_details.length > 0){
            this.setState({
                doesEducationExists: false,
                userEducations: this.state.userData[1].education_details,
                userCertifications: this.state.userData[2].certificate_details
            })
        }
        else{
            this.setState({
                doesEducationExists: true
            })
        }
    })
  }
  getPosts = async(examID) => {
    let exams = {
        "exam_code": examID
    };

    await fetch(`https://nssbrecruitment.in/admin/api/get_post.php`, {
        method: 'POST',
        body: JSON.stringify(exams),
        headers: {
            Accept: "application/json,  */*",
            "Content-Type": "multipart/form-data",
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
        this.setState({
            postsArr: responseJson,
            activeTab: responseJson[0].name_of_post,
            activeItemCode: responseJson[0].item_code,
        });
        this.getPostDetails(responseJson[0].item_code);
    })
    .catch((error) => {
        console.error(error);
    });
  }
  togglePosts = async(itemCode, postName) => {
    this.setState({
        activeTab: postName,
        activeItemCode: itemCode,
        activeDept: "",
        isCurrentPostEligible: false,
        didEligibiltyChecked: false,
        postRequirements: []
    });
    this.getPostDetails(itemCode)
  }
  getPostDetails = async(itemCode) => {
    let roles = {
        "exam_code": this.state.examID,
        "item_code": itemCode
    }
    await fetch(`https://nssbrecruitment.in/admin/api/get_post_details.php`, {
        method: 'POST',
        body: JSON.stringify(roles),
        headers: {
            Accept: "application/json,  */*",
            "Content-Type": "multipart/form-data",
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
        this.setState({
            postDetails: responseJson.postDetails
        });
    })
    .catch((error) => {
        console.error(error);
    });
  }
  toogleDepartment = async(codeForPost, itemCode, deptName) => {
    this.setState({
        activeDept: deptName,
        isCurrentPostEligible: false,
        didEligibiltyChecked: false,
        postRequirements: []
    });
    this.getReuirements(codeForPost, itemCode)
  }
  getReuirements = async(codeForPost, itemCode) => {
    let details = {
        "exam_code": this.state.examID,
        "item_code": itemCode,
        "code_for_post": codeForPost,
        "category": this.state.category
    };
    await fetch(`https://nssbrecruitment.in/admin/api/get_eligibility_details.php`, {
        method: 'POST',
        body: JSON.stringify(details),
        headers: {
            Accept: "application/json,  */*",
            "Content-Type": "multipart/form-data",
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
        this.setState({
            postRequirements: responseJson
        })
    })
    .catch((error) => {
        console.error(error);
    });
  }
  checkEligibilty = () => {
    let requirementsArr = this.state.postRequirements;
    let educationArr = this.state.userEducations;
    let certificateArr = this.state.userCertifications;
    const joinedArray = educationArr.concat(certificateArr);

    if(requirementsArr[0].optional == "True"){
        for (let i = 0; i < requirementsArr.length; i++) {
            const valueToCheck = requirementsArr[i].qualification;
            for (let j = 0; j < joinedArray.length; j++) {
              if (joinedArray[j].degree && joinedArray[j].degree === valueToCheck || joinedArray[j].certificate_name && joinedArray[j].certificate_name === valueToCheck) {
                requirementsArr[i]["matched"] = true;
                this.setState({
                    isCurrentPostEligible: true,
                })
                break;
              }
            }
        }
    }
    else{
        for (let i = 0; i < requirementsArr.length; i++) {
            const valueToCheck = requirementsArr[i].qualification;
            for (let j = 0; j < joinedArray.length; j++) {
              if(valueToCheck =="Any Graduate" || valueToCheck =="Graduate"){
                if(
                    joinedArray.some(obj => {
                        return obj.degree && obj.degree.includes("Bachelor");
                    }) ||
                    joinedArray.some(obj => {
                        return obj.degree && obj.degree.includes("Master");
                    }) ||
                    joinedArray.some(obj => {
                        return obj.degree && obj.degree.includes("Ph.D");
                    })
                ){
                    requirementsArr[i]["matched"] = true;
                    break;
                }
                else{
                    requirementsArr[i]["matched"] = false;
                    continue;
                }
              }
              else if(valueToCheck =="Class 12"){
                if(
                    joinedArray.some(obj => {
                        return obj.degree && obj.degree.includes("Class 12");
                    }) ||
                    joinedArray.some(obj => {
                        return obj.degree && obj.degree.includes("Bachelor");
                    }) ||
                    joinedArray.some(obj => {
                        return obj.degree && obj.degree.includes("Master");
                    }) ||
                    joinedArray.some(obj => {
                        return obj.degree && obj.degree.includes("Ph.D");
                    })
                ){
                    requirementsArr[i]["matched"] = true;
                    break;
                }
                else{
                    requirementsArr[i]["matched"] = false;
                    continue;
                }
              }
              else{
                if (joinedArray[j].degree && joinedArray[j].degree === valueToCheck || joinedArray[j].certificate_name && joinedArray[j].certificate_name === valueToCheck) {
                    requirementsArr[i]["matched"] = true;
                    break;
                  }
                  else{
                    requirementsArr[i]["matched"] = false;
                    continue;
                  }
              }
              
            }
        }
        if(requirementsArr.some(object => object.matched === false)){
            this.setState({
                isCurrentPostEligible: false,
            })
        }
        else{
            this.setState({
                isCurrentPostEligible: true,
            })
        }
    }
    if(this.state.isIndigenous === false){
        this.setState({
            isCurrentPostEligible: false,
        })
    }
    this.setState({
        didEligibiltyChecked: true
    })
  }
  changeApplied = async() => {
    let appliedArr = this.state.appliedArr;

    let obj = {
        postName: this.state.activeTab,
        itemCode: this.state.activeItemCode
    }
    appliedArr.push(obj)
    this.setState({appliedArr})
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }
  eligibiltyButtonChecker = () => {
    const { fontSize } = this.props;
    let appliedArr = this.state.appliedArr;
    const value = this.state.activeTab;
    const exists = appliedArr.some(obj => obj.postName === value);
    if(exists){
        return(
            <>
                {
                    value === "Sub Inspector" ?
                    <p className="postAppliedTab_subTitle" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '16px' }}>The candidate must be a Graduate with specific honours in either of these subjects: Statistics / Economics / Mathematics / Commerce / Agriculture Economics / Social Work / Rural Economics / Education. Any candidate who applies without the prerequisite qualification will be disqualified for the said post by the Board in any stages of the examination process.</p>
                    :
                    <></>
                }
                <div className="ViewExams_appliedBtn">
                    <p className="profile_greenBtn_txt">Applied</p>    
                </div>
            </>
        )
    }
    else{
        return(
            <>
                {
                    this.state.didEligibiltyChecked ?
                        <>
                            {
                                this.state.isCurrentPostEligible ? 
                                    <>
                                        {
                                            value === "Sub Inspector" ?
                                            <p className="postAppliedTab_subTitle" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '16px' }}>The candidate must be a Graduate with specific honours in either of these subjects: Statistics / Economics / Mathematics / Commerce / Agriculture Economics / Social Work / Rural Economics / Education. Any candidate who applies without the prerequisite qualification will be disqualified for the said post by the Board in any stages of the examination process.</p>
                                            :
                                            <></>
                                        }
                                        <div className="EligibleBtn" onClick={() => this.changeApplied()}>
                                            <p className="login_signup_ques_text_white">Apply</p>    
                                        </div>
                                    </>
                                :
                                    <>
                                        <center>
                                            <br className="viewExam_BR"/>
                                            <p className="examTab_subTitle" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>Make sure you've submitted all your educational documents & certificates on the <span onClick={()=> this.props.history.push("/profile")} className="linkBlue">Profile</span> to be eligible.</p>
                                        </center>
                                        <div className="notEligibleBtn">
                                            <p className="deleteDocumentButton_Txt">Not Eligible</p>    
                                        </div>
                                    </>
                            }
                        </>
                    :
                        <div className="profile_skyblueBtn" onClick={this.checkEligibilty}>
                            <p className="profile_skyblueBtn_txt">Check Your Eligibility</p>    
                        </div>
                }
            </>
        )
    }
    
  }
  deleteApplied = async(postName) => {
    let appliedArr = this.state.appliedArr;
    const filteredArray = appliedArr.filter(obj => obj.postName !== postName);
    this.setState({appliedArr: filteredArray})
  }
  navigateConfirm = () => {
    if(this.state.appliedArr.length == this.state.postsArr.length){
        this.changeAppliedPosts()
    }
    else{
        this.setState({
            disclaimerModal: true
        })
    }
  }
  changeAppliedPosts = async() => {
    this.setState({
        disclaimerModal: false,
        loaderModal: true
    })
    let appliedArr = this.state.appliedArr;
    const resultString = appliedArr.map(item => item.postName).join(', ');

    let postData = {
      "roll_no": this.state.roll_no,
      "token": this.state.transactionToken,
      "post_name": resultString
    }
    await fetch("https://nssbrecruitment.in/admin/api/change_post_submission.php", {
        method: "POST",
        body: JSON.stringify(postData),
        headers: {
          Accept: "application/json,  */*",
          "Content-Type": "multipart/form-data"
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
        if(responseJson.Status == "Post Name Updated Successfully"){
            this.setState({
                loaderModal: false,
                changeAppliedModal: true
            })
        }
        else{
            this.props.history.push("/examination");
        }
    })
  }
  navigateTo = () => {
        let roll_no = this.state.roll_no
        let token = this.state.transactionToken
        let url = window.location.origin + "/order-status?roll_no=" + roll_no + "&token=" + token;
        window.location.replace(url)
  }
  render() {
    const { fontSize } = this.props;
    const defaultOptions_2 = {
        loop: true,
        autoplay: true,
        animationData: clipmarkJSON,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    }
    const animationStyles_2 = {
        width: '50px',
        height: '50px',
    };
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: checkmark,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    }
    const animationStyles = {
        width: '170px',
        height: '170px',
    };
    return (
      <div>
        <Helmet>
            <html lang="en" />  
            <meta charSet="utf-8" />
            <title>Nagaland Loan Tracking Portal | Change Posts</title>
            <meta name="description" content="One-Time-Registration Portal of Credit Outreach Facilitation Unit (COFU) : Nagaland" />
            <link rel="canonical" href="https://nssbrecruitment.in/" />
        </Helmet>
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
                  <p className="viewExam_WarnModalSubtitles" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '15px' }}>In order to register for the examination, you must Login or Register, and add your Educational details.</p>
                  <Row>
                    <Col md={6} sm={6} xs={6}>
                        <div className="changeEmail_button" onClick={()=> this.props.history.push("/login")}>
                            <p className="login_signup_ques_text_blue">Login</p>
                        </div>
                    </Col>
                    <Col md={6} sm={6} xs={6}>
                        <div className="login_button" onClick={()=> this.props.history.push("/register")}>
                            <p className="login_signup_ques_text_white">Register</p>
                        </div>
                    </Col>
                  </Row>
                </center>
              </div>
            </ModalBody>
        </Modal>
        <Modal
            show={this.state.doesEducationExists}
            backdrop="static"
            keyboard={false}
            centered
            size="md"
        >
            <ModalBody>
              <div style={{padding: 5}}>
                <p className="login_header_text">Warning</p>
                <center>
                  <p className="emailVerifyHeader_register" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Add Education / Certificate Details</p>
                  <p className="viewExam_WarnModalSubtitles"  style={{ fontSize: fontSize >16 ? `${fontSize}px` : '15px' }}>In order to register for the examination, you must add your Education / Certificate details on Profile.</p>
                  <Row>
                    <Col md={12} sm={12} xs={12}>
                        <div className="changeEmail_button" onClick={()=> this.props.history.push("/profile")}>
                            <p className="login_signup_ques_text_blue">Add Educational Details</p>
                        </div>
                    </Col>
                  </Row>
                </center>
              </div>
            </ModalBody>
        </Modal>
        <Modal
            show={this.state.disclaimerModal}
            backdrop="static"
            keyboard={false}
            centered
            size="md"
        >
            <ModalBody>
              <div style={{padding: 5}}>
                <p className="login_header_text">Information</p>
                <center>
                  <p className="emailVerifyHeader_register" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>{this.state.appliedArr.length} Posts Selected</p>
                  <p className="viewExam_WarnModalSubtitles" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '15px' }}>You are applying for {this.state.appliedArr.length} posts out of {this.state.postsArr.length}. Do you confirm that you want to proceed ahead?</p>
                  <Row>
                    <Col md={6} sm={6} xs={6}>
                        <div className="changeEmail_button" onClick={()=> this.setState({disclaimerModal: false})}>
                            <p className="login_signup_ques_text_blue">No</p>
                        </div>
                    </Col>
                    <Col md={6} sm={6} xs={6}>
                        <div className="login_button" onClick={this.changeAppliedPosts}>
                            <p className="login_signup_ques_text_white">Proceed</p>
                        </div>
                    </Col>
                  </Row>
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
                <p className="loaderText">Please Wait, Updating Data</p>
            </ModalBody>
        </Modal>
        <Modal
            show={this.state.changeAppliedModal}
            backdrop="static"
            keyboard={false}
            centered
            size="md"
        >
            <ModalBody>
              <div style={{padding: 5}}>
                <center>
                    <Lottie options={defaultOptions} style={animationStyles} />
                    <div className="checkPayment_button" onClick={this.navigateTo}>
                        <p className="login_signup_ques_text_blue">View Updated Reciept</p>
                    </div>
                </center>
              </div>
            </ModalBody>
        </Modal>
        <div className="settings_body">
            <>
                {
                    this.state.postsArr.length > 0 ?
                    <>
                        <p className="login_header_text">Edit Posts Applied for Clerical & Allied Services Examination 2023</p>
                        <p className="examTab_subTitle" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>Make sure you've submitted all your educational documents & certificates to be eligible.</p>
                        <div className="lottieContainer_3">
                            <Row>
                                <Col md={1} xs={2} sm={2}>
                                    <Lottie options={defaultOptions_2}  style={animationStyles_2} />
                                </Col>
                                <Col md={11} xs={10} sm={10} className="lottieDivTxt2">
                                    <p className="lottieDivTxt2">You can apply for <b>multiple posts</b> by selecting the posts mentioned below. Applying for posts is based on eligibility.</p>
                                </Col>
                            </Row>
                        </div>
                        <Row>
                            {
                                this.state.postsArr.map((item, key) =>(
                                    <>
                                        {
                                            this.state.activeTab == item.name_of_post ?
                                                <button className="examTab_activePost" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>
                                                    <span className="searchBtn_txt">{item.name_of_post}</span>
                                                </button>
                                            :
                                                <button className="examTab_inactivePost" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }} onClick={() => this.togglePosts(item.item_code, item.name_of_post)}>
                                                    <span className="searchBtn_txt">{item.name_of_post}</span>
                                                </button>
                                        }
                                    </>
                                    
                                ))
                            }                
                        </Row>
                        {
                            this.state.postDetails.length > 0 ?
                                <div className="viewExaminationDetails_AllBoxes">
                                    {
                                        this.state.appliedArr.length > 0 ?
                                        <div className="examination_shadowBoxes">
                                            <p className="settings_TabsTittle" style={{ fontSize: fontSize >21 ? `${fontSize}px` : '20px' }}>Posts Applying</p>
                                            <p className="postAppliedTab_subTitle" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>You can apply for multiple positions as per your eligibility.</p>
                                            <Row>
                                                {
                                                    this.state.appliedArr.map((item, key) =>(
                                                        <Col md={4} sm={12} xs={12}>
                                                            <div key={key} className="degreeTabs">
                                                                <p className="examination_shadowBoxesTxt" style={{ fontSize: fontSize >16.5 ? `${fontSize}px` : '16.5px' }}>{item.postName}</p>
                                                                <div className="deleteDocumentButton" onClick={() => this.deleteApplied(item.postName)}>
                                                                    <p className="deleteDocumentButton_Txt">Delete</p>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    ))
                                                }
                                            </Row>
                                            <div className="ViewExams_confirmBtn" onClick={this.navigateConfirm}>
                                                <span>Confirm & Proceed</span>
                                            </div>
                                        </div>
                                        :
                                        <></>
                                    }
                                    <Row>
                                        <Col md={6} xs={12} sm={12}>
                                            <div className="profile_left_firstDiv">
                                                <p className="settings_TabsTittle" style={{ fontSize: fontSize >21 ? `${fontSize}px` : '20px' }}>Information</p>
                                                <br className="viewExam_BR"/>
                                                <p className="viewExam_subtites_new" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}><span className="viewExamDetails_boldTxt">Pay-Matrix</span>: Level {this.state.postDetails[0].pay_matrix}</p>
                                                <p className="viewExam_subtites_new" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}><span className="viewExamDetails_boldTxt">Minimum Age</span>: {this.state.postDetails[0].min_age} years</p>
                                                <p className="viewExam_subtites_new" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}><span className="viewExamDetails_boldTxt">Maxiumum Age</span>: {this.state.postDetails[0].max_age} years</p>
                                                <img src={downloadPDF} className="downloadPDF_img" onClick={() => window.open("https://admin.nssbrecruitment.in/api/storage/CASE_2023.pdf", "_blank")}/>
                                            </div>
                                            <div className="profile_left_firstDiv">
                                                <p className="settings_TabsTittle" style={{ fontSize: fontSize >21 ? `${fontSize}px` : '20px' }}>Upper Age Relaxation</p>
                                                <br className="viewExam_BR"/>
                                                <p className="viewExam_subtites_new" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}><span className="viewExamDetails_boldTxt">SC/ST</span>: 35 years (as on 1st January, 2023)</p>
                                                <p className="viewExam_subtites_new" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}><span className="viewExamDetails_boldTxt">Covid Relaxation</span>: 37 years (as on 22nd April, 2023)</p>
                                                <p className="viewExam_subtites_new" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}><span className="viewExamDetails_boldTxt">Government Employee</span>: 40 years (as on 1st January, 2023)</p>
                                                <p className="viewExam_subtites_new" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}><span className="viewExamDetails_boldTxt">PwD Candidates</span>: 45 years (as on 1st January, 2023)</p>
                                            </div>
                                        </Col>
                                        <Col md={6} xs={12} sm={12}>
                                            <div className="profile_left_firstDiv">
                                                <p className="settings_TabsTittle" style={{ fontSize: fontSize >21 ? `${fontSize}px` : '20px' }}>Check Eligibility</p>
                                                <p className="postAppliedTab_subTitle" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>Note: Make sure you've submitted all your educational documents & certificates in Profile, to be eligible.</p>
                                                {/*<Row>
                                                    {
                                                        this.state.postDetails[1].deparments.map((item, key) =>(
                                                            <>
                                                                {
                                                                    this.state.activeDept == item.name_of_department ?
                                                                        <button className="examTab_activePost">
                                                                            <span className="searchBtn_txt">{item.name_of_department}</span>
                                                                        </button>
                                                                        :
                                                                        <button className="examTab_inactivePost" onClick={() => this.toogleDepartment(item.code_for_post, item.item_code, item.name_of_department)}>
                                                                            <span className="searchBtn_txt">{item.name_of_department}</span>
                                                                        </button>
                                                                        
                                                                }
                                                            </>
                                                        ))
                                                    }
                                                </Row>*/}
                                                <Row>
                                                    {
                                                        this.state.postDetails[1].deparments.map((item, key) =>(
                                                            <>
                                                            <p className="totalPostsVacancy" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Total Vacancy: {item.no_of_vacancy}</p>
                                                            {
                                                                key == 0 ?
                                                                <>
                                                                    {
                                                                        this.state.activeDept == item.name_of_department ?
                                                                            <></>
                                                                            :
                                                                            <>
                                                                                <div className="profile_skyblueBtn" onClick={() => this.toogleDepartment(item.code_for_post, item.item_code, item.name_of_department)}>
                                                                                    <p className="profile_skyblueBtn_txt">View Details</p>
                                                                                </div>
                                                                            </>
                                                                            
                                                                    }
                                                                </>
                                                                :
                                                                <></>
                                                            }
                                                            </>
                                                        ))
                                                    }
                                                </Row>
                                                {
                                                    this.state.postRequirements.length > 0 ?
                                                    <>
                                                        <p className="settings_TabsTittle">Requirements</p>
                                                        <br className="viewExam_BR2"/>
                                                        {
                                                            this.state.didEligibiltyChecked ? 
                                                            <>
                                                                {
                                                                    this.state.isIndigenous ?
                                                                    <>
                                                                        <p className="viewExam_subCourcs_green" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>1. Indigenous of Nagaland</p>
                                                                        <BsCheckCircleFill size={fontSize > 20 ? fontSize : 20} className="BsCheckCircleFill-icon2"/>
                                                                        <br clear="all"/>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <p className="viewExam_subCourcs_red" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>1. Indigenous of Nagaland</p>
                                                                        <RxCross1 size={fontSize > 20 ? fontSize : 20} className="RxCross1-icon2"/>
                                                                        <br clear="all"/>
                                                                    </>
                                                                }
                                                                {
                                                                    this.state.postRequirements.map((item, key) =>(
                                                                        <>
                                                                            {
                                                                                item.optional == "True" ?
                                                                                <>
                                                                                    <p style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }} className={item.matched === true ? "viewExam_subCourcs_green" : "viewExam_subCourcs_red"}>{key == 0 ? "2. " + item.qualification : item.qualification} <b> {key == this.state.postRequirements.length-1 ? "" : " or"}</b></p>
                                                                                    {
                                                                                        item.matched === true?
                                                                                        <BsCheckCircleFill size={fontSize > 20 ? fontSize : 20} className="BsCheckCircleFill-icon2"/>
                                                                                        :
                                                                                        <RxCross1 size={fontSize > 20 ? fontSize : 20} className="RxCross1-icon2"/>
                                                                                    }
                                                                                    <br clear="all"/>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    <p style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }} className= {item.matched === true ? "viewExam_subCourcs_green" : "viewExam_subCourcs_red"}>{key+2}. {item.qualification}</p>
                                                                                    {
                                                                                        item.matched === true?
                                                                                        <BsCheckCircleFill size={fontSize > 20 ? fontSize : 20} className="BsCheckCircleFill-icon2"/>
                                                                                        :
                                                                                        <RxCross1 size={fontSize > 20 ? fontSize : 20} className="RxCross1-icon2"/>
                                                                                    }
                                                                                    <br clear="all"/>
                                                                                </>
                                                                            }
                                                                        </>
                                                                    ))
                                                                }
                                                            </>
                                                            :
                                                            <>
                                                                <p className="viewExam_subtites"  style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>1. Indigenous of Nagaland</p>
                                                                {
                                                                    this.state.postRequirements.map((item, key) =>(
                                                                        <>
                                                                            {
                                                                                item.optional == "True" ?
                                                                                <p style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }} className="viewExam_subtites">{key == 0 ? "2. " + item.qualification : item.qualification} <b> {key == this.state.postRequirements.length-1 ? "" : " or"}</b></p>
                                                                                :
                                                                                <p style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }} className="viewExam_subtites">{key+2}. {item.qualification}</p>
                                                                            }
                                                                            {
                                                                                item.qualification === "Graduate" ?
                                                                                <p className="postAppliedTab_subTitle" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '16px' }}>The candidate must be a Graduate with specific honours in either of these subjects: Statistics / Economics / Mathematics / Commerce / Agriculture Economics / Social Work / Rural Economics / Education. Any candidate who applies without the prerequisite qualification will be disqualified for the said post by the Board in any stages of the examination process.</p>
                                                                                :
                                                                                <></>
                                                                            }
                                                                        </>
                                                                    ))
                                                                }
                                                                <br/>
                                                                
                                                            </>
                                                        }
                                                        {this.eligibiltyButtonChecker()}
                                                    </>
                                                    :
                                                    <></>
                                                }

                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            :
                                <></>
                        }
                    </>
                    :
                    <></>
                }
            </>
            
        </div>
        <Footer/>
      </div>
    )
  }
}
export default withRouter(ChangePosts);