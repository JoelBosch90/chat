import React from 'react'

/**
 *  Functional component that displays a single time stamp.
 * 
 *  @param    {Object}  props   React props passed by the parent element.
 *  @returns  {JSX.Element}
 */
export default function TimeStamp(props) {

  // Extract the props that we want to use.
  const { time } = props

  /**
   *  Helper function to format a time stamp into a human readable format.
   *  @param    {string}  time  A time string format that Date() can recognize.
   *  @returns  {string}
   */
  const format = time => {

    // If no time is provided, we default to an empty string to display no time
    // at all.
    if (!time) return ''

    // Construct a Date() object that we can use to read many different time
    // string formats. Hopefully this one as well.
    const timeObject = new Date(time)

    // Get the hours and the minutes both as strings of two digits each.
    const hours = ("0" + timeObject.getHours()).slice(-2)
    const minutes = ("0" + timeObject.getMinutes()).slice(-2)

    // Combine both with a colon to construct a regular time stamp.
    return `${hours}:${minutes}`
  }

  return (
    <>{format(time)}</>
  )
}
