export const toggleCircle = circleIndex => ({
    type: 'TOGGLE_CIRCLE',
    circleIndex
});

export const moveCircle = (circleIndex, x, y) => ({
    type: 'MOVE_CIRCLE',
    circleIndex,
    x,
    y
});