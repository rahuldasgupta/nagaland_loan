import React from "react";
import { withRouter } from "react-router-dom";

import "./privacy-policy.css";
import Footer from "../../components/Footer/footer";

class privacy_policy extends React.Component {
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
      <div className="termscontainer">
        <div>
          <p className="terms-Title">Privacy Policy</p>
          <p className="policy-Txt">At NSSB Nagaland, we are committed to protecting the privacy of our users. This privacy policy outlines how we collect, use and safeguard your personal information when you use our website and participate in the recruitment exams. By accessing or using our services, you consent to the terms of this privacy policy.</p>
          <p className="policy-SubTitle">1. Information Collection:</p>
          <ul>
            <li>
                <p>Personal Information: We may collect personal information such as your name, father’s name, indigenous details, address, contact details, educational qualifications, and other relevant data during the One-Time-Registration and application process.</p>
            </li>
            <li>
                <p>Non-Personal Information: We may also gather non-personal information, including demographic information and IP addresses to improve our services and enhance user experience.</p>
            </li>
          </ul>

          <p className="policy-SubTitle">2. Use of Information:</p>
          <ul>
            <li>
                <p>We use the collected personal information to process your applications, verify your eligibility, and communicate with you regarding the recruitment process.</p>
            </li>
            <li>
                <p>Non-personal information may be used to analyze monitor website performance, and enhance our services.</p>
            </li>
            <li>
                <p>Maintain accurate records and databases to manage the recruitment process efficiently.</p>
            </li>
          </ul>

          <p className="policy-SubTitle">3. Data Security:</p>
          <ul>
            <li>
                <p>We employ industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
            </li>
            <li>
                <p>We restrict access to your personal information to authorized personnel who require it to perform their duties.</p>
            </li>
            <li>
                <p>All your data is stored in State Data Center, Nagaland.</p>
            </li>
          </ul>

          <p className="policy-SubTitle">4. Data Retention:</p>
          <ul>
            <li>
                <p>All your personal and educational details are retained as long as you use NSSB Nagaland’s website.</p>
            </li>
            <li>
                <p>All your data will be deleted if you request to delete your account.</p>
            </li>
          </ul>

          <p className="policy-SubTitle">5. Third-Party Sharing:</p>
          <ul>
            <li>
                <p>We do not share your personal information with third parties, except as required by law.</p>
            </li>
            <li>
                <p>Your personal and educational data is ONLY used for the verifying your eligibility after you applied for an exam on the NSSB Nagaland Portal.</p>
            </li>
          </ul>

          <p className="policy-SubTitle">6. Third-Party Sharing: <span className="policy-spanSubTitle">Our website may use cookies to enhance your browsing experience.</span></p>
          <p className="policy-SubTitle">7. Changes to the Privacy Policy: <span className="policy-spanSubTitle">We reserve the right to modify or update this privacy policy at any time. We will notify you of any material changes through prominent notices on our website.</span></p>
          <p className="policy-SubTitle">8. Contact Us: <span className="policy-spanSubTitle">If you have any questions, concerns, or requests regarding our privacy policy or the handling of your personal information, please contact us using the provided contact information.</span></p>
          <p>Last updated: 19/05/2023</p>
          <p>If you have any further questions or require assistance regarding the cancellation process, please don’t hesitate to contact our customer support team at helpdesk@nssbrecruitment.in. We are here to assist you.</p>
        </div>
      </div>
      <Footer/>
    </div>
    
    );
  }
}

export default withRouter(privacy_policy);
