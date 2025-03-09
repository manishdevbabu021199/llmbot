export class APIConstants{
    static END_POINT = 'http://127.0.0.1:8000/';
    static LOGIN = APIConstants.END_POINT + 'auth/login'
    static VALIDATE_TOKEN = APIConstants.END_POINT + 'auth/validate-token'
    static REFRESH_TOKEN = APIConstants.END_POINT + 'auth/refresh-token'
    static GET_USER_TASK = APIConstants.END_POINT + 'tasks/user'
    static ADD_TASK = APIConstants.END_POINT + 'tasks/add'
    static GET_ESCALTIONS = APIConstants.END_POINT + 'escalations'
    static GET_GROUPS = APIConstants.END_POINT + 'groups'
    static CHATS = APIConstants.END_POINT + 'chat'

}


