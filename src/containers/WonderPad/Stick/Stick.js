import React, { Component } from 'react';
import nipplejs from 'nipplejs';

import classes from './Stick.module.css';
import PropTypes from 'prop-types';

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
        this.joystick.on('move', (evt, data) => this.props.onMove(evt, data));
        this.joystick.on('end', (evt, data) => this.props.onRelease(evt, data));
    }

    render(){
        return (
            <div ref={this.stickDiv} className={classes.stickDiv}/>
        )
    }
}

export default Stick;