/* 

The store should have 4 parts
    1. The state of our entire applicationm
    2. Get the state
    3. Listen to changes on the state
    4. Update the state

*/

/* 

Actions objects

Represent a type of event that are going to be occuring inside of our application that eventually is going to change the state of our store.

Action is  just an object which represent a specific event or action which is going to occur in our App which
eventually is going to change the state in our store. 

An example of an action object passed into our dispatch method.

{
  type: 'ADD_TODO',
  todo: {
    id: 0,
    name: 'Learn Redux',
    complete: 'false'
  }
}

*/

/*

Listeners is an array of functions.

Whenever suscribe is called, a new function will be stored
on the array of listeners.

Whenever we update the state, we will loop into all of our
Listeners and invoke every single function that is inside
of the listeners array, listen the state might changed.

You get an object back representing the store
The state will not be public but you can interact
with it with the update methods.

*/

/* 

Characteristics of a Pure Function 

1) They always return the same result if the same arguments are
passed in.
2) They depend only on the arguments passed into them. They only care about their own scope and the arguments being passed into them.
3) Never produce any side effects. i.e. Making AJAX Request, they should never do anything with the DOM. 

*/

/* 

Reducer function

Responsible for getting us to the next state of our application based on the specific action we pass into it. 

*/

function reducer(state = [], action) {
  if (action.type === 'ADD_TODO') {
    return state.concat([action.todo])
  }

  return state
}

function createStore(reducer) {
  /*

  This is our main function where we will be creating a new store.

  We start with our state uninitialized or undefined.
  
  */

  let state

  // Listeners is an array of functions. These functions will be executed whenever there is an state change.

  let listeners = []

  // Method to return the current state via closures.

  const getState = () => state

  /* 
  
  Suscribe method will add a new function to the listeners array these functions will be executed whenever there are changes in the state. 
  
  It will also allow us to unsuscribe from listening by returning a new array without the targeted function on it.

  */

  const subscribe = (listener) => {
    listeners.push(listener)

    return () => {
      listeners = listeners.filter(
        (listenersItem) => listenersItem !== listener
      )
    }
  }

  /* 
  
  Dispatch is responsible for updating the state in the most
  predictable manner.
  
  Dispatch receives an action, access the current state with a reducer and updates it accordingly. 

  In our case, it also loops through the listeners array and
  invoke all the functions there whenever there is an state update.
  
  */

  const dispatch = (action) => {
    /* 
    
    call the reducer function and give it the current state,
    the reducer we are using is going to give us an empty
    array by default if the state is undefined (uninitialized) 

    */

    state = reducer(state, action)

    /* 
    
    Loop over all of our listeners and invoke them, whenever
    there is a change in the state. 
    
    */

    listeners.forEach((listener) => listener())
  }

  return {
    getState,
    subscribe,
    dispatch,
  }
}

// Create the store object and give our reducer function as an argument.

const store = createStore(reducer)

/* 

Whenever you want to change the state of your application
You will need to DISPATCH a particular ACTION. As previously
mentioned, dispatch takes an action object 

*/

store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 0,
    name: 'Learn Redux',
    complete: 'false',
  },
})
