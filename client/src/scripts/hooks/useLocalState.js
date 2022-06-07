import { useState } from 'react'

/**
 *  This function is simply JSON.parse, but it doesn't crash on undefined.
 *  @param    {any}   json  The potential JSON object.
 *  @returns  {any}
 */
const safeParse = json => json === 'undefined' ? undefined : JSON.parse(json)

/**
 *  Keep a memoized version of the local storage so that we don't have to keep
 *  calling the browser API until we see a hard page reload.
 *  @var      {Object}
 */
const memoizedStorage = {}

/**
 *  Helper function to get a property from storage if we can.
 *  @param    {string}  name
 *  @returns  {any}
 */
const getProp = (name) => {

  // Try to get the prop from the memoized storage first.
  if (memoizedStorage.hasOwnProperty(name)) return safeParse(memoizedStorage[name])

  // Try to get the prop from the local storage second.
  if (window.localStorage.hasOwnProperty(name)) return safeParse(window.localStorage.getItem(name))

  // Default to undefined.
  return undefined
}

/**
 *  Helper function to get a property from storage if we can.
 *  @param    {string}  name
 *  @param    {any}     value
 */
const setProp = (name, value) => void window.localStorage.setItem(name, JSON.stringify(value))

/**
 *  Custom hook that acts juse like the useState hook, except it stores all
 *  changes to localStorage and fetches changes from localStorage on
 *  initialization.
 *  @param    {string}  name          Name of the state.
 *  @param    {any}     defaultValue  Default value for this state.
 *  @returns  {array}
 */
export default function useLocalState(name, defaultValue) {

  // Get the initial value from local storage if we can. Otherwise we can use
  // the given default.
  const initial = getProp(name) || defaultValue

  // First use the React hook to get the state variable and setter function.
  const [state, setState] = useState(initial)

  // Use our saveLocalState function to make sure we always save state locally.
  return [state, update => {

    // First set the state using the setter function.
    setState(oldState => {
      
      // Note that the setState hook that we're mimicking accepts either a
      // callback function or the value of the new state. We want to construct
      // the new state from either.
      const newState = typeof update === 'function' ? update(oldState) : update

      // Next, store the new state.
      setProp(name, newState)

      // Then return it to the setState hook.
      return newState
    })
  }]
}