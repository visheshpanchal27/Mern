import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: credentials,
      }),
    }),
    
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: USERS_URL,
        method: 'POST',
        body: userData,
      }),
    }),

    profile: builder.mutation({
      query: (userData) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    getUserProfile: builder.query({
      query: () => `${USERS_URL}/profile`,
      providesTags: ['User'],
    }),

    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
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
      }),
      invalidatesTags: (result, error, id) => [
        'User',
        { type: 'User', id }
      ],
    }),

    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
        body: data,
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
    }),

    verifyEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verify-email`,
        method: 'POST',
        body: data,
      }),
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
  useGetUserProfileQuery,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useGoogleLoginMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} = userApiSlice;