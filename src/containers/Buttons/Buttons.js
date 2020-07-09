import React, {Component} from 'react';
import { connect } from 'react-redux';

import classes from './Buttons.module.css';
import * as actionCreators from '../../store/actions/inputData';

class Buttons extends Component{
    

    onTouchStart = (e) => {
        const touch = e.targetTouches[0];
        const div = touch.target;
        const touchOffsetX = window.innerWidth - div.offsetWidth;
        const touchOffsetY = window.innerHeight - div.offsetHeight;
        let touchX = (touch.clientX - touchOffsetX) / div.offsetWidth;
        let touchY = (touch.clientY - touchOffsetY) / div.offsetHeight;
        touchX += (touchX - .5);
        const touchedA = (touchX + (1-touchY)) > 1;
        
        if(touchedA){
            this.props.pressA();
        } else {
            this.props.pressB();
        }
    }

    render() {
        const AColor = this.props.aPressed ? classes.ATouched : classes.ADefault;
        const BColor = this.props.bPressed ? classes.BTouched : classes.BDefault;
        const AButtonClass = [classes.AButton, AColor]
        const BButtonClass = [classes.BButton, BColor]
   

        return (
            <React.Fragment>
                <div 
                    onClick={e => e.preventDefault()}
                    className={classes.ButtonsDiv}
                    onTouchEnd={this.props.releaseButton}
                    onTouchStart={(e) => {this.onTouchStart(e)}}>                   
                    
                    <div className={AButtonClass.join(' ')}/>
                    <div className={BButtonClass.join(' ')}/>
                    
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => (
    {
        aPressed: state.aPressed,
        bPressed: state.bPressed
    }
)

const mapDispatchToProps = dispatch => (
    {
        pressA: () => dispatch(actionCreators.aDown()),
        pressB: () => dispatch(actionCreators.bDown()),
        releaseButton: () => dispatch(actionCreators.buttonRelease())
    }
)

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);