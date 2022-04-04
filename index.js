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

  // Listeners is an array of functions.
  // Whenever suscribe is called, a new function will be stored
  // on the array of listeners.

  // Whenever we update the state, we will loop into all of our
  // Listeners and invoke every single function that is inside
  // of the listeners array, listen the state might changed.

  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)

    // unsuscribing from the listeners array

    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  return {
    getState,
    subscribe,
  }
}

// Create the store

const store = createStore()

// Whenever the state changes, we use the passed function on the
// suscribe method.
// The user can call suscribe as many times as he want.

const unsuscribe = store.subscribe(() => {})
