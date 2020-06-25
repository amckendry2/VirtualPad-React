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
        touchX += (touchX - .5) * (this.props.dividerSlope - 1);
        const touchedA = (touchX + (1-touchY)) > 1;
        
        if(touchedA){
            this.props.pressA();
        } else {
            this.props.pressB();
        }
    }

    render() {

        const buttonClass = [classes.ButtonsDiv]
        if(this.props.aPressed){
            buttonClass.push(classes.ATouched);
        }

        if(this.props.bPressed){
            buttonClass.push(classes.BTouched);
        }

        return (
            <div 
                onClick={e => e.preventDefault()}
                className={buttonClass.join(' ')}
                onTouchEnd={this.props.releaseButton}
                onTouchStart={(e) => {this.onTouchStart(e)}}/>
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