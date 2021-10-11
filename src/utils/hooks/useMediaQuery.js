import { useEffect, useState } from 'react'

/**
 * https://github.com/antonioru/beautiful-react-hooks/blob/master/src/useMediaQuery.ts
 *
 * Accepts a media query string then uses the
 * [window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) API to determine if it
 * matches with the current document.<br />
 * It also monitor the document changes to detect when it matches or stops matching the media query.<br />
 * Returns the validity state of the given media query.
 *
 */
const useMediaQuery = (mediaQuery) => {
  if (!window?.matchMedia) return null

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isVerified, setIsVerified] = useState(!!window.matchMedia(mediaQuery).matches)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQuery)
    const documentChangeHandler = () => setIsVerified(!!mediaQueryList.matches)

    try {
      mediaQueryList.addEventListener('change', documentChangeHandler)
    } catch (e) {
      // Safari isn't supporting mediaQueryList.addEventListener
      mediaQueryList.addListener(documentChangeHandler)
    }

    documentChangeHandler()
    return () => {
      try {
        mediaQueryList.removeEventListener('change', documentChangeHandler)
      } catch (e) {
        // Safari isn't supporting mediaQueryList.removeEventListener
        mediaQueryList.removeListener(documentChangeHandler)
      }
    }
  }, [mediaQuery])

  return isVerified
}

export default useMediaQuery
