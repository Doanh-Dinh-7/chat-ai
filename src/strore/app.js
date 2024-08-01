import { configureStore } from "@reduxjs/toolkit";
import ChatReducer from "./chatSlice";
const store = configureStore({
    reducer: {
        chat: ChatReducer  // thuộc tính này phải giống với name trong file import
    },
});

export default store;