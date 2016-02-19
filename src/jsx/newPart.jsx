import React from 'react';
import Firebase from 'firebase';

var firebase = new Firebase('https://mvrt-engdoc.firebaseio.com/parts');

import {NavStore, NavItemStore} from 'navStore';

import {Tabs, Tab, Input, Modal, Button} from 'react-bootstrap';

module.exports = React.createClass({
    getInitialState: function(){
        return {
            showModal: false,
            data_name: '',
            data_id: '',
            data_desc: '',
            data_type: 'stock',
            data_qty: 0,
            data_status: '',
            allow_location: false,
            allow_part: false,
            allow_class: true,
            allow_stock: false
        }
    },
    render: function(){
        var specialInfo = (this.state.data_type !== 'location' && this.state.data_type !== 'class')?
        (<div>
            <Input type="number" ref="data_qty" label="Quantity" value={this.state.data_qty} onChange={this.handleChange}/>
            <Input type="text" ref="data_status" label="Status" placeholder="CAD? Fabrication? Let us know!" value={this.state.data_status} onChange={this.handleChange}/>
        </div>):(<div></div>);

        return(
            <div>
                <Button bsStyle="primary" onClick={this.showModal}>New Part</Button>
                <Modal show={this.state.showModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Part</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tabs defaultActiveKey={this.state.data_type} activeKey={this.state.data_type} onSelect={this.tabSelected}>
                           <Tab eventKey="location" title="Location" disabled={!this.state.allow_location}></Tab>
                           <Tab eventKey="class" title="Class" disabled={!this.state.allow_class}></Tab>
                           <Tab eventKey="part" title="Part" disabled={!this.state.allow_part}></Tab>
                           <Tab eventKey="stock" title="Stock" disabled={!this.state.allow_stock}></Tab>
                         </Tabs>
                        <Input type="text" ref="data_name"label="Item Name" placeholder="Some Part/Assembly" value={this.state.data_name} onChange={this.handleChange}/>
                        <Input type="text" ref="data_id" label="Item ID" placeholder="ie. ABC-123" value={this.state.data_id} onChange={this.handleChange}/>
                        <Input type="text" ref="data_desc" label="Description" placeholder="Describe your item!" value={this.state.data_desc} onChange={this.handleChange}/>
                        {specialInfo}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button disabled={this.buttonEnabled()} onClick={this.createPart}>Create</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    },
    componentWillMount: function(){
        NavItemStore.addChangeListener(this.navChange);
        this.navChange();
    },
    componentWillUnmount: function(){
        NavItemStore.removeChangeListener(this.navChange);
    },
    navChange: function(){
        var details = NavItemStore.getDetails();
        if(details.type === 'location'){
            this.setState({ allow_part: true, allow_location: true, allow_stock: true, data_type: 'location' });
        }else if(details.type === 'part'){
            this.setState({ allow_part: true, allow_location: false, allow_stock: true, data_type: 'part'});
        }else if(details.type === 'class'){
            this.setState({ allow_part: true, allow_location: false, allow_stock: false, data_type: 'class'});
        }else this.setState({ allow_part: false, allow_location: false, allow_stock: false, data_type: 'stock' });
    },
    showModal: function(){
        this.setState({ showModal: true });
    },
    closeModal: function(){
        this.setState({ showModal: false });
    },
    tabSelected: function(key){
        console.log('selected: ' + key);
        this.setState({ data_type: key });
    },
    handleChange: function(){
        this.setState({
            data_name: this.refs.data_name.getValue(),
            data_id: this.refs.data_id.getValue(),
            data_desc: this.refs.data_desc.getValue(),
            data_qty: (!!this.refs.data_qty)?this.refs.data_qty.getValue():0,
            data_status: (!!this.refs.data_status)?this.refs.data_status.getValue():''
        })
    },
    validate: function(){
        return (this.state.data_name.length > 2
            && this.state.data_id.length > 2
            && this.state.data_desc.length > 2
            && this.state.data_qty >= 0);
    },
    buttonEnabled: function(){
        return !this.validate();
    },
    createPart: function(){
        var parent = NavStore.getCurrentItem();
        var data = {
            desc: this.state.data_desc,
            id: this.state.data_id,
            name: this.state.data_name,
            parent: parent,
            qty: this.state.data_qty,
            status: this.state.data_status,
            type: this.state.data_type
        };
        firebase.push(data, function(error){
            if(error){
                console.log("ERROR");
            }else{
                this.closeModal();
            }
        }.bind(this));
    }
});
