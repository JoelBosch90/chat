/**
 *  Function to fetch a sharable text for the current page.
 *  @returns {string}
 */
const shareText = () => {

  // List all possible different elements that may contain the meta description
  // in order of importance. We'll take the description from the first source
  // we'll find.
  const sources = ["meta[property='og:description']", "meta[name=description]"]

  // Loop through all sources and get its content.
  for(const source of sources) if (document.querySelector(source)) return document.querySelector(source).content

  // Default to an empty string.
  return ""
}

/**
 *  Function to fetch a sharable URL for the current page.
 *  @returns {string}
 */
const shareURL = () => {

  // Check for the Open Graph metadata first, then the canonical link.
  if (document.querySelector("meta[property='og:url']")) return document.querySelector("meta[property='og:url']").content
  if (document.querySelector("link[rel=canonical]")) return document.querySelector("link[rel=canonical]").href

  // Default to simply the location of the current page.
  return document.location.href
}

/**
 *  Function to fetch a sharable URL for the current page.
 *  @returns {string}
 */
const shareTitle = () => {

  // Check for an Open Graph title first.
  if (document.querySelector("meta[property='og:title']")) return document.querySelector("meta[property='og:title']").content

  // Default to simply the location of the current page.
  return document.title
}

/**
 *  Function to share the current page.
 *  @returns  {Promise}
 */
const share = () => {

  console.log({
    title: shareTitle(),
    url: shareURL(),
    text: shareText(),
  })

  // Check if we have access to native share functionality.
  if (navigator?.share) return navigator.share({
    title: shareTitle(),
    url: shareURL(),
    text: shareText(),
  })

  // Otherwise, we simply copy to clipboard.
  return navigator?.clipboard.writeText(shareURL())
}

// Export the share function.
export default share