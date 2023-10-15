import React from "react";
import { withRouter } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OtpInput from 'react-otp-input';
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import Checkbox from '@mui/material/Checkbox';
import { BsCircle, BsCheckCircleFill, BsInfoCircle } from "react-icons/bs";
import Calendar from 'react-calendar';
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { AiOutlineUpload } from "react-icons/ai";
import { RxDoubleArrowLeft, RxDoubleArrowRight, } from "react-icons/rx";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import moment from 'moment';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Bars } from  'react-loader-spinner';
import Compressor from 'compressorjs';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {Helmet} from "react-helmet";

import Footer from "../../../components/Footer/footer";
import passport_upload from "../../../assets/passport_upload.png";
import "./Register.css"
import "react-toastify/dist/ReactToastify.css";
import 'react-calendar/dist/Calendar.css';

const steps_Mobile = [
  'Basic',
  'Verify',
  'Address',
  "Loan",
  'Confirmation'
];
const steps_PC = [
  'Basic Information',
  'Verify Email',
  'Add Address',
  "Loan Information",
  'Confirmation'
];

const districtOptions = [
  { value: "Chumoukedima", label: "Chumoukedima" },
  { value: "Dimapur", label: "Dimapur" },
  { value: "Kiphire", label: "Kiphire" },
  { value: "Kohima", label: "Kohima" },
  { value: "Longleng", label: "Longleng" },
  { value: "Mokokchung", label: "Mokokchung" },
  { value: "Mon", label: "Mon" },
  { value: "Niuland", label: "Niuland" },
  { value: "Noklak", label: "Noklak" },
  { value: "Peren", label: "Peren" },
  { value: "Phek", label: "Phek" },
  { value: "Shamator", label: "Shamator" },
  { value: "Tuensang", label: "Tuensang" },
  { value: "Tseminyu", label: "Tseminyu" },
  { value: "Wokha", label: "Wokha" },
  { value: "Zunheboto", label: "Zunheboto" },
];

const maritialOptions = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Divorced", label: "Divorced" },
  { value: "Widowed", label: "Widowed" }
]

const employmentStatusOptions = [
  { value: "Employed", label: "Employed" },
  { value: "Self-employed,", label: "Self-employed" },
  { value: "Unemployed", label: "Unemployed" },
  { value: "Others", label: "Others" }
]

const today = new Date();

var passtportPhoto = null;
var affidavitPhoto = null;
var signaturePhoto = null;
var pwdCertificate = null;

const firebaseConfig = {
  apiKey: "AIzaSyAMQ3BmRsgCfZAC60WUIuVElJuHjS6bo2k",
  authDomain: "nssb-nagaland.firebaseapp.com",
  projectId: "nssb-nagaland",
  storageBucket: "nssb-nagaland.appspot.com",
  messagingSenderId: "892321318871",
  appId: "1:892321318871:web:5f3d367adef5d3f3a3ad92",
  measurementId: "G-4TVNHXXLL3"
};

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layoutView: "Basics",
      //layoutView: "Loan Info",
      loaderModal: false,
      APIStatus: "Creating Account",

      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      middleName: "",
      lastName: "",
      hasNameChanged: false,
      isIndigenous: true,
      legalName: "",
      phone: "",
      gender: true,
      errors:{},
      count: 0,
      basicsChecked: false,
      calenderModal: false,
      dateofbirth: "",
      unformattedDate: new Date(),
      passportPhoto: null,
      affidavitPhoto: null,
      signaturePhoto: null,
      pwdCertificate: null,
      motherName: "",
      fatherName: "",
      martialStatus: null,
      category: null,
      isPWD: false,
      pwdCategory: null,
      publicizeMarks: true,
      
      countDown: 30,
      duplicateEmailModal: false,
      duplicatePhoneModal: false,
      isCountDownStarted: false,
      enteredOTP: "",
      responseOTP: "",

      streetName: "",
      town: "",
      district: null,
      pincode: "",
      addressChecked: false,

      employmentStatus: "",
      employerName: "",
      monthlyIncome: "",

      isTOC: true,
      fileTooLargeModal: false,
      FTL_message: ""
    };
    this.handleRegister = this.handleRegister.bind(this);
    this.handleFirstName = this.handleFirstName.bind(this);
    this.handleMiddleName = this.handleMiddleName.bind(this);
    this.handleLastName = this.handleLastName.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
    this.handlePhone = this.handlePhone.bind(this);
    this.basicsCheck = this.basicsCheck.bind(this);
    this.tocUpdate = this.tocUpdate.bind(this);

    this.handleEmploymentStatus = this.handleEmploymentStatus.bind(this);
  }

  //BASIC INFORMATION
  handlePassportSelect = async(event) => {
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
    if(event.target.files[0]){
      this.handleImageCompress(event.target.files[0])
    }
  }
  handleFirstName = (event) => {
    let errors = this.state.errors;
    let name = event.target.value.length
    if (name>0) {
      errors["firstName"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["firstName"] = "Must not be empty";
      this.setState({ errors: errors});
    }
    this.setState({
        firstName: event.target.value,
    });
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
  }
  handleMiddleName = (event) => {
    this.setState({
        middleName: event.target.value,
    });
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
  }
  handleLastName = (event) => {
    let errors = this.state.errors;
    let name = event.target.value.length
    if (name>0) {
      errors["lastName"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["lastName"] = "Must not be empty";
      this.setState({ errors: errors});
    }
    this.setState({
        lastName: event.target.value,
    });
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
  }
  handleMotherName = (event) => {
    this.setState({
      motherName: event.target.value,
    });
  }
  handleFatherName = (event) => {
    let errors = this.state.errors;
    let name = event.target.value.length
    if (name>0) {
      errors["fatherName"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["fatherName"] = "Must not be empty";
      this.setState({ errors: errors});
    }
    this.setState({
      fatherName: event.target.value,
    });
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
  }
  handleMaritialStatus = (martialStatus) => {
    if(martialStatus.value != undefined || martialStatus.value != "" || martialStatus.value != null){
      this.setState({ martialStatus: martialStatus.value });
      let errors = this.state.errors;
      if (this.state.martialStatus != null || martialStatus.value) {
        errors["martialStatus"] = null
        this.setState({ errors: errors });
      } else {
        errors["martialStatus"] = "Select martial status";
        this.setState({ errors: errors });
      }
    }
    setTimeout(() => {
      this.basicsCheck();
    }, 300);
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
      this.basicsCheck()
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
      this.basicsCheck()
    }, 100);
  };
  handlePhone = (object) => {
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
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
  };
  basicsCheck = () => {
    const {passportPhoto, firstName, lastName, fatherName, dateofbirth, email, password, phone, martialStatus} = this.state;

    let firstNameWarning = this.state.errors["firstName"];
    let lastNameWarning = this.state.errors["lastName"];
    let fatherNameWarning = this.state.errors["fatherName"];
    let phoneWarning = this.state.errors["phone"];
    let emailWarning = this.state.errors["email"];
    let confirmPasswordWarning = this.state.errors["confirmPassword"];
    let passwordWarning = this.state.errors["password"];

    if(
        passportPhoto != null && passportPhoto != "" &&
        lastName != null && lastName != "" &&
        firstName != null && firstName != "" &&
        fatherName != null && fatherName != "" &&
        dateofbirth != null && dateofbirth != "" &&
        phone != null && phone != "" &&
        password != null && password != "" && 
        email != null && email != "" &&
        martialStatus != null && martialStatus != ""
      ){
      if(firstNameWarning == null && lastNameWarning == null && passwordWarning == null && phoneWarning == null && emailWarning == null && fatherNameWarning == null && confirmPasswordWarning == null)
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
  basicsNext = () => {
    this.setState({
      loaderModal: true,
      APIStatus: "Checking Phone Number"
    })
    this.checkPhoneNumber()
  }
  changeDate = (dateStr) => {
    let errors = this.state.errors;
    if (dateStr != null && dateStr != "" && dateStr != undefined) {
      errors["dateofbirth"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["dateofbirth"] = "Must not be empty";
      this.setState({ errors: errors});
    }
    let formattedDate = moment(dateStr, 'ddd MMM DD YYYY HH:mm:ss ZZ').format('Do MMMM, YYYY');
    this.setState({
      unformattedDate: dateStr,
      dateofbirth: formattedDate,
      calenderModal: false
    })
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
  }
  checkPhoneNumber = async() => {
    let phone = this.state.phone;
    let phoneTrimmed = phone.trim();
    let user = {
      "phone_no": phoneTrimmed,
    };
    await fetch("https://nssbrecruitment.in/admin/api/validate_phone_no.php", {
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
      if(responseJson.Status === "True! Phone Number Exists"){
        this.setState({
          duplicatePhoneModal: true
        })
      }
      else{
        this.sendMail();
      }
    })
  }

  //VERIFY EMAIL
  sendMail = async() => {
    this.setState({
      loaderModal: true,
      APIStatus: "Sending Email OTP"
    })
    let email = this.state.email;
    let emailTrimmed = email.trim();
    let user = {
      "email": emailTrimmed,
    };
    await fetch("https://nssbrecruitment.in/admin/api/emailOTP.php", {
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
      if(responseJson.Status === "False! Email ID already exists"){
        this.setState({
          duplicateEmailModal: true
        })
      }
      else{
        this.setState({
          responseOTP: responseJson.OTP
        })
        this.setState({
          layoutView: "Verify Email"
        })
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      }
    })
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
        layoutView: "Addresses",
        enteredOTP: ""
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
    this.countdownTimer()

    let email = this.state.email;
    let emailTrimmed = email.trim();
    let user = {
      "email": emailTrimmed,
    };
    await fetch("https://nssbrecruitment.in/admin/api/emailOTP.php", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        Accept: "application/json,  */*",
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.Status === "False! Email ID already exists"){
        this.setState({
          duplicateEmailModal: true
        })
      }
      else{
        this.setState({
          responseOTP: responseJson.OTP
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


  //ADDRESS
  handleDistrict = (district) => {
    if(district.value != undefined || district.value != "" || district.value != null){
      this.setState({ district: district.value });
      let errors = this.state.errors;
      if (this.state.district != null || district.value) {
        errors["district"] = null
        this.setState({ errors: errors });
      } else {
        errors["district"] = "Select a district";
        this.setState({ errors: errors });
      }
    }
    setTimeout(() => {
      this.addressCheck();
    }, 300);
  };
  handleStreetName = (event) => {
    let errors = this.state.errors;
    let name = event.target.value.length
    if (name>0) {
      errors["street"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["street"] = "Must not be empty";
      this.setState({ errors: errors});
    }
    this.setState({
      streetName: event.target.value,
    });
    this.addressCheck();
  }
  handleTown = (event) => {
    let errors = this.state.errors;
    let name = event.target.value.length
    if (name>0) {
      errors["town"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["town"] = "Must not be empty";
      this.setState({ errors: errors});
    }
    this.setState({
      town: event.target.value,
    });
    this.addressCheck();
  }
  handlePincode = (object) => {
    if (object.target.value.length <= object.target.maxLength) {
      this.setState({ pincode: object.target.value });
    }
    let errors = this.state.errors;
    var phoneLength = object.target.value.length;
    if (phoneLength === 7 || phoneLength === 6 ) {
      errors["pincode"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["pincode"] = "Must be 6 digits";
      this.setState({ errors: errors});
    }
    this.addressCheck();
  };
  addressCheck = () => {
    const {streetName, town, district, pincode} = this.state;
    let streetNameWarning = this.state.errors["street"];
    let townWarning = this.state.errors["town"];
    let pincodeWarning = this.state.errors["pincode"];
    if(streetName != null && town != null && pincode != null && streetName != "" && town != "" && pincode != ""){
      if(streetNameWarning == null && townWarning == null && pincodeWarning == null)
      {
        this.setState({
          addressChecked: true
        })
      }
      else{
        this.setState({
          addressChecked: false
        })
      }
    }
    else{
      this.setState({
        addressChecked: false
      })
    }
  }

  //LOAN INFORMATION

  handleEmploymentStatus = (employmentStatus) => {
    if(employmentStatus.value != undefined || employmentStatus.value != "" || employmentStatus.value != null){
      this.setState({ employmentStatus: employmentStatus.value });
      let errors = this.state.errors;
      if (this.state.employmentStatus != null || employmentStatus.value) {
        errors["employmentStatus"] = null
        this.setState({ errors: errors });
      } else {
        errors["employmentStatus"] = "Select Employment Status";
        this.setState({ errors: errors });
      }
    }
    setTimeout(() => {
      this.loanCheck();
    }, 300);
  };
  handleEmployerName = (event) => {
    let errors = this.state.errors;
    let name = event.target.value.length
    if (name>0) {
      errors["employerName"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["employerName"] = "Must not be empty";
      this.setState({ errors: errors});
    }
    this.setState({
      employerName: event.target.value,
    });
    this.addressCheck();
  }
  handleMonthlyIncome = (object) => {
    if (object.target.value.length <= object.target.maxLength) {
      this.setState({ monthlyIncome: object.target.value });
    }
    let errors = this.state.errors;
    if (object.target.value>1000) {
      errors["monthlyIncome"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["monthlyIncome"] = "Must be atleast above Rs. 1000";
      this.setState({ errors: errors});
    }
    this.loanCheck();
  };
  loanCheck = () => {
    const {streetName, town, district, pincode} = this.state;
    let streetNameWarning = this.state.errors["street"];
    let townWarning = this.state.errors["town"];
    let pincodeWarning = this.state.errors["pincode"];
    if(streetName != null && town != null && pincode != null && streetName != "" && town != "" && pincode != ""){
      if(streetNameWarning == null && townWarning == null && pincodeWarning == null)
      {
        this.setState({
          addressChecked: true
        })
      }
      else{
        this.setState({
          addressChecked: false
        })
      }
    }
    else{
      this.setState({
        addressChecked: false
      })
    }
  }
  //
  tocUpdate(e) {
    this.setState({ isTOC: !e.target.checked });
  }
  handleImageCompress = (event) => {
    const image = event;
    new Compressor(image, {
      quality: 0.1,
      success: (compressedResult) => {
        if(compressedResult.size > 3000000){
          this.setState({
            fileTooLargeModal: true,
            FTL_message: "Passport Image"
          })
        }
        else{
          passtportPhoto = compressedResult
          this.setState({
            passportPhoto: URL.createObjectURL(passtportPhoto)
          });
        }
      },
    });
  };
  uploadPassport = async(userID) => {
    let random = Math.floor(Math.random() * 10000000) + 1;
    let fullName = this.state.fullName;
    const nameWithoutSpaces = fullName.replace(/\s/g, "");
    let fileName = nameWithoutSpaces + '_passport_' + userID + "_" + random;

    this.setState({
      loaderModal: true,
      APIStatus: "Uploading Photo"
    })
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    let file = passtportPhoto;
    let imageName = fileName;
    const storageRef = ref(storage, imageName);
    await uploadBytes(storageRef, file)
    .then(() => {
        getDownloadURL(storageRef).then((url)=> {
          this.updatePassportPhoto(userID, url);
        })
    })
  }
  updatePassportPhoto = async(userID, url) => {
    let user = {
      "user_id": userID,
      "passport_image": url
    };
    await fetch("https://nssbrecruitment.in/admin/api/passport_image.php", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        Accept: "application/json,  */*",
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.uploadSignature(userID)
    })
  }
  uploadSignature = async(userID) => {
    let random = Math.floor(Math.random() * 10000000) + 1;
    let fullName = this.state.fullName;
    const nameWithoutSpaces = fullName.replace(/\s/g, "");
    let fileName = nameWithoutSpaces + '_signature_' + userID + "_" + random;

    this.setState({
      loaderModal: true,
      APIStatus: "Uploading Signature"
    })
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    let file = signaturePhoto;
    let imageName = fileName;
    const storageRef = ref(storage, imageName);
    await uploadBytes(storageRef, file)
    .then(() => {
        getDownloadURL(storageRef).then((url)=> {
          this.updateSignaturePhoto(userID, url);
        })
    })
  }
  updateSignaturePhoto = async(userID, url) => {
    let user = {
      "user_id": userID,
      "signature_docs": url
    };
    await fetch("https://nssbrecruitment.in/admin/api/upload_signature.php", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        Accept: "application/json,  */*",
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.json())
    .then(async(responseJson) => {
      await this.uploadAffidavit(userID)
    })
  }
  uploadAffidavit = async(userID) => {
    if(this.state.hasNameChanged == true && affidavitPhoto != null){
      let random = Math.floor(Math.random() * 10000000) + 1;
      let fullName = this.state.fullName;
      const nameWithoutSpaces = fullName.replace(/\s/g, "");
      let fileName = nameWithoutSpaces + '_affidavit_' + userID + "_" + random;
      
      this.setState({
        loaderModal: true,
        APIStatus: "Uploading Affidavit"
      })
      const app = initializeApp(firebaseConfig);
      const storage = getStorage(app);
      let file = affidavitPhoto;
      let imageName = fileName;
      const storageRef = ref(storage, imageName);
      await uploadBytes(storageRef, file)
      .then(() => {
          getDownloadURL(storageRef).then((url)=> {
            this.updateAffidavitDocument(userID, url);
          })
      })
    }
    else{
      await this.uploadPWDCertificate(userID)
    }
    
  }
  updateAffidavitDocument = async(userID, url) => {
    let user = {
      "user_id": userID,
      "affidavit": url
    };
    await fetch("https://nssbrecruitment.in/admin/api/upload_affidavit.php", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        Accept: "application/json,  */*",
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.json())
    .then(async(responseJson) => {
      await this.uploadPWDCertificate(userID)
    })
  }
  uploadPWDCertificate = async(userID) => {
    if(this.state.isPWD == true && pwdCertificate != null){
      let random = Math.floor(Math.random() * 10000000) + 1;
      let fullName = this.state.fullName;
      const nameWithoutSpaces = fullName.replace(/\s/g, "");
      let fileName = nameWithoutSpaces + '_PwD_certificate_' + userID + "_" + random;
      
      this.setState({
        loaderModal: true,
        APIStatus: "Uploading PwD Certificate"
      })
      const app = initializeApp(firebaseConfig);
      const storage = getStorage(app);
      let file = pwdCertificate;
      let imageName = fileName;
      const storageRef = ref(storage, imageName);
      await uploadBytes(storageRef, file)
      .then(() => {
          getDownloadURL(storageRef).then((url)=> {
            this.updatePWDCertificate(userID, url);
          })
      })
    }
    else{
      this.setState({
        loaderModal: false,
        APIStatus: ""
      })
      let url = window.location.origin + "/profile";
      window.location.replace(url)
    }
    
  }
  updatePWDCertificate = async(userID, url) => {
    let user = {
      "user_id": userID,
      "pwd_docs": url
    };
    await fetch("https://nssbrecruitment.in/admin/api/upload_PWD.php", {
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
        loaderModal: false,
        APIStatus: ""
      })
      let url = window.location.origin + "/profile";
      window.location.replace(url)
    })
  }
  changeStepper = (index) => {
    if(index === "Verify Email"){}
    if(index === "Confirmation"){}
    if(index === "Basic Information"){
      this.setState({
        layoutView: "Basics"
      })
    }
    if(index === "Add Address" && this.state.layoutView === "Confirmation"){
      this.setState({
        layoutView: "Addresses"
      })
    }
    
  }
  storeData = async (userData) => {
    localStorage.setItem("userData", JSON.stringify(userData));
  };
  async componentDidMount(){
    var userData = JSON.parse(localStorage.getItem('userData'));
    if(userData){
        this.props.history.push("/profile");
    }
  }
  handleRegister = async () => {
    this.setState({
      loaderModal: true,
      APIStatus: "Creating Account"
    })
    const { email,
            password,
            fullName,
            legalName,
            phone,
            dateofbirth,
            motherName,
            fatherName,
            streetName,
            town,
            district,
            pincode} = this.state;

    let gender = this.state.gender === true ? "MALE" : "FEMALE";
    let emailTrimmed = email.trim();
    let isIndigenous = this.state.isIndigenous === true ? "Yes" : "No"
    let hasNameChanged = this.state.hasNameChanged === true ? "Yes" : "No"
    let isPWD = this.state.isPWD === true ? "Yes" : "No"
    let tribe = this.state.tribe === null ? "" : this.state.tribe;
    let category = this.state.category === null ? "" : this.state.category;
    let pwdCategory = this.state.pwdCategory === null ? "" : this.state.pwdCategory;

    let user = {
      "email": emailTrimmed,
      "password": password,
      "full_name": fullName,
      "gender": gender,
      "has_name_changed": hasNameChanged,
      "is_indegeneous": isIndigenous,
      "legal_name": legalName,
      "phone_no": phone,
      "date_of_birth": dateofbirth,
      "mother_name": motherName,
      "father_name": fatherName,
      "tribe": tribe,
      "tribe_category": category,
      "is_pwd": isPWD,
      "pwd_category": pwdCategory,
      "colony_name": streetName,
      "town": town,
      "district": district,
      "pincode": pincode,
      "is_publicise_marks": this.state.publicizeMarks == true ? "Yes" : "No"
    };

    await fetch("https://nssbrecruitment.in/admin/api/register.php", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        Accept: "application/json,  */*",
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson && responseJson.Status == "Account already exists, please re-try again"){
        this.setState({
          duplicateEmailModal: true
        })
      }
      else{
        this.storeData(responseJson);
        setTimeout(() => {
          this.uploadPassport(responseJson[0].id)
        }, 100);
      }
    })
  }
  render() {
    const { district, gender, hasNameChanged, isIndigenous, martialStatus, employmentStatus, publicizeMarks} = this.state;
    let index = 0
    if(this.state.layoutView === "Basics"){
      index = 0
    }
    else if(this.state.layoutView === "Verify Email"){
      index = 1
    }
    else if(this.state.layoutView === "Addresses"){
      index = 2
    }
    else if(this.state.layoutView === "Loan Info"){
      index = 3
    }
    else{
      index = 4
    }
    const { fontSize } = this.props;
    return (
      <>
        <div className="container-box_register">
          <Helmet>
              <html lang="en" />  
              <meta charSet="utf-8" />
              <title>Nagaland Loan Tracking Portal | Register</title>
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
                <p className="modal_header_text">Select Date of Birth</p>
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
                  />
                </center>
                {  
                  this.state.errors["dateofbirth"] ? (
                      <span
                          id="marginInputs"
                          className="validateErrorTxt"
                      >
                          {this.state.errors["dateofbirth"]}
                      </span>
                  ) :
                  <></>
                }
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
            show={this.state.duplicateEmailModal}
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
                  onClick={() => this.setState({ duplicateEmailModal: false })}
                />
                <p className="login_header_text">Email ID already exists</p>
                <center>
                  <p className="emailVerifyHeader_register">{this.state.email}</p>
                  <p className="verifyEmail_subheader_text">An account with the Email ID already exists. Either login with the email, or create a new account with different Email ID.</p>
                </center>
              </div>
            </ModalBody>
          </Modal>
          <Modal
            show={this.state.duplicatePhoneModal}
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
                  onClick={() => this.setState({ duplicatePhoneModal: false })}
                />
                <p className="login_header_text">Phone Number exists</p>
                <center>
                  <p className="emailVerifyHeader_register">{this.state.phone}</p>
                  <p className="verifyEmail_subheader_text">An account with the Phone Number already exists. Either login, or create a new account with different phone number.</p>
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
                  <p className="emailVerifyHeader_register">{this.state.FTL_message}</p>
                  <p className="verifyEmail_subheader_text">The selected {this.state.FTL_message} should be less than 3Mb.</p>
                  </center>
              </div>
              </ModalBody>
          </Modal>
          <Row>
            <Col md={8}>
              <div className="forPC">
                <Box sx={{ width: '100%' }}>
                  <Stepper activeStep={index} alternativeLabel >
                    {steps_PC.map((label) => (
                      <Step
                        key={label}
                        sx={{
                          '& .MuiStepLabel-root .Mui-completed': {
                            color: '#4cbb17', // circle color (COMPLETED)
                          },
                          '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                            {
                              color: '#4cbb17', // Just text label (COMPLETED)
                            },
                          '& .MuiStepLabel-root .Mui-active': {
                            color: '#0783de', // circle color (ACTIVE)
                          }
                        }}
                      >
                        <StepLabel onClick={() => this.changeStepper(label)}>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </div>
              <div className="forMobile">
                <Box sx={{ width: '100%' }}>
                  <Stepper activeStep={index} alternativeLabel >
                    {steps_Mobile.map((label) => (
                      <Step
                        key={label}
                        sx={{
                          '& .MuiStepLabel-root .Mui-completed': {
                            color: '#4cbb17', // circle color (COMPLETED)
                          },
                          '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                            {
                              color: '#4cbb17', // Just text label (COMPLETED)
                            },
                          '& .MuiStepLabel-root .Mui-active': {
                            color: '#0783de', // circle color (ACTIVE)
                          }
                        }}
                      >
                        <StepLabel onClick={() => this.changeStepper(label)}>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </div>
              {
                 this.state.layoutView === "Basics" ?
                  <div className="register_containerBox_inner">
                      <p className="login_header_text" style={{ fontSize: fontSize >27 ? `${fontSize}px` : '27px' }}>Create Account</p>
                      <p className="login_subheader_text" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Make sure your name entered matches with name on ADHAAR/PAN Card</p>
                      <Row>
                        <Col md={9} xs={6} sm={6}>
                          <div className="passtport_header">
                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Passport Photo *</p>
                            <p style={{marginLeft: 4,  fontSize: fontSize >17 ? `${fontSize}px` : '15px'}} className="passport_subheader_text">Photo should have white background & good quality.</p>
                            <p style={{marginLeft: 4,  fontSize: fontSize >17 ? `${fontSize}px` : '15px'}} className="passport_subheader_text">Only JPG, PNG & JPEG allowed.</p>
                          </div>
                        </Col>
                        <Col md={3} xs={6} sm={6}>
                          <div className="emptyPasstport"  onClick={() => document.getElementById('fileInput').click()}>
                            <div>
                              <center>
                                {
                                  this.state.passportPhoto === null ?
                                    <>
                                      <img src={passport_upload} className="passport_empty_img" alt="select image" />
                                      <p className="passport_empty_txt">Select Image</p>
                                    </>
                                  :
                                    <img src={this.state.passportPhoto} className="passport_img" alt="select image" />
                                }
                                
                              </center>
                            </div>
                            <input
                              type="file"
                              id="fileInput"
                              accept="image/jpg, image/jpeg, image/png"
                              onChange={this.handlePassportSelect}
                              style={{ display: 'none' }}
                            />
                          </div>
                        </Col>
                      </Row>
                      <br/>
                      <Row>
                        <Col md={4}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>First Name *</p>
                            <input
                                className="emailInput"
                                type="text"
                                placeholder="Enter your first name"
                                onChange={this.handleFirstName}
                                onFocus={this.handleFirstName}
                                onBlur={this.basicsCheck}
                                value={this.state.firstName}
                            />
                            {  
                                this.state.errors["firstName"] ? (
                                    <span
                                        id="marginInputs"
                                        className="validateErrorTxt registerInputMargin"
                                    >
                                        {this.state.errors["firstName"]}
                                    </span>
                                ) :
                                <></>
                            }
                        </Col>
                        <Col md={4}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Middle Name</p>
                            <input
                                className="emailInput"
                                type="text"
                                placeholder="(optional)"
                                onChange={this.handleMiddleName}
                                onFocus={this.handleMiddleName}
                                onBlur={this.basicsCheck}
                                value={this.state.middleName}
                            />
                        </Col>
                        <Col md={4}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Last Name *</p>
                            <input
                                className="emailInput"
                                type="text"
                                placeholder="Enter your last name"
                                onChange={this.handleLastName}
                                onFocus={this.handleLastName}
                                onBlur={this.basicsCheck}
                                value={this.state.lastName}
                            />
                            {  
                                this.state.errors["lastName"] ? (
                                    <span
                                        id="marginInputs"
                                        className="validateErrorTxt registerInputMargin"
                                    >
                                        {this.state.errors["lastName"]}
                                    </span>
                                ) :
                                <></>
                            }
                        </Col>
                      </Row>
                      <div className="registerInputMargin"></div>
                      <Row>
                        <Col md={6}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Father's Name *</p>
                          <input
                              className="emailInput"
                              type="text"
                              placeholder="Enter your father's name"
                              onChange={this.handleFatherName}
                              onFocus={this.handleFatherName}
                              onBlur={this.basicsCheck}
                              value={this.state.fatherName}
                          />
                          {  
                            this.state.errors["fatherName"] ? (
                                <span
                                    id="marginInputs"
                                    className="validateErrorTxt"
                                >
                                    {this.state.errors["fatherName"]}
                                </span>
                            ) :
                            <></>
                          }
                        </Col>
                        <Col md={6}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Mother's Name</p>
                          <input
                              className="emailInput"
                              type="text"
                              placeholder="Enter your mother's name"
                              onChange={this.handleMotherName}
                              onFocus={this.handleMotherName}
                              onBlur={this.basicsCheck}
                              value={this.state.motherName}
                          />
                        </Col>
                      </Row>
                      <div className="registerInputMargin"></div>
                      <div className="forPC">
                        <Row>
                          <Col md={6}>
                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Gender *</p>
                          </Col>
                          <Col md={6}>
                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Date of Birth *</p>
                          </Col>
                        </Row>
                      </div>
                      <div className="forMobile">
                        <p className="input_header_txt" style={{ fontSize: '16.5px' }}>Gender *</p>
                      </div>
                      <Row className="genderMargins">
                        <Col style={{marginTop:"1%"}} md={2} xs={5} sm={5}>
                            <>
                                <Checkbox
                                    checked={gender}
                                    onFocus={this.basicsCheck}
                                    onBlur={this.basicsCheck}
                                    onChange={() => this.setState({gender: true})}
                                    icon={<BsCircle size={fontSize >20 ? fontSize : 20} className="chbk-icons"/>}
                                    checkedIcon={<BsCheckCircleFill size={fontSize >20 ? fontSize : 20} className="chbk-icons"/>}
                                />
                                <span className="newDemo-radio-txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16px' }}>Male</span>
                            </>
                        </Col>
                        <Col style={{marginTop:"1%"}} md={2} xs={5} sm={5}>
                            <>
                                <Checkbox
                                    checked={!gender}
                                    onFocus={this.basicsCheck}
                                    onBlur={this.basicsCheck}
                                    onChange={() => this.setState({gender: false})}
                                    icon={<BsCircle size={fontSize >20 ? fontSize : 20} className="chbk-icons"/>}
                                    checkedIcon={<BsCheckCircleFill size={fontSize >20 ? fontSize : 20} className="chbk-icons"/>}
                                />
                                <span className="newDemo-radio-txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16px' }}>Female</span>
                            </>
                        </Col>
                        <Col md={2}></Col>
                        <Col md={6} sm={12} xs={12}>
                          <div className="forMobile">
                            <p className="input_header_txt" style={{ fontSize: '16.5px' }}>Date of birth *</p>
                          </div>
                          <div className="calender_div" onClick={() => this.setState({calenderModal: true})}>
                            {
                              this.state.dateofbirth ? 
                              <p className="dob_txt">{this.state.dateofbirth}</p>
                              :
                              <p className="dob_txt">Select date of birth</p>
                            }
                          </div>
                        </Col>
                      </Row>
                      <Row style={{marginBottom:"4.5%"}}>
                        <Col md={6}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Maritial Status *</p>
                          <Select
                            onChange={this.handleMaritialStatus}
                            isSearchable={false}
                            onFocus={this.basicsCheck}
                            onBlur={this.basicsCheck}
                            value={maritialOptions.find(
                              (item) => item.value === martialStatus
                            )}
                            placeholder={<div>Select Martial Status</div>}
                            options={maritialOptions}
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
                            this.state.errors["maritialStatus"] ? (
                                <span
                                    id="marginInputs"
                                    className="validateErrorTxt registerInputMargin"
                                >
                                    {this.state.errors["maritialStatus"]}
                                </span>
                            ) :
                            <></>
                          }
                        </Col>
                        <Col md={6}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Phone Number *</p>
                          <input
                              className="emailInput"
                              placeholder="Enter your phone number"
                              type = "number" maxLength = "10"
                              onChange={this.handlePhone}
                              onFocus={this.handlePhone}
                              onBlur={this.basicsCheck}
                              value={this.state.phone}
                          />
                          {  
                              this.state.errors["phone"] ? (
                                  <span
                                      id="marginInputs"
                                      className="validateErrorTxt registerInputMargin"
                                  >
                                      {this.state.errors["phone"]}
                                  </span>
                              ) :
                              <div></div>
                          }
                        </Col>
                      </Row>
                      <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Email ID *</p>
                      <input
                          className="emailInput"
                          type="text"
                          placeholder="Enter your Email ID"
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
                          <div className="registerInputMargin"></div>
                      }
                      <Row>
                        <Col md={6}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Password *</p>
                          <input
                            className="emailInput"
                            type="password"
                            placeholder="Minimum 8 characters"
                            onChange={this.handlePassword}
                            onFocus={this.handlePassword}
                            onBlur={this.basicsCheck}
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
                              <></>
                          }
                        </Col>
                        <Col md={6}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Confirm Password *</p>
                          <input
                            className="emailInput"
                            type="password"
                            placeholder="Minimum 8 characters"
                            onChange={this.handleConfirmPassword}
                            onFocus={this.handleConfirmPassword}
                            onBlur={this.basicsCheck}
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
                        </Col>
                      </Row>
                      <div className="registerInputMargin"></div>
                      {
                        this.state.basicsChecked ?
                          <div className="login_button" onClick={this.basicsNext}>
                              <p className="login_signup_ques_text_white">Next</p>
                          </div>
                        :
                          <div className="login_button_disabled">
                              <p className="login_signup_ques_text_white">Next</p>
                          </div>
                      }
                      
                  </div>
                 :
                 <></>
              }
              {
                 this.state.layoutView === "Verify Email" ?
                    <div className="register_containerBox_inner">
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
                            <div className="changeEmail_button" onClick={()=> this.setState({layoutView: "Basics"})}>
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
                    </div>
                    :
                    <></>
              }
              {
                 this.state.layoutView === "Addresses" ?
                 <div className="register_containerBox_inner">
                      <p className="login_header_text" style={{ fontSize: fontSize >28 ? `${fontSize}px` : '27px' }}>Address</p>
                      <p className="login_subheader_text" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Add your current address details.</p>
                      <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>House No. & Street/Colony</p>
                      <input
                          className="emailInput"
                          type="text"
                          placeholder="Enter your house no. & street/colony"
                          onChange={this.handleStreetName}
                          onBlur={this.addressCheck}
                          onFocus={this.handleStreetName}
                          value={this.state.streetName}
                      />
                      {  
                          this.state.errors["street"] ? (
                              <span
                                  id="marginInputs"
                                  className="validateErrorTxt registerInputMargin"
                              >
                                  {this.state.errors["street"]}
                              </span>
                          ) :
                          <div className="registerInputMargin_3"></div>
                      }
                      <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Town/Village</p>
                      <input
                          className="emailInput"
                          type="text"
                          placeholder="Enter your town or village"
                          onChange={this.handleTown}
                          onBlur={this.addressCheck}
                          onFocus={this.handleTown}
                          value={this.state.town}
                      />
                      {  
                          this.state.errors["town"] ? (
                              <span
                                  id="marginInputs"
                                  className="validateErrorTxt registerInputMargin"
                              >
                                  {this.state.errors["town"]}
                              </span>
                          ) :
                          <div className="registerInputMargin_3"></div>
                      }
                      <Row>
                        <Col md={6} xs={12} sm={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>District</p>
                          <Select
                            onChange={this.handleDistrict}
                            isSearchable={false}
                            onFocus={this.addressCheck}
                            onBlur={this.addressCheck}
                            value={districtOptions.find(
                              (item) => item.value === district
                            )}
                            placeholder={<div>Select district</div>}
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
                            this.state.errors["district"] ? (
                                <span
                                    id="marginInputs"
                                    className="validateErrorTxt registerInputMargin"
                                >
                                    {this.state.errors["district"]}
                                </span>
                            ) :
                            <div className="registerInputMargin"></div>
                          }
                        </Col>
                        <Col md={6} xs={12} sm={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>PIN Code</p>
                          <input
                              className="emailInput"
                              type = "number" maxLength = "6"
                              placeholder="Enter your PIN Code"
                              onChange={this.handlePincode}
                              onFocus={this.handlePincode}
                              onBlur={this.addressCheck}
                              value={this.state.pincode}
                          />
                          {  
                            this.state.errors["pincode"] ? (
                                <span
                                    id="marginInputs"
                                    className="validateErrorTxt registerInputMargin"
                                >
                                    {this.state.errors["pincode"]}
                                </span>
                            ) :
                            <div className="registerInputMargin"></div>
                          }
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} xs={6} sm={6}>
                          <div className="changeEmail_button" onClick={()=> this.setState({layoutView: "Basics"})}>
                              <p className="login_signup_ques_text_blue">Go Back</p>
                          </div>
                        </Col>
                        <Col md={6} xs={6} sm={6}>
                          {
                            this.state.addressChecked ?
                              <div className="login_button" onClick={() => this.setState({layoutView: "Loan Info"})}>
                                  <p className="login_signup_ques_text_white">Next</p>
                              </div>
                            :
                              <div className="login_button_disabled">
                                  <p className="login_signup_ques_text_white">Next</p>
                              </div>
                          }
                        </Col>
                      </Row>
                      
                      
                  </div>
                 :
                 <></>
              }
              {
                 this.state.layoutView === "Loan Info" ?
                 <div className="register_containerBox_inner">
                      <p className="login_header_text" style={{ fontSize: fontSize >28 ? `${fontSize}px` : '27px' }}>Employment Information</p>
                      <p className="login_subheader_text" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Kindly provide the below details related to your employment & loan facilty requirements.</p>
                      <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Employment Status *</p>
                      <Select
                        onChange={this.handleEmploymentStatus}
                        isSearchable={false}
                        onFocus={this.loanCheck}
                        onBlur={this.loanCheck}
                        value={employmentStatusOptions.find(
                          (item) => item.value === employmentStatus
                        )}
                        placeholder={<div>Select Employment Status</div>}
                        options={employmentStatusOptions}
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
                        this.state.errors["employmentStatus"] ? (
                            <span
                                id="marginInputs"
                                className="validateErrorTxt registerInputMargin"
                            >
                                {this.state.errors["employmentStatus"]}
                            </span>
                        ) :
                        <div className="genderMargins"></div>
                      }
                      <Row>
                        <Col md={6} xs={12} sm={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Employer Name *</p>
                          <input
                              className="emailInput"
                              type="text"
                              placeholder="Enter your employer / business name"
                              onChange={this.handleEmployerName}
                              onBlur={this.loanCheck}
                              onFocus={this.handleEmployerName}
                              value={this.state.employerName}
                          />
                          {  
                              this.state.errors["employerName"] ? (
                                  <span
                                      id="marginInputs"
                                      className="validateErrorTxt registerInputMargin"
                                  >
                                      {this.state.errors["employerName"]}
                                  </span>
                              ) :
                              <div className="registerInputMargin"></div>
                          }
                        </Col>
                        <Col md={6} xs={12} sm={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Monthly Income (in ₹)</p>
                          <input
                              className="emailInput"
                              type = "number" maxLength={10}
                              placeholder="Enter your monthly income in Indian Rupees"
                              onChange={this.handleMonthlyIncome}
                              onFocus={this.handleMonthlyIncome}
                              onBlur={this.loanCheck}
                              value={this.state.monthlyIncome}
                          />
                          {  
                            this.state.errors["monthlyIncome"] ? (
                                <span
                                    id="marginInputs"
                                    className="validateErrorTxt registerInputMargin"
                                >
                                    {this.state.errors["monthlyIncome"]}
                                </span>
                            ) :
                            <div className="registerInputMargin"></div>
                          }
                        </Col>
                      </Row>
                      <br/>
                      <p className="login_header_text" style={{ fontSize: fontSize >28 ? `${fontSize}px` : '27px' }}>Loan Information</p>
                      <p className="login_subheader_text" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Kindly provide the below details related to your employment & loan facilty requirements.</p>
                      <Row>
                        <Col md={6} x={12} sm={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Loan Type *</p>
                          <Select
                            onChange={this.handleEmploymentStatus}
                            isSearchable={false}
                            onFocus={this.loanCheck}
                            onBlur={this.loanCheck}
                            value={employmentStatusOptions.find(
                              (item) => item.value === employmentStatus
                            )}
                            placeholder={<div>Select Employment Status</div>}
                            options={employmentStatusOptions}
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
                            this.state.errors["employmentStatus"] ? (
                                <span
                                    id="marginInputs"
                                    className="validateErrorTxt registerInputMargin"
                                >
                                    {this.state.errors["employmentStatus"]}
                                </span>
                            ) :
                            <div className="genderMargins"></div>
                          }
                        </Col>
                        <Col md={6} x={12} sm={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Loan Amount (in ₹)</p>
                          <input
                              className="emailInput"
                              type = "number" maxLength={10}
                              placeholder="Enter your monthly income in Indian Rupees"
                              onChange={this.handleMonthlyIncome}
                              onFocus={this.handleMonthlyIncome}
                              onBlur={this.loanCheck}
                              value={this.state.monthlyIncome}
                          />
                          {  
                            this.state.errors["monthlyIncome"] ? (
                                <span
                                    id="marginInputs"
                                    className="validateErrorTxt registerInputMargin"
                                >
                                    {this.state.errors["monthlyIncome"]}
                                </span>
                            ) :
                            <div className="registerInputMargin"></div>
                          }
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} xs={6} sm={6}>
                          <div className="changeEmail_button" onClick={()=> this.setState({layoutView: "Addresses"})}>
                              <p className="login_signup_ques_text_blue">Go Back</p>
                          </div>
                        </Col>
                        <Col md={6} xs={6} sm={6}>
                          {
                            this.state.addressChecked ?
                              <div className="login_button" onClick={() => this.setState({layoutView: "Confirmation"})}>
                                  <p className="login_signup_ques_text_white">Next</p>
                              </div>
                            :
                              <div className="login_button_disabled">
                                  <p className="login_signup_ques_text_white">Next</p>
                              </div>
                          }
                        </Col>
                      </Row>
                      
                      
                  </div>
                 :
                 <></>
              }
              {
                 this.state.layoutView === "Confirmation" ?
                  <div className="register_containerBox_inner">
                      <p className="login_header_text" style={{ fontSize: fontSize >28 ? `${fontSize}px` : '27px' }}>Confirmation</p>
                      <p className="login_subheader_text" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Kindly review the fields, incase of any discrepancy the candidate may press the "Go Back" button to go back & make the required changes.</p>
                      <Row>
                        <Col md={9} xs={6} sm={6}>
                          <div className="passtport_header">
                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Passport Photo</p>
                            <p style={{marginLeft: 4, fontSize: fontSize >17 ? `${fontSize}px` : '15px'}} className="passport_subheader_text">Photo should have white background & good quality.</p>
                            <p style={{marginLeft: 4, fontSize: fontSize >17 ? `${fontSize}px` : '15px'}} className="passport_subheader_text">Only JPG, PNG & JPEG allowed.</p>
                          </div>
                        </Col>
                        <Col md={3} xs={6} sm={6}>
                          <div className="emptyPasstport"  onClick={() => document.getElementById('fileInput').click()}>
                            <div>
                              <center>
                                {
                                  this.state.passportPhoto === null ?
                                    <>
                                      <img src={passport_upload} className="passport_empty_img" alt="select image" />
                                      <p className="passport_empty_txt">Select Image</p>
                                    </>
                                  :
                                    <img src={this.state.passportPhoto} className="passport_img" alt="select image" />
                                }
                                
                              </center>
                            </div>
                            <input
                              type="file"
                              id="fileInput"
                              accept="image/jpg, image/jpeg, image/png"
                              onChange={this.handlePassportSelect}
                              style={{ display: 'none' }}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={8} xs={6} sm={6}>
                          <div className="passtport_header">
                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Signature</p>
                            <p style={{marginLeft: 4, fontSize: fontSize >17 ? `${fontSize}px` : '15px'}} className="passport_subheader_text">Photo should have white background & good quality.</p>
                            <p style={{marginLeft: 4, fontSize: fontSize >17 ? `${fontSize}px` : '15px'}} className="passport_subheader_text">Only JPG, PNG & JPEG allowed.</p>
                          </div>
                        </Col>
                        <Col md={4} xs={6} sm={6}>
                          <div className="emptySignature"  onClick={() => document.getElementById('signatureInput').click()}>
                            <div>
                              <center>
                                {
                                  this.state.signaturePhoto === null ?
                                    <>
                                      <img src={passport_upload} className="signature_empty_img" alt="select image" />
                                      <p className="passport_empty_txt">Select Image</p>
                                    </>
                                  :
                                    <img src={this.state.signaturePhoto} className="signature_img" alt="select image" />
                                }
                                
                              </center>
                            </div>
                            <input
                              type="file"
                              id="signatureInput"
                              accept="image/jpg, image/jpeg, image/png"
                              onChange={this.handleSignatureSelect}
                              style={{ display: 'none' }}
                            />
                          </div>
                        </Col>
                      </Row>
                      <br/>
                      <Row className="confirmationTXT_margins">
                        <Col md={6} xs={12} sm={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Full Name</p>
                          <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.fullName}</p>
                        </Col>
                        <Col md={6} xs={12} sm={12}>
                          {
                            hasNameChanged ?
                            <>
                              <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Legal Name*</p>
                              <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.legalName}</p>
                            </>
                            :
                            <>
                              <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Did you change your name?</p>
                              <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>No</p>
                            </>
                          }
                        </Col>
                      </Row>
                      <Row className="confirmationTXT_margins">
                        <Col md={6} xs={6} sm={6}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Gender</p>
                          {
                            this.state.gender ?
                              <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>Male</p>
                            :
                              <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>Female</p>
                          }
                        </Col>
                        <Col md={6} xs={6} sm={6}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Date of Birth</p>
                          <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.dateofbirth}</p>
                        </Col>
                      </Row>
                      <Row className="confirmationTXT_margins">
                        <Col md={6} xs={12} sm={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Email ID</p>
                          <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.email}</p>
                        </Col>
                        <Col md={6} xs={12} sm={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Phone Number</p>
                          <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>+91-{this.state.phone}</p>
                        </Col>
                      </Row>
                      <Row className="confirmationTXT_margins">
                        <Col md={6} xs={12} sm={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Father's Name</p>
                          <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.fatherName}</p>
                        </Col>
                        <Col md={6} xs={12} sm={12}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Mother's Name</p>
                          <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.motherName}</p>
                        </Col>
                      </Row>
                      {
                        isIndigenous ?
                          <Row className="confirmationTXT_margins">
                            <Col md={6} xs={6} sm={6}>
                              <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Tribe</p>
                              <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.tribe}</p>
                            </Col>
                            <Col md={6} xs={6} sm={6}>
                              <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Category</p>
                              <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.category}</p>
                            </Col>
                          </Row>
                          :
                          <></>
                      }
                      <Row className="confirmationTXT_margins">
                        <Col md={6}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>House No. & Street</p>
                          <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.streetName}</p>
                        </Col>
                        <Col md={6}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Town/Village</p>
                          <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.town}</p>
                        </Col>
                      </Row>
                      <Row className="confirmationTXT_margins">
                        <Col md={6} xs={6} sm={6}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>District</p>
                          <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.district}</p>
                        </Col>
                        <Col md={6} xs={6} sm={6}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>PIN Code</p>
                          <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.pincode}</p>
                        </Col>
                      </Row>
                      <Row className="confirmationTXT_margins">
                        <Col md={6}>
                          <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Do you belong to PwD?</p>
                          <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.isPWD ? "Yes" : "No"}</p>
                        </Col>
                        <Col md={6}>
                         {
                          this.state.isPWD ?
                          <>
                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Category of PwD</p>
                            <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.pwdCategory}</p>
                          </>
                          :
                          <></>
                         }
                        </Col>
                      </Row>
                      <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Do you wish to disclose your marks in the public domain?</p>
                      <Row style={{marginBottom:"3.6%"}}>
                        <Col style={{marginTop:"1%"}} md={2} xs={5} sm={5}>
                            <>
                                <Checkbox
                                    checked={publicizeMarks}
                                    onChange={() => this.setState({publicizeMarks: true})}
                                    icon={<BsCircle size={fontSize > 21 ? fontSize : 20} className="chbk-icons"/>}
                                    checkedIcon={<BsCheckCircleFill size={fontSize > 21 ? fontSize : 20} className="chbk-icons"/>}
                                />
                                <span className="newDemo-radio-txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16px' }}>Yes</span>
                            </>
                        </Col>
                        <Col style={{marginTop:"1%"}} md={2} xs={5} sm={5}>
                            <>
                                <Checkbox
                                    checked={!publicizeMarks}
                                    onChange={() => this.setState({publicizeMarks: false})}
                                    icon={<BsCircle size={fontSize > 21 ? fontSize : 20} className="chbk-icons"/>}
                                    checkedIcon={<BsCheckCircleFill size={fontSize > 21 ? fontSize : 20} className="chbk-icons"/>}
                                />
                                <span className="newDemo-radio-txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16px' }}>No</span>
                            </>
                        </Col>
                      </Row>
                      <div>
                        <Checkbox
                            checked={!this.state.isTOC}
                            onChange={this.tocUpdate}
                            icon={<BsCircle size={fontSize > 21 ? fontSize : 20} className="chbk-icons"/>}
                            checkedIcon={<BsCheckCircleFill size={fontSize > 21 ? fontSize : 20} className="chbk-icons"/>}
                        />
                        <span className="newDemo-radio-txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16px' }}>I Agree that <b>all the information I submitted are correct & true.</b></span>
                      </div>
                      <Row>
                        <Col md={6} sm={6} xs={6}>
                          <div className="changeEmail_button" onClick={()=> this.setState({layoutView: "Addresses"})}>
                            <p className="login_signup_ques_text_blue">Go Back</p>
                          </div>
                        </Col>
                        <Col md={6} sm={6} xs={6}>
                          {
                            this.state.isTOC ?
                              <div className="login_button_disabled">
                                  <p className="login_signup_ques_text_white">Submit</p>
                              </div>
                            :
                              <div className="login_button" onClick={this.handleRegister}>
                                  <p className="login_signup_ques_text_white">Submit</p>
                              </div>
                          }
                        </Col>
                      </Row>
                  </div>
                 :
                 <></>
              }
            </Col>
            <Col md={4} xs={12} sm={12}>
              <div className="registration_right">
                <p className="login_header_text"><BsInfoCircle size={25}/> Instructions</p>
                <br className="counter_br"/>
                <ul>
                  {
                    this.state.layoutView === "Basics" ?
                    <>
                      <li><p className="passport_subheader_text">All fields marked with * are mandatory</p></li>
                      <li><p className="passport_subheader_text">Make sure your Full Name matches with your Matriculation Admit Card or with documents like Aadhaar, PAN card or Driving License.</p></li>
                      <li><p className="passport_subheader_text">Password has to be minimum of 8 characters.</p></li>
                      <li><p className="passport_subheader_text">Make sure you have access to the Email ID & Phone Number you're submitting.</p></li>
                      <li><p className="passport_subheader_text">If you changed your name than an affidavit must be submitted mentioning your previous and current name.</p></li>
                      <li><p className="passport_subheader_text">Kindly recheck all the fields before proceeding ahead.</p></li>
                      
                    </>
                    :
                    <></>
                  }
                  {
                    this.state.layoutView === "Verify Email" ?
                    <>
                      <li><p className="passport_subheader_text">An email with 4 digits OTP has been sent at {this.state.email}</p></li>
                      <li><p className="passport_subheader_text">Kindly check Inbox & Spam folders.</p></li>
                      <li><p className="passport_subheader_text">You can request for OTP Resend every 30 seconds.</p></li>
                    </>
                    :
                    <></>
                  }
                  {
                    this.state.layoutView === "Addresses" ?
                    <>
                      <li><p className="passport_subheader_text">All the fields are mandatory.</p></li>
                      <li><p className="passport_subheader_text">You can add your correspondence address or permanent address.</p></li>
                      <li><p className="passport_subheader_text">Kindly recheck all the fields before proceeding ahead.</p></li>
                    </>
                    :
                    <></>
                  }
                  {
                    this.state.layoutView === "Confirmation" ?
                    <>
                      <li><p className="passport_subheader_text">Passport photo must have a white background.</p></li>
                      <li><p className="passport_subheader_text">You can click on the steps above to go back make changes.</p></li>
                      <li><p className="passport_subheader_text">Kindly recheck all the fields before submitting.</p></li>
                    </>
                    :
                    <></>
                  }
                </ul>
               
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
      </>
    )
  }
}
export default withRouter(Register);
