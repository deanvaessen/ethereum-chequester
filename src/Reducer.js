import { appReducer, defaultAppState, appState } from "./components/App/Reducer";
import { Action } from "redux";

import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

export function defaultState() {
    return {
        app : defaultAppState()
    };
}

export function createRootReducer( history ) {
    return combineReducers( {
        router : connectRouter( history ),
        app : appReducer
    } );
}
