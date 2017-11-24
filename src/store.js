export const createStore = function createStoreFn (reducer) {
  let state
  const subscribers = []
  const store = {
    dispatch: action => {
      state = reducer(state, action)
      console.log(state, action)
      subscribers.forEach(handler => handler())
    },
    getState: () => state,
    subscribe: handler => {
      subscribers.push(handler)
      return () => {
        const index = subscribers.indexOf(handler)
        if (index > 0) {
          subscribers.splice(index, 1)
        }
      }
    }
  }
  store.dispatch({type: '@@redux/INIT'})
  return store
}