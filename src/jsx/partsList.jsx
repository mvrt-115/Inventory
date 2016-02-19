import React from 'react';
import Firebase from 'firebase';

import {NavStore, NavItemStore, NavListStore} from 'navStore';
import NavActionCreator from 'navActionCreators';
import PartListStore from 'partListStore';

import NewPart from 'newPart';

import {Table, Input} from 'react-bootstrap';

module.exports = React.createClass({
    getInitialState: function(){
        return {
            parts: PartListStore.getPartList(),
            visible: PartListStore.getVisible()
        }
    },
    render: function(){
        if(this.state.visible)return(
            <div>
                <Table hover responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Parent</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.parts.map(function(part){
                            return (
                                <tr key={part.key} onClick={this.selectItem.bind(this, part.key)}>
                                    <td>{part.name}</td>
                                    <td>{part.desc}</td>
                                    <td>{part.id}</td>
                                    <td>{part.type}</td>
                                    <td>{part.qty}</td>
                                    <td>{part.parent||'None'}</td>
                                    <td>{part.status}</td>
                                </tr>
                            )
                        }.bind(this))}
                    </tbody>
                </Table>
                <NewPart/>
            </div>
        );
        else return(<div></div>);
    },
    componentWillMount: function(){
        PartListStore.addChangeListener(this.updateState);
        this.testFlux();
    },
    componentWillUnmount: function(){
        PartListStore.removeChangeListener(this.updateState);
    },
    updateState: function(){
        this.setState({parts:PartListStore.getPartList(), visible:PartListStore.getVisible()});
    },
    testFlux: function(){
        NavActionCreator.setCurrentItem('');
    },
    selectItem: function(item){
        NavActionCreator.setCurrentItem(item);
    }
});
