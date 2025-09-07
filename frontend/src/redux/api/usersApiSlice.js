import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

// Centralized token management
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');
  return token;
};

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        return response;
      },
    }),
    
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
      transformResponse: (response) => {
        localStorage.removeItem('token');
        return response;
      },
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: USERS_URL,
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        return response;
      },
    }),


    profile: builder.mutation({
      query: (userData) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      }),
      providesTags: (result) => {
        const users = Array.isArray(result) ? result : [];
        return [
          'User',
          ...users.map(({ _id }) => ({ type: 'User', id: _id }))
        ];
      },
      keepUnusedDataFor: 5,
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      }),
      invalidatesTags: (result, error, id) => [
        'User',
        { type: 'User', id }
      ],
    }),

    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      }),
      transformErrorResponse: (response) => {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return response.data;
      },
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
        body: data,
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        'User',
        { type: 'User', id }
      ],
    }),

    googleLogin: builder.mutation({
      query: (tokenIdPayload) => ({
        url: `${USERS_URL}/google-auth`,
        method: 'POST',
        body: tokenIdPayload, 
      }),
      transformResponse: (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        return response;
      },
    }),

    verifyEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verify-email`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        return response;
      },
    }),

    resendVerification: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/resend-verification`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});


export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useGoogleLoginMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} = userApiSlice;