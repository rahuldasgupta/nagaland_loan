import React from "react";
import { withRouter } from "react-router-dom";

import "./privacy-policy.css";
import Footer from "../../components/Footer/footer";

class cancellation_policy extends React.Component {
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
          <p className="terms-Title">Fees Policy</p>
          <p className="policy-SubTitle">1. Application Fee:</p>
          <ul>
            <li>
                <p>All candidates are required to pay an application fee of Rs. 100 for NSSB examination.</p>
            </li>
          </ul>
          <p className="policy-SubTitle">2. Fee Exemption for PWD Candidates:</p>
          <ul>
            <li>
                <p>Candidates with disabilities (PwD - Persons with Disabilities) are exempted from paying the application fee.</p>
            </li>
            <li>
                <p>PwD candidates must have valid and recognized documentation of their disability.</p>
            </li>
          </ul>
          <p className="policy-SubTitle">3. Payment Method:</p>
          <ul>
            <li>
                <p>The application fee should be paid online through the designated payment gateway on the official NSSB website - nssbrecruitment.in</p>
            </li>
            <li>
                <p>Accepted modes of payment include debit cards & net banking.</p>
            </li>
          </ul>
          <br/>
          <p className="terms-Title">Refund Policy</p>
          <p className="policy-Txt">At NSSB, we strive to provide the best user experience and ensure fair and transparent practices. We understand that occasionally, payment failures may occur during the exam registration process. In such cases, we are committed to resolving the issue promptly and facilitating a refund. Please review our refund policy outlined below:</p>
          <p className="policy-SubTitle">1. Eligibility for Refund:</p>
          <ul>
            <li>
                <p>Refunds are applicable only for failed payments made on nssbrecruitment.in</p>
            </li>
            <li>
                <p>The refund will be initiated at the discretion of the website’s administration.</p>
            </li>
            <li>
                <p>To be eligible for a refund, users must have completed the payment process but encountered a technical failure or other issues resulting in payment failure.</p>
            </li>
            <li>
                <p>Payments made through unauthorized means or fraudulent activities will not be eligible for a refund.</p>
            </li>
          </ul>

          <p className="policy-SubTitle">2. Refund Process:</p>
          <ul>
            <li>
                <p>Upon encountering a failed payment, users are required to contact our support team by submitting a refund request.</p>
            </li>
            <li>
                <p>Users can also request for refund from nssbrecruitment.in/request-refund</p>
            </li>
            <li>
                <p>Our support team will review the request and verify the failed payment.</p>
            </li>
            <li>
                <p>If the failed payment is confirmed, the refund will be initiated by the admin within 3-5 business days of the verification.</p>
            </li>
          </ul>

          <p className="policy-SubTitle">3. Refund Method:</p>
          <ul>
            <li>
                <p>Refunds will be issued using the same payment method originally used for the transaction or NEFT.</p>
            </li>
            <li>
                <p>If the original payment method is unavailable or invalid, our support team will work with the user to identify an alternative refund method.</p>
            </li>
          </ul>

          <p className="policy-SubTitle">4. Refund Amount:</p>
          <ul>
            <li>
                <p>The refund amount will be equal to the original payment made by the user for the failed transaction.</p>
            </li>
            <li>
                <p>Additional charges, such as transaction fees or bank charges, incurred during the original payment process, will not be included in the refund.</p>
            </li>
          </ul>

          <p className="policy-SubTitle">5. Communication:</p>
          <ul>
            <li>
                <p>Users will be notified via email regarding the status of their refund request. Also you can check your refund status from nssbrecruitment.in/transactions</p>
            </li>
            <li>
                <p>In case of any discrepancies or further information required, our support team may contact the user via the provided email address or phone number.</p>
            </li>
          </ul>
          <p className="policy-SubTitle">6. Contact Information: <span className="policy-spanSubTitle">For any queries or assistance regarding refunds or the refund policy, users can reach out to our customer support team at helpdesk@nssbrecruitment.in.</span></p>

          <p>Last updated: 19/05/2023</p>
          <p>Note: This fee policy is subject to change and should be referred to the official NSSB website for the most up-to-date information and guidelines regarding fee payment and exemptions. If you have any further questions or require assistance regarding the cancellation process, please don’t hesitate to contact our customer support team at helpdesk@nssbrecruitment.in. We are here to assist you.</p>
        </div>
      </div>
      <Footer/>
    </div>
    
    );
  }
}

export default withRouter(cancellation_policy);
