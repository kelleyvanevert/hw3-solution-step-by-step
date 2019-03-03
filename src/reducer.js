const reducer = (state = [], action = {}) => {
  switch (action.type) {
  case 'ADD_MODEL': {
    console.log("add model!", state, action)
    return [ ...state, action.payload ]
  }
  default:
    return state
  }
}

export default reducer