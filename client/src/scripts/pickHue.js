// Import dependencies.
import shuffle from './generic/shuffle'

/**
 *  Function to pick a hue for the color of a new user in a specific room.
 *  This function tries to divide hues in such a way that as few users as
 *  possible share a similar color. Returns a number between 0 and 360.
 *  @param    {Object}    room      Room object for which to pick a hue.
 *    @property {Object}    users     An object mapping the ids of the users in
 *                                    this room to objects that contains each
 *                                    user's properties.
 *      @property {Object}    [id]      An object describing a user's
 *                                      properties.
 *        @property {Number}    hue       A number describing the hue that's
 *                                        assigned to a user.
 *  @returns  {Number}
 */
const pickHue = room => {

  // List all supported hues. These hues are picked for legibility.
  const supportedHues = shuffle([30, 60, 90, 120, 150, 180, 300, 330])

  // Get a list of hues that are already taken.
  const taken = (room.users ?  Object.values(room.users) : [])

    // Hues wrap around a scale of 0 - 360, so we can use modulo here to
    // simplify the numbers.
    .map(user => user.hue % 360)

  // Pick the least used support hue.
  return supportedHues.sort((hueA, hueB) => {

    // Sort supported hues by how often they're used.
    return taken.filter(hue => hue === hueB).length - taken.filter(hue => hue === hueA).length

  // The last entry should be the least frequent hue.
  }).at(-1)
}

export default pickHue
