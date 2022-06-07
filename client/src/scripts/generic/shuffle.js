/**
 *  Function that randomly shuffles an array using the Durstenfeld shuffle.
 *  @param    {array}   array   The array to shuffle.
 *  @returns  {array}
 */
export default array => {

  // Create a local copy of the array that we can safely manipulate.
  const copy = array.slice(0)

  // Loop through all array indices.
  for (let index = copy.length - 1; index > 0; index--) {

    // Get a random index.
    const randomIndex = Math.floor(Math.random() * (index + 1));

    // Swap the entry at the current index with the entry at the random index.
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]]
  }

  // Return the shuffled array.
  return copy
}
