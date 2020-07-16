import React, { Component } from 'react';
import { connect } from 'react-redux';
import nipplejs from 'nipplejs';

import classes from './Stick.module.css';

import * as actionCreators from '../../store/actions/index';

class Stick extends Component {

    constructor(){
        super();
        this.stickDiv = React.createRef();
    }

    componentDidMount() {
        this.createJoystick();
        
    }

    createJoystick = () => {
        const options = {
            zone: this.stickDiv.current,
            color: 'black',
            mode: 'static',
            position: {
                top: '50%',
                left: '50%'
            }
        };

        this.joystick = nipplejs.create(options);
        this.joystick.on('move', (evt, data) => this.onMove(data));
        this.joystick.on('end', (evt, data) => this.props.onRelease(data));
    }

    onMove = (data) => {
        const dir = data.angle.degree;
        const mag = data.force;
        this.props.onMove(dir, mag);
    };


    render(){
        return (
            <div ref={this.stickDiv} className={classes.stickDiv}/>
        )
    }
}

const mapDispatchToProps = dispatch => (
    {
        onMove: (dir, mag) => dispatch(actionCreators.stickMove(dir, mag)),
        onRelease: () => dispatch(actionCreators.stickRelease()) 
    }
)

export default connect(null, mapDispatchToProps)(Stick);