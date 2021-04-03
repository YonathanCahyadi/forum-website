import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['String'];
  post: Thread;
  createdBy: User;
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  updated: Scalars['Boolean'];
};


export type Mutation = {
  __typename?: 'Mutation';
  register: UserResponse;
  login: UserResponse;
  postThread: ThreadResponse;
  updateThread: ThreadResponse;
  deleteThread: ThreadResponse;
};


export type MutationRegisterArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationPostThreadArgs = {
  content: Scalars['String'];
  title: Scalars['String'];
};


export type MutationUpdateThreadArgs = {
  content: Scalars['String'];
  title: Scalars['String'];
  threadId: Scalars['String'];
};


export type MutationDeleteThreadArgs = {
  threadId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me: UserResponse;
  getUserById: UserResponse;
  getUserByUsername: UserResponse;
  getAllThread: ThreadResponse;
  getThreadById: ThreadResponse;
};


export type QueryGetUserByIdArgs = {
  id: Scalars['String'];
};


export type QueryGetUserByUsernameArgs = {
  usename: Scalars['String'];
};


export type QueryGetAllThreadArgs = {
  page?: Maybe<Scalars['Int']>;
};


export type QueryGetThreadByIdArgs = {
  threadId: Scalars['String'];
};

export type Thread = {
  __typename?: 'Thread';
  id: Scalars['String'];
  createdBy: User;
  title: Scalars['String'];
  content: Scalars['String'];
  comments: Array<Comment>;
  updated: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type ThreadResponse = {
  __typename?: 'ThreadResponse';
  data?: Maybe<Array<Thread>>;
  error?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
  threads: Array<Thread>;
  comments: Array<Comment>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  data?: Maybe<User>;
  authorizationToken?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
};

export type DeleteThreadMutationVariables = Exact<{
  threadId: Scalars['String'];
}>;


export type DeleteThreadMutation = (
  { __typename?: 'Mutation' }
  & { deleteThread: (
    { __typename?: 'ThreadResponse' }
    & Pick<ThreadResponse, 'error'>
    & { data?: Maybe<Array<(
      { __typename?: 'Thread' }
      & Pick<Thread, 'id' | 'title' | 'content'>
    )>> }
  ) }
);

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & Pick<UserResponse, 'authorizationToken' | 'error'>
    & { data?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
      & { threads: Array<(
        { __typename?: 'Thread' }
        & Pick<Thread, 'id' | 'content' | 'title'>
      )>, comments: Array<(
        { __typename?: 'Comment' }
        & Pick<Comment, 'id' | 'content'>
      )> }
    )> }
  ) }
);

export type PostThreadMutationVariables = Exact<{
  title: Scalars['String'];
  content: Scalars['String'];
}>;


export type PostThreadMutation = (
  { __typename?: 'Mutation' }
  & { postThread: (
    { __typename?: 'ThreadResponse' }
    & Pick<ThreadResponse, 'error'>
    & { data?: Maybe<Array<(
      { __typename?: 'Thread' }
      & Pick<Thread, 'id' | 'content' | 'updated' | 'createdAt'>
    )>> }
  ) }
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & Pick<UserResponse, 'authorizationToken' | 'error'>
    & { data?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'createdAt' | 'updatedAt'>
      & { comments: Array<(
        { __typename?: 'Comment' }
        & Pick<Comment, 'id' | 'content'>
      )>, threads: Array<(
        { __typename?: 'Thread' }
        & Pick<Thread, 'id' | 'content' | 'title'>
      )> }
    )> }
  ) }
);

export type GetAllThreadQueryVariables = Exact<{
  page?: Maybe<Scalars['Int']>;
}>;


export type GetAllThreadQuery = (
  { __typename?: 'Query' }
  & { getAllThread: (
    { __typename?: 'ThreadResponse' }
    & Pick<ThreadResponse, 'error'>
    & { data?: Maybe<Array<(
      { __typename?: 'Thread' }
      & Pick<Thread, 'id' | 'title' | 'content' | 'updated' | 'createdAt' | 'updatedAt'>
      & { createdBy: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username'>
      ), comments: Array<(
        { __typename?: 'Comment' }
        & Pick<Comment, 'id'>
      )> }
    )>> }
  ) }
);

export type GetThreadByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetThreadByIdQuery = (
  { __typename?: 'Query' }
  & { getThreadById: (
    { __typename?: 'ThreadResponse' }
    & Pick<ThreadResponse, 'error'>
    & { data?: Maybe<Array<(
      { __typename?: 'Thread' }
      & Pick<Thread, 'id' | 'title' | 'content' | 'createdAt' | 'updatedAt' | 'updated'>
      & { createdBy: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username'>
      ), comments: Array<(
        { __typename?: 'Comment' }
        & Pick<Comment, 'id'>
      )> }
    )>> }
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'UserResponse' }
    & Pick<UserResponse, 'error'>
    & { data?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'createdAt'>
      & { threads: Array<(
        { __typename?: 'Thread' }
        & Pick<Thread, 'id' | 'title'>
      )>, comments: Array<(
        { __typename?: 'Comment' }
        & Pick<Comment, 'id'>
      )> }
    )> }
  ) }
);


export const DeleteThreadDocument = gql`
    mutation DeleteThread($threadId: String!) {
  deleteThread(threadId: $threadId) {
    data {
      id
      title
      content
    }
    error
  }
}
    `;
export type DeleteThreadMutationFn = Apollo.MutationFunction<DeleteThreadMutation, DeleteThreadMutationVariables>;

/**
 * __useDeleteThreadMutation__
 *
 * To run a mutation, you first call `useDeleteThreadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteThreadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteThreadMutation, { data, loading, error }] = useDeleteThreadMutation({
 *   variables: {
 *      threadId: // value for 'threadId'
 *   },
 * });
 */
export function useDeleteThreadMutation(baseOptions?: Apollo.MutationHookOptions<DeleteThreadMutation, DeleteThreadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteThreadMutation, DeleteThreadMutationVariables>(DeleteThreadDocument, options);
      }
export type DeleteThreadMutationHookResult = ReturnType<typeof useDeleteThreadMutation>;
export type DeleteThreadMutationResult = Apollo.MutationResult<DeleteThreadMutation>;
export type DeleteThreadMutationOptions = Apollo.BaseMutationOptions<DeleteThreadMutation, DeleteThreadMutationVariables>;
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    data {
      id
      username
      threads {
        id
        content
        title
      }
      comments {
        id
        content
      }
    }
    authorizationToken
    error
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const PostThreadDocument = gql`
    mutation PostThread($title: String!, $content: String!) {
  postThread(title: $title, content: $content) {
    data {
      id
      content
      updated
      createdAt
    }
    error
  }
}
    `;
export type PostThreadMutationFn = Apollo.MutationFunction<PostThreadMutation, PostThreadMutationVariables>;

/**
 * __usePostThreadMutation__
 *
 * To run a mutation, you first call `usePostThreadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostThreadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postThreadMutation, { data, loading, error }] = usePostThreadMutation({
 *   variables: {
 *      title: // value for 'title'
 *      content: // value for 'content'
 *   },
 * });
 */
export function usePostThreadMutation(baseOptions?: Apollo.MutationHookOptions<PostThreadMutation, PostThreadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostThreadMutation, PostThreadMutationVariables>(PostThreadDocument, options);
      }
export type PostThreadMutationHookResult = ReturnType<typeof usePostThreadMutation>;
export type PostThreadMutationResult = Apollo.MutationResult<PostThreadMutation>;
export type PostThreadMutationOptions = Apollo.BaseMutationOptions<PostThreadMutation, PostThreadMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!) {
  register(username: $username, password: $password) {
    data {
      id
      username
      comments {
        id
        content
      }
      threads {
        id
        content
        title
      }
      createdAt
      updatedAt
    }
    authorizationToken
    error
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const GetAllThreadDocument = gql`
    query GetAllThread($page: Int) {
  getAllThread(page: $page) {
    data {
      id
      title
      content
      updated
      createdBy {
        id
        username
      }
      comments {
        id
      }
      createdAt
      updatedAt
    }
    error
  }
}
    `;

/**
 * __useGetAllThreadQuery__
 *
 * To run a query within a React component, call `useGetAllThreadQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllThreadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllThreadQuery({
 *   variables: {
 *      page: // value for 'page'
 *   },
 * });
 */
export function useGetAllThreadQuery(baseOptions?: Apollo.QueryHookOptions<GetAllThreadQuery, GetAllThreadQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllThreadQuery, GetAllThreadQueryVariables>(GetAllThreadDocument, options);
      }
export function useGetAllThreadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllThreadQuery, GetAllThreadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllThreadQuery, GetAllThreadQueryVariables>(GetAllThreadDocument, options);
        }
export type GetAllThreadQueryHookResult = ReturnType<typeof useGetAllThreadQuery>;
export type GetAllThreadLazyQueryHookResult = ReturnType<typeof useGetAllThreadLazyQuery>;
export type GetAllThreadQueryResult = Apollo.QueryResult<GetAllThreadQuery, GetAllThreadQueryVariables>;
export const GetThreadByIdDocument = gql`
    query GetThreadById($id: String!) {
  getThreadById(threadId: $id) {
    data {
      id
      title
      content
      createdBy {
        id
        username
      }
      comments {
        id
      }
      createdAt
      updatedAt
      updated
    }
    error
  }
}
    `;

/**
 * __useGetThreadByIdQuery__
 *
 * To run a query within a React component, call `useGetThreadByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetThreadByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetThreadByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetThreadByIdQuery(baseOptions: Apollo.QueryHookOptions<GetThreadByIdQuery, GetThreadByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetThreadByIdQuery, GetThreadByIdQueryVariables>(GetThreadByIdDocument, options);
      }
export function useGetThreadByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetThreadByIdQuery, GetThreadByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetThreadByIdQuery, GetThreadByIdQueryVariables>(GetThreadByIdDocument, options);
        }
export type GetThreadByIdQueryHookResult = ReturnType<typeof useGetThreadByIdQuery>;
export type GetThreadByIdLazyQueryHookResult = ReturnType<typeof useGetThreadByIdLazyQuery>;
export type GetThreadByIdQueryResult = Apollo.QueryResult<GetThreadByIdQuery, GetThreadByIdQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    data {
      id
      username
      createdAt
      threads {
        id
        title
      }
      comments {
        id
      }
    }
    error
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;