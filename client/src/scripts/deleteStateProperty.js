/**
 *  Function to delete a property from an object created with the useState hook.
 *  @param  {string}    property  Name of the property to remove from the state
 *                                object.
 *  @param  {Function}  setter    The second argument that's returned by the
 *                                useState hook that's used to update the state
 *                                object.
 */
const deleteStateProperty = (property, setter) => {
  setter(oldObject => {

    // Create a local copy we can safely manipulate.
    const copy = { ...oldObject }

    // Delete the property.
    delete copy[property]

    // Return the copy.
    return copy
  })
}

// Export the delete state property function.
export default deleteStateProperty