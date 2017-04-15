import ActionsConst from './../actionsConst';

export const keyboardReducer = (state = null, action) => {
    switch (action.type) {

        case ActionsConst.KEYBOARD_SHOWN: {
            return true;
        }

        case ActionsConst.KEYBOARD_HIDDEN: {
            return false;
        }

    }

    return state;
}


