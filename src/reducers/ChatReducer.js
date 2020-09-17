const initialState = {
    chats:[],
    contacts:[],
    chatAtivo:'',
    activeChatTitle:'',
    activeChatMessage:[]
};

const ChatReducer = (state = initialState, action) => {

    if (action.type == 'setContactList') {
        return { ...state, contacts: action.payload.users }
    }

    if (action.type == 'setChatList') {
        return { ...state, chats: action.payload.chats }
    }

    if (action.type == 'setActiveChat') {
        return { ...state, chatAtivo: action.payload.chatId, activeChatTitle: action.payload.chatTitleName }
    }

    if (action.type == 'setActiveChatMessage') {
        return { ...state, activeChatMessage: action.payload.msgs }
    }


    return state;

};

export default ChatReducer;