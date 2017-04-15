import ActionsConst from './../actionsConst';

export const tabReducer = (state = null, action) => {
    switch (action.type) {

        case ActionsConst.SHOW_TAB: {
            return true;
        }

        case ActionsConst.HIDE_TAB: {
            return false;
        }

    }

    return state;
}


