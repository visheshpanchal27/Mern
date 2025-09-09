export const useHaptic = () => {
  const light = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  const medium = () => {
    if (navigator.vibrate) {
      navigator.vibrate(20)
    }
  }

  const heavy = () => {
    if (navigator.vibrate) {
      navigator.vibrate([30, 10, 30])
    }
  }

  const success = () => {
    if (navigator.vibrate) {
      navigator.vibrate([10, 5, 10])
    }
  }

  const error = () => {
    if (navigator.vibrate) {
      navigator.vibrate([50, 20, 50, 20, 50])
    }
  }

  return { light, medium, heavy, success, error }
}