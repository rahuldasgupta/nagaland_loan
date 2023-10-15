import React from "react";
import { withRouter } from "react-router-dom";
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import {
  BsCreditCard
} from "react-icons/bs";
import { VscHome, VscAccount } from "react-icons/vsc";
import { TfiWrite } from "react-icons/tfi";

class Tabs extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          switchView: true,
          value: this.props.value
        };
    }
    navigateHome = () => {
        this.props.history.push("/");
    }
    navigateExamination = () => {
        this.props.history.push("/examination");
    }
    navigateProfile = () => {
        this.props.history.push("/profile");
    }
    navigatePaymentHistory = () => {
        this.props.history.push("/payment-history");
    }
    switchTab = (val) => {
        console.log(val)
        if(val==0){
            this.navigateHome()
        }
        else if(val==1){
            this.navigateExamination()
        }
        else if(val==2){
            this.navigatePaymentHistory()
        }
        else if(val==3){
            this.navigateProfile()
        }
        else{}
        this.setState({
            value: val
        })
    }
    render(){
        return (
            <Box sx={{ pb: 5 }}>
                <Paper sx={{ position: 'fixed', bottom: -1, left: 0, right: 0, paddingLeft: 1, paddingRight: 1, paddingTop: 0.6, paddingBottom: 0.6, borderTopLeftRadius: 15, borderTopRightRadius: 15 }} elevation={6}>
                    <BottomNavigation
                        value={this.state.value}
                        onChange={(event, newValue) => this.switchTab(newValue)}
                    >
                        <BottomNavigationAction
                            style={{
                                color: this.state.value === 0 ? "white" : "#0783de",
                                fontSize: this.state.value === 0 ? 0 : 17,
                                backgroundColor: this.state.value === 0 ? "#0783de" : "white",
                                borderRadius: 10
                            }}
                            label={this.state.value === 0 ? "Home" : null}
                            icon={<VscHome size={this.state.value == 0 ? 25 : 28} className="nav-icons"
                            style={{
                                color: this.state.value === 0 ? "white" : "#0783de",
                                marginTop: this.state.value === 0 ? "0px" : "-10px"
                            }}/>}
                        />
                        <BottomNavigationAction
                            style={{
                                color: this.state.value === 1 ? "white" : "#0783de",
                                fontSize: this.state.value === 1 ? 0 : 17,
                                backgroundColor: this.state.value === 1 ? "#0783de" : "white",
                                borderRadius: 10
                            }}
                            label={this.state.value === 1 ? "Exams" : null}
                            icon={<TfiWrite size={this.state.value === 1 ? 22 : 23} className="nav-icons"
                            style={{
                                color: this.state.value === 1 ? "white" : "#0783de",
                                marginTop: this.state.value === 1 ? "" : "-10px"
                            }}/>}
                        />
                        <BottomNavigationAction
                            style={{
                                color: this.state.value === 2 ? "white" : "#0783de",
                                fontSize: this.state.value === 2 ? 0 : 17,
                                backgroundColor: this.state.value === 2 ? "#0783de" : "white",
                                borderRadius: 10
                            }}
                            label={this.state.value === 2 ? "Payments" : null}
                            icon={<BsCreditCard size={this.state.value === 2 ? 25 : 23} className="nav-icons"
                            style={{
                                color: this.state.value === 2 ? "white" : "#0783de",
                                marginTop: this.state.value === 2 ? "" : "-10px"
                            }}/>}
                        />
                         <BottomNavigationAction
                            style={{
                                color: this.state.value === 3 ? "white" : "#0783de",
                                fontSize: this.state.value === 3 ? 19 : 20,
                                backgroundColor: this.state.value === 3 ? "#0783de" : "white",
                                borderRadius: 10
                            }}
                            label={this.state.value === 3 ? "Profile" : null}
                            icon={<VscAccount size={this.state.value === 3 ? 25 : 23} className="nav-icons"
                            style={{
                                color: this.state.value === 3 ? "white" : "#0783de",
                                marginTop: this.state.value === 3 ? "" : "-10px"
                            }}/>}
                        />
                    </BottomNavigation>
                </Paper>
            </Box>
        );
    }
}
export default withRouter(Tabs);