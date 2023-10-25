import React from "react";
import { withRouter } from "react-router-dom";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { BsPersonCircle, BsInfoCircle, BsCreditCard, BsQuestionCircle } from "react-icons/bs";
import { FiUser } from "react-icons/fi";

import { RxDashboard } from "react-icons/rx";
import { IoHomeOutline, IoCreateOutline } from "react-icons/io5";
import { PiCertificate } from "react-icons/pi";
import { SlLogin } from "react-icons/sl";
import { VscFeedback } from "react-icons/vsc";

import nssb from "../../assets/nssb.png";
import "./custom.scss";
import "./sidebar_styles.css";

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      sideBar: this.props.sideBarShow
    };
  }
  componentDidMount(){
    var userData = JSON.parse(localStorage.getItem('userData'));
    if(userData){
        this.setState({
          isLoggedIn: true
        })
    }
  }
  toggleButton = () => {
    this.setState({
      sideBar: !this.state.sideBar,
    });
  };
  navigateHome = () => {
    this.props.history.push("/");
    this.toggleButton()
  }
  navigateAbout = () => {
    window.open("https://nssb.nagaland.gov.in/about-nssb/", "_blank");
    this.toggleButton()
  }
  navigateExamination = () => {
    this.props.history.push("/");
    this.toggleButton()
  }
  navigateLogin = () => {
    this.props.history.push("/login");
    this.toggleButton()
  }
  navigateRegister = () => {
    this.props.history.push("/register");
    this.toggleButton()
  }
  navigateProfile = () => {
    this.props.history.push("/profile");
    this.toggleButton()
  }
  navigatePaymentHistory = () => {
    this.props.history.push("/");
    this.toggleButton()
  }
  navigateAdmitCard = () => {
    this.props.history.push("/");
    this.toggleButton()
  }
  navigateFAQ = () => {
    this.props.history.push("/");
    this.toggleButton()
  }
  clearAsyncStorage = async() => {
    localStorage.clear();
    window.location.reload()
  }
  render() {
    return (
      <>
        {
          this.state.sideBar?
            <ProSidebar>
              <center>
                <img src={nssb} style={{ height: 140, marginTop:"17%", marginBottom: "10%" }} />
              </center>
              <Menu iconShape="square" className="sidebar-icons-margin">
                <MenuItem icon={<IoHomeOutline size={26} color={"#fff"} style={{marginRight: 7}}/>}>
                  <span onClick={this.navigateHome} className="sidebar-item-txt">Home</span>
                </MenuItem>
                <MenuItem icon={<RxDashboard size={25} color="white" style={{marginRight: 7}}/>}>
                  <span onClick={this.navigateExamination} className="sidebar-item-txt">About</span>
                </MenuItem>
                <MenuItem icon={<BsQuestionCircle size={25} color="white" style={{marginRight: 7}}/>}>
                  <span onClick={this.navigateFAQ} className="sidebar-item-txt">FAQs</span>
                </MenuItem>
                {
                  this.state.isLoggedIn ?
                  <>
                    <MenuItem icon={<FiUser size={26} color={"#fff"} style={{marginRight: 7}} />}>
                      <span  onClick={this.navigateProfile} className="sidebar-item-txt">Profile</span>
                    </MenuItem>
                    <center>
                      <hr className="sidebar_hr_white"/>
                    </center>
                    {/*
                      <MenuItem icon={<LuMoon size={23} color={"#fff"} style={{marginRight: 7}}/>}>
                        <span onClick={this.clearAsyncStorage} className="sidebar-item-txt">Dark Mode</span>
                      </MenuItem>
                    */}
                    <MenuItem icon={<SlLogin size={23} color={"#fff"} style={{marginRight: 7}}/>}>
                      <span onClick={this.clearAsyncStorage} className="sidebar-item-txt">Logout</span>
                    </MenuItem>
                  </>
                  :
                  <>
                    <center>
                      <hr className="sidebar_hr_white"/>
                    </center>
                    <MenuItem icon={<SlLogin size={23} color={"#fff"} style={{marginRight: 7}}/>}>
                      <span onClick={this.navigateLogin} className="sidebar-item-txt">Login</span>
                    </MenuItem>
                    <MenuItem icon={<BsPersonCircle size={25} color={"#fff"} style={{marginRight: 7}}/>}>
                      <span onClick={this.navigateRegister} className="sidebar-item-txt">Register</span>
                    </MenuItem>
                  </>
                }
                <div className="empty-sidebar-div"></div>
              </Menu>
            </ProSidebar>
          :
            <></>
        }
      </>
    );
  }
}

export default withRouter(SideBar);
