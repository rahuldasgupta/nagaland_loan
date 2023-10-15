import React from "react";
import { withRouter, Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Checkbox from '@mui/material/Checkbox';
import { BsCircle, BsCheckCircleFill, BsInfoCircle } from "react-icons/bs";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { AiOutlineYoutube, AiOutlineUpload } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Bars } from  'react-loader-spinner';
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import moment from 'moment';
import Select from "react-select";
import Compressor from 'compressorjs';
import axios from 'axios';
import {Helmet} from "react-helmet";

import './examination.css'
import Footer from "../../components/Footer/footer";

var NOC_Doc = null;


class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors:{},
      userData: [],
      notLoggedInModal: false,
      examID: "",
      age: 0,
      maxAge: 30,
      isIndigenous: false,
      isPwD: false,
      appliedArr: [],
      didEligibiltyChecked: false,
      disclaimerModal: false,
      countDown: 31,
      isCountDownStarted: false,
      isTOC: true,
      amount: 300,
      fileTooLargeModal: false,
      loaderModal: false,
      APIStatus: "",

      isGovtEmployee: false,
      yearsOfService: "",
      NOC_Doc: null,
      checkButtonEligible: true,

      isSTApplied: false,
      isCovidApplied: false,
      isPwDApplied: false,
      isNoAgeRelaxations: false,

      DOB_On_1stJan:"",
      DOB_On_22ndApril: "",

      centerChoice_1: null,
      centerChoice_2: null,

      isDataSubmitted: false,
      alreadyAppliedModal: false
    };
    this.tocUpdate = this.tocUpdate.bind(this);
  }
  componentDidMount(){
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    if(this.props.location.state && this.props.location.state.appliedArr.length>0){
      this.setState({
        appliedArr: this.props.location.state.appliedArr
      })
  
      var examID = localStorage.getItem('examID');
      this.setState({examID})
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
  checkApplied = async(userID, examID, token) => {
    let userDetails = {
        "user_id": userID,
        "exam_code": examID
    }
    await fetch("https://nssbrecruitment.in/admin/api/check_applied.php", {
        method: "POST",
        body: JSON.stringify(userDetails),
        headers: {
            Accept: "application/json,  */*",
            "Content-Type": "multipart/form-data",
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
        if(responseJson.Status == "Record Exist"){
            this.setState({
                alreadyAppliedModal: true
            })
        }
        else{
          this.getUserData(userID, token)
        }
    })
  }
  getUserData = async(userID, token) => {
    this.setState({
      maxAge: 30
    })
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
            isPwD: responseJson.userData[0].is_pwd == "Yes" ? true : false,
            amount:  responseJson.userData[0].is_pwd == "Yes" ? 0 : 300
        })

        this.calculateAge(responseJson.userData[0].date_of_birth)

        const originalDateOfBirth = responseJson.userData[0].date_of_birth;
        const convertedDateOfBirth = moment(originalDateOfBirth, 'Do MMM, YYYY').format('YYYY-MM-DD');

        const targetDate = moment('2023-04-22');
        const targetDate2 = moment('2023-01-01');

        const diff = targetDate.diff(convertedDateOfBirth);
        const duration = moment.duration(diff);

        const years = duration.years();
        const months = duration.months();
        const days = duration.days();

        const diff2 = targetDate2.diff(convertedDateOfBirth);
        const duration2 = moment.duration(diff2);

        this.setState({
          DOB_On_1stJan: duration2.years() + " years, " + duration2.months() + " months, " + duration2.days() + " days",
          DOB_On_22ndApril: duration.years() + " years, " + duration.months() + " months, " + duration.days() + " days"
        })       
        //AGE IS 29 OR LESS
        if(duration2.years()<30){
          this.setState({
            maxAge: 30,
            isSTApplied: false,
            isPwDApplied: false,
            isCovidApplied: false,
            isNoAgeRelaxations: true
          })
        }
        //AGE IS 30 OR MORE
        else if(duration2.years()>=30){

          //IS CANDIDATE PwD
          if(this.state.isPwD){
            this.setState({
              maxAge: 45,
              isSTApplied: false,
              isPwDApplied: true,
              isCovidApplied: false,
              isNoAgeRelaxations: false
            })
          }

          //AGE IS 30-35 YEARS & ST
          if(duration2.years()<35 && this.state.isPwD == false && responseJson.userData[0].is_indegeneous == "Yes"){
            this.setState({
              maxAge: 35,
              isSTApplied: true,
              isPwDApplied: false,
              isCovidApplied: false,
              isNoAgeRelaxations: false
            })
          }

          //AGE IS 35-37 YEARS 
          if(duration2.years()>=35 && this.state.isPwD == false && responseJson.userData[0].is_indegeneous == "Yes"){
            if(years < 37){
              this.setState({
                maxAge: 37,
                isSTApplied: true,
                isPwDApplied: false,
                isCovidApplied: true,
                isNoAgeRelaxations: false
              })
            }
            else if(years == 37 && months == 0 && days == 0){
              this.setState({
                maxAge: 37,
                isSTApplied: true,
                isPwDApplied: false,
                isCovidApplied: true,
                isNoAgeRelaxations: false
              })
            }
          }
        }
    })
  }
  calculateAge = (dob) => {
    const convertedDate = moment(dob, "Do MMMM, YYYY").format("YYYY-MM-DD");
    const birthday = moment(convertedDate);
    const currentDate = moment('2023-01-01');
    const age = currentDate.diff(birthday, 'years');
    this.setState({age: Number(age)})
  }
  checkEligibilty = async() => {
    this.setState({examID});
    var examID = localStorage.getItem('examID');
    var userData = JSON.parse(localStorage.getItem('userData'));
    this.setState({
      maxAge: 30
    })
    let user = {
        "user_id": userData[0].id
    }
    await fetch("https://nssbrecruitment.in/admin/api/get_user_details.php", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            Accept: "application/json,  */*",
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + userData[0].auth_bearer_token,
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
            isPwD: responseJson.userData[0].is_pwd == "Yes" ? true : false,
            amount:  responseJson.userData[0].is_pwd == "Yes" ? 0 : 300
        })

        this.calculateAge(responseJson.userData[0].date_of_birth)

        const originalDateOfBirth = responseJson.userData[0].date_of_birth;
        const convertedDateOfBirth = moment(originalDateOfBirth, 'Do MMM, YYYY').format('YYYY-MM-DD');

        const targetDate = moment('2023-04-22');
        const targetDate2 = moment('2023-01-01');

        const diff = targetDate.diff(convertedDateOfBirth);
        const duration = moment.duration(diff);

        const years = duration.years();
        const months = duration.months();
        const days = duration.days();

        const diff2 = targetDate2.diff(convertedDateOfBirth);
        const duration2 = moment.duration(diff2);
        const years_2 = duration2.years();
        const months_2 = duration2.months();
        const days_2 = duration2.days();

        this.setState({
          DOB_On_1stJan: duration2.years() + " years, " + duration2.months() + " months, " + duration2.days() + " days",
          DOB_On_22ndApril: duration.years() + " years, " + duration.months() + " months, " + duration.days() + " days"
        })
        //AGE IS 29 OR LESS
        if(duration2.years()<30){
          this.setState({
            maxAge: 30,
            isSTApplied: false,
            isPwDApplied: false,
            isCovidApplied: false,
            isNoAgeRelaxations: true
          })
        }
        //AGE IS 30 OR MORE
        else if(duration2.years()>=30){

          //IS CANDIDATE PwD
          if(this.state.isPwD){
            if(duration2.years()<45 || duration2.years()==45 && months_2 == 0 && days_2 == 0)
            {
              this.setState({
                maxAge: 45,
                isSTApplied: false,
                isPwDApplied: true,
                isCovidApplied: false,
                isNoAgeRelaxations: false
              })
            }
            else if(duration2.years()==45 && months_2 != 0 || duration2.years()==45 && days_2 != 0){
              this.setState({
                maxAge: 45,
                age: 46,
                isSTApplied: false,
                isPwDApplied: true,
                isCovidApplied: false,
                isNoAgeRelaxations: false
              })
            }
          }

          //AGE IS 30-35 YEARS & ST
          if(duration2.years()<35 && this.state.isPwD == false && responseJson.userData[0].is_indegeneous == "Yes"){
            this.setState({
              maxAge: 35,
              isSTApplied: true,
              isPwDApplied: false,
              isCovidApplied: false,
              isNoAgeRelaxations: false
            })
          }

          //AGE IS 35-37 YEARS 
          if(duration2.years()>=35 && this.state.isPwD == false && responseJson.userData[0].is_indegeneous == "Yes"){
            if(years < 37){
              this.setState({
                maxAge: 37,
                isSTApplied: true,
                isPwDApplied: false,
                isCovidApplied: true,
                isNoAgeRelaxations: false
              })
            }
            else if(years == 37 && months == 0 && days == 0){
              this.setState({
                maxAge: 37,
                isSTApplied: true,
                isPwDApplied: false,
                isCovidApplied: true,
                isNoAgeRelaxations: false
              })
            }
          }
        }
        if(this.state.isGovtEmployee && this.state.isPwD == false){
          if(duration2.years()<40 || duration2.years()==40 && months_2 == 0 && days_2 == 0)
          {
            this.setState({
              maxAge: 40
            })
          }
          else if(duration2.years()==40 && months_2 != 0 || duration2.years()==45 && days_2 != 0){
            this.setState({
              age: 41,
              maxAge: 40
            })
          }
        }
    })
    
    this.setState({
      didEligibiltyChecked: true
    })
  }
  handleFirstPrefernce = async(data) => {
    if(data.value != undefined || data.value != "" || data.value != null){
      this.setState({
        centerChoice_1: data.value,
      });
      if(data.value == this.state.centerChoice_2){
        this.setState({
          centerChoice_2: null,
        });
      }
      let errors = this.state.errors;
      if (this.state.centerChoice_1 != null || data.value) {
        errors["First_Prefernce"] = null
        this.setState({ errors: errors });
      } else {
        errors["First_Prefernce"] = "Select First Prefernce";
        this.setState({ errors: errors });
      }
    }
  }
  handleSecondPrefernce = async(data) => {
    if(data.value != undefined || data.value != "" || data.value != null){
      this.setState({ centerChoice_2: data.value });
      if(data.value == this.state.centerChoice_1){
        this.setState({
          centerChoice_1: null,
        });
      }
      let errors = this.state.errors;
      if (this.state.centerChoice_2 != null || data.value) {
        errors["Second_Prefernce"] = null
        this.setState({ errors: errors });
      } else {
        errors["Second_Prefernce"] = "Select Second Prefernce";
        this.setState({ errors: errors });
      }
    }
  }
  eligibiltyButtonChecker = () => {
    let maxAge = this.state.maxAge;
    let userAge = this.state.age;
    let checkButtonEligible = this.state.checkButtonEligible;
    let { centerChoice_1, centerChoice_2 } = this.state;
    const { fontSize } = this.props;

    let districtOptions = [
      { value: "Chumoukedima / Dimapur", label: "Chumoukedima / Dimapur", isDisabled: centerChoice_1 === "Chumoukedima / Dimapur" || centerChoice_2 === "Chumoukedima / Dimapur" ? true : false},
      { value: "Kiphire", label: "Kiphire", isDisabled: centerChoice_1 === "Kiphire" || centerChoice_2 === "Kiphire" ?  true : false },
      { value: "Kohima", label: "Kohima", isDisabled: centerChoice_1 === "Kohima" || centerChoice_2 === "Kohima" ?  true : false },
      { value: "Longleng", label: "Longleng", isDisabled: centerChoice_1 === "Longleng" || centerChoice_2 === "Longleng" ?  true : false },
      { value: "Mokokchung", label: "Mokokchung", isDisabled: centerChoice_1 === "Mokokchung" || centerChoice_2 === "Mokokchung" ?  true : false },
      { value: "Mon", label: "Mon", isDisabled: centerChoice_1 === "Mon" || centerChoice_2 === "Mon" ?  true : false },
      { value: "Niuland", label: "Niuland", isDisabled: centerChoice_1 === "Niuland" || centerChoice_2 === "Niuland" ?  true : false },
      { value: "Noklak", label: "Noklak", isDisabled: centerChoice_1 === "Noklak" || centerChoice_2 === "Noklak" ?  true : false },
      { value: "Peren", label: "Peren", isDisabled: centerChoice_1 === "Peren" || centerChoice_2 === "Peren" ?  true : false },
      { value: "Phek", label: "Phek", isDisabled: centerChoice_1 === "Phek" || centerChoice_2 === "Phek" ?  true : false },
      { value: "Shamator", label: "Shamator", isDisabled: centerChoice_1 === "Shamator" || centerChoice_2 === "Shamator" ?  true : false },
      { value: "Tuensang", label: "Tuensang", isDisabled: centerChoice_1 === "Tuensang" || centerChoice_2 === "Tuensang" ?  true : false },
      { value: "Tseminyu", label: "Tseminyu", isDisabled: centerChoice_1 === "Tseminyu" || centerChoice_2 === "Tseminyu" ?  true : false },
      { value: "Wokha", label: "Wokha", isDisabled: centerChoice_1 === "Wokha" || centerChoice_2 === "Wokha" ?  true : false },
      { value: "Zunheboto", label: "Zunheboto", isDisabled: centerChoice_1 === "Zunheboto" || centerChoice_2 === "Zunheboto" ?  true : false },
    ]

    if(this.state.didEligibiltyChecked){
      if(userAge<=maxAge && userAge>=21){
        return(
          <>
            <p className="viewExam_subCourcs_Black" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>Select Exam Center Preference</p>
            <Row style={{marginBottom:"4.5%"}}>
              <Col md={6}>
                <Select
                  onChange={this.handleFirstPrefernce}
                  isSearchable={false}
                  value={districtOptions.find(
                    (item) => item.value === centerChoice_1
                  )}
                  placeholder={<div>First Preference</div>}
                  options={districtOptions}
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
                {  
                  this.state.errors["First_Prefernce"] ? (
                      <span
                          id="marginInputs"
                          className="validateErrorTxt"
                      >
                          {this.state.errors["First_Prefernce"]}
                      </span>
                  ) :
                  <></>
                }
              </Col>
              <Col md={6}>
                <Select
                  onChange={this.handleSecondPrefernce}
                  isSearchable={false}
                  value={districtOptions.find(
                    (item) => item.value === centerChoice_2
                  )}
                  placeholder={<div>Second Preference</div>}
                  options={districtOptions}
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
                {  
                  this.state.errors["Second_Prefernce"] ? (
                      <span
                          id="marginInputs"
                          className="validateErrorTxt"
                      >
                          {this.state.errors["Second_Prefernce"]}
                      </span>
                  ) :
                  <></>
                }
              </Col>
            </Row>
            {
              centerChoice_1 != null && centerChoice_2 != null ?
                <div className="EligibleBtn" onClick={this.toggleDisclaimerModal}>
                    <p className="login_signup_ques_text_white">Proceed to Payment</p>    
                </div>
                :
                <div className="login_button_disabled">
                    <p className="login_signup_ques_text_white">Proceed to Payment</p>    
                </div>
            }
            
          </>
        )
      }
      else{
        return(
          <>
            <center>
                <br className="viewExam_BR"/>
                <p className="confirmation_ageIneligibleTxt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Your age (as on 1st January, 2023) { userAge<21 ? "should be atleast 21 years, but unfortunately your age is less than the minimum age limit.": "unfortunatly is greater than the maximum age limit."}</p>
            </center>
            <div className="notEligibleBtn">
                <p className="deleteDocumentButton_Txt">Not Eligible</p>    
            </div>
          </>
        )
        
      }
    }
    else{
      if(checkButtonEligible){
        return(
          <div className="profile_skyblueBtn" onClick={this.checkEligibilty}>
            <p className="profile_skyblueBtn_txt">Check Your Eligibility</p>    
          </div>
        )
      }
      else{
        return(
          <div className="login_button_disabled">
            <p className="login_signup_ques_text_white">Check Your Eligibility</p>
          </div>
        )
      }
    }
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
        countDown: 31
      })
    }
  }
  toggleDisclaimerModal = () => {
    this.setState({
      disclaimerModal: true,
      isCountDownStarted: true
    })
    this.countdownTimer()
  }
  tocUpdate(e) {
    this.setState({ isTOC: !e.target.checked });
  }
  isGovtEmployeeToggle = (value) =>{
    this.setState({isGovtEmployee: value});
    setTimeout(() => {
      this.NOC_ButtonChecker()
    }, 100);
  }
  handleYearsOfService = (object) => {
    if (object.target.value.length <= object.target.maxLength) {
      this.setState({ yearsOfService: object.target.value });
    }
    let errors = this.state.errors;
    var yopLength = object.target.value.length;
    if (yopLength<=3 && yopLength>=1) {
      errors["yearsOfService"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["yearsOfService"] = "Must be minimum 1 digit";
      this.setState({ errors: errors});
    }
    setTimeout(() => {
      this.NOC_ButtonChecker()
    }, 100);
  };
  handleNOCDocument = (event) => {
    if(event.target.files[0]){
      if(event.target.files[0].type == "application/pdf"){
        if(event.target.files[0].size>3000000){
          this.setState({
            fileTooLargeModal: true
          })
        }
        else{
          this.setState({
              NOC_Doc: event.target.files[0].name
          });
          NOC_Doc = event.target.files[0]
        }
        setTimeout(() => {
          this.NOC_ButtonChecker()
        }, 100);
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
                  NOC_Doc: compressedResult.name
              });
              NOC_Doc = compressedResult
            }
          },
        });
        setTimeout(() => {
          this.NOC_ButtonChecker()
        }, 1200);
      }
    }
  }
  NOC_ButtonChecker = () => {
    const {isGovtEmployee, yearsOfService, NOC_Doc} = this.state;
    let yearsOfServiceWarning = this.state.errors["yearsOfService"];
    if(isGovtEmployee){
      if(
        yearsOfService != null && yearsOfService != "" &&
        NOC_Doc != null && NOC_Doc != ""
      ){
        if(yearsOfServiceWarning == null){
          this.setState({
            checkButtonEligible: true
          })
        }
        else{
          this.setState({
            checkButtonEligible: false
          })
        }
      }
      else{
        this.setState({
          checkButtonEligible: false
        })
      }
    }
    else{
      this.setState({
        checkButtonEligible: true
      })
    }
  }
  preTransactionChecker = () => {
    if(this.state.isDataSubmitted){
      //this.retryTransaction();
    }
    else{
      if(this.state.isGovtEmployee && NOC_Doc){
        this.uploadNOC();
      }
      else{
        this.createTransactions("");
      }
    }
  }
  uploadNOC = async() => {
    let random = Math.floor(Math.random() * 10000000) + 1;
    let userID = this.state.userData[0].id;
    let fullName = this.state.userData[0].full_name;
    const nameWithoutSpaces = fullName.replace(/\s/g, "");

    const doc = NOC_Doc;
    const docExtension = doc.name.split('.').pop();
    this.setState({
        disclaimerModal: false,
        loaderModal: true,
        APIStatus: "Uploading NOC"
    })

    let file = NOC_Doc;
    let fileName = nameWithoutSpaces + '_NOC_' + userID + '_' + random + '.' + docExtension;
    const formData = new FormData();
    formData.append('document', file);
    formData.append('file_name', fileName);

    await axios.post('https://nssbrecruitment.in/admin/api/upload_noc_file.php', formData, {
        headers: {
          'Authorization': "Bearer " + "azdperi3j9eyJhbGdvIjoiSFMyNTYiLCJ0eXBlIjoiSldUIiwiZXhwaXJlIjoxspolsaKGZjkxNTc2ODY1fQ==.eyJ1c2VyX2lkIjoxMiwid02731dGltZSI6MTY5MTU3Njg2NX0=.AOlwepE1MGM2NzNjZWEsxMjUwYjdmMDFkOTsdfsJlOWY2NzJkYTM1Mjcwdf3MzFkNDJmOWJm0+-atwhdMDIzYTM4M2MzNjgwMGNiNjA3ZZPPlldfii=="
        }
    })
    .then((responseJson) => {
        if(responseJson.data.docURL){
            this.createTransactions(responseJson.data.docURL);
        }
    })
    .catch(error => {
        console.log(error)
    });
  }
  createTransactions = async(noc_url) => {
    this.setState({
        disclaimerModal: false,
        loaderModal: true,
        APIStatus: "Submitting Data"
    })
    var examID = localStorage.getItem('examID');
    let appliedArr = this.state.appliedArr
    const resultString = appliedArr.map(item => item.postName).join(', ');
    let token = this.state.userData[0].auth_bearer_token;
    let userData = {
      "exam_code": examID,
      "user_id": this.state.userData[0].id,
      "post_name": resultString,
      "noc": noc_url,
      "is_covid_applied": this.state.isCovidApplied ? "true" : "false",
      "is_pwd_applied": this.state.userData[0].is_pwd == "Yes" ? "true" : "false",
      "is_govt_applied": this.state.isGovtEmployee ? "true" : "false", 
      "centre_1": this.state.centerChoice_1,
      "centre_2": this.state.centerChoice_2,
      "date_of_birth": this.state.userData[0].date_of_birth
    }
    await fetch("https://nssbrecruitment.in/admin/api/create_transaction.php", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          Accept: "application/json,  */*",
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
        if(this.state.userData[0].is_pwd == "Yes"){
          let url = "https://nssbrecruitment.in/order-status?roll_no="+ responseJson.roll_no + "&token=" + responseJson.token;
          window.location.replace(url)
        }
        else{
          let url = "https://nssbrecruitment.in/admin/api/payment.php?roll_no="+ responseJson.roll_no + "&token=" + responseJson.token;
          window.location.replace(url)
        }
        
    })
  }
  render() {
    const { isGovtEmployee } = this.state;
    const { fontSize } = this.props;
    return (
      <div>
        <Helmet>
            <html lang="en" />  
            <meta charSet="utf-8" />
            <title>NSSB: Nagaland Staff Selection Board - Registration Portal | Submit Application</title>
            <meta name="description" content="One-Time-Registration Portal of Nagaland Staff Selection Board (NSSB)" />
            <link rel="canonical" href="https://nssbrecruitment.in/" />
        </Helmet>
        <Modal
            show={this.state.disclaimerModal}
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
                  onClick={() => this.setState({ disclaimerModal: false, })}
              />
              <p className="login_header_text">Disclaimer</p>
              <br/>
              <ol>
                <li><p className="disclaimerTxt">Make sure all the basic information (full name, date of birth, tribe etc) & educational details are genuine.</p></li>
                <li><p className="disclaimerTxt">Any false data can result to your application being rejected.</p></li>
                <li><p className="disclaimerTxt"><b>Remember: </b>Once you proceed & pay, you will not be able to make any changes in the application.</p></li>
                <li><p className="disclaimerTxt">You're applying for the following {this.state.appliedArr.length} posts:</p></li>
                <ul>
                  {
                    this.state.appliedArr.map((item, key) =>(
                      <li><p className="disclaimerTxt"><b>{item.postName}</b></p></li>
                    ))
                  }
                </ul>
              </ol>
              <div style={{marginBottom: -10}}>
                <Checkbox
                    checked={!this.state.isTOC}
                    onChange={this.tocUpdate}
                    icon={<BsCircle size={20} className="chbk-icons"/>}
                    checkedIcon={<BsCheckCircleFill size={20} className="chbk-icons"/>}
                />
                <span className="disclaimerTxt">I agree that <b>I've read all the instructions above.</b></span>
              </div>
              {
                this.state.isCountDownStarted ?
                  <div className="login_button_disabled">
                    <p className="login_signup_ques_text_white">Wait {this.state.countDown} secs</p>
                  </div>
                :
                  <>
                    {
                      this.state.isTOC ?
                        <div className="login_button_disabled">
                          <p className="login_signup_ques_text_white">Agree to instructions above</p>
                        </div>
                      :
                        <div className="login_button" onClick={this.preTransactionChecker}>
                          <p className="login_signup_ques_text_white">Proceed & Pay ₹{this.state.amount}</p>
                        </div>
                    }
                  </>
              }
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
                  <p className="emailVerifyHeader_register">NOC Document</p>
                  <p className="verifyEmail_subheader_text">The selected NOC document should be less than 3Mb.</p>
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
        <Modal
            show={this.state.alreadyAppliedModal}
            backdrop="static"
            keyboard={false}
            centered
            size="md"
        >
            <ModalBody>
              <div style={{padding: 5}}>
                <p className="login_header_text">Warning</p>
                <center>
                  <p className="emailVerifyHeader_register" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Already Submitted</p>
                  <p className="viewExam_WarnModalSubtitles"  style={{ fontSize: fontSize >16 ? `${fontSize}px` : '16px' }}>Check the payment status of your submission. If the payment status is "PENDING", kindly RETRY the payment, or else your application will be rejected.</p>
                  <Row>
                    <Col md={12} sm={12} xs={12}>
                        <div className="changeEmail_button" onClick={()=> this.props.history.push("/payment-history")}>
                            <p className="login_signup_ques_text_blue">Check Payment Status</p>
                        </div>
                    </Col>
                  </Row>
                </center>
              </div>
            </ModalBody>
        </Modal>
        <div className="settings_body">
            <p className="login_header_text">Confirmation</p>
            <p className="examTab_subTitle" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>Make sure you've submitted all your educational documents & certificates to be eligible.</p>
            <Row>
            <Col md={4} sm={12} xs={12}>
              {
                this.state.appliedArr.length > 0 ?
                  <div className="profile_left_firstDiv">
                      <p className="settings_TabsTittle" style={{ fontSize: fontSize >21 ? `${fontSize}px` : '20px' }}>Posts Applying</p>
                      <p className="postAppliedTab_subTitle" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>You can apply for multiple positions as per your eligibility.</p>
                      <br className="viewExam_BR"/>
                      <Row>
                          {
                              this.state.appliedArr.map((item, key) =>(
                                  <Col md={12} sm={12} xs={12}>
                                      <div key={key} className="ViewExams_confirmBtn">
                                        <span>{item.postName}</span>
                                      </div>
                                      <br className="viewExam_BR"/>
                                  </Col>
                              ))
                          }
                      </Row>
                  </div>
                  :
                  <></>
              }
              </Col>
              <Col md={8} sm={12} xs={12}>
                {
                  this.state.userData.length > 0 ? 
                  <>
                    <div className="profile_left_firstDiv">
                      <p className="settings_TabsTittle" style={{ fontSize: fontSize >21 ? `${fontSize}px` : '20px' }}>Basic Details</p>
                      <br/>
                      <Row>
                        <Col md={6} sm={12} xs={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Full Name</p>
                          <p className="confirmationBasicInfo" style={{ fontSize: fontSize >15 ? `${fontSize}px` : '15px' }}>{this.state.userData[0].full_name}</p>
                        </Col>
                        <Col md={6} sm={12} xs={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Date of Birth</p>
                          <p className="confirmationBasicInfo" style={{ fontSize: fontSize >15 ? `${fontSize}px` : '15px' }}>{this.state.userData[0].date_of_birth}</p>
                        </Col>
                      </Row>
                      <Row style={{marginTop: "3%"}}>
                        <Col md={6} sm={12} xs={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Age (as on 1st January, 2023)</p>
                          <p className="confirmationBasicInfo" style={{ fontSize: fontSize >15 ? `${fontSize}px` : '15px' }}>{this.state.DOB_On_1stJan}</p>
                        </Col>
                        <Col md={6} sm={12} xs={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Age (as on 22nd April, 2023)</p>
                          <p className="confirmationBasicInfo" style={{ fontSize: fontSize >15 ? `${fontSize}px` : '15px' }}>{this.state.DOB_On_22ndApril}</p>
                        </Col>
                      </Row>
                      <Row style={{marginTop: "3%"}}>
                        <Col md={6} sm={12} xs={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Are you Indigenous?</p>
                          <p className="confirmationBasicInfo" style={{ fontSize: fontSize >15 ? `${fontSize}px` : '15px' }}>{this.state.userData[0].is_indegeneous}</p>
                        </Col>
                        <Col md={6} sm={12} xs={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>SC/ST</p>
                          <p className="confirmationBasicInfo" style={{ fontSize: fontSize >15 ? `${fontSize}px` : '15px' }}>{this.state.userData[0].is_indegeneous}</p>
                        </Col>
                      </Row>
                      <Row style={{marginTop: "3%"}}>
                        <Col md={6} sm={6} xs={6}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Tribe</p>
                          <p className="confirmationBasicInfo" style={{ fontSize: fontSize >15 ? `${fontSize}px` : '15px' }}>{this.state.userData[0].tribe}</p>
                        </Col>
                        <Col md={6} sm={6} xs={6}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Category</p>
                          <p className="confirmationBasicInfo" style={{ fontSize: fontSize >15 ? `${fontSize}px` : '15px' }}>{this.state.userData[0].tribe_category}</p>
                        </Col>
                      </Row>
                      <Row style={{marginTop: "3%"}}>
                        <Col md={6} sm={12} xs={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Are you PwD Candidate?</p>
                          <p className="confirmationBasicInfo" style={{ fontSize: fontSize >15 ? `${fontSize}px` : '15px' }}>{this.state.userData[0].is_pwd}</p>
                        </Col>
                        {
                          this.state.isPwD ?
                            <Col md={6} sm={12} xs={12}>
                              <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>PwD Category</p>
                              <p className="confirmationBasicInfo" style={{ fontSize: fontSize >15 ? `${fontSize}px` : '15px' }}>{this.state.userData[0].pwd_category}</p>
                            </Col>
                          :
                          <></>
                        }
                        
                      </Row>
                    </div>
                    <div className="profile_left_firstDiv">
                      <p className="settings_TabsTittle" style={{ fontSize: fontSize >21 ? `${fontSize}px` : '20px' }}>Age Relaxations</p>
                      <br/>
                        {
                          this.state.age >= 21 ?
                          <>
                            <p className="viewExam_subCourcs_green" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>Minimum Age - 21 Years</p>
                            <BsCheckCircleFill size={fontSize > 20 ? fontSize : 20} className="BsCheckCircleFill-icon2"/>
                          </>
                          :
                          <>
                            <p className="viewExam_subCourcs_red" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>Minimum Age - 21 Years</p>
                            <RxCross1 size={fontSize > 20 ? fontSize : 20} className="RxCross1-icon2"/>
                          </>
                        }
                      <br clear="all"/><br className="viewExam_BR"/>
                      {
                        this.state.isNoAgeRelaxations ?
                        <>
                          <p className="viewExam_subCourcs_green" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>Is age relaxations applied?</p>
                          <p className="ageRelaxionApplied" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '16px' }}>Not Required</p>
                          <br clear="all"/>
                        </>
                        :
                        <>
                          {
                            this.state.isSTApplied ?
                            <>
                              <p className="viewExam_subCourcs_green" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>SC/ST</p>
                              <p className="viewExam_subCourcs_green_rightAlligned"  style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>{ this.state.isGovtEmployee ? "" : "+5 years"}</p>
                              <p className="ageRelaxionApplied" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '16px' }}>Applied</p>
                              <br clear="all"/>
                            </>
                            :
                            <></>
                          }
                          {
                            this.state.isCovidApplied ?
                            <>
                              <p className="viewExam_subCourcs_green" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>Covid Relaxations</p>
                              <p className="viewExam_subCourcs_green_rightAlligned" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>{this.state.isGovtEmployee ? "" : "+2 years"}</p>
                              <p className="ageRelaxionApplied" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '16px' }}>Applied</p>
                              <br clear="all"/>
                            </>
                            :
                            <></>
                          }
                          {
                            this.state.isPwDApplied ?
                            <> 
                              <p className="viewExam_subCourcs_green" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>PwD Candidate</p>
                              <p className="viewExam_subCourcs_green_rightAlligned" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>+15 years</p>
                              <p className="ageRelaxionApplied" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '16px' }}>Applied</p>
                              <br clear="all"/>
                            </>
                            :
                            <></>
                          }
                        </>
                      }
                      {
                        this.state.didEligibiltyChecked ?
                        <>
                        {
                          this.state.isGovtEmployee ?
                            <>
                              <p className="viewExam_subCourcs_green" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>Government Employee Relaxations</p>
                              <p className="viewExam_subCourcs_green_rightAlligned" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>{this.state.isPwDApplied? "" : "+10 years"}</p>
                              <p className="ageRelaxionApplied" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '16px' }}>Applied</p>
                            </>
                            :
                            <>
                              <p className="viewExam_subCourcs_red" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>Government Employee Relaxations</p>
                              <RxCross1 size={fontSize > 20 ? fontSize : 20} className="RxCross1-icon2"/>
                              <br/>
                            </>
                        }
                        </>
                        :
                        <>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Are you a Government Employee?</p>
                          <Row>
                            <Col style={{marginTop:"1%"}} md={2} xs={4} sm={4}>
                                <>
                                    <Checkbox
                                        checked={isGovtEmployee}
                                        onChange={() => this.isGovtEmployeeToggle(true)}
                                        icon={<BsCircle size={fontSize > 21 ? fontSize : 20} className="chbk-icons"/>}
                                        checkedIcon={<BsCheckCircleFill size={fontSize > 21 ? fontSize : 20} className="chbk-icons"/>}
                                    />
                                    <span className="newDemo-radio-txt" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '16px' }}>Yes</span>
                                </>
                            </Col>
                            <Col style={{marginTop:"1%"}} md={2} xs={4} sm={4}>
                                <>
                                    <Checkbox
                                        checked={!isGovtEmployee}
                                        onChange={() =>this.isGovtEmployeeToggle(false)}
                                        icon={<BsCircle size={fontSize > 21 ? fontSize : 20} className="chbk-icons"/>}
                                        checkedIcon={<BsCheckCircleFill size={fontSize > 21 ? fontSize : 20} className="chbk-icons"/>}
                                    />
                                    <span className="newDemo-radio-txt" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '16px' }}>No</span>
                                </>
                            </Col>
                          </Row>
                          {
                            isGovtEmployee ? 
                            <>
                              <Row style={{marginTop:"1%"}}>
                                <Col md={6} sm={12} xs={12}>
                                  <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Years of service</p>
                                  <input
                                      className="emailInput"
                                      type = "number" maxLength = "2"
                                      placeholder="Enter total years in service"
                                      onChange={this.handleYearsOfService}
                                      onFocus={this.handleYearsOfService}
                                      onBlur={this.NOC_ButtonChecker}
                                      value={this.state.yearsOfService}
                                  />
                                  {  
                                    this.state.errors["yearsOfService"] ? (
                                        <span
                                            id="marginInputs"
                                            className="validateErrorTxt"
                                        >
                                            {this.state.errors["yearsOfService"]}
                                        </span>
                                    ) :
                                    <></>
                                  }
                                </Col>
                                <Col md={6} sm={12} xs={12}>
                                  <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Upload NOC</p>
                                  <div className="calender_div">
                                    <div onClick={() => document.getElementById('nocInput').click()}>
                                        {
                                        this.state.NOC_Doc === null ?
                                            <p className="dob_txt"><AiOutlineUpload size={20}/>  Select File (Only Images/PDF allowed)</p>
                                        :
                                            <p className="dob_txt"><BsCheckCircleFill size={20} color="green"/>  {this.state.NOC_Doc}</p>
                                        }
                                    </div>
                                    <input
                                        type="file"
                                        id="nocInput"
                                        accept="image/jpg, image/jpeg, image/png, application/pdf"
                                        onFocus={this.handleNOCDocument}
                                        onChange={this.handleNOCDocument}
                                        style={{ display: 'none' }}
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </>
                            :
                            <></>
                          }
                        </>
                      }
                      <br clear="all"/>
                      {
                        this.state.age <= this.state.maxAge ?
                        <>
                          <p className="viewExam_subCourcs_green" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>Maximum Age</p>
                          <BsCheckCircleFill size={fontSize > 21 ? fontSize : 20} className="BsCheckCircleFill-icon2"/>
                        </>
                        :
                        <>
                          <p className="viewExam_subCourcs_red" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '17px' }}>Maximum Age</p>
                          <RxCross1 size={fontSize > 21 ? fontSize : 20} className="RxCross1-icon2"/>
                        </>
                      }
                      <br clear="all"/>
                      <p className="addingMaxAgeTxt"  style={{ fontSize: fontSize >16 ? `${fontSize}px` : '16px' }}>Added all the eligible relaxations</p>
                      <br className="viewExam_BR"/>
                      {this.eligibiltyButtonChecker()}
                    </div>
                  </>
                  :
                  <></>
                }
              </Col>
            </Row>
        </div>
        <Footer/>
      </div>
    )
  }
}
export default withRouter(Confirmation);