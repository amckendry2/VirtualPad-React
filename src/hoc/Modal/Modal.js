import React from 'react';
import classes from './Modal.module.css';

const modal = props => {
    
    const modalClass = [classes.Modal, props.show ? classes.Show : classes.Hide];

    return (
        <div className = {modalClass.join(' ')}>
            {props.children}
        </div>
    )
}

export default modal;