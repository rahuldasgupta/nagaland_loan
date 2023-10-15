import React from "react";
import { withRouter } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ToastContainer, toast } from "react-toastify";
import {  BsCircle, BsCheckCircleFill, BsInfoCircle } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import Checkbox from '@mui/material/Checkbox';
import Select from "react-select";
import Calendar from 'react-calendar';
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { AiOutlineUpload } from "react-icons/ai";
import { RxDoubleArrowLeft, RxDoubleArrowRight, } from "react-icons/rx";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import moment from 'moment';
import Compressor from 'compressorjs';
import { Bars } from  'react-loader-spinner';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import axios from 'axios';
import {Helmet} from "react-helmet";
import Lottie from 'react-lottie';

import youtube from '../../assets/youtube.json'; 
import bookmarkJSON from '../../assets/bookmark.json'; 
import clipmarkJSON from '../../assets/clipmark.json'; 
import passport from "../../assets/passport.png";
import email from "../../assets/email.png";
import education from "../../assets/education.png";
import passport_upload from "../../assets/passport_upload.png";

import Footer from "../../components/Footer/footer";
import "./profile.css";
import "react-toastify/dist/ReactToastify.css";

const tribeOptions = [
    { value: "Angami", label: "Angami" },
    { value: "Ao", label: "Ao" },
    { value: "Chakhesang", label: "Chakhesang" },
    { value: "Chang", label: "Chang" },
    { value: "Garo", label: "Garo" },
    { value: "Kachari", label: "Kachari" },
    { value: "Khiamniungan", label: "Khiamniungan" },
    { value: "Konyak", label: "Konyak" },
    { value: "Kuki", label: "Kuki" },
    { value: "Lotha", label: "Lotha" },
    { value: "Mikir", label: "Mikir" },
    { value: "Phom", label: "Phom" },
    { value: "Pochury", label: "Pochury" },
    { value: "Rengma", label: "Rengma" },
    { value: "Sangtam", label: "Sangtam" },
    { value: "Sumi", label: "Sumi" },
    { value: "Sumi (Kiphire)", label: "Sumi (Kiphire)" },
    { value: "Tikhir", label: "Tikhir" },
    { value: "Yimkhiung", label: "Yimkhiung" },
    { value: "Zeliang", label: "Zeliang" }
  ]  
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
const pwdOptions = [
    { value: "Category A", label: "Category A (Blindness & Low Vision)" },
    { value: "Category B", label: "Category B (Deaf & Hard of Hearing)" },
    { value: "Category C", label: "Category C (Locomotor Disability including Cerebral Palsy, Leprosy Cured, Dwarfism, Acid Attacks Victims & Muscular Dystrophy)" },
  ]
const percentageOptions = [
    { value: "Percentage", label: "Percentage" },
    { value: "CPGA (Max 7)", label: "CPGA (Max 7)" },
    { value: "CPGA (Max 10)", label: "CPGA (Max 10)" }
  ]
let degreeOptions = [
    { value: "Class 10", label: "Class 10" },
    { value: "Class 12", label: "Class 12", isDisabled: true },

    { value: "Diploma in Computer Application", label: "Diploma in Computer Application", isDisabled: true },
    { value: "Diploma in Computer Application & Networking", label: "Diploma in Computer Application & Networking (DCAN)", isDisabled: true },
    { value: "Diploma in Mechanical Engineering", label: "Diploma in Mechanical Engineering", isDisabled: true },
    { value: "Diploma in Chemical Engineering", label: "Diploma in Chemical Engineering", isDisabled: true },
    { value: "Diploma in Electronics & Telecommunication", label: "Diploma in Electronics & Telecommunication", isDisabled: true },
    { value: "Diploma in Textile Engineering", label: "Diploma in Textile Engineering", isDisabled: true },
    { value: "Diploma in Architectual Engineering", label: "Diploma in Architectual Engineering", isDisabled: true },
    { value: "Diploma in Automobile Engineering", label: "Diploma in Automobile Engineering", isDisabled: true },
    { value: "Diploma in Plastic Engineering", label: "Diploma in Plastic Engineering", isDisabled: true },
    { value: "Diploma in Civil Engineering", label: "Diploma in Civil Engineering", isDisabled: true },
    { value: "Diploma in Electrical Engineering", label: "Diploma in Electrical Engineering", isDisabled: true },
    { value: "Diploma in Computer Science Engineering", label: "Diploma in Computer Science Engineering", isDisabled: true },
    { value: "Diploma in Information Technology", label: "Diploma in Information Technology", isDisabled: true },
    { value: "Diploma in Metallurgy Engineering", label: "Diploma in Metallurgy Engineering", isDisabled: true },
    { value: "Diploma in Fine Arts", label: "Diploma in Fine Arts", isDisabled: true },
    { value: "Diploma in Fashion Designing", label: "Diploma in Fashion Designing", isDisabled: true },
    { value: "Diploma in Soft Skill", label: "Diploma in Soft Skill", isDisabled: true },
    { value: "Diploma in Baking & Confectionery", label: "Diploma in Baking & Confectionery", isDisabled: true },
    { value: "Diploma in Hairstyling", label: "Diploma in Hairstyling", isDisabled: true },
    { value: "Diploma in Office Management", label: "Diploma in Office Management", isDisabled: true },
    { value: "Diploma in Public Hygiene & Sanitation Technology", label: "Diploma in Public Hygiene & Sanitation Technology", isDisabled: true },

    { value: "Pre-Service Teacher Education", label: "Pre-Service Teacher Education (P.S.T.E)", isDisabled: true },

    { value: "Bachelor of Arts", label: "Bachelor of Arts (B.A)", isDisabled: true },
    { value: "Bachelor of Arts Bachelor of Education", label: "Bachelor of Arts Bachelor of Education (B.A B.Ed)", isDisabled: true },
    { value: "Bachelor of Arts Bachelor of Law", label: "Bachelor of Arts Bachelor of Law (B.A.LLB)", isDisabled: true },
    { value: "Bachelor of Ayurvedic Medicine and Surgery", label: "Bachelor of Ayurvedic Medicine and Surgery (B.A.M.S)", isDisabled: true },
    { value: "Bachelor of Applied Sciences", label: "Bachelor of Applied Sciences (B.A.S)", isDisabled: true },
    { value: "Bachelor of Audiology and Speech Language Pathology", label: "Bachelor of Audiology and Speech Language Pathology (B.A.S.L.P)", isDisabled: true },
    { value: "Bachelor of Architecture", label: "Bachelor of Architecture (B.Arch)", isDisabled: true },
    { value: "Bachelor of Agriculture", label: "Bachelor of Agriculture (BSc Agriculture)", isDisabled: true },
    { value: "Bachelor of Business Administration", label: "Bachelor of Business Administration (B.B.A)", isDisabled: true },
    { value: "Bachelor of Business Administration Bachelor of Law", label: "Bachelor of Business Administration Bachelor of Law (B.B.A L.L.B)", isDisabled: true },
    { value: "Bachelor of Business Management", label: "Bachelor of Business Management (B.B.M)", isDisabled: true },
    { value: "Bachelor of Business Studies", label: "Bachelor of Business Studies (B.B.S)", isDisabled: true },
    { value: "Bachelor of Commerce", label: "Bachelor of Commerce (B.Com)", isDisabled: true },
    { value: "Bachelor of Computer Applications", label: "Bachelor of Computer Applications (B.C.A)", isDisabled: true },
    { value: "Bachelor of Communication Journalism", label: "Bachelor of Communication Journalism (B.C.J)", isDisabled: true },
    { value: "Bachelor of Computer Science", label: "Bachelor of Computer Science (B.C.S)", isDisabled: true },
    { value: "Bachelor of Divinity", label: "Bachelor of Divinity (B.D)", isDisabled: true },
    { value: "Bachelor of Dental Surgery", label: "Bachelor of Dental Surgery (B.D.S)", isDisabled: true },
    { value: "Bachelor of Basic Development Therapy", label: "Basic Development Therapy (B.D.T)", isDisabled: true },
    { value: "Bachelor of Design", label: "Bachelor of Design (B.Des)", isDisabled: true },
    { value: "Bachelor of Engineering", label: "Bachelor of Engineering (B.E)", isDisabled: true },
    { value: "Bachelor of Education", label: "Bachelor of Education (B.Ed)", isDisabled: true },
    { value: "Bachelor of Electronic Science", label: "Bachelor of Electronic Science (B.E.S)", isDisabled: true },
    { value: "Bachelor of Fine Arts", label: "Bachelor of Fine Arts (B.F.A)", isDisabled: true},
    { value: "Bachelor of Financial Investment and Analysis", label: "Bachelor of Financial Investment and Analysis (B.F.I.A)", isDisabled: true },
    { value: "Bachelor of Fishery Sciences", label: "Bachelor of Fishery Sciences (B.F.S)", isDisabled: true },
    { value: "Bachelor of Fashion Technology", label: "Bachelor of Fashion Technology (B.F.Tech)", isDisabled: true },
    { value: "Bachelor of General Law", label: "Bachelor of General Law (B.G.L)", isDisabled: true },
    { value: "Bachelor of Hotel Management", label: "Bachelor of Hotel Management (B.H.M)", isDisabled: true },
    { value: "Bachelor Hotel Management and Catering Technology", label: "Bachelor Hotel Management and Catering Technology (B.H.M.C.T)", isDisabled: true },
    { value: "Bachelor of Hospitality and Tourism Management", label: "Bachelor of Hospitality and Tourism Management (B.H.T.M)", isDisabled: true },
    { value: "Bachelor of Information Systems Management", label: "Bachelor of Information Systems Management (B.I.S.M)", isDisabled: true },
    { value: "Bachelor of Journalism and Mass Communication", label: "Bachelor of Journalism and Mass Communication (BJMC)", isDisabled: true },
    { value: "Bachelor of Laws", label: "Bachelor of Laws (L.L.B)", isDisabled: true },
    { value: "Bachelor Library Science", label: "Bachelor Library Science (B.L.Sc)", isDisabled: true },
    { value: "Bachelor of Literature", label: "Bachelor of Literature (B.Lit)", isDisabled: true },
    { value: "Bachelor of Medicine Bachelor of Surgery", label: "Bachelor of Medicine Bachelor of Surgery (M.B.B.S)", isDisabled: true },
    { value: "Bachelor of Medical Laboratory Technology", label: "Bachelor of Medical Laboratory Technology (B.M.L.T)", isDisabled: true },
    { value: "Bachelor of Music", label: "Bachelor of Music (B.Mus)", isDisabled: true },
    { value: "Bachelor of Mental Retardation", label: "Bachelor of Mental Retardation (B.M.R)", isDisabled: true },
    { value: "Bachelor of Nursing", label: "Bachelor of Nursing (B.N)", isDisabled: true },
    { value: "Bachelor Of Physical Education", label: "Bachelor Of Physical Education (B.P.Ed)", isDisabled: true },
    { value: "Bachelor of Public Relations", label: "Bachelor of Public Relations (B.P.R)", isDisabled: true },
    { value: "Bachelor in Pharmacy", label: "Bachelor in Pharmacy (B.Pharm)", isDisabled: true },
    { value: "Bachelor of Psychology", label: "Bachelor of Psychology (B.Psych)", isDisabled: true },
    { value: "Bachelor of Physiotherapy", label: "Bachelor of Physiotherapy (B.P.T)", isDisabled: true },
    { value: "Bachelor in Science Education", label: "Bachelor in Science Education (B.S.E)", isDisabled: true },
    { value: "Bachelor of Social Work", label: "Bachelor of Social Work (B.S.W)", isDisabled: true },
    { value: "Bachelor of Science", label: "Bachelor of Science (B.Sc)", isDisabled: true },
    { value: "Bachelor of Science Bachelor of Education", label: "Bachelor of Science Bachelor of Education (B.Sc.B.Ed)", isDisabled: true },
    { value: "Bachelor of Science in Education", label: "Bachelor of Science in Education (B.Sc.Ed)", isDisabled: true },
    { value: "Bachelor of Science in Horticulture", label: "Bachelor of Science in Horticulture (B.Sc Horticulture)", isDisabled: true },
    { value: "Bachelor of Science in Forestry", label: "Bachelor of Science in Forestry (B.Sc Forestry)", isDisabled: true },
    { value: "Bachelor of Science in Information Technology", label: "Bachelor of Science in Information Technology (B.Sc. IT) ", isDisabled: true },
    { value: "Bachelor of Tourism Administration", label: "Bachelor of Tourism Administration (B.T.A)", isDisabled: true },
    { value: "Bachelor of Technology", label: "Bachelor of Technology (B.Tech)", isDisabled: true },
    { value: "Bachelor of Unani Medicine & Surgery", label: "Bachelor of Unani Medicine & Surgery (B.U.M.S)", isDisabled: true },
    { value: "Bachelor of Veterinary Science", label: "Bachelor of Veterinary Science (B.V.Sc)", isDisabled: true },
    { value: "Bachelor of Elementary Education", label: "Bachelor of Elementary Education (B.El.Ed)", isDisabled: true },
    { value: "Bachelor of Healthcare Education", label: "Bachelor of Healthcare Education (B.H.Ed)", isDisabled: true },
    { value: "Bachelor of Vocational", label: "Bachelor of Vocational (B.Voc.)", isDisabled: true },

    { value: "Master of Arts", label: "Master of Arts (M.A)", isDisabled: true },
    { value: "Master of Science", label: "Master of Science (M.Sc)", isDisabled: true },
    { value: "Master of Fine Arts", label: "Master of Fine Arts (M.F.A)", isDisabled: true },
    { value: "Master of Business Administration", label: "Master of Business Administration (M.B.A)", isDisabled: true },
    { value: "Master of Education", label: "Master of Education (M.Ed)", isDisabled: true },
    { value: "Master of Engineering", label: "Master of Engineering (M.E)", isDisabled: true },
    { value: "Master of Technology", label: "Master of Technology (M.Tech)", isDisabled: true },
    { value: "Master of Nursing", label: "Master of Nursing (M.N)", isDisabled: true },
    { value: "Master of Social Work", label: "Master of Social Work (M.SW)", isDisabled: true },
    { value: "Master of Architecture", label: "Master of Architecture (M.Arch)", isDisabled: true },
    { value: "Master of Commerce", label: "Master of Commerce (M.Com)", isDisabled: true },
    { value: "Master of Psychology", label: "Master of Psychology (M.Psych)", isDisabled: true },
    { value: "Master of Music", label: "Master of Music (M.Mus)", isDisabled: true },
    { value: "Master of Laws", label: "Master of Laws (L.L.M)", isDisabled: true },
    { value: "Master of Philosophy", label: "Master of Philosophy (M.Phil)", isDisabled: true },
    { value: "Master of Agriculture", label: "Master of Agriculture (MSc Agriculture)", isDisabled: true },
    { value: "Master of Science in Horticulture", label: "Master of Science in Horticulture (M.Sc Horticulture)", isDisabled: true },
    { value: "Master of Science in Forestry", label: "Master of Science in Forestry (M.Sc Forestry)", isDisabled: true },
    { value: "Master of Science in Information Technology", label: "Master of Science in Information Technology (M.Sc. IT) ", isDisabled: true },

    { value: "Ph.D", label: "Ph.D (Doctor of Philosophy)", isDisabled: true },
  ]
const certificateOptions = [
    { value: "ITI Carpentry", label: "ITI Carpentry" },
    { value: "ITI Computer Operator & Programming Assistant", label: "ITI Computer Operator & Programming Assistant" },
    { value: "ITI Cutting & Sewing", label: "ITI Cutting & Sewing" },
    { value: "ITI Diesel Mechanic", label: "ITI Diesel Mechanic" },
    { value: "ITI Draughtsman (Civil)", label: "ITI Draughtsman (Civil)" },
    { value: "ITI Electrician", label: "ITI Electrician" },
    { value: "ITI Hair & Skin care", label: "ITI Hair & Skin care" },
    { value: "ITI Knitting", label: "ITI Knitting" },
    { value: "ITI Mechanist", label: "ITI Mechanist" },
    { value: "ITI Motor Mechanic", label: "ITI Motor Mechanic" },
    { value: "ITI Plumbing", label: "ITI Plumbing" },
    { value: "ITI Radio & TV", label: "ITI Radio & TV" },
    { value: "ITI Secretarial Practice", label: "ITI Secretarial Practice" },
    { value: "ITI Stenography", label: "ITI Stenography" },
    { value: "ITI Turner", label: "ITI Turner" },
    { value: "Inland Fisheries Development & Management", label: "Inland Fisheries Development & Management" },
    { value: "TET", label: "TET (State Teacher Eligibility Test)" },
    { value: "Veterinary Field Assistant", label: "Veterinary Field Assistant (VFA)" },
    { value: "IETC", label: "IETC" },


    { value: "Certificate Course on Yoga", label: "Certificate Course on Yoga" },
    { value: "Certificate Course on Web Designing", label: "Certificate Course on Web Designing" },
    { value: "Certificate Course on Spoken English", label: "Certificate Course on Spoken English" },
    { value: "Certificate Course on Tally", label: "Certificate Course on Tally" },
    { value: "Certificate Course on Accountance", label: "Certificate Course on Accountance" },
    { value: "Certificate Course on Photography", label: "Certificate Course on Photography" },
    { value: "Course on Computer Concepts", label: "Course on Computer Concepts (CCC)" }
  ]
const durationOptions = [
    { value: "6", label: "6 Months" },
    { value: "12", label: "1 Year" },
    { value: "24", label: "2 Years" },
    { value: "36", label: "3 Years" },
    { value: "48", label: "4 Years" },
  ]

let documentTypeOptions = [
    { value: "Marksheet", label: "Marksheet", isDisabled: true },
    { value: "Transcript", label: "Transcript", isDisabled: true },
    { value: "Admit Card", label: "Admit Card" },
  ]

const today = new Date();

var passtportPhoto = null;
var affidavitPhoto = null;
var educationalDoc = null;
var certificateDoc = null;
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

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            layoutView: "Profile",
            profileEditMode: false,
            educationEditMode: false,
            certificateEditMode: false,
            loaderModal: true,
            APIStatus: "Loading Data",
            doesEducationExists: false,
            isSignatureEditMode: false,
            signaturePhoto: null,
            pwdCertificate: null,

            email: "",
            fullName: "",
            hasNameChanged: false,
            isIndigenous: true,
            legalName: "",
            gender: true,
            errors:{},
            count: 0,
            basicsChecked: false,
            calenderModal: false,
            dateofbirth: "",
            unformattedDate: new Date(),
            passportPhoto: null,
            affidavitPhoto: null,
            motherName: "",
            fatherName: "",
            tribe: null,
            category: null,
            isPWD: false,
            pwdCategory: null,
            isClass10Submitted: false,
            

            streetName: "",
            town: "",
            district: null,
            pincode: "",
            basicsChecked: false,

            degree: null,
            yearOfPassingModal: false,
            yearofpassing: null,
            yearofpassing_unformated: new Date(),
            percentage: "",
            educationalDoc: null,
            educationChecked: false,
            duplicateEducationModal: false,
            percentageType: "Percentage",
            universityName: "",
            documentType: "",

            certificateCourse: null,
            duration: null,
            certificateDoc: null,
            certificateChecked: false,
            duplicateCertificateModal: false,

            disclaimerModal: false,
            fileTooLargeModal: false,
            FTL_message: "",
            showButton: false
        };
        this.handleFullName = this.handleFullName.bind(this);
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
            email: responseJson.userData[0].email,
            fullName: responseJson.userData[0].full_name,
            hasNameChanged: responseJson.userData[0].has_name_changed == "Yes" ? true : false,
            isIndigenous:  responseJson.userData[0].is_indegeneous == "Yes" ? true : false,
            legalName: responseJson.userData[0].legal_name,
            gender: responseJson.userData[0].gender == "MALE" ? true : false,
            dateofbirth: responseJson.userData[0].date_of_birth,
            passportPhoto: responseJson.userData[0].passport_photo,
            signaturePhoto: responseJson.userData[0].signature_docs,
            affidavitPhoto: responseJson.userData[0].affidavit_docs === "" ? null : " File Already Uploaded (Tap to change)",
            pwdCertificate: responseJson.userData[0].pwd_docs === "" ? null : " File Already Uploaded (Tap to change)",
            motherName: responseJson.userData[0].mother_name,
            fatherName: responseJson.userData[0].father_name,
            tribe: responseJson.userData[0].tribe,
            category: responseJson.userData[0].tribe_category,
            isPWD: responseJson.userData[0].is_pwd == "Yes" ? true : false,
            pwdCategory: responseJson.userData[0].pwd_category,
            streetName: responseJson.userData[0].colony_name,
            town: responseJson.userData[0].town,
            district: responseJson.userData[0].district,
            pincode: responseJson.userData[0].pincode
        })
        if(this.state.userData[1].education_details.length > 1 || this.state.userData[2].certificate_details.length > 0){
            this.setState({
                doesEducationExists: true,
            })
        }
        if(this.state.userData[1].education_details.length > 0){
            this.setState({
                isClass10Submitted: true,
            })
            degreeOptions = [
                { value: "Class 10", label: "Class 10" },
                { value: "Class 12", label: "Class 12" },
            
                { value: "Diploma in Computer Application", label: "Diploma in Computer Application" },
                { value: "Diploma in Computer Application & Networking", label: "Diploma in Computer Application & Networking (DCAN)" },
                { value: "Diploma in Mechanical Engineering", label: "Diploma in Mechanical Engineering" },
                { value: "Diploma in Chemical Engineering", label: "Diploma in Chemical Engineering" },
                { value: "Diploma in Electronics & Telecommunication", label: "Diploma in Electronics & Telecommunication" },
                { value: "Diploma in Textile Engineering", label: "Diploma in Textile Engineering" },
                { value: "Diploma in Architectual Engineering", label: "Diploma in Architectual Engineering" },
                { value: "Diploma in Automobile Engineering", label: "Diploma in Automobile Engineering" },
                { value: "Diploma in Plastic Engineering", label: "Diploma in Plastic Engineering" },
                { value: "Diploma in Civil Engineering", label: "Diploma in Civil Engineering" },
                { value: "Diploma in Electrical Engineering", label: "Diploma in Electrical Engineering" },
                { value: "Diploma in Computer Science Engineering", label: "Diploma in Computer Science Engineering" },
                { value: "Diploma in Information Technology", label: "Diploma in Information Technology" },
                { value: "Diploma in Metallurgy Engineering", label: "Diploma in Metallurgy Engineering" },
                { value: "Diploma in Fine Arts", label: "Diploma in Fine Arts" },
                { value: "Diploma in Fashion Designing", label: "Diploma in Fashion Designing" },
                { value: "Diploma in Soft Skill", label: "Diploma in Soft Skill" },
                { value: "Diploma in Baking & Confectionery", label: "Diploma in Baking & Confectionery" },
                { value: "Diploma in Hairstyling", label: "Diploma in Hairstyling" },
                { value: "Diploma in Office Management", label: "Diploma in Office Management" },
                { value: "Diploma in Public Hygiene & Sanitation Technology", label: "Diploma in Public Hygiene & Sanitation Technology" },
            
                { value: "Pre-Service Teacher Education", label: "Pre-Service Teacher Education (P.S.T.E)" },
            
                { value: "Bachelor of Arts", label: "Bachelor of Arts (B.A)" },
                { value: "Bachelor of Arts Bachelor of Education", label: "Bachelor of Arts Bachelor of Education (B.A B.Ed)" },
                { value: "Bachelor of Arts Bachelor of Law", label: "Bachelor of Arts Bachelor of Law (B.A.LLB)" },
                { value: "Bachelor of Ayurvedic Medicine and Surgery", label: "Bachelor of Ayurvedic Medicine and Surgery (B.A.M.S)" },
                { value: "Bachelor of Applied Sciences", label: "Bachelor of Applied Sciences (B.A.S)" },
                { value: "Bachelor of Audiology and Speech Language Pathology", label: "Bachelor of Audiology and Speech Language Pathology (B.A.S.L.P)" },
                { value: "Bachelor of Architecture", label: "Bachelor of Architecture (B.Arch)" },
                { value: "Bachelor of Agriculture", label: "Bachelor of Agriculture (BSc Agriculture)" },
                { value: "Bachelor of Business Administration", label: "Bachelor of Business Administration (B.B.A)" },
                { value: "Bachelor of Business Administration Bachelor of Law", label: "Bachelor of Business Administration Bachelor of Law (B.B.A L.L.B)" },
                { value: "Bachelor of Business Management", label: "Bachelor of Business Management (B.B.M)" },
                { value: "Bachelor of Business Studies", label: "Bachelor of Business Studies (B.B.S)" },
                { value: "Bachelor of Commerce", label: "Bachelor of Commerce (B.Com)" },
                { value: "Bachelor of Computer Applications", label: "Bachelor of Computer Applications (B.C.A)" },
                { value: "Bachelor of Communication Journalism", label: "Bachelor of Communication Journalism (B.C.J)" },
                { value: "Bachelor of Computer Science", label: "Bachelor of Computer Science (B.C.S)" },
                { value: "Bachelor of Divinity", label: "Bachelor of Divinity (B.D)" },
                { value: "Bachelor of Dental Surgery", label: "Bachelor of Dental Surgery (B.D.S)" },
                { value: "Bachelor of Basic Development Therapy", label: "Basic Development Therapy (B.D.T)" },
                { value: "Bachelor of Design", label: "Bachelor of Design (B.Des)" },
                { value: "Bachelor of Engineering", label: "Bachelor of Engineering (B.E)" },
                { value: "Bachelor of Education", label: "Bachelor of Education (B.Ed)" },
                { value: "Bachelor of Electronic Science", label: "Bachelor of Electronic Science (B.E.S)" },
                { value: "Bachelor of Fine Arts", label: "Bachelor of Fine Arts (B.F.A)"},
                { value: "Bachelor of Financial Investment and Analysis", label: "Bachelor of Financial Investment and Analysis (B.F.I.A)" },
                { value: "Bachelor of Fishery Sciences", label: "Bachelor of Fishery Sciences (B.F.S)" },
                { value: "Bachelor of Fashion Technology", label: "Bachelor of Fashion Technology (B.F.Tech)" },
                { value: "Bachelor of General Law", label: "Bachelor of General Law (B.G.L)" },
                { value: "Bachelor of Hotel Management", label: "Bachelor of Hotel Management (B.H.M)" },
                { value: "Bachelor Hotel Management and Catering Technology", label: "Bachelor Hotel Management and Catering Technology (B.H.M.C.T)" },
                { value: "Bachelor of Hospitality and Tourism Management", label: "Bachelor of Hospitality and Tourism Management (B.H.T.M)" },
                { value: "Bachelor of Information Systems Management", label: "Bachelor of Information Systems Management (B.I.S.M)" },
                { value: "Bachelor of Journalism and Mass Communication", label: "Bachelor of Journalism and Mass Communication (BJMC)" },
                { value: "Bachelor of Laws", label: "Bachelor of Laws (L.L.B)" },
                { value: "Bachelor Library Science", label: "Bachelor Library Science (B.L.Sc)" },
                { value: "Bachelor of Literature", label: "Bachelor of Literature (B.Lit)" },
                { value: "Bachelor of Medicine Bachelor of Surgery", label: "Bachelor of Medicine Bachelor of Surgery (M.B.B.S)" },
                { value: "Bachelor of Medical Laboratory Technology", label: "Bachelor of Medical Laboratory Technology (B.M.L.T)" },
                { value: "Bachelor of Music", label: "Bachelor of Music (B.Mus)" },
                { value: "Bachelor of Mental Retardation", label: "Bachelor of Mental Retardation (B.M.R)" },
                { value: "Bachelor of Nursing", label: "Bachelor of Nursing (B.N)" },
                { value: "Bachelor Of Physical Education", label: "Bachelor Of Physical Education (B.P.Ed)" },
                { value: "Bachelor of Public Relations", label: "Bachelor of Public Relations (B.P.R)" },
                { value: "Bachelor in Pharmacy", label: "Bachelor in Pharmacy (B.Pharm)" },
                { value: "Bachelor of Psychology", label: "Bachelor of Psychology (B.Psych)" },
                { value: "Bachelor of Physiotherapy", label: "Bachelor of Physiotherapy (B.P.T)" },
                { value: "Bachelor in Science Education", label: "Bachelor in Science Education (B.S.E)" },
                { value: "Bachelor of Social Work", label: "Bachelor of Social Work (B.S.W)" },
                { value: "Bachelor of Science", label: "Bachelor of Science (B.Sc)" },
                { value: "Bachelor of Science Bachelor of Education", label: "Bachelor of Science Bachelor of Education (B.Sc.B.Ed)" },
                { value: "Bachelor of Science in Education", label: "Bachelor of Science in Education (B.Sc.Ed)" },
                { value: "Bachelor of Science in Information Technology", label: "Bachelor of Science in Information Technology (B.Sc. IT) " },
                { value: "Bachelor of Science in Horticulture", label: "Bachelor of Science in Horticulture (B.Sc Horticulture)" },
                { value: "Bachelor of Science in Forestry", label: "Bachelor of Science in Forestry (B.Sc Forestry)" },
                { value: "Bachelor of Tourism Administration", label: "Bachelor of Tourism Administration (B.T.A)" },
                { value: "Bachelor of Technology", label: "Bachelor of Technology (B.Tech)" },
                { value: "Bachelor of Unani Medicine & Surgery", label: "Bachelor of Unani Medicine & Surgery (B.U.M.S)" },
                { value: "Bachelor of Veterinary Science", label: "Bachelor of Veterinary Science (B.V.Sc)" },
                { value: "Bachelor of Elementary Education", label: "Bachelor of Elementary Education (B.El.Ed)" },
                { value: "Bachelor of Healthcare Education", label: "Bachelor of Healthcare Education (B.H.Ed)" },
                { value: "Bachelor of Vocational", label: "Bachelor of Vocational (B.Voc.)" },
            
                { value: "Master of Arts", label: "Master of Arts (M.A)" },
                { value: "Master of Science", label: "Master of Science (M.Sc)" },
                { value: "Master of Fine Arts", label: "Master of Fine Arts (M.F.A)" },
                { value: "Master of Business Administration", label: "Master of Business Administration (M.B.A)" },
                { value: "Master of Education", label: "Master of Education (M.Ed)" },
                { value: "Master of Engineering", label: "Master of Engineering (M.E)" },
                { value: "Master of Technology", label: "Master of Technology (M.Tech)" },
                { value: "Master of Nursing", label: "Master of Nursing (M.N)" },
                { value: "Master of Social Work", label: "Master of Social Work (M.SW)" },
                { value: "Master of Architecture", label: "Master of Architecture (M.Arch)" },
                { value: "Master of Commerce", label: "Master of Commerce (M.Com)" },
                { value: "Master of Psychology", label: "Master of Psychology (M.Psych)" },
                { value: "Master of Music", label: "Master of Music (M.Mus)" },
                { value: "Master of Laws", label: "Master of Laws (L.L.M)" },
                { value: "Master of Philosophy", label: "Master of Philosophy (M.Phil)" },
                { value: "Master of Agriculture", label: "Master of Agriculture (MSc Agriculture)" },
                { value: "Master of Science in Horticulture", label: "Master of Science in Horticulture (M.Sc Horticulture)" },
                { value: "Master of Science in Forestry", label: "Master of Science in Forestry (M.Sc Forestry)" },
                { value: "Master of Science in Information Technology", label: "Master of Science in Information Technology (M.Sc. IT)" },
            
                { value: "Ph.D", label: "Ph.D (Doctor of Philosophy)" }
            ]
        }
        if(responseJson.userData[0].passport_photo == "" || responseJson.userData[0].signature_docs == ""){
            this.setState({
                showButton: true
            })
        }
        this.setState({
            loaderModal: false
        })
    })
  }

  //PROFILE INFO
  basicsCheck = () => {
    const {passportPhoto, signaturePhoto, fullName, fatherName, dateofbirth, hasNameChanged, legalName, isIndigenous, tribe, category, isPWD, pwdCategory, streetName, town, district, pincode} = this.state;

    let fullNameWarning = this.state.errors["name"];
    let fatherNameWarning = this.state.errors["fatherName"];
    let districtWarning = this.state.errors["district"];
    let pincodeWarning = this.state.errors["pincode"];
    let townWarning = this.state.errors["town"];
    let streetWarning = this.state.errors["street"];
    if(
        passportPhoto != null && passportPhoto != "" &&
        signaturePhoto != null && signaturePhoto != "" &&
        fullName != null && fullName != "" &&
        fatherName != null && fatherName != "" &&
        dateofbirth != null && dateofbirth != "" &&
        streetName != null && streetName != "" &&
        town != null && town != "" &&
        district != null && district != "" &&
        pincode != null && pincode != ""
      ){
      if(fullNameWarning == null && fatherNameWarning == null && districtWarning == null && pincodeWarning == null && townWarning == null && streetWarning == null)
      {
        this.setState({
          basicsChecked: true
        })
        if(hasNameChanged == true && legalName == "" || hasNameChanged == true && legalName == null){
          this.setState({
            basicsChecked: false
          })
        }
        if(isIndigenous == true && tribe == null){
          this.setState({
            basicsChecked: false
          })
        }
        if(isIndigenous == true && category == null){
          this.setState({
            basicsChecked: false
          })
        }
        if(isPWD == true && pwdCategory == null){
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
    else{
      this.setState({
        basicsChecked: false
      })
    }
  }
  handlePassportSelect = async(event) => {
    setTimeout(() => {
      this.basicsCheck()
    }, 100);

    if(event.target.files[0]){
        this.handleImageCompress(event.target.files[0])
    }
  }
  handlePwDCertificateSelect = (event) => {
    if(event.target.files[0]){
      if(event.target.files[0].type == "application/pdf"){
        if(event.target.files[0].size>3000000){
          this.setState({
            FTL_message: "PwD Certificate",
            fileTooLargeModal: true
          })
        }
        else{
          this.setState({
            pwdCertificate: event.target.files[0].name
          });
          pwdCertificate = event.target.files[0];
        }
      }
      else{
        const image = event.target.files[0];
        new Compressor(image, {
          quality: 0.1,
          success: (compressedResult) => {
            if(compressedResult.size > 3000000){
              this.setState({
                FTL_message: "PwD Certificate",
                fileTooLargeModal: true
              })
            }
            else{
              pwdCertificate = compressedResult
              this.setState({
                pwdCertificate: compressedResult.name
              });
            }
          },
        });
      }
    }
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
  }
  handleSignatureSelect = async(event) => {
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
    if(event.target.files[0]){
      this.handleSignatureCompress(event.target.files[0])
    }
  }
  handleSignatureCompress = (event) => {
    const image = event;
    new Compressor(image, {
      quality: 0.1,
      success: (compressedResult) => { 
        if(compressedResult.size > 3000000){
          this.setState({
            FTL_message: "Signature",
            fileTooLargeModal: true
          })
        }
        else{
          signaturePhoto = compressedResult
          this.setState({
            signaturePhoto: URL.createObjectURL(signaturePhoto)
          });
        }
      },
    });
  };
  handleFullName = (event) => {
    let errors = this.state.errors;
    let name = event.target.value.length
    if (name>0) {
      errors["name"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["name"] = "Must not be empty";
      this.setState({ errors: errors});
    }
    this.setState({
        fullName: event.target.value,
    });
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
  }
  hasNameChangedToggle = (value) =>{
    this.setState({hasNameChanged: value});
    if(value === false){
      this.setState({legalName:"", affidavitPhoto: null})
      affidavitPhoto = null;
    }
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
  }
  handleLegalName = (event) => {
    let errors = this.state.errors;
    let name = event.target.value.length
    if (name>0) {
      errors["legalName"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["legalName"] = "Must not be empty";
      this.setState({ errors: errors});
    }
    this.setState({
      legalName: event.target.value,
    });
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
  }
  hanldeAffidavitSelect = (event) => {
    if(event.target.files[0]){
        if(event.target.files[0].type == "application/pdf"){
          if(event.target.files[0].size>3000000){
            this.setState({
              fileTooLargeModal: true,
              FTL_message: "Affidavit Document"
            })
          }
          else{
            this.setState({
              affidavitPhoto: event.target.files[0].name
            });
            affidavitPhoto = event.target.files[0];
          }
        }
        else{
          const image = event.target.files[0];
          new Compressor(image, {
            quality: 0.1,
            success: (compressedResult) => {
              if(compressedResult.size > 3000000){
                this.setState({
                  fileTooLargeModal: true,
                  FTL_message: "Affidavit Image"
                })
              }
              else{
                affidavitPhoto = compressedResult
                this.setState({
                  affidavitPhoto: compressedResult.name
                });
              }
            },
          });
        }
    }
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
  isIndigenousToggle = (value) =>{
    this.setState({isIndigenous: value});
    if(value === false){
      this.setState({category: null, tribe: null})
    }
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
  }
  handleTribe = (tribe) => {
    if(tribe.value != undefined || tribe.value != "" || tribe.value != null){
        this.setState({ tribe: tribe.value });
        let errors = this.state.errors;
        if (this.state.tribe != null || tribe.value) {
          errors["tribe"] = null
          this.setState({ errors: errors });
        } else {
          errors["tribe"] = "Select a tribe";
          this.setState({ errors: errors });
        }
        if(tribe.value){
            this.handleCategory(tribe.value)
        }
    }
    setTimeout(() => {
        this.basicsCheck();
      }, 300);
  };
  handleCategory= (value) => {
    if(
        value === "Konyak" ||
        value === "Phom" ||
        value === "Sangtam" ||
        value === "Yimkhiung" ||
        value === "Chang" ||
        value === "Khiamniungan" ||
        value === "Chakhesang" ||
        value === "Pochury" ||
        value === "Zeliang" ||
        value === "Sumi (Kiphire)" ||
        value === "Tikhir"
    ){
        this.setState({
          category: "BT"
        })
    }
    else{
        this.setState({
          category: "General"
        })
    }
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
  };
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
  isPWDToggle =  (value) =>{
    this.setState({isPWD: value});
    if(value === false){
      this.setState({pwdCategory: null})
    }
    setTimeout(() => {
      this.basicsCheck()
    }, 100);
  }
  handlePWD = (event) => {
    if(event.value != undefined || event.value != "" || event.value != null){
        this.setState({ pwdCategory: event.value });
        let errors = this.state.errors;
        if (this.state.pwdCategory != null || event.value) {
        errors["pwdCategory"] = null
        this.setState({ errors: errors });
        } else {
        errors["pwdCategory"] = "Select a category";
        this.setState({ errors: errors });
        }
    }
    setTimeout(() => {
      this.basicsCheck()
    }, 300);
  };
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
        this.basicsCheck()
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
    setTimeout(() => {
        this.basicsCheck()
    }, 100);
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
    setTimeout(() => {
        this.basicsCheck()
    }, 100);
  }
  handlePincode = (object) => {
    if (object.target.value.length <= object.target.maxLength) {
      this.setState({ pincode: object.target.value });
    }
    let errors = this.state.errors;
    var pinLength = object.target.value.length;
    if (pinLength === 7 || pinLength === 6 ) {
      errors["pincode"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["pincode"] = "Must be 6 digits";
      this.setState({ errors: errors});
    }
    setTimeout(() => {
        this.basicsCheck()
    }, 100);
  };
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
    if(passtportPhoto != null){
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
    else{
        await this.uploadAffidavit(userID);
    }
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
    .then(async(responseJson) => {
        await this.deleteOldPassport(userID)
    })
  }
  deleteOldPassport = async(userID) => {
    const storage = getStorage();
    const fileUrl = this.state.userData[0].passport_photo;
    if(fileUrl != ""){
        const storageRef = ref(storage, fileUrl);
        try {
            // Delete the file
            await deleteObject(storageRef);
            console.log('File deleted successfully');
      
            // Call uploadAffidavit function after deleting the file
            await this.uploadAffidavit(userID);
          } catch (error) {
            console.error('Error deleting file:', error);
          }
    }
    else{
        await this.uploadAffidavit(userID);
    }
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
        await this.uploadSignature(userID);
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
        await this.uploadSignature(userID);
    })
  }
  uploadSignature = async(userID) => {
    if(signaturePhoto != null){
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
              this.updateSignatureDocument(userID, url);
            })
        })
    }
    else{
        await this.uploadPwDCertificate(userID)
    }
  }
  updateSignatureDocument = async(userID, url) => {
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
        await this.deleteOldSignature(userID)
    })
  }
  deleteOldSignature = async(userID) => {
    const storage = getStorage();
    const fileUrl = this.state.userData[0].signature_docs;
    if(fileUrl != ""){
        const storageRef = ref(storage, fileUrl);
        try {
            // Delete the file
            await deleteObject(storageRef);
            console.log('File deleted successfully');
    
            // Call uploadPwDCertificate function after deleting the file
            await this.uploadPwDCertificate(userID);
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    }
    else{
        await this.uploadPwDCertificate(userID)
    }
  }
  uploadPwDCertificate = async(userID) => {
    if(pwdCertificate != null){
        let random = Math.floor(Math.random() * 10000000) + 1;
        let fullName = this.state.fullName;
        const nameWithoutSpaces = fullName.replace(/\s/g, "");
        let fileName = nameWithoutSpaces + '_pwd_' + userID + "_" + random;
        
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
              this.updatePwDCertificate(userID, url);
            })
        })
    }
    else{
        this.setState({
            loaderModal: true,
            APIStatus: "Updating Info"
        })
        await this.updateBasicInfo();
    }
  }
  updatePwDCertificate = async(userID, url) => {
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
    .then(async(responseJson) => {
        this.setState({
            loaderModal: true,
            APIStatus: "Updating Info"
        })
        await this.updateBasicInfo();
    })
  }
  updateBasicInfo = async() => {
    const { fullName,
        legalName,
        dateofbirth,
        motherName,
        fatherName,
        streetName,
        town,
        district,
        pincode} = this.state;
    
    let userID = this.state.userData[0].id;
    let token = this.state.userData[0].auth_bearer_token;
    let gender = this.state.gender === true ? "MALE" : "FEMALE";
    let isIndigenous = this.state.isIndigenous === true ? "Yes" : "No"
    let hasNameChanged = this.state.hasNameChanged === true ? "Yes" : "No"
    let isPWD = this.state.isPWD === true ? "Yes" : "No"
    let tribe = this.state.tribe === null ? "" : this.state.tribe;
    let category = this.state.category === null ? "" : this.state.category;
    let pwdCategory = this.state.pwdCategory === null ? "" : this.state.pwdCategory;

    let user = {
        "user_id": userID,
        "full_name": fullName,
        "gender": gender,
        "has_name_changed": hasNameChanged == "No" ? "" : hasNameChanged,
        "is_indegeneous": isIndigenous,
        "legal_name": legalName,
        "date_of_birth": dateofbirth,
        "mother_name": motherName,
        "father_name": fatherName,
        "tribe": isIndigenous === "No" ? "" : tribe,
        "tribe_category": isIndigenous === "No" ? "" : category,
        "is_pwd": isPWD,
        "pwd_category": isPWD === "No"? "" : pwdCategory,
        "colony_name": streetName,
        "town": town,
        "district": district,
        "pincode": pincode
    };

    await fetch("https://nssbrecruitment.in/admin/api/change_basic_info.php", {
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
        this.setState({
            loaderModal: false,
            APIStatus: ""
        })
        window.location.reload();
    })
  }
  infoUpdateChecker = () => {
    let userID = this.state.userData[0].id;
    this.uploadPassport(userID);
  }

  //EDUCATIONAL ADD
  handlePercentageType = (data) => {
    if(data.value != undefined || data.value != "" || data.value != null){
        this.setState({ percentageType: data.value });
    }
    setTimeout(() => {
        this.educationCheck()
      }, 300);
  };
  handleDegree = (degree) => {
    if(degree.value != undefined || degree.value != "" || degree.value != null){
        this.setState({ degree: degree.value });
        let errors = this.state.errors;
        if (this.state.degree != null || degree.value) {
        errors["degree"] = null
        this.setState({ errors: errors });
        } else {
        errors["degree"] = "Select a degree";
        this.setState({ errors: errors });
        }
        if(degree.value == "Class 10"){
            this.setState({
                documentType: "Admit Card",
            })
            documentTypeOptions = [
                { value: "Marksheet", label: "Marksheet", isDisabled: true },
                { value: "Transcript", label: "Transcript", isDisabled: true },
                { value: "Admit Card", label: "Admit Card" },
            ]
        }
        else{
            this.setState({
                documentType: "Marksheet",
            })
            documentTypeOptions = [
                { value: "Marksheet", label: "Marksheet"},
                { value: "Transcript", label: "Transcript"},
                { value: "Admit Card", label: "Admit Card", isDisabled: true },
            ]
        }
    }
    setTimeout(() => {
        this.educationCheck()
      }, 300);
  };
  handleYearOfPassing = (dateStr) => {
    let errors = this.state.errors;
    if (dateStr != null && dateStr != "" && dateStr != undefined) {
        errors["yearofpassing"] = null
        this.setState({ errors: errors});
    }
     else {
      errors["yearofpassing"] = "Must not be empty";
      this.setState({ errors: errors});
    }
    let formattedDate = moment(dateStr, 'ddd MMM DD YYYY HH:mm:ss ZZ').format('Do MMMM, YYYY');
    this.setState({
        yearofpassing_unformated: dateStr,
        yearofpassing: formattedDate,
        yearOfPassingModal: false
    })
    setTimeout(() => {
      this.educationCheck()
    }, 100);
  };
  handlePercentage = (object) => {
    if (object.target.value.length <= object.target.maxLength) {
      this.setState({ percentage: object.target.value });
    }
    let errors = this.state.errors;
    var yopLength = object.target.value.length;
    if(this.state.percentageType === "Percentage"){
        if (yopLength <= 5 && yopLength >= 3 ) {
            errors["percentage"] = null
            this.setState({ errors: errors});
        }
        else {
            errors["percentage"] = "Enter valid format (Eg: 70.0)";
            this.setState({ errors: errors});
        }
    }
    else{
        if (yopLength <= 4 && yopLength >= 2 ) {
            errors["percentage"] = null
            this.setState({ errors: errors});
        }
        else {
            errors["percentage"] = "Enter valid format (Eg: 7.0)";
            this.setState({ errors: errors});
        }
    }
    
    setTimeout(() => {
        this.educationCheck()
    }, 100);
  };
  handleDocumentType = (docType) => {
    if(docType.value != undefined || docType.value != "" || docType.value != null){
        this.setState({ documentType: docType.value });
        let errors = this.state.errors;
        if (this.state.documentType != null || docType.value) {
          errors["documentType"] = null
          this.setState({ errors: errors });
        } else {
          errors["documentType"] = "Select document type";
          this.setState({ errors: errors });
        }
    }
    setTimeout(() => {
        this.educationCheck()
      }, 300);
  };
  handleUniversity = (event) => {
    let errors = this.state.errors;
    let universityName = event.target.value.length
    if (universityName>0) {
      errors["university"] = null
      this.setState({ errors: errors});
    }
     else {
      errors["university"] = "Must not be empty";
      this.setState({ errors: errors});
    }
    this.setState({
        universityName: event.target.value,
    });
    setTimeout(() => {
        this.educationCheck()
    }, 100);
  };
  handleEducationDocument = (event) => {
    if(event.target.files[0]){
        if(event.target.files[0].type == "application/pdf"){
          if(event.target.files[0].size>5000000){
            this.setState({
              FTL_message: "Education Document",
              fileTooLargeModal: true
            })
          }
          else{
            this.setState({
                educationalDoc: event.target.files[0].name
            });
            educationalDoc = event.target.files[0]
          }
          setTimeout(() => {
            this.educationCheck()
            }, 100);
        }
        else{
          const image = event.target.files[0];
          new Compressor(image, {
            quality: 0.6,
            success: (compressedResult) => {
              if(compressedResult.size > 5000000){
                this.setState({
                    FTL_message: "Education Document",
                    fileTooLargeModal: true
                })
              }
              else{
                this.setState({
                    educationalDoc: compressedResult.name
                });
                educationalDoc = compressedResult
              }
            },
          });
          setTimeout(() => {
            this.educationCheck()
            }, 1200);
        }
      }
  }
  educationCheck = () => {
    const {degree, yearofpassing, percentage, educationalDoc, documentType, universityName} = this.state;

    let degreeWarning = this.state.errors["degree"];
    let yearofpassingWarning = this.state.errors["yearofpassing"];
    let percentageWarning = this.state.errors["percentage"];
    let documentTypeWarning = this.state.errors["documentType"];
    let universityWarning = this.state.errors["university"];
    if(
        degree != null && degree != "" &&
        yearofpassing != null && yearofpassing != "" &&
        percentage != null && percentage != "" &&
        educationalDoc != null && educationalDoc != "" && 
        documentType != null && documentType != "" && 
        universityName != null && universityName != ""
      ){
      if(degreeWarning == null && yearofpassingWarning == null && percentageWarning == null && documentTypeWarning == null && universityWarning == null)
      {
        this.setState({
            educationChecked: true
        })
      }
      else{
        this.setState({
            educationChecked: false
        })
      }
    }
    else{
      this.setState({
        educationChecked: false
      })
    }
  }
  handleUploadEducation = async() => {
    let degree =  this.state.degree;
    let educationArr = this.state.userData[1].education_details;

    const exists = educationArr.some(obj => obj.degree === degree);
    if(exists){
        this.setState({
            duplicateEducationModal: true
        })
    }
    else{
        this.setState({
            loaderModal: true,
            APIStatus: "Uploading Document"
        })
        let random = Math.floor(Math.random() * 10000000) + 1;
        let userID = this.state.userData[0].id;
        let token = this.state.userData[0].auth_bearer_token;
        let fullName = this.state.userData[0].full_name;
        const nameWithoutSpaces = fullName.replace(/\s/g, "");
        
        const doc = educationalDoc;
        const docExtension = doc.name.split('.').pop();
        let file = educationalDoc;
        let fileName = nameWithoutSpaces + '_educationDoc_' + userID + '_' + random + '.' + docExtension;
        const formData = new FormData();
        formData.append('document', file);
        formData.append('file_name', fileName);
        
        await axios.post('https://nssbrecruitment.in/admin/api/file_upload.php', formData, {
            headers: {
                'Authorization': "Bearer " + "zwyprqti3j9eyJhbGdvIjoiSFMyNTYiLCJ0eXBlIjoiSldUIiwiZXhwaXJlIjoxNjkxNTc2ODY1fQ==.eyJ1c2VyX2lkIjoxMiwid0938dGltZSI6MTY5MTU3Njg2NX0=.ZmE1MGM2NzNjZWEsxMjUwYjdmMDFkOTsdfsJlOWY2NzJkYTM1Mjcwdf3MzFkNDJmOWJm0dMDIzYTM4M2MzNjgwMGNiNjA3Mg=="
            }
        })
        .then((responseJson) => {
            if(responseJson.data.docURL){
                this.handleAddEducation(userID, responseJson.data.docURL, token);
            }
        })
        .catch(error => {
            console.log(error)
        });
    }   
  }
  handleAddEducation = async(userID, url, token) => {
    let user = {
        "user_id": userID,
        "degree": this.state.degree,
        "year": this.state.yearofpassing,
        "marks": this.state.percentage,
        "docs": url,
        "doctype": this.state.documentType,
        "university": this.state.universityName
    }
      await fetch("https://nssbrecruitment.in/admin/api/education_details.php", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          Accept: "application/json,  */*",
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.Status && responseJson.Status == "Invalid Token"){
            localStorage.clear();
            this.props.history.push("/login");
        }
        this.setState({
            loaderModal: false,
            APIStatus: "", 
            educationEditMode: false,
            degree: null,
            yearofpassing: null,
            percentage: "",
            educationalDoc: null,
            educationChecked: false,
            universityName: "",
            documentType: "",
  
            certificateEditMode: false,
            certificateCourse: null,
            duration: null,
            certificateDoc: null,
            certificateChecked: false,
        });
        toast.success("Education details added", {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
        educationalDoc = null;
        this.getUserData(userID, token);
      })
  }
  deleteEducation = async(id, degree) => {
    let userID = this.state.userData[0].id;
    let token = this.state.userData[0].auth_bearer_token;
    let user = {
        "id": id,
        "user_id": userID
    }
    await fetch("https://nssbrecruitment.in/admin/api/delete_education.php", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          Accept: "application/json,  */*",
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
        toast.error("Education details delete", {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
        if(degree == "Class 10"){
            setTimeout(() => {
                window.location.reload()
            }, 500);
        }
        else{
            this.getUserData(userID, token);
        }
    })
  }


  //CERTIFICATE COURSE
  handleCertificateCourse = (degree) => {
    if(degree.value != undefined || degree.value != "" || degree.value != null){
        this.setState({ certificateCourse: degree.value });
        let errors = this.state.errors;
        if (this.state.certificateCourse != null || degree.value) {
          errors["certificate"] = null
          this.setState({ errors: errors });
        } else {
          errors["certificate"] = "Select a certificate";
          this.setState({ errors: errors });
        }
    }
    setTimeout(() => {
        this.certificateCheck()
      }, 300);
  };
  handleDuration = (duration) => {
    if(duration.value != undefined || duration.value != "" || duration.value != null){
        this.setState({ duration: duration.value });
        let errors = this.state.errors;
        if (this.state.duration != null || duration.value) {
          errors["duration"] = null
          this.setState({ errors: errors });
        } else {
          errors["duration"] = "Select duration";
          this.setState({ errors: errors });
        }
    }
    setTimeout(() => {
        this.certificateCheck()
      }, 300);
  };
  handleCertificateDocument = (event) => {
    if(event.target.files[0]){
        if(event.target.files[0].type == "application/pdf"){
          if(event.target.files[0].size>5000000){
            this.setState({
              FTL_message: "Certification Document",
              fileTooLargeModal: true
            })
          }
          else{
            this.setState({
                certificateDoc: event.target.files[0].name
            });
            certificateDoc = event.target.files[0]
          }
          setTimeout(() => {
            this.certificateCheck()
            }, 100);
        }
        else{
          const image = event.target.files[0];
          new Compressor(image, {
            quality: 0.6,
            success: (compressedResult) => {
              if(compressedResult.size > 5000000){
                this.setState({
                    FTL_message: "Certification Document",
                    fileTooLargeModal: true
                })
              }
              else{
                this.setState({
                    certificateDoc: compressedResult.name
                });
                certificateDoc = compressedResult
              }
            },
          });
          setTimeout(() => {
            this.certificateCheck()
            }, 1200);
        }
      }
  }
  certificateCheck = () => {
    const {certificateCourse, duration, certificateDoc} = this.state;

    let certificateCourseWarning = this.state.errors["certificate"];
    let durationWarning = this.state.errors["duration"];

    if(
        certificateCourse != null && certificateCourse != "" &&
        duration != null && duration != "" &&
        certificateDoc != null && certificateDoc != ""
      ){
      if(certificateCourseWarning == null && durationWarning == null)
      {
        this.setState({
            certificateChecked: true
        })
      }
      else{
        this.setState({
            certificateChecked: false
        })
      }
    }
    else{
      this.setState({
        certificateChecked: false
      })
    }
  }
  handleUploadCertificate = async() => {
    let certificate =  this.state.certificateCourse;
    let certificateArr = this.state.userData[2].certificate_details;

    const exists = certificateArr.some(obj => obj.certificate_name === certificate);
    if(exists){
        this.setState({
            duplicateCertificateModal: true
        })
    }

    else{
        this.setState({
            loaderModal: true,
            APIStatus: "Uploading Document"
        })
        let random = Math.floor(Math.random() * 10000000) + 1;
        let userID = this.state.userData[0].id;
        let token = this.state.userData[0].auth_bearer_token;
        let fullName = this.state.userData[0].full_name;
        const nameWithoutSpaces = fullName.replace(/\s/g, "");
    
        const doc = certificateDoc;
        const docExtension = doc.name.split('.').pop();
        let file = certificateDoc;
        let fileName = nameWithoutSpaces + '_certificateDoc_' + userID + '_' + random + '.' + docExtension;
        const formData = new FormData();
        formData.append('document', file);
        formData.append('file_name', fileName);

        await axios.post('https://nssbrecruitment.in/admin/api/file_upload.php', formData, {
            headers: {
                'Authorization': "Bearer " + "zwyprqti3j9eyJhbGdvIjoiSFMyNTYiLCJ0eXBlIjoiSldUIiwiZXhwaXJlIjoxNjkxNTc2ODY1fQ==.eyJ1c2VyX2lkIjoxMiwid0938dGltZSI6MTY5MTU3Njg2NX0=.ZmE1MGM2NzNjZWEsxMjUwYjdmMDFkOTsdfsJlOWY2NzJkYTM1Mjcwdf3MzFkNDJmOWJm0dMDIzYTM4M2MzNjgwMGNiNjA3Mg=="
            }
        })
        .then((responseJson) => {
            if(responseJson.data.docURL){
                this.handleAddCertificate(userID, responseJson.data.docURL, token);
            }
        })
        .catch(error => {
            console.log(error)
        });
    }
  }
  handleAddCertificate = async(userID, url, token) => {
    let user = {
        "user_id": userID,
        "certificate_name": this.state.certificateCourse, 
        "duration": this.state.duration,
        "docs": url
    }
      await fetch("https://nssbrecruitment.in/admin/api/certificate_details.php", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          Accept: "application/json,  */*",
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.Status && responseJson.Status == "Invalid Token"){
            localStorage.clear();
            this.props.history.push("/login");
        }
        this.setState({
          loaderModal: false,
          APIStatus: "", 
          educationEditMode: false,
          degree: null,
          yearofpassing: null,
          percentage: "",
          educationalDoc: null,
          educationChecked: false,

          certificateEditMode: false,
          certificateCourse: null,
          duration: null,
          certificateDoc: null,
          certificateChecked: false,
        });
        toast.success("Certificate details added", {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
        educationalDoc = null;
        this.getUserData(userID, token);
      })
  }
  deleteCertificate = async(id) => {
    let userID = this.state.userData[0].id;
    let token = this.state.userData[0].auth_bearer_token;
    let user = {
        "id": id,
        "user_id": userID
    }
    await fetch("https://nssbrecruitment.in/admin/api/delete_certificate.php", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          Accept: "application/json,  */*",
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
        toast.error("Certificate details delete", {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
        this.getUserData(userID, token);
    })

  }
  closeEducationTab = () => {
    this.setState({
        educationEditMode: false,
        certificateEditMode: false,
        degree: null,
        yearofpassing: null,
        percentage: "",
        educationalDoc: null,
        educationChecked: false,
        percentageType: "Percentage",
        universityName: "",
        documentType: "",

        certificateCourse: null,
        duration: null,
        certificateDoc: null,
        certificateChecked: false,
    })
    passtportPhoto = null;
    affidavitPhoto = null;
    educationalDoc = null;
    certificateDoc = null;
  }
  render() {
    const { district, gender, hasNameChanged, isIndigenous, tribe, category, isPWD, pwdCategory, degree, duration, certificateCourse, percentageType, documentType} = this.state;
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: bookmarkJSON,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    }
    const defaultOptions_2 = {
        loop: true,
        autoplay: true,
        animationData: clipmarkJSON,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    }
    const animationStyles = {
        width: '40px',
        height: '40px',
    };
    const animationStyles_2 = {
        width: '60px',
        height: '60px',
    };
    const { fontSize } = this.props;
    const defaultOptions_3 = {
        loop: true,
        autoplay: true,
        animationData: youtube,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    }
    const animationStyles_3 = {
        width: '60px',
        height: '60px',
    };
    return (
        <>
            {
                this.state.userData.length>0 ?
                    <div className="settings_body">
                        <Helmet>
                            <html lang="en" />  
                            <meta charSet="utf-8" />
                            <title>NSSB: Nagaland Staff Selection Board - Registration Portal | Profile</title>
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
                            show={this.state.duplicateEducationModal}
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
                                    onClick={() => this.setState({ duplicateEducationModal: false })}
                                />
                                <p className="login_header_text">Education Already Added</p>
                                <center>
                                <p className="emailVerifyHeader_register">{this.state.degree}</p>
                                <p className="verifyEmail_subheader_text">You've already added the selected degree. You can add one qualification only one time.</p>
                                </center>
                            </div>
                            </ModalBody>
                        </Modal>
                        <Modal
                            show={this.state.duplicateCertificateModal}
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
                                    onClick={() => this.setState({ duplicateCertificateModal: false })}
                                />
                                <p className="login_header_text">Certificate Already Added</p>
                                <center>
                                <p className="emailVerifyHeader_register">{this.state.certificateCourse}</p>
                                <p className="verifyEmail_subheader_text">You've already added the selected certificate. You can add one certificate only one time.</p>
                                </center>
                            </div>
                            </ModalBody>
                        </Modal>
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
                                onClick={() => this.setState({ disclaimerModal: false })}
                            />
                            <p className="login_header_text">Guidelines</p>
                            <br/>
                            <ol>
                                <li><p className="disclaimerTxt">All education details starting from Class 10 and onwards must be upload.</p></li>
                                <li><p className="disclaimerTxt"></p>All the Marksheets/Transcripts along with Pass Certificate, should be scanned in one PDF file and uploaded.</li>
                                <li><p className="disclaimerTxt"><b>Note:</b> For Class 10, upload your Admit Card.</p></li>
                            </ol>
                            <div className="login_button"  onClick={() => this.setState({disclaimerModal: false})}>
                                <p className="login_signup_ques_text_white">I understand</p>
                            </div>
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
                                <p className="verifyEmail_subheader_text">The selected {this.state.FTL_message} should be less than {this.state.FTL_message == "Education Document" || this.state.FTL_message == "Certification Document" ? "5Mb." : "3Mb." }</p>
                                </center>
                            </div>
                            </ModalBody>
                        </Modal>
                        <Modal
                            show={this.state.yearOfPassingModal}
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
                                    onClick={() => this.setState({ yearOfPassingModal: false })}
                                />
                                <p className="modal_header_text">Select Date of Passing</p>
                                <br/>
                                <center>
                                <Calendar
                                    className="calenderLayout"
                                    onFocus={this.basicsCheck}
                                    prevLabel={(<IoChevronBack size={20}/>)}
                                    prev2Label={(<RxDoubleArrowLeft size={22}/>)}
                                    next2Label={(<RxDoubleArrowRight size={22}/>)}
                                    nextLabel={(<IoChevronForward size={20}/>)}
                                    onChange={(e)=>this.handleYearOfPassing(e)}
                                    onBlur={this.educationCheck}
                                    value={this.state.yearofpassing_unformated}
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
                        <div>
                            {
                                this.state.layoutView === "Profile" ?
                                    <button className="settings_domains_tab_active_first">
                                        <span className="searchBtn_txt">Profile</span>
                                    </button>
                                :
                                    <button className="settings_domains_tab_inactive_first" onClick={() => this.setState({layoutView: "Profile"})}>
                                        <span className="searchBtn_txt">Profile</span>
                                    </button>
                            }
                            {
                                this.state.layoutView === "Education" ?
                                    <button className="settings_domains_tab_active">
                                        <span className="searchBtn_txt">Education</span>
                                    </button>
                                    :
                                    <button className="settings_domains_tab_inactive" onClick={() => this.setState({layoutView: "Education"})}>
                                        <span className="searchBtn_txt">Education</span>
                                    </button>
                            }
                            {
                                this.state.layoutView === "Settings" ?
                                    <button className="settings_domains_tab_active">
                                        <span className="searchBtn_txt">Settings</span>
                                    </button>
                                    :
                                    <button className="settings_domains_tab_inactive" onClick={() => this.setState({layoutView: "Settings"})}>
                                        <span className="searchBtn_txt">Settings</span>
                                    </button>
                            }
                        </div>
                        <Row>
                            <Col md={4} xs={12} sm={12}>
                                <div className="forMobile">
                                    <div className="lottieContainer_5" onClick={() => window.open("https://www.youtube.com/watch?v=xxYFMCqLx4k", "_blank")}>
                                        <Row>
                                            <Col md={2} xs={2} sm={2}>
                                                <Lottie options={defaultOptions_3}  style={animationStyles_3} />
                                            </Col>
                                            <Col md={10} xs={10} sm={10} className="lottieDivTxt4">
                                                <p className="lottieDivTxt4"> Tutorial: How to apply in NSSB Portal</p>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className="profile_left_firstDiv">
                                    <center>
                                        <img src={this.state.userData[0].passport_photo} className="settings_profileImage_empty"></img>
                                        <p className="settings_fullName" style={{ fontSize: fontSize >21 ? `${fontSize}px` : '20px' }}>{this.state.userData[0].full_name}</p>
                                        <p className="emailVerifyHeader_register" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>{this.state.email}</p>
                                    </center>
                                    <hr className="profile_hr"/>
                                    <div>
                                        <p className="profile_humanityTxt_black" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '15px' }}><img src={passport} className="profile_humanity"/>Passport Photo Uploaded</p>
                                        <BsCheckCircleFill size={fontSize > 21 ? fontSize : 20} className="BsCheckCircleFill-icon2"/>
                                        <br clear="all"/>
                                        <p className="profile_humanityTxt_black" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '15px' }}><img src={email} className="profile_humanity"/>Email Verified</p>
                                        <BsCheckCircleFill size={fontSize > 21 ? fontSize : 20} className="BsCheckCircleFill-icon2"/>
                                        <br clear="all"/>
                                        <p className="profile_humanityTxt_black" style={{ fontSize: fontSize >16 ? `${fontSize}px` : '15px' }}><img src={education} className="profile_humanity"/>Educational Details</p>
                                        {
                                            this.state.doesEducationExists ?
                                            <BsCheckCircleFill size={fontSize > 21 ? fontSize : 20} className="BsCheckCircleFill-icon2"/>
                                            :
                                            <RxCross1 size={fontSize > 21 ? fontSize : 20} className="RxCross1-icon2"/>
                                        }
                                        <br clear="all"/>
                                        {
                                            this.state.doesEducationExists ?
                                                <div className="OTR_SuccessfulMessage" onClick={() => this.props.history.push("/examination")}>
                                                    <p className="OTR_SuccessfulMessageTxt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Your OTR registration is completed. You may now go to the <span className="OTR_SuccessfulMessageSpan">Examination</span> page to check and apply upcoming exams.</p>
                                                </div>
                                            :
                                                <div className="OTR_SuccessfulMessageWarn">
                                                    <p className="OTR_SuccessfulMessageTxt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Your educational documents of Class 10 and onwards is mandatory. Kindly upload them on the education tab.</p>
                                                </div>
                                        }
                                    </div>
                                </div>
                                <div className="profile_left_firstDiv">
                                    <p className="profile_Signature_black" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Signature</p>
                                    <div className="emptySignature_Profile">
                                        <center>
                                            <img src={this.state.userData[0].signature_docs} className="signature_imgProfile" alt="Signature Image" />
                                        </center>
                                    </div>
                                </div>
                                {
                                    this.state.userData[0].has_name_changed === "Yes" ?
                                    <>
                                    {
                                        this.state.userData[0].affidavit_docs == ""
                                        ?
                                        <></>
                                        :
                                        <div className="profile_left_firstDiv">
                                            <p className="profile_Signature_black" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Affidavit</p>
                                            <div className="viewDocumentButton" onClick={() =>  window.open(this.state.userData[0].affidavit_docs, '_blank')}>
                                                <p className="viewDocumentButton_Txt">View Document</p>
                                            </div>
                                        </div>
                                    }
                                    </>
                                    :
                                    <></>
                                }
                                {
                                    this.state.userData[0].is_pwd === "Yes" && this.state.userData[0].pwd_docs != ""?
                                    <div className="profile_left_firstDiv">
                                        <p className="profile_Signature_black" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>PwD Certificate</p>
                                        <div className="viewDocumentButton" onClick={() =>  window.open(this.state.userData[0].pwd_docs, '_blank')}>
                                            <p className="viewDocumentButton_Txt">View Document</p>
                                        </div>
                                    </div>
                                    :
                                    <></>
                                }
                            </Col>
                            <Col md={8} xs={12} sm={12}>
                                <>
                                    {
                                        this.state.layoutView === "Profile" ?
                                            <div className="profile_left_firstDiv">
                                                <p className="settings_TabsTittle" style={{ fontSize: fontSize >21 ? `${fontSize}px` : '20px' }}>Basic Details</p>
                                                <p className="profile_bio" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Make sure your entered data matches with AADHAR, PAN or Driving License</p>
                                                {
                                                    this.state.profileEditMode ?
                                                        <div>
                                                            <Row>
                                                                <Col md={9} xs={6} sm={6}>
                                                                    <div className="passtport_header">
                                                                        <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Passport Photo *</p>
                                                                        <p style={{marginLeft: 4, fontSize: fontSize >17 ? `${fontSize}px` : '15px'}} className="passport_subheader_text">Photo should have white background & good quality.</p>
                                                                        <p style={{marginLeft: 4, fontSize: fontSize >17 ? `${fontSize}px` : '15px'}} className="passport_subheader_text">Only JPG, PNG & JPEG allowed.</p>
                                                                    </div>
                                                                </Col>
                                                                <Col md={3} xs={6} sm={6}>
                                                                    <div className="emptyPasstport" onClick={() => document.getElementById('fileInput').click()}>
                                                                        <div>
                                                                            <center>
                                                                                {
                                                                                this.state.passportPhoto === null ?
                                                                                    <img src={passport_upload} className="passport_empty_img" alt="select image" />
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
                                                                    <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Signature *</p>
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
                                                                            <img src={passport_upload} className="signature_empty_img" alt="select image" />
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
                                                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Full Name (as per Class 10 Admit Card or equivalent)*</p>
                                                            <input
                                                                className="emailInput"
                                                                type="text"
                                                                placeholder="Enter your full name"
                                                                onChange={this.handleFullName}
                                                                onFocus={this.handleFullName}
                                                                onBlur={this.basicsCheck}
                                                                value={this.state.fullName}
                                                            />
                                                            {  
                                                                this.state.errors["name"] ? (
                                                                    <span
                                                                        id="marginInputs"
                                                                        className="validateErrorTxt registerInputMargin"
                                                                    >
                                                                        {this.state.errors["name"]}
                                                                    </span>
                                                                ) :
                                                                <></>
                                                            }
                                                            <div className="registerInputMargin"></div>
                                                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Did you change your name?</p>
                                                            <Row className="isNameChanged_Margins2">
                                                                <Col style={{marginTop:"1%"}} md={2} xs={5} sm={5}>
                                                                    <>
                                                                        <Checkbox
                                                                            checked={hasNameChanged}
                                                                            onChange={() => this.hasNameChangedToggle(true)}
                                                                            icon={<BsCircle size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                            checkedIcon={<BsCheckCircleFill size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                        />
                                                                        <span className="newDemo-radio-txt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Yes</span>
                                                                    </>
                                                                </Col>
                                                                <Col style={{marginTop:"1%"}} md={2} xs={5} sm={5}>
                                                                    <>
                                                                        <Checkbox
                                                                            checked={!hasNameChanged}
                                                                            onChange={() =>this.hasNameChangedToggle(false)}
                                                                            icon={<BsCircle size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                            checkedIcon={<BsCheckCircleFill size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                        />
                                                                        <span className="newDemo-radio-txt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>No</span>
                                                                    </>
                                                                </Col>
                                                            </Row>
                                                            {
                                                                hasNameChanged?
                                                                <Row className="isNameChanged_Margins2">
                                                                    <Col md={6}>
                                                                        <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Legal Name *</p>
                                                                        <input
                                                                            className="emailInput"
                                                                            type="text"
                                                                            placeholder="Enter your full legal name"
                                                                            onChange={this.handleLegalName}
                                                                            onFocus={this.handleLegalName}
                                                                            onBlur={this.basicsCheck}
                                                                            value={this.state.legalName}
                                                                        />
                                                                        {  
                                                                        this.state.errors["legalName"] ? (
                                                                            <span
                                                                                id="marginInputs"
                                                                                className="validateErrorTxt"
                                                                            >
                                                                                {this.state.errors["legalName"]}
                                                                            </span>
                                                                        ) :
                                                                        <></>
                                                                        }
                                                                    </Col>
                                                                    <Col md={6}>
                                                                        <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Upload Affidavit *</p>
                                                                        <div className="calender_div">
                                                                            <div onClick={() => document.getElementById('affidavitInput').click()}>
                                                                                {
                                                                                this.state.affidavitPhoto === null ?
                                                                                    <p className="dob_txt"><AiOutlineUpload size={20}/>   Select File (Only Image/PDF allowed)</p>
                                                                                :
                                                                                    <p className="dob_txt"><BsCheckCircleFill size={20} color="green"/>  {this.state.affidavitPhoto}</p>
                                                                                }
                                                                            </div>
                                                                            <input
                                                                                type="file"
                                                                                id="affidavitInput"
                                                                                accept="image/jpg, image/jpeg, image/png, application/pdf"
                                                                                onFocus={this.hanldeAffidavitSelect}
                                                                                onChange={this.hanldeAffidavitSelect}
                                                                                style={{ display: 'none' }}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                                :
                                                                <></>
                                                            }
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
                                                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Are you an Indigenous of Nagaland?</p>
                                                            <Row className="isNameChanged_Margins2">
                                                                <Col style={{marginTop:"1%"}} md={2} xs={5} sm={5}>
                                                                    <>
                                                                        <Checkbox
                                                                            checked={isIndigenous}
                                                                            onChange={() => this.isIndigenousToggle(true)}
                                                                            icon={<BsCircle size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                            checkedIcon={<BsCheckCircleFill size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                        />
                                                                        <span className="newDemo-radio-txt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Yes</span>
                                                                    </>
                                                                </Col>
                                                                <Col style={{marginTop:"1%"}} md={2} xs={5} sm={5}>
                                                                    <>
                                                                        <Checkbox
                                                                            checked={!isIndigenous}
                                                                            onChange={() => this.isIndigenousToggle(false)}
                                                                            icon={<BsCircle size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                            checkedIcon={<BsCheckCircleFill size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                        />
                                                                        <span className="newDemo-radio-txt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>No</span>
                                                                    </>
                                                                </Col>
                                                            </Row>
                                                            {
                                                                isIndigenous?
                                                                <Row style={{marginBottom:"4.5%"}}>
                                                                    <Col md={6}>
                                                                        <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Tribe *</p>
                                                                        <Select
                                                                            onFocus={this.basicsCheck}
                                                                            onChange={this.handleTribe}
                                                                            isSearchable={false}
                                                                            onBlur={this.basicsCheck}
                                                                            value={tribeOptions.find(
                                                                                (item) => item.value === tribe
                                                                            )}
                                                                            placeholder={<div>Select tribe</div>}
                                                                            options={tribeOptions}
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
                                                                    <Col md={6}>
                                                                        <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Category</p>
                                                                        <input
                                                                            className="emailInput"
                                                                            type="text"
                                                                            disabled
                                                                            placeholder=""
                                                                            value={category}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                                :
                                                                <></>
                                                            }
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
                                                            <Row style={{marginBottom:"4.5%"}}>
                                                                <Col style={{marginTop:"1%"}} md={2} xs={5} sm={5}>
                                                                    <>
                                                                        <Checkbox
                                                                            checked={gender}
                                                                            onFocus={this.basicsCheck}
                                                                            onBlur={this.basicsCheck}
                                                                            onChange={() => this.setState({gender: true})}
                                                                            icon={<BsCircle size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                            checkedIcon={<BsCheckCircleFill size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                        />
                                                                        <span className="newDemo-radio-txt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Male</span>
                                                                    </>
                                                                </Col>
                                                                <Col style={{marginTop:"1%"}} md={2} xs={5} sm={5}>
                                                                    <>
                                                                        <Checkbox
                                                                            checked={!gender}
                                                                            onFocus={this.basicsCheck}
                                                                            onBlur={this.basicsCheck}
                                                                            onChange={() => this.setState({gender: false})}
                                                                            icon={<BsCircle size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                            checkedIcon={<BsCheckCircleFill size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                        />
                                                                        <span className="newDemo-radio-txt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Female</span>
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
                                                            <div className="forPC">
                                                                <Row>
                                                                    <Col md={6}>
                                                                        <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Do you belong to PwD?</p>
                                                                    </Col>
                                                                    <Col md={6}>
                                                                        {
                                                                            isPWD ?
                                                                                <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Category of PwD *</p>
                                                                            :
                                                                                <></>
                                                                        }
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                            <div className="forMobile">
                                                                <p className="input_header_txt" style={{ fontSize: '16.5px' }}>Do you belong to PwD?</p>
                                                            </div>
                                                            <Row className="isNameChanged_Margins2">
                                                                <Col style={{marginTop:"1%"}} md={2} xs={5} sm={5}>
                                                                    <>
                                                                        <Checkbox
                                                                            checked={isPWD}
                                                                            onChange={() => this.isPWDToggle(true)}
                                                                            icon={<BsCircle size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                            checkedIcon={<BsCheckCircleFill size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                        />
                                                                        <span className="newDemo-radio-txt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Yes</span>
                                                                    </>
                                                                </Col>
                                                                <Col style={{marginTop:"1%"}} md={2} xs={5} sm={5}>
                                                                    <>
                                                                        <Checkbox
                                                                            checked={!isPWD}
                                                                            onChange={() => this.isPWDToggle(false)}
                                                                            icon={<BsCircle size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                            checkedIcon={<BsCheckCircleFill size={fontSize >21 ? fontSize : 20} className="chbk-icons"/>}
                                                                        />
                                                                        <span className="newDemo-radio-txt" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>No</span>
                                                                    </>
                                                                </Col>
                                                                <Col md={2}></Col>
                                                                <Col md={6} sm={12} xs={12}>
                                                                    {
                                                                        isPWD ?
                                                                        <>
                                                                            <div className="forMobile">
                                                                                <p className="input_header_txt" style={{ fontSize: '16.5px' }}>Category of PwD *</p>
                                                                            </div>
                                                                            <Select
                                                                                onFocus={this.basicsCheck}
                                                                                onChange={this.handlePWD}
                                                                                isSearchable={false}
                                                                                onBlur={this.basicsCheck}
                                                                                value={pwdOptions.find(
                                                                                (item) => item.value === pwdCategory
                                                                                )}
                                                                                placeholder={<div>Select PwD Category</div>}
                                                                                options={pwdOptions}
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
                                                                        </>
                                                                        :
                                                                        <></>
                                                                    }
                                                                </Col>
                                                                <Col md={12}>
                                                                    {
                                                                        isPWD ?
                                                                        <>
                                                                            <div div className="forPC">
                                                                                <br/>
                                                                            </div>
                                                                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Upload PwD Certificate</p>
                                                                            <div className="calender_div" onClick={() => document.getElementById('PwDInput').click()}>
                                                                            <div>
                                                                                {
                                                                                this.state.pwdCertificate === null ?
                                                                                    <p className="dob_txt"><AiOutlineUpload size={20}/>  Select File (Only Image/PDF allowed)</p>
                                                                                :
                                                                                    <p className="dob_txt"><BsCheckCircleFill size={20} color="green"/>  {this.state.pwdCertificate}</p>
                                                                                }
                                                                            </div>
                                                                            <input
                                                                                type="file"
                                                                                id="PwDInput"
                                                                                accept="image/jpg, image/jpeg, image/png, application/pdf"
                                                                                onFocus={this.handlePwDCertificateSelect}
                                                                                onChange={this.handlePwDCertificateSelect}
                                                                                style={{ display: 'none' }}
                                                                            />
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <></>
                                                                    }
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={6} xs={12} sm={12}>
                                                                    <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>House No. & Street/Colony *</p>
                                                                    <input
                                                                        className="emailInput"
                                                                        type="text"
                                                                        placeholder="Enter your house no. & street/colony"
                                                                        onChange={this.handleStreetName}
                                                                        onBlur={this.basicsCheck}
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
                                                                        <></>
                                                                    }
                                                                </Col>
                                                                <Col md={6} xs={12} sm={12}>
                                                                    <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Town/Village *</p>
                                                                    <input
                                                                        className="emailInput"
                                                                        type="text"
                                                                        placeholder="Enter your town or village"
                                                                        onChange={this.handleTown}
                                                                        onBlur={this.basicsCheck}
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
                                                                        <></>
                                                                    }
                                                                </Col>
                                                            </Row>
                                                            <div className="registerInputMargin"></div>
                                                            <Row>
                                                                <Col md={6} xs={12} sm={12}>
                                                                    <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>District *</p>
                                                                    <Select
                                                                        onFocus={this.basicsCheck}
                                                                        onChange={this.handleDistrict}
                                                                        isSearchable={false}
                                                                        onBlur={this.basicsCheck}
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
                                                                    <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>PIN Code *</p>
                                                                    <input
                                                                        className="emailInput"
                                                                        type = "number" maxLength = "6"
                                                                        placeholder="Enter your PIN Code"
                                                                        onChange={this.handlePincode}
                                                                        onFocus={this.handlePincode}
                                                                        onBlur={this.basicsCheck}
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
                                                                <Col md={6} sm={6} xs={6}>
                                                                    <div className="changeEmail_button" onClick={()=> {this.setState({profileEditMode: false}); window.scrollTo({top: 0, left: 0, behavior: 'smooth'});}}>
                                                                        <p className="login_signup_ques_text_blue">Cancel</p>
                                                                    </div>
                                                                </Col>
                                                                <Col md={6} sm={6} xs={6}>
                                                                    {
                                                                        this.state.basicsChecked ?
                                                                        <div className="login_button" onClick={this.infoUpdateChecker}>
                                                                            <p className="login_signup_ques_text_white">Save</p>
                                                                        </div>
                                                                        :
                                                                        <div className="login_button_disabled">
                                                                            <p className="login_signup_ques_text_white">Save</p>
                                                                        </div>
                                                                    }
                                                                </Col>
                                                            </Row>
                                                            
                                                        </div>
                                                    :
                                                        <div>
                                                            <Row>
                                                                <Col md={6}>
                                                                <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Full Name</p>
                                                                <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.fullName}</p>
                                                                </Col>
                                                                <Col md={6}>
                                                                {
                                                                    hasNameChanged ?
                                                                    <>
                                                                        <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Legal Name</p>
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
                                                            <Row className="profileInforMargins">
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
                                                            <Row className="profileInforMargins">
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
                                                                <Row className="profileInforMargins">
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
                                                            <Row >
                                                                <Col md={6}>
                                                                    <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>House No. & Street</p>
                                                                    <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.streetName}</p>
                                                                </Col>
                                                                <Col md={6}>
                                                                    <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Town/Village</p>
                                                                    <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.town}</p>
                                                                </Col>
                                                            </Row>
                                                            <Row className="profileInforMargins">
                                                                <Col md={6} xs={6} sm={6}>
                                                                <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>District</p>
                                                                <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.district}</p>
                                                                </Col>
                                                                <Col md={6} xs={6} sm={6}>
                                                                <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>PIN Code</p>
                                                                <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.pincode}</p>
                                                                </Col>
                                                            </Row>
                                                            <Row className="profileInforMargins">
                                                                <Col md={6} xs={12} sm={12}>
                                                                <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Do you belong to PwD?</p>
                                                                <p className="confirmationText" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{this.state.isPWD ? "Yes" : "No"}</p>
                                                                </Col>
                                                                <Col md={6} xs={12} sm={12}>
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
                                                            {
                                                                this.state.showButton ?
                                                                <div className="login_button" onClick={()=>this.setState({profileEditMode: true})}>
                                                                    <p className="login_signup_ques_text_white">Edit Information</p>
                                                                </div>
                                                                :
                                                                <></>
                                                            }
                                                        </div>
                                                }
                                            </div>
                                        :
                                        <></>
                                    }
                                    {
                                        this.state.layoutView === "Education" ? 
                                            <>
                                                <div className="profile_left_firstDiv">
                                                    <p className="settings_TabsTittle" style={{ fontSize: fontSize >21 ? `${fontSize}px` : '20px' }}>Educational Details</p>
                                                    <p className="profile_eduBio" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Add all you educational qualifications from Class 10 onwards. Make sure all the educational details you enter are authentic & genuine.</p>
                                                    {
                                                        this.state.userData[1].education_details.length > 0 ?
                                                        <Row>
                                                        {
                                                            this.state.userData[1].education_details.map((item, key) =>(
                                                                
                                                                    <Col md={6} sm={12} xs={12}>
                                                                        <div key={key} className="degreeTabs">
                                                                            <p className="degreeTabs_Degree" style={{ fontSize: fontSize >17.5 ? `${fontSize}px` : '16.5px' }}>{item.degree}</p>
                                                                            <p className="degreeTabs_Year" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{Number(item.marks) > 10.1 ? "Percentage " + item.marks + "%" : "CGPA " + item.marks}</p>
                                                                            <p className="degreeTabs_Year" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>Date of Passing: {item.year}</p>
                                                                            <Row>
                                                                                <Col md={6} xs={12} sm={12}>
                                                                                    <div className="viewDocumentButton" onClick={() =>  window.open(item.docs, '_blank')}>
                                                                                        <p className="viewDocumentButton_Txt">View Document</p>
                                                                                    </div>
                                                                                </Col>
                                                                                <Col md={6} xs={12} sm={12}>
                                                                                    <div className="deleteDocumentButton" onClick={() => this.deleteEducation(item.id, item.degree)}>
                                                                                        <p className="deleteDocumentButton_Txt">Delete</p>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </div>
                                                                    </Col>
                                                                
                                                            ))
                                                        }
                                                        </Row>
                                                        :
                                                        <></>
                                                    }
                                                    {
                                                        this.state.educationEditMode ?
                                                            <>
                                                                <div className="addEducationView">
                                                                    <div className="lottieContainer_2">
                                                                        <Row>
                                                                            <Col md={1} xs={2} sm={2}>
                                                                                <Lottie options={defaultOptions_2} style={animationStyles_2} />
                                                                            </Col>
                                                                            <Col md={11} xs={10} sm={10}>
                                                                                <span className="lottieDivTxt">Submitting your <b>Class 10</b> details is <b>compulsory</b>. Once you submit your Class 10 educational details, all the other degree options will be enabled automatically.</span>
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                    <Row>
                                                                        <Col md={6} xs={12} sm={12}>
                                                                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Qualification</p>
                                                                            <Select
                                                                                onFocus={this.educationCheck}
                                                                                onChange={this.handleDegree}
                                                                                onBlur={this.educationCheck}
                                                                                value={degreeOptions.find(
                                                                                (item) => item.value === degree
                                                                                )}
                                                                                placeholder={<div>Select qualification</div>}
                                                                                options={degreeOptions}
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
                                                                                this.state.errors["degree"] ? (
                                                                                    <span
                                                                                        id="marginInputs"
                                                                                        className="validateErrorTxt registerInputMargin"
                                                                                    >
                                                                                        {this.state.errors["degree"]}
                                                                                    </span>
                                                                                ) :
                                                                                <div className="registerInputMargin"></div>
                                                                            }
                                                                        </Col>
                                                                        <Col md={6} xs={12} sm={12}>
                                                                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Date of Passing</p>
                                                                            <div className="calender_div" onClick={() => this.setState({yearOfPassingModal: true})}>
                                                                                {
                                                                                    this.state.yearofpassing ? 
                                                                                    <p className="dob_txt">{this.state.yearofpassing}</p>
                                                                                    :
                                                                                    <p className="dob_txt">Select date of passing</p>
                                                                                }
                                                                            </div>
                                                                            {  
                                                                                this.state.errors["yearofpassing"] ? (
                                                                                    <span
                                                                                        id="marginInputs"
                                                                                        className="validateErrorTxt registerInputMargin"
                                                                                    >
                                                                                        {this.state.errors["yearofpassing"]}
                                                                                    </span>
                                                                                ) :
                                                                                <div className="registerInputMargin"></div>
                                                                            }
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col md={12} xs={12} sm={12}>
                                                                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Percentage/CGPA</p>
                                                                            <Row>
                                                                                <Col md={6} xs={12} sm={12}>
                                                                                    <Select
                                                                                        onFocus={this.educationCheck}
                                                                                        onBlur={this.educationCheck}
                                                                                        onChange={this.handlePercentageType}
                                                                                        value={percentageOptions.find(
                                                                                        (item) => item.value === percentageType
                                                                                        )}
                                                                                        placeholder={<div>Select</div>}
                                                                                        options={percentageOptions}
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
                                                                                    <input
                                                                                        className="emailInput"
                                                                                        type="number" maxLength = {percentageType === "Percentage" ? "4": "3"} pattern="[0-9\.]+"
                                                                                        placeholder={percentageType === "Percentage" ? "Enter Percentage": "Enter CPGA"}
                                                                                        onChange={this.handlePercentage}
                                                                                        onFocus={this.handlePercentage}
                                                                                        onBlur={this.educationCheck}
                                                                                        value={this.state.percentage}
                                                                                    />
                                                                                    {  
                                                                                        this.state.errors["percentage"] ? (
                                                                                            <span
                                                                                                id="marginInputs"
                                                                                                className="validateErrorTxt registerInputMargin"
                                                                                            >
                                                                                                {this.state.errors["percentage"]}
                                                                                            </span>
                                                                                        ) :
                                                                                        <div className="registerInputMargin"></div>
                                                                                    }
                                                                                </Col>
                                                                            </Row>
                                                                            <Row>
                                                                                <Col md={6} xs={12} sm={12}>
                                                                                    <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>University/Board/Institute</p>
                                                                                    <input
                                                                                        className="emailInput"
                                                                                        type = "text"
                                                                                        placeholder="Enter University/Board/Institute"
                                                                                        onChange={this.handleUniversity}
                                                                                        onFocus={this.handleUniversity}
                                                                                        onBlur={this.educationCheck}
                                                                                        value={this.state.universityName}
                                                                                    />
                                                                                    {  
                                                                                        this.state.errors["university"] ? (
                                                                                            <span
                                                                                                id="marginInputs"
                                                                                                className="validateErrorTxt registerInputMargin"
                                                                                            >
                                                                                                {this.state.errors["university"]}
                                                                                            </span>
                                                                                        ) :
                                                                                        <div className="registerInputMargin"></div>
                                                                                    }
                                                                                </Col>
                                                                                <Col md={6} xs={12} sm={12}>
                                                                                    <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Document Type</p>
                                                                                    <Select
                                                                                        onFocus={this.educationCheck}
                                                                                        onChange={this.handleDocumentType}
                                                                                        onBlur={this.educationCheck}
                                                                                        value={documentTypeOptions.find(
                                                                                        (item) => item.value === documentType
                                                                                        )}
                                                                                        placeholder={<div>Select document type</div>}
                                                                                        options={documentTypeOptions}
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
                                                                                        this.state.errors["documentType"] ? (
                                                                                            <span
                                                                                                id="marginInputs"
                                                                                                className="validateErrorTxt registerInputMargin"
                                                                                            >
                                                                                                {this.state.errors["documentType"]}
                                                                                            </span>
                                                                                        ) :
                                                                                        <div className="registerInputMargin"></div>
                                                                                    }
                                                                                </Col>
                                                                                
                                                                            </Row>
                                                                        </Col>
                                                                        <Col md={12} xs={12} sm={12}>
                                                                            <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Upload {degree === "Class 10" ? "Admit Card" : "Marksheet"}</p>
                                                                            <div className="calender_div">
                                                                                <div onClick={() => document.getElementById('educationDocumentInput').click()}>
                                                                                    {
                                                                                    this.state.educationalDoc === null ?
                                                                                        <p className="dob_txt"><AiOutlineUpload size={20}/>  Select File (Only Images/PDF allowed)</p>
                                                                                    :
                                                                                        <p className="dob_txt"><BsCheckCircleFill size={20} color="green"/>  {this.state.educationalDoc}</p>
                                                                                    }
                                                                                </div>
                                                                                <input
                                                                                    type="file"
                                                                                    id="educationDocumentInput"
                                                                                    accept="image/jpg, image/jpeg, image/png, application/pdf"
                                                                                    onFocus={this.handleEducationDocument}
                                                                                    onChange={this.handleEducationDocument}
                                                                                    onBlur={this.educationCheck}
                                                                                    style={{ display: 'none' }}
                                                                                />
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col md={6} xs={6} sm={6}>
                                                                            <div className="changeEmail_button" onClick={this.closeEducationTab}>
                                                                                <p className="login_signup_ques_text_blue">Close</p>
                                                                            </div>
                                                                        </Col>
                                                                        <Col md={6} xs={6} sm={6}>
                                                                            {
                                                                                this.state.educationChecked ?
                                                                                    <div className="login_button" onClick={this.handleUploadEducation}>
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
                                                                <div className="lottieContainer">
                                                                    <Row>
                                                                        <Col md={1} xs={2} sm={2}>
                                                                            <Lottie options={defaultOptions} style={animationStyles} />
                                                                        </Col>
                                                                        <Col md={11} xs={10} sm={10}>
                                                                            <span className="lottieDivTxt">If your qualification or degree is not mentioned on the list above, you may contact 9366495971 or helpdesk@nssbrecruitment.in</span>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </>
                                                        :
                                                            <div className="profile_skyblueBtn" onClick={() => this.setState({educationEditMode: true, disclaimerModal: true})}>
                                                                <p className="profile_skyblueBtn_txt">+ Add Education</p>    
                                                            </div>
                                                    }  
                                                </div>
                                                <div className="profile_left_firstDiv">
                                                    <p className="settings_TabsTittle" style={{ fontSize: fontSize >21 ? `${fontSize}px` : '20px' }}>Professional Certifications</p>
                                                    <p className="profile_eduBio" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '16px' }}>Make sure all the certificate details you enter and upload are from recognised institute.</p>
                                                    {
                                                        this.state.userData[2].certificate_details.length > 0 ?
                                                        <Row>
                                                        {
                                                            this.state.userData[2].certificate_details.map((item, key) =>(
                                                                
                                                                    <Col md={6} sm={12} xs={12}>
                                                                        <div key={key} className="degreeTabs">
                                                                            <p className="degreeTabs_Degree" style={{ fontSize: fontSize >17.5 ? `${fontSize}px` : '16.5px' }}>{item.certificate_name}</p>
                                                                            <p className="degreeTabs_Year" style={{ fontSize: fontSize >17 ? `${fontSize}px` : '15px' }}>{item.duration >= 12 ? (item.duration)/12 + " Years" : item.duration + " Months"}</p>
                                                                            <Row>
                                                                                <Col md={6} xs={12} sm={12}>
                                                                                    <div className="viewDocumentButton" onClick={() =>  window.open(item.docs, '_blank')}>
                                                                                        <p className="viewDocumentButton_Txt">View Document</p>
                                                                                    </div>
                                                                                </Col>
                                                                                <Col md={6} xs={12} sm={12}>
                                                                                    <div className="deleteDocumentButton" onClick={() => this.deleteCertificate(item.id)}>
                                                                                        <p className="deleteDocumentButton_Txt">Delete</p>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </div>
                                                                    </Col>
                                                                
                                                            ))
                                                        }
                                                        </Row>
                                                        :
                                                        <></>
                                                    }
                                                    {
                                                        this.state.certificateEditMode ?
                                                            <div className="addEducationView">
                                                                <Row>
                                                                    <Col md={6} xs={12} sm={12}>
                                                                        <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Certificate</p>
                                                                        <Select
                                                                            onFocus={this.certificateCheck}
                                                                            onChange={this.handleCertificateCourse}
                                                                            onBlur={this.certificateCheck}
                                                                            value={certificateOptions.find(
                                                                            (item) => item.value === certificateCourse
                                                                            )}
                                                                            placeholder={<div>Select certificate</div>}
                                                                            options={certificateOptions}
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
                                                                            this.state.errors["certificate"] ? (
                                                                                <span
                                                                                    id="marginInputs"
                                                                                    className="validateErrorTxt registerInputMargin"
                                                                                >
                                                                                    {this.state.errors["certificate"]}
                                                                                </span>
                                                                            ) :
                                                                            <div className="registerInputMargin"></div>
                                                                        }
                                                                    </Col>
                                                                    <Col md={6} xs={12} sm={12}>
                                                                        <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Duration</p>
                                                                        <Select
                                                                            onFocus={this.certificateCheck}
                                                                            onChange={this.handleDuration}
                                                                            onBlur={this.certificateCheck}
                                                                            value={durationOptions.find(
                                                                            (item) => item.value === duration
                                                                            )}
                                                                            placeholder={<div>Select duration</div>}
                                                                            options={durationOptions}
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
                                                                            this.state.errors["duration"] ? (
                                                                                <span
                                                                                    id="marginInputs"
                                                                                    className="validateErrorTxt registerInputMargin"
                                                                                >
                                                                                    {this.state.errors["duration"]}
                                                                                </span>
                                                                            ) :
                                                                            <div className="registerInputMargin"></div>
                                                                        }
                                                                    </Col>
                                                                </Row>
                                                                
                                                                <Row>
                                                                    <Col md={12} xs={12} sm={12}>
                                                                        <p className="input_header_txt" style={{ fontSize: fontSize >17.3 ? `${fontSize}px` : '16.5px' }}>Upload Certificate</p>
                                                                        <div className="calender_div">
                                                                            <div onClick={() => document.getElementById('certificateDocumentInput').click()}>
                                                                                {
                                                                                this.state.certificateDoc === null ?
                                                                                    <p className="dob_txt"><AiOutlineUpload size={20}/>  Select File (Only Images/PDF allowed)</p>
                                                                                :
                                                                                    <p className="dob_txt"><BsCheckCircleFill size={20} color="green"/>  {this.state.certificateDoc}</p>
                                                                                }
                                                                            </div>
                                                                            <input
                                                                                type="file"
                                                                                id="certificateDocumentInput"
                                                                                accept="image/jpg, image/jpeg, image/png, application/pdf"
                                                                                onFocus={this.handleCertificateDocument}
                                                                                onChange={this.handleCertificateDocument}
                                                                                onBlur={this.certificateCheck}
                                                                                style={{ display: 'none' }}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={6} xs={6} sm={6}>
                                                                        <div className="changeEmail_button" onClick={this.closeEducationTab}>
                                                                            <p className="login_signup_ques_text_blue">Close</p>
                                                                        </div>
                                                                    </Col>
                                                                    <Col md={6} xs={6} sm={6}>
                                                                        {
                                                                            this.state.certificateChecked ?
                                                                                <div className="login_button" onClick={this.handleUploadCertificate}>
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
                                                            <div className="profile_skyblueBtn" onClick={() => this.setState({certificateEditMode: true})}>
                                                                <p className="profile_skyblueBtn_txt">+ Add Certificate</p>    
                                                            </div>
                                                           
                                                    }  
                                                </div>
                                            </>
                                        :
                                        <></>
                                    }
                                </>
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
                :
                    <div className="settings_body">
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
                    </div>
            }
            <Footer/>
        </>
    );
  }
}

export default withRouter(Profile);
