import React from "react";
import { withRouter } from "react-router-dom";
import "./footer.css";
import { Link } from "react-router-dom";
import facebook from "../../assets/facebook.png";
import twitter from "../../assets/twitter.png";
import instagram from "../../assets/instagram.png";
import youtube from "../../assets/youtube.png";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Footer extends React.Component {
  render() {
    return (
        <div className="footer_contant">
            <Row>
                <Col xs={12} sm={12} md={4} lg={4}>
                    <div className="items-cls">
                        <p className="footer_col_title">Get in touch</p>
                        <Row style={{width: "70%"}}>
                            <Col md={2} lg={2} xs={2} sm={2}>
                                <a href="https://www.facebook.com/">
                                    <img
                                        alt="logo"
                                        src={facebook}
                                        className="social-icons"
                                    />
                                </a>
                            </Col>
                            <Col md={2} lg={2} xs={2} sm={2}>
                                <a href="https://www.instagram.com/">
                                    <img
                                        alt="logo"
                                        src={instagram}
                                        className="social-icons"
                                    />
                                </a>
                            </Col>
                            <Col md={2} lg={2} xs={2} sm={2}>
                                <a href="https://twitter.com/">
                                    <img
                                        alt="logo"
                                        src={twitter}
                                        className="social-icons"
                                    />
                                </a>
                            </Col>
                            <Col md={2} lg={2} xs={2} sm={2}>
                                <a href="https://www.youtube.com/">
                                    <img
                                        alt="logo"
                                        src={youtube}
                                        className="social-icons"
                                        style={{marginTop: 5}}
                                    />
                                </a>
                            </Col>
                            <Col md={4} lg={4} xs={2} sm={2}></Col>
                        </Row>
                    </div>
                    {/*
                        <br className="counter_br"/>
                        <img className="counter_svg" src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fnssbrecruitment.in&count_bg=%23005A9C&title_bg=%23006EBF&icon=&icon_color=%23E7E7E7&title=+Visitors+++&edge_flat=false"/>
                    */}
                </Col>              
                <Col xs={12} sm={12} md={4} lg={4}>
                    <div className="items-cls sec">
                        <p className="footer_col_title">Other links</p>
                        <div className="links">
                            <a href="https://www.nagaland.gov.in/">
                                <p className="links links_text">Govt. of Nagaland</p>
                            </a>
                            <a href="https://nssb.nagaland.gov.in/category/news/">
                                <p className="links links_text">Notifications</p>
                            </a>
                            <p className="links">
                                <Link className="links_text" to="/terms-of-use">Terms of Use</Link>
                            </p>
                            <p className="links">
                                <Link className="links_text" to="/privacy-policy">Privacy Policy</Link>
                            </p>
                            <a href="https://nssbrecruitment.in/sitemap.xml">
                                <p className="links links_text">Sitemap</p>
                            </a>
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4}>
                    <div  className="items-cls">
                        <p className="footer_col_title">Contact</p>
                        <p className="info">
                            Nagaland Loan Tracking Department,<br/>
                            New Capital Complex, Secretariat<br/>
                            Kohima, Nagaland - 797004, IN<br/><br/>
                            Email - helpdesk@nagalandloan.in<br/>
                            Phone - 9876543210
                        </p>
                    </div>
                </Col>
            </Row>
        </div>
    );
  }
}

export default withRouter(Footer);
