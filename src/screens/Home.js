import React from 'react';
import Plan from '../components/Plan';
import axios from "axios";
import Loader from 'react-loader-spinner'
import '../styles/plans.scss';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

// const BASE_URL = "http://localhost:8080/";
const BASE_URL = 'https://ppnode.dotslash227.now.sh/';

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userId: '',
            loading: true,
            pricingPlanId: '',
            allowedPlans: '',
            plans: [],
            newPlanName: '',
            newPlanPrice: '',
            newPlanFeatures: [],
            userPlans: []
        }
        this.setPricingPlan = this.setPricingPlan.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.randomFunction = this.randomFunction.bind(this);
    }        

    setPricingPlan(planName){
        console.log(this.state);
        this.setState({pricingPlanId:planName});        
    }


    async componentWillMount(){
        console.log("component mounted");
        await window.Gofer.getContext()
        .then((response)=>{
            let pricingPlan = '';
            if (response.pricingPlan == "NOT SET") pricingPlan="";
            else pricingPlan = response.pricingPlan
            this.setState({pricingPlanId:pricingPlan, allowedPlans:3, userId: response.user.id});
            this.getUserCreatedPlans();
            axios({
                method: 'get',
                url: BASE_URL
                // url: 'http://localhost:8080'          
            }).then((response)=>{                  
                this.setState({plans:response.data.data});                
            }).catch((error)=>{
                console.log(error);
            })    
        })
        .catch((error)=>{
            console.log("getContext issues");
        })
        this.setState({loading:false});
    }    


    handleChange(event, field){        
        switch(field){
            case 'name':{
                this.setState({newPlanName:event.target.value});
                break;
            }
            case 'price':{
                this.setState({newPlanPrice:event.target.value});
                break;
            }
            case 'description':{
                this.setState({newPlanFeatures:event.target.value});
                break;
            }
            default:{
                console.log("hola");
            }
        }
    }

    getUserCreatedPlans(){
        axios({
            method: 'get',
            url: BASE_URL + "userCreatedPlans?userId=" + this.state.userId,
        })
        .then((response)=>{
            this.setState({userPlans:response.data.data});
        })
        .catch((error)=>console.log(error));            
    }

    handleSubmit(event){
        event.preventDefault();           
        axios({
            method: 'post',
            url: BASE_URL + "newUserPlan",
            data:{
                "name":this.state.newPlanName, 
                "price":this.state.newPlanPrice, 
                "description":this.state.newPlanFeatures, 
                "userId":this.state.userId
            }
        })
        .then((response)=>{    
            this.getUserCreatedPlans();        
        })
        .catch((error)=>console.log(error));        
    }

    randomFunction(e){
        alert("pressed");
        e.preventDefault();
    }

    // Render Functions Here

    renderPricingPlans(){
        console.log("Rendering plans");
        return(            
            <div className="prices">                
                <div className="pricing-table">                        
                    {this.state.plans.map((item,key)=>{                                                
                        return <Plan planData={item} key={key} addPlan={this.setPricingPlan} />
                    })}                    
                </div>
            </div>
        )
    }


    renderPlanForm(){
        return(
            <div>
                <h3>Add a new plan</h3>
                <form onSubmit={this.randomFunction}>
                    <div className="form-group">
                        <label for="planName">Enter Name of Plan</label>
                        <input type="text" className="form-control" name="plan-name" onChange={(e)=>this.handleChange(e,"name")} /><br />
                        <small className="form-text text-muted">It is a compulsory field</small>
                    </div>
                    <div className="form-group">
                        <label for="planName">Enter Price of the Plan</label>
                        <input type="number" className="form-control" name="plan-name" onChange={(e)=>this.handleChange(e,"price")} /><br />
                        <small className="form-text text-muted">Only numbers are accepted as input.</small>
                    </div>                    
                    <div className="form-group">
                        <label for="planName">Enter description of the plan</label>
                        <textarea onChange={(e)=>this.handleChange(e,"description")} className="form-control" rows="3" />
                        <small className="form-text text-muted">Can Contain HTML.</small>
                    </div>                    
                    <input type="submit" className="btn btn-primary" value="Add New Plan" onClick={this.handleSubmit} />
                </form>                
                <hr />
                <h5>Plans Already Created By You</h5>
                <hr />
                <div className="row">                    
                    {this.state.userPlans.map((item,key)=>{
                        return(
                            <div className="col-4">
                                <Plan planData={item} key={key} noBuyButton />
                            </div>
                        )                        
                    })}
                </div>                
            </div>
        )
    }

    render(){
        if(this.state.loading){
            return (
                <Loader 
                    type="Puff"
                    color="#00BFFF"
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                    style={{marginLeft:"50%"}}
                />
            )
        }
        return(            
            <div className="center">
                <h1 className="center">Pricing Plans Demo</h1>
                {(!this.state.pricingPlanId) ? this.renderPricingPlans() : this.renderPlanForm()}
            </div>            
        )
    }
}

export default Home;