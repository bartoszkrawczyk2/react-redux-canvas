const defaultState = () => ({
    circleRadius: 40,
    circles: [
        {
            color: '#DA4167',
            enabled: false,
            x: 200,
            y: 200
        }, {
            color: '#F4D35E',
            enabled: false,
            x: 200,
            y: 200
        }, {
            color: '#F78764',
            enabled: false,
            x: 200,
            y: 200
        }
    ]
});

export default (state = defaultState(), action) => {
    switch (action.type) {
        case 'TOGGLE_CIRCLE': {
            let circles = [...state.circles];
            circles[action.circleIndex].enabled = !circles[action.circleIndex].enabled;
            
            return Object.assign({}, state, {
                circles
            });
        }

        case 'MOVE_CIRCLE': {
            let circles = [...state.circles];
            circles[action.circleIndex].x = action.x;
            circles[action.circleIndex].y = action.y;

            return Object.assign({}, state, {
                circles
            });
        }

        default:
            return state;
    }
}