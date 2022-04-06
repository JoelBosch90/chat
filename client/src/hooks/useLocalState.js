import React, { useState } from 'react'

/**
 *  Custom hook that acts juse like the useState hook, except it stores all
 *  changes to localStorage and fetches changes from localStorage on
 *  initialization.
 *  @param    {string}  name      Name of the state.
 *  @param    {any}     value     Default value for this state.
 *  @returns  {array}
 */
export default function useLocalState(name, value) {

  // Check if we can find a state with this name in local storage. If not,
  // use the provided default value.
  const initial = window.localStorage.hasOwnProperty(name) ? JSON.parse(window.localStorage.getItem(name)) : value

  // First use the React hook to get the state variable and setter function.
  const [state, setState] = useState(initial)

  // Use our saveLocalState function to make sure we always save state locally.
  return [state, newState => {
    
    console.log('saveLocalState', { state, newState })

    // First set the state using the setter function.
    setState(newState)

    // Next, store the item to local storage as well.
    window.localStorage.setItem(name, JSON.stringify(newState))
  }]
}