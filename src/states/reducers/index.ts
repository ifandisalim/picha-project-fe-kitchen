import {combineReducers} from 'redux';
import {loginReducer} from './accountReducer';
import {keyboardReducer} from './keyboardReducer';
import {tabReducer} from './tabReducer';
import {orderReducer} from './orderReducer';
import IAppState from '../IAppState';


const allReducers = combineReducers<IAppState>({
    currentKitchen: loginReducer,
    keyboardShown: keyboardReducer,
    showTab: tabReducer,
    orderDetails: orderReducer
});

export default allReducers;