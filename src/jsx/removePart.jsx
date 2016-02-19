import React from 'react';
import Firebase from 'firebase';

var firebase = new Firebase('https://mvrt-engdoc.firebaseio.com/parts');

import {NavStore, NavItemStore} from 'navStore';

import {Input, Modal, Button} from 'react-bootstrap';

module.exports = React.createClass({
    getInitialState: function(){
        return {
            showModal: false
        }
    },
    render: function(){
        return(
            <div>
                <Button bsStyle="primary" onClick={this.showModal}>Remove Part</Button>
                <Modal show={this.state.showModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Remove Parts</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button ref="remove_part" label="Remove" defaultValue={this.props.id} onChange={this.handleChange}/>
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
        firebase.child("parts").child(this.props.id).remove();
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
