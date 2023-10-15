import React from "react";
import { withRouter } from "react-router-dom";
import Accordion from 'react-bootstrap/Accordion';

import './AccordionCustomStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "../../components/Footer/footer";

class faq extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFABOpen: false
    };
  }
  componentDidMount(){
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }
  render() {
    return (
    <div>
      <div className="faq_body">
        <div>
            <p className="login_header_text">FAQs</p>
            <p className="faq_subTitle">Kindly read these FAQs thoroughly before contacting the helpdesk.</p>
            <Accordion flush>
                <p className="faq_subHeader">General Queries</p>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Can I apply for NSSB Advertisement without One-Time-Registration?</Accordion.Header>
                    <Accordion.Body>
                        No, you cannot apply for any exams conducted by NSSB, without OTR (One-Time-Registration). It is mandatory to register in the NSSB Registration Portal before applying for any competitive examination under NSSB.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>How do I register for OTR?</Accordion.Header>
                    <Accordion.Body>
                        Go to <span className="accordianTextLink" onClick={() => window.open("https://nssb.nagaland.gov.in", "_blank")}>NSSB Official Portal</span> and on the Menu, click the "Register" button.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header>What are the requirements to register on the NSSB Recruitment Portal?</Accordion.Header>
                    <Accordion.Body>
                        Passport Photo & Signature (with white background), valid Email ID and Phone Number. While registering, an OTP will be sent to your Email ID only. Please check the spam / junk folder as well if you don’t find the OTP in your inbox.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                    <Accordion.Header>What are the documents required while adding educational details?</Accordion.Header>
                    <Accordion.Body>
                        <span className="accordianBoldTxt">For Class 10</span> - Admit Card<br/>
                        <span className="accordianBoldTxt">For Class 12</span> - Marksheet<br/>
                        <span className="accordianBoldTxt">For Graduation / Post Graduation / Diploma</span> - Transcript or Scan all the marksheets of all the semesters into 1 PDF file.<br/>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="5">
                    <Accordion.Header>What if my qualification / degree is not mentioned on the list of education?</Accordion.Header>
                    <Accordion.Body>
                      Please check the eligibility criteria of the posts at <span className="accordianTextLink" onClick={() => window.open("https://nssb.nagaland.gov.in/wp-content/uploads/2023/08/Clerical-and-Allied-Services-Examination-2023.pdf", "_blank")}>NSSB CASE 2023 [PDF]</span> If the requirement is simple Graduate, you may select the Graduate option irrespective of your honours or discipline if any.<br/><br/>For person with Engineering, B.Sc, B.A etc. degree, you may select B.E / B.Tech or B.Sc or B.A, irrespective of your field, honours or discipline.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="6">
                    <Accordion.Header>For the post of Sub Inspector advertised under CASE 2023, will graduate in any field make me eligible for the post?</Accordion.Header>
                    <Accordion.Body>
                        Please remember the qualification for the post of Sub Inspector is Graduate with Statistics / Economics / Mathematics / Commerce / Agriculture Economics / Social Work / Rural Economics / Education as advertised.<br/><br/>You can select the Graduate option and the system will allow you to proceed  but please take note, Graduate with Statistics / Economics / Mathematics / Commerce / Agriculture Economics / Social Work / Rural Economics / Education qualification is a must and will be scrutinised during physical documents verification when called upon to do so.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="7">
                    <Accordion.Header>How do I contact NSSB if I have any queries or technical issues?</Accordion.Header>
                    <Accordion.Body>
                        You can call NSSB helpline number <a href={"tel:" + "+919366495971"}><span className="accordianTextLink">9366495971</span></a> between 10AM to 4PM.<br/>
                        You may also drop in your queries at <span className="accordianTextLink" onClick={() => window.location = 'mailto:helpdesk@nssbrecruitment.in'}>helpdesk@nssbrecruitment.in</span>
                    </Accordion.Body>
                </Accordion.Item>
                <p className="faq_subHeader">Payment Related Queries</p>
                <Accordion.Item eventKey="8">
                    <Accordion.Header>What to do if recipt shows "PENDING" despite money being dedcuted?</Accordion.Header>
                    <Accordion.Body>
                      Such cases are due to poor internet connectivity or server down of partner bank.<br/>
                      For this, candidate should kindly email at <span className="accordianTextLink" onClick={() => window.location = 'mailto:helpdesk@nssbrecruitment.in'}>helpdesk@nssbrecruitment.in</span> with the following information:<br/>
                      <ul>
                        <li>Payment Recipt screenshot</li>
                        <li>Full Name (as entered during registration)</li>
                      </ul>
                      NSSB Team will be verifying the transaction on our end in 3-4 working days. Once verified, we will update the status as paid.<br/>
                      In such instances, candidates are requested to please wait for the Board’s reply for 4 days instead of applying twice with different Email ID.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="9">
                    <Accordion.Header>How can I claim my refund in case of multiple payments done?</Accordion.Header>
                    <Accordion.Body>
                      For this, candidate needs to go to <span className="accordianTextLink" onClick={() => window.open("https://nssbrecruitment.in/payment-history", "_blank")}>Payment History</span> and create a "Refund Request".<br/>
                      NSSB Team will be verifying the transaction on our end in 3-4 working days. Once verified, we will initiate the refunds of extra amounts & the updating the payment status.<br/>
                      The refunded amount may take 10-15 days to reach your bank accounts.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
      </div>
      <Footer/>
    </div>
    
    );
  }
}

export default withRouter(faq);
