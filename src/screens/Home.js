import React from 'react';
import Plan from '../components/Plan';
import axios from "axios";
import Loader from 'react-loader-spinner'
import '../styles/plans.scss';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const BASE_URL = "http://localhost:8080/";
// const BASE_URL = 'https://ppnode.dotslash227.now.sh/';

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
            <div style={{marginLeft:"auto", marginRight:"auto"}}>
                <h3>Add a new plan</h3>
                <form onSubmit={this.randomFunction}>
                    Name of Plan: <input type="text" name="plan-name" onChange={(e)=>this.handleChange(e,"name")} /><br />
                    Price of Plan : <input type="text" name="plan-price" onChange={(e)=>this.handleChange(e, "price")} /><br />
                    Plan Description <textarea onChange={(e)=>this.handleChange(e,"description")} />
                </form>
                <input type="submit" value="Add New Plan" onClick={this.handleSubmit} />
                <h5>User Created Plans</h5>
                {this.state.userPlans.map((item,key)=>{
                    return (
                        <span>   
                            <h3>Plane Name : {item.name}</h3>
                            <p>Plan Price : {item.price}</p>
                            <p>Plan Description : {item.description}</p>
                        </span>
                    )
                })}
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
            <div>
                <h1>Pricing Plans</h1>
                {(!this.state.pricingPlanId) ? this.renderPricingPlans() : this.renderPlanForm()}
            </div>            
        )
    }
}

export default Home;