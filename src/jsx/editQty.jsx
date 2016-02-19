import React from 'react';
import Firebase from 'firebase';

var firebase = new Firebase('https://mvrt-engdoc.firebaseio.com/parts');

import {NavStore, NavItemStore} from 'navStore';

import {Input, Modal, Button} from 'react-bootstrap';

module.exports = React.createClass({
    getInitialState: function(){
        return {
            showModal: false,
            data_qty: -1
        }
    },
    render: function(){
        return(
            <div>
                <Button bsStyle="primary" onClick={this.showModal}>Edit Qty</Button>
                <Modal show={this.state.showModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Remove Part</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Input type="number" ref="data_qty" label="Quantity" defaultValue={this.props.qty} onChange={this.handleChange}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button disabled={this.buttonEnabled()} onClick={this.save}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    },
    componentWillMount: function(){
    },
    showModal: function(){
        this.setState({ showModal: true });
    },
    closeModal: function(){
        this.setState({ showModal: false });
    },
    handleChange: function(){
        this.setState({
            data_qty: this.refs.data_qty.getValue()
        })
    },
    validate: function(){
        return this.state.data_qty >= 0;
    },
    buttonEnabled: function(){
        return !this.validate();
    },
    save: function(){
        firebase.child(this.props.id).update({qty:this.refs.data_qty.getValue()});
        this.closeModal();
    }
});
