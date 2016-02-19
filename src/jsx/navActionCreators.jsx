import AppDispatcher from 'appDispatcher';
import {ActionTypes} from 'appConstants';

module.exports = {

    setCurrentItem: function(item){
        AppDispatcher.dispatch({
            type: ActionTypes.NAV_SET_ITEM,
            item: item
        })
    }

}
