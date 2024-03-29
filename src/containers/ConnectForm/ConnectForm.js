import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './ConnectForm.module.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/Spinner/Spinner';

class ConnectForm extends Component {

    state = {
        inputValue: '',
        valid: false,
        touched: false,
    }

    checkValidity = (value) => {
        return /[A-Z0-9]{4,4}/.test(value);
    }

    inputChangedHandler = (event) => {
        
        const newVal = event.target.value.toUpperCase();
        const valid = this.checkValidity(newVal);

        this.setState({
            ...this.state,
            inputValue: newVal,
            valid: valid,
            touched: true
        })
    }

    buttonClickHandler = (event) => {
        event.preventDefault();
        this.props.requestValidation(this.state.inputValue);
    }

    render(){

        const inputClass = [classes.Input];
        if (this.state.touched) {
            inputClass.push(this.state.valid ? classes.Valid : classes.Invalid);
        }

        let error = null;
        if (this.props.error !== null){
            error = (<p>{this.props.error}</p>)
        }

        let connectForm = (
            <div>
                <input
                    type='text'
                    maxLength='4'
                    autoComplete='off'
                    className={inputClass.join(' ')}
                    value = {this.state.inputValue}
                    onChange={event => this.inputChangedHandler(event)}
                />
                <button
                    onClick={event => this.buttonClickHandler(event)}
                    className={classes.Button}
                    disabled={!this.state.valid}
                >CONNECT</button>
                {error}
            </div>
        );

        if (this.props.connecting) connectForm = <Spinner/>

        return connectForm;
    }
}

const mapStateToProps = state => ({
    connecting: state.connection.connecting,
    error: state.connection.error
})

const mapDispatchToProps = dispatch => ({
    requestValidation: gameCode => dispatch(actions.requestConnection(gameCode))
});


export default connect(mapStateToProps, mapDispatchToProps)(ConnectForm);