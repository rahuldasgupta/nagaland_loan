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
          <p className="terms-Title">Cancellation Policy</p>
          <p className="policy-Txt">At NSSB Nagaland, we value our users’ needs and understand that circumstances may arise which require the cancellation of an exam enrollment. To ensure a fair and transparent process, we have implemented the following cancellation policy:</p>
          
          <p className="policy-SubTitle">1. 100% Refund: <span className="policy-spanSubTitle">If you decide to cancel your exam enrollment, you are eligible for a full refund of the amount paid. This applies to all cancellations made before the exam date. Once requested for cancellation, the user cannot re-apply for the same examination.</span></p>
          <p className="policy-SubTitle">2. Cancellation Request: <span className="policy-spanSubTitle">To initiate the cancellation process, you must submit a cancellation request through our website or contact our customer support team at helpdesk@nssbrecruitment.in. Please provide your exam enrollment details and reason for cancellation.</span></p>
          <p className="policy-SubTitle">3. Timely Cancellation: <span className="policy-spanSubTitle">To be eligible for a full refund, cancellations must be made within 1 day prior to the scheduled last date of registration. Cancellation requests received after this period may not be eligible for a refund.</span></p>
          <p className="policy-SubTitle">4. Refund Process: <span className="policy-spanSubTitle">Once we receive your cancellation request, our team will review it and process the refund. The refund amount will be credited back to the original payment method used during the enrollment process, or NEFT.</span></p>
          <p className="policy-SubTitle">5. Refund Timeframe: <span className="policy-spanSubTitle">We strive to process refunds promptly. You can expect to receive your refund within 3-5 working days, depending on your payment provider’s processing time.</span></p>
          <p className="policy-SubTitle">6. Exceptions: <span className="policy-spanSubTitle">In the event that the exam is canceled or rescheduled by NSSB Nagaland, we will provide alternative options, including rescheduling of the exam date.</span></p>
          
          <p className="policy-SubTitle">We strongly recommend reviewing the cancellation policy before enrolling for an exam on NSSB Nagaland. By proceeding with the exam enrollment, you acknowledge and agree to adhere to the terms and conditions stated in this cancellation policy.</p>
          <p>Last updated: 19/05/2023</p>
          <p>If you have any further questions or require assistance regarding the cancellation process, please don’t hesitate to contact our customer support team at helpdesk@nssbrecruitment.in. We are here to assist you.</p>
        </div>
      </div>
      <Footer/>
    </div>
    
    );
  }
}

export default withRouter(cancellation_policy);
