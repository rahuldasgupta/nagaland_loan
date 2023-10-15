import React, {createRef} from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SideBar from "../Sidebar/sidebar";
import { IoClose } from "react-icons/io5";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { VscDebugRestart } from "react-icons/vsc";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";

//images
import sidebar_icon from "../../assets/icon/sidebar_icon.png";
import register from "../../assets/register.png";
import login from "../../assets/login.png";
import logout from "../../assets/logout.png";
import nssb_banner from "../../assets/nssb_banner.webp";

const styles = {
  row: {
      marginLeft: 0,
      marginRight: 0
  },
  col: {
      paddingLeft: 0,
      paddingRight: 0
  }
};

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sideBar: false,
      dropdownView: false,
      notificationModal: false,
      isLoggedIn: false,
      isDarkModeActive: false,
      fontSize: parseInt(localStorage.getItem("fontSize")) || 16,
      isInfoModal: false
    };
    this.componentRef = createRef();
  }
  componentDidMount(){
    var userData = JSON.parse(localStorage.getItem('userData'));
    if(userData){
        this.setState({
          isLoggedIn: true
        })
    }
    //this.getSessionData();
  }
  setSessionStorageWithExpiry(key, value, expiryInSeconds) {
    const now = new Date();
    const expiryTime = now.getTime() + expiryInSeconds * 1000;
    const item = {
      value,
      expiry: expiryTime,
    };
    localStorage.setItem(key, JSON.stringify(item));
    this.setState({
      isInfoModal: false
    })
  }
  getSessionStorageWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null; // Item does not exist
    }
    const item = JSON.parse(itemStr);
    const now = new Date().getTime();
    if (now > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }
  getSessionData() {
    const storedData = this.getSessionStorageWithExpiry('infoModal');
    if (storedData === null) {
      this.setState({
        isInfoModal: true
      })
      //this.setSessionStorageWithExpiry('infoModal', newData, 24 * 60 * 60); // 24 hours * 60 minutes * 60 seconds
    } else {
      this.setState({
        isInfoModal: false
      })
    }
  }
  clearAsyncStorage = async() => {
    localStorage.clear();
    window.location.reload()
  }
  render() {
    const { increaseFontSize, decreaseFontSize, resetFontSize } = this.props;
    return (
      <>
        <Modal
            show={this.state.isInfoModal}
            backdrop="static"
            keyboard={false}
            centered
            size="md"
        >
            <ModalBody>
              <div style={{padding: 5}}>
                <p className="login_header_text">Notice</p>
                <center>
                  <p className="emailVerifyHeader_register" style={{ fontSize: '17px' }}>Changing Posts Applied is OPEN</p>
                  <p className="viewExam_WarnModalSubtitles"  style={{ fontSize:'16px' }}>This only implies on the candidates who have already submitted & applied.</p>
                  <p className="home_infoModal"> Open <span className="accordianTextLink">Examinations</span> & click  <span className="accordianTextLink">View Details</span>. If already applied, you will be shown a popup with the option <span className="accordianTextLink">Change Posts Applied</span></p>
                </center>
                <div className="changeEmail_button" onClick={()=> this.setSessionStorageWithExpiry('infoModal', "true", 3600)}>
                  <p className="login_signup_ques_text_blue">I understand</p>
                </div>
              </div>
            </ModalBody>
        </Modal>
        <div className="logos-div-navbar">
          <center>
            <img
              alt="logo"
              src={nssb_banner}
              className="nssb_banner"
            />
          </center>
        </div>
        <div className="logos-div-navbar_forPC">
          <center>
            <img
              alt="logo"
              src={nssb_banner}
              className="nssb_banner"
            />
          </center>
        </div>
        <Nav>
          <div className="side-bar">
            {
              this.state.sideBar ?
              <Row style={styles.row} className="SideBarPosition">
                <Col onClick={() => this.setState({ sideBar: false })} style={styles.col}>
                  <SideBar sideBarShow={this.state.sideBar}/>
                </Col>
                <Col onClick={() => this.setState({ sideBar: false })} style={styles.col}>
                  <div className="sidebar_Shadow">
                    &nbsp;
                  </div>
                </Col>
              </Row>
              :
              <Row>
                <Col>
                <div className="mobile-side-img-div2">
                  <img
                      alt="sidebar"
                      src={sidebar_icon}
                      className="sidebar-icon"
                      onClick={() => this.setState({ sideBar: true })}
                    />
                </div>
                </Col>
              </Row>
            }
          </div>
          <NavMenu>
            <NavLink to="/" style={{marginLeft:"3%",marginRight:"3%"}} onMouseOver={() => this.setState({dropdownView: false})}>
              <span className="contact-nav-text">Home</span>
            </NavLink>
            <NavLink to="/" style={{marginRight:"3%"}} onMouseOver={() => this.setState({dropdownView: false})}>
              <span className="contact-nav-text">About</span>
            </NavLink>
            <NavLink to="/faq" style={{marginRight:"3%"}} onMouseOver={() => this.setState({dropdownView: false})}>
              <span className="contact-nav-text">FAQs</span>
            </NavLink>
            <div onMouseEnter={() => this.setState({dropdownView: true})}>
              <span className="contact-nav-text">More</span>
            </div>
            {
              this.state.dropdownView?
                <div className="categories-hover-div" onMouseOver={() => this.setState({dropdownView: true})} onMouseLeave={() => this.setState({dropdownView: false})}>
                  <center>
                    <NavLink
                        to="/"
                        className="nav-change-drop"
                        onMouseOver={() => this.setState({dropdownView: true})}
                      >
                        Notifications
                    </NavLink>
                    <div style={{marginTop: 15, marginBottom:15}}></div>
                    <NavLink
                        to="/"
                        className="nav-change-drop"
                        onMouseOver={() => this.setState({dropdownView: true})}
                      >
                        Reports
                    </NavLink>
                    <div style={{marginTop: 15, marginBottom:15}}></div>
                  </center>
                </div>
              :
              <></>
            }
          </NavMenu>
          
          <div className="navbar-register">
            <Row>
              <Col md={4} xs={4} sm={4}>
                <img
                  alt="logo"
                  src={login}
                  className="register-navbar-icon"
                />
              </Col>
              <Col md={7} xs={7} sm={7}>
                {
                  this.state.isLoggedIn ?
                  <NavLink to="/profile">
                    <p className="navbar_txt">Profile</p>
                  </NavLink>
                  :
                  <NavLink to="/login">
                    <p className="navbar_txt">Login</p>
                  </NavLink>
                }
              </Col>
            </Row>
            <Row style={{marginLeft:"12%"}}>
              <Col md={3} xs={3} sm={3}>
                {
                  this.state.isLoggedIn ?
                    <img
                      alt="logo"
                      src={logout}
                      className="register-navbar-icon"
                    />
                  :
                    <img
                      alt="logo"
                      src={register}
                      className="register-navbar-icon"
                    />
                }
              </Col>
              <Col md={7} xs={7} sm={7}>
                {
                  this.state.isLoggedIn ?
                    <p className="navbar_txt" onClick={this.clearAsyncStorage}> Logout</p>
                  :
                  <NavLink to="/register">
                    <p className="navbar_txt">Register</p>
                  </NavLink>
                }
              </Col>
            </Row>
          </div>
        </Nav>
        <div className="assessibility_div">
          {/*
            <div className="assessibility_div_darkMode">
              {
                this.state.isDarkModeActive ? 
                  <MdDarkMode
                    size={20}
                    className="MdDarkMode"
                  />
                  :
                  <MdOutlineDarkMode
                    size={20}
                    className="MdDarkMode"
                  />
              }
              <span className="assessibility_div_Txt">Dark Mode</span>
            </div>
            <div className="borderAssessibilty"></div>
          */}
          
          <div className="assessibility_div_darkMode">
            <span className="assessibility_div_Txt">Font Size: </span>
            <div className="assessibility_div_fonts" onClick={resetFontSize}>
              <span className="assessibility_div_Txt">Reset </span>
              <VscDebugRestart
                size={20}
                className="MdDarkMode2"
              />
            </div>
            <div className="assessibility_div_fonts" onClick={decreaseFontSize}>
              <span className="assessibility_div_Txt">Decrease </span>
              <AiOutlineMinusCircle
                size={20}
                className="MdDarkMode2"
              />
            </div>
            <div className="assessibility_div_fonts" onClick={increaseFontSize}>
              <span className="assessibility_div_Txt">Increase </span>
              <AiOutlinePlusCircle
                size={20}
                className="MdDarkMode2"
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Navbar;
