import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useGetProfileQuery } from '../api/apiSlice'
import { setCredentials, logout } from '../store/authSlice'

const AuthCheck = ({ children }) => {
  const dispatch = useDispatch()
  const { data: profile, error } = useGetProfileQuery(undefined, {
    skip: false,
  })

  useEffect(() => {
    if (profile) {
      dispatch(setCredentials(profile))
    } else if (error?.status === 401) {
      dispatch(logout())
    }
  }, [profile, error, dispatch])

  return children
}

export default AuthCheck