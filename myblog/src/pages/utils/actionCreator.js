export const actionCreator = (type, ...argNames) => {
    return (...args) => {
        let action = { type }
        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index]
        })
        return action
    }
}

export const actionDispatch = (type, ...argNames) => {
    return (dispatch, ...args) => {
        let action = {type}
        argNames.forEach((arg, index) => {
            let name = argNames[index]
            action[name] = args[index]
        })
        dispatch(action)
    }
}