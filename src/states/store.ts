import IAppState from './IAppState';

export const INITIAL_STATE: IAppState = {
	keyboardShown: false,
	showTab:false,
	currentKitchen: {
		accessToken: '',
		kitchenId: null,
		userId: null,
		firstName: ''
	},
	orderDetails:{
		newOrdersCount: 0,
		remainingOrders: []
	}
};


