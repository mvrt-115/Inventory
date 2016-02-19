import {EventEmitter} from 'events';
import assign from 'object-assign';
import {ActionTypes} from 'appConstants';
import Firebase from 'firebase';

var firebase = new Firebase('https://mvrt-engdoc.firebaseio.com/parts');

import AppDispatcher from 'appDispatcher';

var CHANGE_EVENT = 'change';

var _currentItem: '';

var NavStore = assign({}, EventEmitter.prototype, {

    emitChange: function(){
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback){
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback){
        this.removeListener(CHANGE_EVENT, callback);
    },

    getCurrentItem: function(){
        return _currentItem;
    },

    _setCurrentItem: function(item){
        _currentItem = item;
        this.emitChange();
    }

});

const _defaultList = [{key: '', name: 'Home'}];

var _currentList = _defaultList.slice();

var NavListStore = assign({}, EventEmitter.prototype, {

    emitChange: function(){
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback){
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback){
        this.removeListener(CHANGE_EVENT, callback);
    },

    getNavList: function(){
        return _currentList;
    },

    _loadNavList: function(){
        _currentList = _defaultList.slice();
        this.addRecursive(_currentItem);
    },

    addRecursive: function(item){
        if(item && _currentList.indexOf(item) < 0){ //prevents cyclical relationships from breaking the system
            // _currentList.splice(1, 0, item);
            firebase.child(item).once('value', function(item, snap){
                if(snap.val()){
                    _currentList.splice(1, 0, {key: item, name: snap.val().name});
                    this.addRecursive(snap.val().parent);
                }
                else {
                    _currentList.splice(1, 0, {key: item, name: item});
                    this.addRecursive('');
                }
            }.bind(this, item));
        }else{
            this.emitChange();
        }
    }

});

var _currentParent = '';
var _currentType = '';

var NavItemStore = assign({}, EventEmitter.prototype, {

    emitChange: function(){
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback){
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback){
        this.removeListener(CHANGE_EVENT, callback);
    },

    _loadDetails: function(){
        if(_currentItem){
            firebase.child(_currentItem).once('value', function(snap){
                if(snap.val()){
                    _currentParent = snap.val().parent;
                    _currentType = snap.val().type;
                }else{
                    _currentParent = '';
                    _currentType = 'location';
                }
                this.emitChange();
            }.bind(this));
        }else{
            _currentParent = '';
            _currentItem = '';
            _currentType = 'location';
            this.emitChange();
        }
    },

    getDetails: function(){
        return {
            parent: _currentParent,
            type: _currentType
        }
    }

});

NavStore.addChangeListener(NavListStore._loadNavList.bind(NavListStore));
NavStore.addChangeListener(NavItemStore._loadDetails.bind(NavItemStore));

NavStore.dispatchToken = AppDispatcher.register(function(action){
    switch(action.type){
        case ActionTypes.NAV_SET_ITEM:
            console.log('set item to "' + action.item + '"');
            NavStore._setCurrentItem(action.item);
            break;
    }
});

module.exports = {
    NavStore: NavStore,
    NavListStore: NavListStore,
    NavItemStore: NavItemStore
}
