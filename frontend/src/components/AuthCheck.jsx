import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useGetUserProfileQuery } from '../redux/api/usersApiSlice'
import { setCredentials, logOut } from '../redux/features/auth/authSlice'

const AuthCheck = ({ children }) => {
  const dispatch = useDispatch()
  const { data: profile, error } = useGetUserProfileQuery(undefined, {
    skip: false,
  })

  useEffect(() => {
    if (profile) {
      dispatch(setCredentials(profile))
    } else if (error?.status === 401) {
      dispatch(logOut())
    }
  }, [profile, error, dispatch])

  return children
}

export default AuthCheck