const initialState = {
    loading: true,
    fileLoaded: false,
    fileLink: ''
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case 'APP_LOADED':
            return {
                ...state,
                loading: false
            };
        case 'IMAGE_LOADING':
            return {
                ...state,
                loading: true
            };
        case 'IMAGE_LOADED':
            return {
                ...state,
                loading: false,
                fileLoaded: true,
                fileLink: action.payload
            };
        default: 
            return {
                ...state
            }
    }
}

export default reducer