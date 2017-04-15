import { INITIAL_STATE } from './../store';
import ActionsConst from './../actionsConst';


export const loginReducer = (state=null, action) => {
    switch(action.type){
        // NOTE: in combineReducer we set currentKitchen: accountReducer
        // So state returned here will go to currentKitchen directly
        case ActionsConst.LOGIN_SUCCESS : {
            return Object.assign({}, state, {
                accessToken: action.payload.accessToken,
                kitchenId: action.payload.kitchenId,
                userId : action.payload.userId,
                firstName: action.payload.firstName
            });
        }

        case ActionsConst.LOGOUT: {
            return INITIAL_STATE;
        }
        
    }

    return state;
}


