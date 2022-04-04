function createStore() {
  // The store should have 4 parts
  // 1. The state of our entire applicationm
  // 2. Get the state
  // 3. Listen to changes on the state
  // 4. Update the state

  // You get an object back representing the store
  // The state will not be public but you can interact
  // with it with the update methods.

  let state

  const getState = () => state

  return {
    getState,
  }
}
