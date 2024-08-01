import { addChat } from '../chatSlice/index';

export const handleNewChatThunk = () => (dispatch, getState) => {
  const stateBefore = getState();
  
  dispatch(addChat()); // Gọi action để thêm chat
  
  const stateAfter = getState();
  const newChat = stateAfter.chat.data.find(chat => !stateBefore.chat.data.some(existingChat => existingChat.id === chat.id));
  if (newChat) {
    return newChat.id; // Trả về ID của chat mới
  }
};