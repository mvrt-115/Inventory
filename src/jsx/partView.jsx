import React from 'react';
import {Button} from 'react-bootstrap';

import PartViewStore from 'partViewStore';
import {NavStore} from 'navStore';
import EditQty from 'editQty';
import RemovePart from 'removePart'

module.exports = React.createClass({
    getInitialState: function() {
        return {
            data: PartViewStore.getPartData(),
            key: NavStore.getCurrentItem(),
            visible: PartViewStore.getVisible(),
            removeKey: NavStore.getCurrentItem()
        };
    },
    componentWillMount: function() {
        PartViewStore.addChangeListener(this.updateState);
    },
    componentWillUnmount: function(){
        PartViewStore.removeChangeListener(this.updateState);
    },
    render: function(){
        if(this.state.visible)return(
            <div id='part-view' style={{padding:'20px'}}>
                <h3>{this.state.data.name}&nbsp;<small>{this.state.data.id}</small></h3>
                <h4>{this.state.data.desc}&nbsp;<small>{this.state.data.type}</small></h4>
                <h5><small>Status</small>&nbsp;{this.state.data.status}</h5>
                <h5><small>Quantity</small>&nbsp;{this.state.data.qty}</h5>
                <h5><small>Parent</small>&nbsp;{this.state.data.parent}</h5>
                <EditQty id={this.state.key} qty={this.state.data.qty}/>
                <RemovePart id={this.state.removeKey}/>
            </div>
        );
        else return(<div></div>);
    },
    updateState: function(){
        this.setState({key: NavStore.getCurrentItem(), data:PartViewStore.getPartData(), visible: PartViewStore.getVisible()});
    }
});
