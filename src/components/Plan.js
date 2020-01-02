import React from 'react';
import '../styles/plans.scss'

class Plan extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
        // this.addPlanToUser = this.addPlanToUser.bind(this);        
    }

    addPlanToUser(planName){        
        console.log("adding plan to user", planName)
    }

    render(){
        const {name, features, price ,id} = this.props.planData;        
        return(
            <div className="pricing-item">
                <div className="pricing-title">                
                {name}
                </div>
                <div className="pricing-value">${price}                
                </div>
                <ul className="pricing-features">                                 
                    {features.map((item, key)=>{                        
                        return <li key={key}>{item}</li>;
                    })}                           
                </ul>
                <button className="button" onClick={()=>this.props.addPlan(name)}>
                    Select This Plan
                </button>
            </div>
        )
    }
}

export default Plan;