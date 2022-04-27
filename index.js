/* 

The store should have 4 parts
    1. The state of our entire application
    2. Get the state
    3. Listen to changes on the state
    4. Update the state

*/

/* 

Actions objects

Represent a type of event that are going to be occurring inside of our application that eventually is going to change the state of our store.

Action is  just an object which represent a specific event or action which is going to occur in our App which
eventually is going to change the state in our store. 

*/

/*

Listeners is an array of functions.

Whenever subscribe is called, a new function will be stored
on the array of listeners.

Whenever we update the state, we will loop into all of our
Listeners and invoke every single function that is inside
of the listeners array, listen the state might changed.

You get an object back representing the store
The state will not be public but you can interact
with it with the update methods.

*/

// This is our main function where we will be creating a new store.
// Library code

function createStore(reducer) {
  //We start with our state uninitialized or undefined.

  let state

  // Listeners is an array of functions. These functions will be executed whenever there is an state change.

  let listeners = []

  // Method to return the current state via closures.

  const getState = () => state

  /* 
  
  Subscribe method will add a new function to the listeners array these functions will be executed whenever there are changes in the state. 
  
  It will also allow us to unsubscribe from listening by returning a new array without the targeted function on it.

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

// App code

// Todos constants

const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'

// Goals constants
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'

// Functions for each actions ( Action creators )

function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  }
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  }
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  }
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  }
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal])
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id)
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo])
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id)
    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      )
    default:
      return state
  }
}

function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action),
  }
}

// Create the store object and give our reducer function as an argument.

const store = createStore(app)

/* 

Whenever you want to change the state of your application
You will need to DISPATCH a particular ACTION. As previously
mentioned, dispatch takes an action object 

*/

// These are the functions that will be invoked whenever the state of our store changes.

const unsubscribe = store.subscribe(() => {
  const { goals, todos } = store.getState()

  const goalsList = document.getElementById('goals')
  const todosList = document.getElementById('todos')

  removeElementsFrom(goalsList)
  removeElementsFrom(todosList)

  goals.forEach(addGoalToDOM)
  todos.forEach(addTodoToDOM)
})

// DOM Code

// Function to remove elements before adding a new one from both containers.

function removeElementsFrom(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}

function addTodoToDOM(todo) {
  const node = document.createElement('li')
  const text = document.createTextNode(todo.name)

  const removeButton = createRemoveButton(() => {
    store.dispatch(removeTodoAction(todo.id))
  })

  node.appendChild(text)
  node.appendChild(removeButton)

  node.style.textDecoration = todo.complete ? 'line-through' : 'none'
  node.addEventListener('click', () => {
    store.dispatch(toggleTodoAction(todo.id))
  })
  document.getElementById('todos').appendChild(node)
}

function addGoalToDOM(goal) {
  const node = document.createElement('li')
  const text = document.createTextNode(goal.name)
  const removeButton = createRemoveButton(() => {
    store.dispatch(removeGoalAction(goal.id))
  })

  node.appendChild(text)
  node.appendChild(removeButton)

  document.getElementById('goals').appendChild(node)
}

function createRemoveButton(onClickFn) {
  const removeButton = document.createElement('button')
  removeButton.textContent = 'X'
  removeButton.addEventListener('click', onClickFn)

  return removeButton
}

function generateId() {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  )
}

function addTodo() {
  const input = document.querySelector('#todo')
  const name = input.value
  input.value = ''

  store.dispatch(
    addTodoAction({
      id: generateId(),
      name,
      complete: false,
    })
  )
}

function addGoal() {
  const input = document.querySelector('#goal')
  const name = input.value
  input.value = ''

  store.dispatch(
    addGoalAction({
      id: generateId(),
      name,
    })
  )
}

const todoButton = document.querySelector('#todoButton')
todoButton.addEventListener('click', addTodo)
const goalButton = document.querySelector('#goalButton')
goalButton.addEventListener('click', addGoal)
