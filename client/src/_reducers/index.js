
import { combineReducers } from "redux";
// combineReducers: 어러개의 reducer를 하나로 합쳐주는 기능 -> rootReducer
import user from './user_reducer';

const rootReducer = combineReducers({
    user
});

export default rootReducer;