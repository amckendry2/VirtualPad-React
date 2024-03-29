import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from '../../hoc/Modal/Modal';
import WonderPad from '../../components/WonderPad/WonderPad';
import ConnectForm from '../ConnectForm/ConnectForm';

class Layout extends Component{
    
    render(){

        const showModal = !this.props.serverConnection;
        
        return (
            <React.Fragment>
                <Modal show={showModal}>
                    <ConnectForm/>
                </Modal>
                <WonderPad/>
           </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    serverConnection: state.connection.serverConnection,
    connecting: state.connection.connecting
});

export default connect(mapStateToProps)(Layout);
