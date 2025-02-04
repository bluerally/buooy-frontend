import {
  GetAuthPlatform,
  GetRedirectionUrlParam,
  GetRedirectionUrlResponse,
  PostAuthToken,
  PostRefreshToken,
} from '@/@types/auth/type';
import { ACCESS_TOKEN_KEY } from '@/constants/common';
import requester from '@/utils/requester';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { setCookie } from 'cookies-next';

const BASE_URL = '/user/auth';

const AuthApi = {
  getRedirectionUrl: (parameter: GetRedirectionUrlParam) => {
    return requester.get<GetRedirectionUrlResponse>(
      `${BASE_URL}/redirect-url/${parameter.platform}`,
    );
  },
  getAuthPlatform: (platform: GetAuthPlatform) => {
    return requester.get<GetAuthPlatform>(`${BASE_URL}/${platform}`);
  },
  postAuthToken: (parameter: PostAuthToken) => {
    return requester.post(`${BASE_URL}/token`, parameter);
  },
  postAuthRefreshToken: (parameter: PostRefreshToken) => {
    return requester.post(`${BASE_URL}/token/refresh`, parameter);
  },
  getLogout: () => {
    return requester.post(`${BASE_URL}/logout`, {});
  },
};

const useGetRedirectionUrl = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ platform }: GetRedirectionUrlParam) =>
      AuthApi.getRedirectionUrl({ platform }),
    {
      onSuccess: (data) => {
        window.location.href = data.data.redirect_url;
        queryClient.invalidateQueries(['auth-token']);
      },
      onError: (error: AxiosError<any>) =>
        window.alert(`${error.code} 로그인 실패`),
    },
  );
};

/** Auth.tsx */
const useGetAuthPlatform = ({ platform }: GetRedirectionUrlParam) => {
  const queryKey = ['auth-platform'];

  return useQuery(queryKey, () => AuthApi.getAuthPlatform(platform), {
    onError: (error: AxiosError<any>) =>
      window.alert(`${error.code} 토큰값 취득`),
  });
};

const usePostAuthRefreshToken = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: PostRefreshToken) => AuthApi.postAuthRefreshToken(data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['auth-token']);

        setCookie(ACCESS_TOKEN_KEY, data.data.access_token);
      },
      onError: (error: AxiosError<any>) =>
        window.alert(`${error.code} 토큰 갱신 실패`),
    },
  );
};

const usePostLogout = () => {};

export {
  AuthApi,
  useGetAuthPlatform,
  useGetRedirectionUrl,
  usePostAuthRefreshToken,
  usePostLogout,
};
