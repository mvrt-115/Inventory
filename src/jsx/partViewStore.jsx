import {EventEmitter} from 'events';
import assign from 'object-assign';
import Firebase from 'firebase';

var firebase = new Firebase('https://mvrt-engdoc.firebaseio.com/parts');

import AppDispatcher from 'appDispatcher';
import {ActionTypes} from 'appConstants';
import {NavStore, NavItemStore} from 'navStore';

var CHANGE_EVENT = 'change';

var _partData = {};
var _visible = false;
var _currentQuery = null;

var PartViewStore = assign({}, EventEmitter.prototype, {

    emitChange: function(){
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback){
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback){
        this.removeListener(CHANGE_EVENT, callback);
    },

    getPartData: function(){
        return _partData;
    },

    getVisible: function(){
        return _visible;
    },

    _setCurrentItem: function(){
        if(_currentQuery)_currentQuery.off();
        _partData = {};

        var details = NavItemStore.getDetails();

        if(!details.type || details.type === 'location'){
            _visible = false;
            this.emitChange();
            return;
        }else _visible = true;

        console.log('visible:' + _visible);

        var part = NavStore.getCurrentItem();

        _currentQuery = firebase.child(part);
        _currentQuery.on('value', function(snap){
            var data = snap.val();
            data.key = snap.key();
            _partData = data;
            this.emitChange();
            //TODO: add error checking
        }.bind(this));

        this.emitChange();
    },
});

NavItemStore.addChangeListener(PartViewStore._setCurrentItem.bind(PartViewStore));

module.exports = PartViewStore;
