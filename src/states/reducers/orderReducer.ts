import ActionsConst from './../actionsConst';

export const orderReducer = (state=null, action) => {
    switch(action.type){

        case ActionsConst.UPDATE_NEW_ORDER_COUNT: {
            return Object.assign({}, state, {
                newOrdersCount: action.payload.newOrdersCount
            });
        }

        case ActionsConst.RETRIEVED_REMAINING_ORDERS: {
            return Object.assign({}, state, {
                remainingOrders: action.payload.remainingOrders
            });
        }

        case ActionsConst.UPDATE_REMAINING_ORDERS_STATUS: {
            let updatedRemainingOrders = state.remainingOrders.map(order => {
                if(order.order_id === action.payload.orderId){
                    order.status = action.payload.newOrderStatus
                };

                return order;
            });

            return Object.assign({}, state, {
                remainingOrders: updatedRemainingOrders
            });
        }


    }

    return state;
}


