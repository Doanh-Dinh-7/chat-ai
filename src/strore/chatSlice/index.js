import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import { marked } from "marked";
import DOMPurify from 'dompurify';

const initData = {
    data: [],
}

/*

data: [
    {
        id: 1,
        title: 'Gì gì đó', // AI sẽ render 
        messages:[
            {id: 1, text: 'react là gì', isBot: false},
            {id: 2, text: 'react là lib của js', isBot: true},
        ]
    }
]

*/

const ChatSlice = createSlice({
    name: 'chat', // tên thuộc tính
    initialState: initData,
    reducers: {
        addChat: (state) => {
            state.data.push({
                id: uuidv4(),
                title: 'Chat', // AI sẽ render 
                messages:[]
            })
        },

        addMessage: (state, action) => {
            const { idChat, userMess, botMess } = action.payload;
            const chat = state.data.find((chat) => chat.id === idChat);
            if (chat) {
                const messageFormat = marked.parse(botMess); // chuyển massage thành HTML
                const safeChat = DOMPurify.sanitize(messageFormat); // Lọc mã độc HTML (tránh bị hack)
                const newMessage = [
                    ...chat.messages,
                    {id: uuidv4(), text: userMess, isBot: false},
                    {id: uuidv4(), text: safeChat, isBot: true},
                ]
                
                chat.messages = newMessage;
                state.data = [...state.data]
            }
        },

        removeChat: (state, action) =>{
            state.data = state.data.filter((chat) => chat.id !== action.payload)
        },

        setNameChat: (state, action) =>{
            const {newTitle, chatId} = action.payload;
            const chat = state.data.find((chat) => chat.id === chatId);
            if(chat){
                chat.title = newTitle;
            }
        }
        

    }
        
});

export const { addChat, addMessage, removeChat, setNameChat } = ChatSlice.actions;

export default ChatSlice.reducer;