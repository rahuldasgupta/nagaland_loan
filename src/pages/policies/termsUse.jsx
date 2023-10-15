import React from "react";
import { withRouter } from "react-router-dom";

import "./privacy-policy.css";
import Footer from "../../components/Footer/footer";

class termsUse extends React.Component {
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
          <p className="terms-Title">Terms of Use</p>
          <p className="policy-Txt">Welcome to the website of the Nagaland Staff Selection Board (NSSB). By accessing or using our website and participating in any activities related to the annual recruitment exams for government jobs, you agree to abide by the following terms and conditions:</p>
          
          <p className="policy-SubTitle">1. Eligibility: <span className="policy-spanSubTitle">To participate in the annual recruitment exams conducted by NSSB, you must meet the eligibility criteria specified for each job position. It is your responsibility to ensure that you meet the required qualifications and fulfill any other conditions mentioned in the official recruitment notification.</span></p>
          <p className="policy-SubTitle">2. Registration: <span className="policy-spanSubTitle">To apply for government job vacancies through NSSB Portal, you must complete the One-Time-Registration (OTR) process on our website. You agree to provide accurate, current, and complete information during registration. Any false or misleading information may result in disqualification from the recruitment process.</span></p>
          <p className="policy-SubTitle">3. Examination Process: <span className="policy-spanSubTitle">NSSB is responsible for organizing and conducting the recruitment exams. You understand and agree to abide by the rules, instructions, and guidelines provided by NSSB throughout the examination process. This includes adhering to the specified exam date, time, and venue, as well as any additional requirements or restrictions communicated by NSSB.</span></p>
          <p className="policy-SubTitle">4. Admit Card: <span className="policy-spanSubTitle">Once you register for an examination, NSSB will issue an admit card that grants you permission to appear for the examination. It is your responsibility to download, print, and carry the admit card to the exam center. Failure to present a valid admit card may result in denial of entry to the examination hall.</span></p>
          <p className="policy-SubTitle">5. Conduct during Exams: <span className="policy-spanSubTitle">You must maintain discipline and adhere to the rules and regulations set by NSSB during the examination. Any form of cheating, malpractice, or violation of exam rules will result in immediate disqualification and may lead to further legal consequences.</span></p>
          <p className="policy-SubTitle">6. Results and Selection: <span className="policy-spanSubTitle">The selection process and the final results of the recruitment exams will be determined solely by NSSB based on the merit and performance of candidates. The decision of NSSB in this regard will be final and binding.</span></p>
          <p className="policy-SubTitle">7. Privacy: <span className="policy-spanSubTitle">NSSB is committed to protecting your privacy and handling your personal information in accordance with applicable laws and regulations. By using our website, you consent to the collection, use, and storage of your personal data as outlined in our Privacy Policy. We DO NOT share your personal and general data with any third-party.</span></p>
          <p className="policy-SubTitle">8. Governing Law: <span className="policy-spanSubTitle">These terms of use shall be governed by and construed in accordance with the laws of Government of Nagaland, India.</span></p>
          <p className="policy-SubTitle">9. Modifications: <span className="policy-spanSubTitle">NSSB reserves the right to modify or update these terms of use at any time without prior notice. It is your responsibility to review the terms periodically for any changes</span></p>

          <p>Last updated: 06/08/2023</p>
          <p>If you have any further questions or require assistance regarding the cancellation process, please don’t hesitate to contact our customer support team at helpdesk@nssbrecruitment.in. We are here to assist you.</p>
        </div>
      </div>
      <Footer/>
    </div>
    
    );
  }
}

export default withRouter(termsUse);
