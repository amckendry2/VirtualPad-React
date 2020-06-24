import React, {Component} from 'react';
import Stick from './Stick/Stick';
import classes from './WonderPad.module.css';

class WonderPad extends Component{

    state = {
        touched: false
    }

    handleStickMove = (evt, data) => {
        console.log(data);
    }

    handleStickRelease = (evt, data) => {
        console.log('released');
    }

    onTouchStart = (e) => {
        this.setState((prevState) => {
            return {
                touched: !prevState.touched
            }
        })
    }

    render(){

        const buttonClass = [classes.PadRight]
        if(this.state.touched){
            buttonClass.push(classes.PadTouched);
        }

        return (
            <React.Fragment>
                <Stick 
                    onMove={this.handleStickMove}
                    onRelease={this.handleStickRelease}/>
                <div 
                    className={buttonClass.join(' ')}
                    onTouchStart={this.onTouchStart}/>
            </React.Fragment>
        )
    }
}

export default WonderPad;