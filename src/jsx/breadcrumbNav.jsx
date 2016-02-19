import React from 'react';
import {Breadcrumb, BreadcrumbItem} from 'react-bootstrap';

import {NavListStore} from 'navStore';
import NavActionCreator from 'navActionCreators';

var BreadcrumbNav = React.createClass({
    getInitialState: function() {
        return {
            list: NavListStore.getNavList()
        };
    },
    componentWillMount: function() {
        NavListStore.addChangeListener(this.updateState);
    },
    render: function(){
        return(
            <Breadcrumb>
                {this.state.list.map(function(item, index, list){
                    return (
                        <BreadcrumbItem key={item.key} active={index==(list.length - 1)} onClick={NavActionCreator.setCurrentItem.bind(undefined, item.key)}>
                            {item.name}
                        </BreadcrumbItem>
                    );
                }, this)}
            </Breadcrumb>
        );
    },
    updateState: function(){
        this.setState({list: NavListStore.getNavList()});
    }
});

module.exports = BreadcrumbNav;
