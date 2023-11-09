import React from "react";
import { withRouter, Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler, BarElement,
  LineController,
  BarController
} from 'chart.js';
import { Pie, Bar, Chart, Line } from 'react-chartjs-2';
import ProgressBar from 'react-bootstrap/ProgressBar';

import Footer from "../../components/Footer/footer";
import "./about.css"

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler, BarElement,
  LineController,
  BarController
  );

export const pieOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    }
  },
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const emptyData = {
  labels,
  datasets: [
    {
      type: 'line',
      label: ' No. of Candidates Trained',
      borderColor: 'rgba(13, 96, 160, 1)',
      borderWidth: 2,
      fill: false,
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      type: 'bar',
      label: ' No. of Workshops Conducted',
      backgroundColor: 'rgb(255, 99, 132)',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
      borderColor: 'white',
      borderWidth: 2,
    },
    {
      type: 'bar',
      label: ' No. of Trainings Conducted',
      backgroundColor: 'rgba(13, 96, 160, 1)',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
      borderColor: 'white',
      borderWidth: 2,
    }
  ],
};

class about extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yearSwitch: "2022",
      genderCount: [0, 0, 0],

      cad_cam: 0,
      digitalLiteracy: 0,
      digitalPhotography: 0,
      entrepreneurship: 0,
      it_skills: 0,
      handloomWorkshop: 0,

      cad_cam_percentage: 0,
      digitalLiteracy_percentage: 0,
      digitalPhotography_percentage: 0,
      entrepreneurship_percentage: 0,
      it_skills_percentage: 0,
      handloomWorkshop_percentage: 0,
      total_percentage: 0,

      districtData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      timelineData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
  }
  componentDidMount(){
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    this.getGenderData();
    this.getTimelineData();
    this.getTrainingData();
    this.getDistricData();
  }
  getGenderData = () => {
    fetch(`https://nielitdihh.in/admin/api/genderWise.php`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("OUTPUT ==> ", responseJson);

        let responseArray = [];
        responseArray = responseJson;
        let genderCount = [0, 0, 0];

        let females = 0;
        let f = 0;

        //For Females
        let female_count = responseArray.findIndex(element => element.gender.includes("Female"));
        if(female_count != -1){
          females = females +  Number(responseArray[female_count].Total)
        }

        let f_count = responseArray.findIndex(element => element.gender.includes("F"));
        if(f_count != -1){
          f = f +  Number(responseArray[f_count].Total)
        }

        if(females > 0 || f >0){
          genderCount[1] = females + f
        }
        
        //For Males
        let males = 0;
        let m = 0;

        let male_count = responseArray.findIndex(element => element.gender.includes("Male"));
        if(male_count != -1){
          males = males +  Number(responseArray[male_count].Total)
        }

        let m_count = responseArray.findIndex(element => element.gender.includes("M"));
        if(m_count != -1){
          m = m +  Number(responseArray[m_count].Total)
        }

        if(males > 0 || m > 0){
          genderCount[0] = males + m
        }

        this.setState({
          genderCount: genderCount
        })
      })
      .catch((error) => {
        console.error(error);
      });
  };
  getTrainingData = () => {
    fetch(`https://nielitdihh.in/admin/api/training_categoryWise.php`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("Training Data ==> ", responseJson);
        
        if(responseJson[0]){
          this.setState({
            cad_cam: Number(responseJson[0].Total)
          })
        }
        if(responseJson[1] && responseJson[1].training_name === "Awareness Workshop"){
          this.setState({
            handloomWorkshop: Number(responseJson[1].Total)
          })
        }
        if(responseJson[2] && responseJson[2].training_name === "Digital Literacy"){
          this.setState({
            digitalLiteracy: Number(responseJson[2].Total)
          })
        }
        if(responseJson[3] && responseJson[3].training_name === "Digital Photography and Scanning"){
          this.setState({
            digitalPhotography: Number(responseJson[3].Total)
          })
        }
        if(responseJson[4] && responseJson[4].training_name === "Entrepreneurship & Soft Skill development"){
          this.setState({
            entrepreneurship: Number(responseJson[4].Total)
          })
        }
        setTimeout(() => {
          this.getProgressPercentage();
        }, 1500);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  getProgressPercentage = () => {
    let {handloomWorkshop, handloomWorkshop_percentage, cad_cam, digitalLiteracy, digitalPhotography, entrepreneurship, it_skills, cad_cam_percentage, digitalLiteracy_percentage, digitalPhotography_percentage, entrepreneurship_percentage, it_skills_percentage, total_percentage} = this.state;
    cad_cam_percentage = Math.round(((cad_cam/180)*100) * 10)/10;
    digitalLiteracy_percentage = Math.round(((digitalLiteracy/2000)*100) * 10)/10;
    digitalPhotography_percentage = Math.round(((digitalPhotography/170)*100) * 10)/10;
    entrepreneurship_percentage = Math.round(((entrepreneurship/200)*100) * 10)/10;
    it_skills_percentage = (it_skills/370)*100;
    handloomWorkshop_percentage =  Math.round(((handloomWorkshop/700)*100) * 10)/10;

    let total = (cad_cam + digitalLiteracy + digitalPhotography + entrepreneurship + it_skills + handloomWorkshop);
    total_percentage = Math.round(((total/3620)*100) * 10)/10;
    console.log(total_percentage)
    this.setState({
      digitalLiteracy_percentage: digitalLiteracy_percentage,
      cad_cam_percentage: cad_cam_percentage,
      total_percentage: total_percentage,
      handloomWorkshop_percentage: handloomWorkshop_percentage,
      digitalPhotography_percentage: digitalPhotography_percentage,
      entrepreneurship_percentage: entrepreneurship_percentage
    })
  }
  getDistricData = () => {
    fetch(`https://nielitdihh.in/admin/api/training_districtWise.php`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let districtData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        console.log("District Data ==> ", responseJson);
        let responseArray = [];
        responseArray = responseJson;

        let chumoukedima = responseArray.findIndex(element => element.District.includes("Chumoukedima"));
        if(chumoukedima != -1){
          districtData[0] = districtData[0] + Number(responseArray[chumoukedima].Total)/100
        }

        let dimapur = responseArray.findIndex(element => element.District.includes("Dimapur"));
        if(dimapur != -1){
          districtData[1] = districtData[1] + Number(responseArray[dimapur].Total)/100
        }

        let kiphire = responseArray.findIndex(element => element.District.includes("Kiphire"));
        if(kiphire != -1){
          districtData[2] = districtData[2] + Number(responseArray[kiphire].Total)/100
        }

        let kohima = responseArray.findIndex(element => element.District.includes("Kohima"));
        if(kohima != -1){
          districtData[3] = districtData[3] + Number(responseArray[kohima].Total)/100
        }

        let longleng = responseArray.findIndex(element => element.District.includes("Longleng"));
        if(longleng != -1){
          districtData[4] = districtData[4] + Number(responseArray[longleng].Total)/100
        }

        let mokokchung = responseArray.findIndex(element => element.District.includes("Mokokchung"));
        if(mokokchung != -1){
          districtData[5] = districtData[5] + Number(responseArray[mokokchung].Total)/100
        }

        let mon = responseArray.findIndex(element => element.District.includes("Mon"));
        if(mon != -1){
          districtData[6] = districtData[6] + Number(responseArray[mon].Total)/100
        }

        let niuland = responseArray.findIndex(element => element.District.includes("Niuland"));
        if(niuland != -1){
          districtData[7] = districtData[7] + Number(responseArray[niuland].Total)/100
        }

        let noklak = responseArray.findIndex(element => element.District.includes("Noklak"));
        if(noklak != -1){
          districtData[8] = districtData[8] + Number(responseArray[noklak].Total)/100
        }
        
        let peren = responseArray.findIndex(element => element.District.includes("Peren"));
        if(peren != -1){
          districtData[9] = districtData[9] + Number(responseArray[peren].Total)/100
        }

        let phek = responseArray.findIndex(element => element.District.includes("Phek"));
        if(phek != -1){
          districtData[10] = districtData[10] + Number(responseArray[phek].Total)/100
        }

        let shamator = responseArray.findIndex(element => element.District.includes("Shamator"));
        if(shamator != -1){
          districtData[11] = districtData[11] + Number(responseArray[shamator].Total)/100
        }

        let tuensang = responseArray.findIndex(element => element.District.includes("Tuensang"));
        if(tuensang != -1){
          districtData[12] = districtData[12] + Number(responseArray[tuensang].Total)/100
        }

        let tseminyu = responseArray.findIndex(element => element.District.includes("Tseminyu"));
        if(tseminyu != -1){
          districtData[13] = districtData[13] + Number(responseArray[tseminyu].Total)/100
        }

        let wokha = responseArray.findIndex(element => element.District.includes("Wokha"));
        if(wokha != -1){
          districtData[14] = districtData[14] + Number(responseArray[wokha].Total)/100
        }

        let zunheboto = responseArray.findIndex(element => element.District.includes("Zunheboto"));
        if(zunheboto != -1){
          districtData[15] = districtData[15] + Number(responseArray[zunheboto].Total)/100
        }
        this.setState({
          districtData: districtData
        })
        this.getWorkshopData()
      })
      .catch((error) => {
        console.error(error);
      });
      
  }
  getWorkshopData = () => {
    fetch(`https://nielitdihh.in/admin/api/workshop_districtWise.php`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let districtData = this.state.districtData;
        console.log("Workshop Data ==> ", responseJson);
        let responseArray = [];
        responseArray = responseJson;

        let chumoukedima = responseArray.findIndex(element => element.District.includes("Chumoukedima"));
        if(chumoukedima != -1){
          districtData[0] = districtData[0] + Number(responseArray[chumoukedima].Total)
        }

        let dimapur = responseArray.findIndex(element => element.District.includes("Dimapur"));
        if(dimapur != -1){
          districtData[1] = districtData[1] + Number(responseArray[dimapur].Total)
        }

        let kiphire = responseArray.findIndex(element => element.District.includes("Kiphire"));
        if(kiphire != -1){
          districtData[2] = districtData[2] + Number(responseArray[kiphire].Total)
        }

        let kohima = responseArray.findIndex(element => element.District.includes("Kohima"));
        if(kohima != -1){
          districtData[3] = districtData[3] + Number(responseArray[kohima].Total)
        }

        let longleng = responseArray.findIndex(element => element.District.includes("Longleng"));
        if(longleng != -1){
          districtData[4] = districtData[4] + Number(responseArray[longleng].Total)
        }

        let mokokchung = responseArray.findIndex(element => element.District.includes("Mokokchung"));
        if(mokokchung != -1){
          districtData[5] = districtData[5] + Number(responseArray[mokokchung].Total)
        }

        let mon = responseArray.findIndex(element => element.District.includes("Mon"));
        if(mon != -1){
          districtData[6] = districtData[6] + Number(responseArray[mon].Total)
        }

        let niuland = responseArray.findIndex(element => element.District.includes("Niuland"));
        if(niuland != -1){
          districtData[7] = districtData[7] + Number(responseArray[niuland].Total)
        }

        let noklak = responseArray.findIndex(element => element.District.includes("Noklak"));
        if(noklak != -1){
          districtData[8] = districtData[8] + Number(responseArray[noklak].Total)
        }
        
        let peren = responseArray.findIndex(element => element.District.includes("Peren"));
        if(peren != -1){
          districtData[9] = districtData[9] + Number(responseArray[peren].Total)
        }

        let phek = responseArray.findIndex(element => element.District.includes("Phek"));
        if(phek != -1){
          districtData[10] = districtData[10] + Number(responseArray[phek].Total)
        }

        let shamator = responseArray.findIndex(element => element.District.includes("Shamator"));
        if(shamator != -1){
          districtData[11] = districtData[11] + Number(responseArray[shamator].Total)
        }

        let tuensang = responseArray.findIndex(element => element.District.includes("Tuensang"));
        if(tuensang != -1){
          districtData[12] = districtData[12] + Number(responseArray[tuensang].Total)
        }

        let tseminyu = responseArray.findIndex(element => element.District.includes("Tseminyu"));
        if(tseminyu != -1){
          districtData[13] = districtData[13] + Number(responseArray[tseminyu].Total)
        }

        let wokha = responseArray.findIndex(element => element.District.includes("Wokha"));
        if(wokha != -1){
          districtData[14] = districtData[14] + Number(responseArray[wokha].Total)
        }

        let zunheboto = responseArray.findIndex(element => element.District.includes("Zunheboto"));
        if(zunheboto != -1){
          districtData[15] = districtData[15] + Number(responseArray[zunheboto].Total)
        }
        this.setState({
          districtData: districtData
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }
  getTimelineData = () => {
    fetch(`https://nielitdihh.in/admin/api/get_year_month_wise_artisans.php?year=2022`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let timelineData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        console.log("Timeline Data ==> ", responseJson);
        let responseArray = [];
        responseArray = responseJson;

        let January = responseArray.findIndex(element => element.Month.includes("January"));
        if(January != -1){
          timelineData[0] = timelineData[0] + Number(responseArray[January].Total_Artisans)
        }

        let February = responseArray.findIndex(element => element.Month.includes("February"));
        if(February != -1){
          timelineData[1] = timelineData[1] + Number(responseArray[February].Total_Artisans)
        }

        let March = responseArray.findIndex(element => element.Month.includes("March"));
        if(March != -1){
          timelineData[2] = timelineData[2] + Number(responseArray[March].Total_Artisans)
        }

        let April = responseArray.findIndex(element => element.Month.includes("April"));
        if(April != -1){
          timelineData[3] = timelineData[3] + Number(responseArray[April].Total_Artisans)
        }

        let May = responseArray.findIndex(element => element.Month.includes("May"));
        if(May != -1){
          timelineData[4] = timelineData[4] + Number(responseArray[May].Total_Artisans)
        }

        let June = responseArray.findIndex(element => element.Month.includes("June"));
        if(June != -1){
          timelineData[5] = timelineData[5] + Number(responseArray[June].Total_Artisans)
        }

        let July = responseArray.findIndex(element => element.Month.includes("July"));
        if(July != -1){
          timelineData[6] = timelineData[6] + Number(responseArray[July].Total_Artisans)
        }

        let August = responseArray.findIndex(element => element.Month.includes("August"));
        if(August != -1){
          timelineData[7] = timelineData[7] + Number(responseArray[August].Total_Artisans)
        }

        let September = responseArray.findIndex(element => element.Month.includes("September"));
        if(September != -1){
          timelineData[8] = timelineData[8] + Number(responseArray[September].Total_Artisans)
        }
        
        let October = responseArray.findIndex(element => element.Month.includes("October"));
        if(October != -1){
          timelineData[9] = timelineData[9] + Number(responseArray[October].Total_Artisans)
        }

        let November = responseArray.findIndex(element => element.Month.includes("November"));
        if(November != -1){
          timelineData[10] = timelineData[10] + Number(responseArray[November].Total_Artisans)
        }

        let December = responseArray.findIndex(element => element.Month.includes("December"));
        if(December != -1){
          timelineData[11] = timelineData[11] + Number(responseArray[December].Total_Artisans)
        }
        this.setState({
          timelineData: timelineData
        })
      })
      .catch((error) => {
        console.error(error);
      });
      
  }
  render() {
    return (
      <div className="container-box">
        <div className="dashbaord_div_1">
        </div>
        <div className="dashbaord_div_2" id="reports">
          <Row>
            <Col md={6} xs={12} sm={12}>
              <div className="dashbaord_div_2_innerLeft">
                <div className="dashbaord_div_2_innerLeft_part">
                  <p className="dashboard_pie_txt">Gender Wise<br className="br_seperator"/> Distribution</p>
                  <p className="dashboard_pie_subtxt">This piechart highlights the distribution of loans applicants based on their gender.</p>
                </div>
                <div className="pie_1">
                  <Pie data={{
                    labels: ['Men', 'Women', 'Transgender'],
                    datasets: [
                      {
                        label: 'Candidates',
                        data: this.state.genderCount,
                        backgroundColor: [
                          'rgba(0,104,182,255)',
                          'rgba(236,0,140,255)',
                          'rgba(235,237,239,255)'
                        ],
                        borderColor: [
                          'rgba(255, 255, 255, 1)',
                          'rgba(255, 255, 255, 1)',
                          'rgba(255, 255, 255, 1)'
                        ],
                        borderWidth: 1,
                      },
                    ]
                  }} className="dashboard_pie" options={pieOptions}/>
                </div>
              </div>
            </Col>
            <Col md={6} xs={12} sm={12}>
              <div className="dashbaord_div_2_innerRight">
                <div className="dashbaord_div_2_innerLeft_part">
                  <p className="dashboard_pie_txt">Bank Wise<br className="br_seperator"/> Distribution</p>
                  <p className="dashboard_pie_subtxt">This piechart highlights the distribution of loans sanctioned accross the varous banks.</p>
                </div>
                <div className="pie_1">
                  <Pie
                    data={{
                      labels: ["BOB", "BOI", "Canara", "Indian Bank", "PNB", "SBI", "UCO Bank", "UBI", "Axis Bank", "Federal Bank", "HDFC Bank", "ICICI Bank", "IDFC First",  "IndusInd", "Kotak Mahindra", "Nagaland Rural Bank"],
                      datasets: [
                        {
                          label: 'Candidates',
                          data: [this.state.digitalLiteracy, this.state.digitalPhotography, this.state.cad_cam, this.state.it_skills, this.state.entrepreneurship, this.state.handloomWorkshop],
                          backgroundColor: [
                            'rgba(0,104,182,255)',
                            'rgba(163,103,220,255)',
                            'rgba(103,183,220,255)',
                            'rgba(44,186,196,255)',
                            'rgba(255,201,129,255)',
                            'rgba(236,0,140,255)',
                          ],
                          borderColor: [
                            'rgba(255, 255, 255, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(255, 255, 255, 1)',
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }} className="dashboard_pie" options={pieOptions}/>
                </div>
                
              </div>
            </Col>
          </Row>
        </div>
        <div className="dashbaord_div_3">
          <div className="dashbaord_div_3_inner">
            <span className="dashboard_pie_txt_left">Timeline</span>
            {
              this.state.yearSwitch === "2022" ?
                <span className="dashboard_2022_txt_first_active">2023</span>
              :
                <span className="dashboard_2022_txt_first" onClick={() => this.setState({yearSwitch: "2022"})}>2023</span>
            }
            {
              this.state.yearSwitch === "2023" ?
                <Chart type='bar' data={emptyData} options={{
                  responsive: true,
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: false,
                    },
                  },
                }}/>
              :
                <Line
                  data={{
                    labels,
                    datasets: [
                      {
                        type: 'line',
                        label: ' Amount sanctioned in Crores (₹)',
                        borderColor: 'rgba(13, 96, 160, 1)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        data: this.state.timelineData,
                      }
                    ],
                  }}
                  options={{
                    responsive: true
                  }}
                />
            }
          </div>
        </div>
        <div className="dashbaord_div_4">
          <div className="dashbaord_div_4_inner">
            <p className="dashboard_pie_txt">Bank Wise Distribution</p>
            <Bar
              options={options}
              data={{
                labels : ["BOB", "BOI", "Canara", "Indian Bank", "PNB", "SBI", "UCO Bank", "UBI", "Axis Bank", "Federal Bank", "HDFC Bank", "ICICI Bank", "IDFC First",  "IndusInd", "Kotak Mahindra", "Nagaland Rural Bank"],
                datasets: [
                  {
                    label: ' Loan amount sanctioned in Crores (₹)',
                    data: this.state.districtData,
                    borderColor: 'rgba(13, 96, 160, 1)',
                    backgroundColor: 'rgba(123,185,232,0.6)',
                    borderWidth: 2,
                  }
                ],
              }}
            />
          </div>
        </div>
        <Footer/>
      </div>
    )}
}
export default withRouter(about);