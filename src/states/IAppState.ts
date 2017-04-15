interface IAppState{

    currentKitchen?: {
        kitchenId: number,
        accessToken: string,
        userId: number,
        firstName: string
    };

    keyboardShown:boolean;
    showTab:boolean;

    orderDetails?:{
        newOrdersCount:number,
        remainingOrders: any[]
    };

}

export default IAppState;