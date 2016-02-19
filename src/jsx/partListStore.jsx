import {EventEmitter} from 'events';
import assign from 'object-assign';
import Firebase from 'firebase';

var firebase = new Firebase('https://mvrt-engdoc.firebaseio.com/parts');

import AppDispatcher from 'appDispatcher';
import {ActionTypes} from 'appConstants';
import {NavStore, NavItemStore} from 'navStore';

var CHANGE_EVENT = 'change';

var _currentList = [];
var _visible = true;
var _currentQuery = firebase;

var PartListStore = assign({}, EventEmitter.prototype, {

    emitChange: function(){
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback){
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback){
        this.removeListener(CHANGE_EVENT, callback);
    },

    getPartList: function(){
        return _currentList;
    },

    getVisible: function(){
        return _visible;
    },

    _setCurrentItem: function(){
        _currentQuery.off();
        _currentList = [];
        var details = NavItemStore.getDetails();

         _visible = true;
        var context = NavStore.getCurrentItem();

        if(details.type === 'stock'){
            _visible = false;
            context = details.parent;
        }

        if(context){
            _currentQuery = firebase.orderByChild('parent').equalTo(context);
        }else{
            _currentQuery = firebase;
        }

        _currentQuery.on('child_added', function(snap){
            var data = snap.val();
            if(!data)return;
            data.key = snap.key();
            this._addPart(data);
        }.bind(this));

        this.emitChange();
    },

    _addPart: function(part){
        _currentList.push(part);
        this.emitChange();
    }

});

NavItemStore.addChangeListener(PartListStore._setCurrentItem.bind(PartListStore));

module.exports = PartListStore;
