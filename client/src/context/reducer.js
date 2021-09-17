const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload
            };
        case 'DELETE_USER':
            return {
                ...state,
                user: {}
            };
        case 'START_LOADING':
            return {
                ...state,
                loading: true 
            };
        case 'STOP_LOADING':
            return {
                ...state,
                loading: false
            }
        default:
            return state;
    }
};

export default Reducer;