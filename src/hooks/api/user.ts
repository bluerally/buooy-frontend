import {
  GetUserByIdResponse,
  GetUserMeResponse,
  PostUserMeProfileImageRequestBody,
  PostUserMeProfileImageResponse,
  PostUserMeRequestBody,
  PostUserMeResponse,
  getPartyMeOrganizationResponse,
  getPartyMeParticipatedResponse,
} from '@/@types/user/type';
import requester from '@/utils/requester';
import { useHandleError } from '@/utils/useHandleError';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'buooy-design-system';

const UserApi = {
  me: () => {
    return requester.get<GetUserMeResponse>(`/user/me`);
  },
  post: (data: PostUserMeRequestBody) => {
    return requester.post<PostUserMeResponse>('/user/me', data);
  },
  profileImageUpload: (data: PostUserMeProfileImageRequestBody) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const multiFormDataHeaders = {
      'Content-Type': 'multipart/form-data',
    };

    return requester.post<PostUserMeProfileImageResponse>(
      '/user/me/profile-image',
      formData,
      {
        headers: multiFormDataHeaders,
      },
    );
  },

  get: (userId?: number) => {
    return requester.get<GetUserByIdResponse>(`/user/profile/${userId}`);
  },
  getPartyMeOrganized: () => {
    return requester.get<getPartyMeOrganizationResponse>(`/party/me/organized`);
  },
  getPartyMeParticipated: () => {
    return requester.get<getPartyMeParticipatedResponse>(
      `/party/me/participated`,
    );
  },
};

const useGetUserMe = (enabled?: boolean) => {
  const queryKey = ['userMe'];
  const { handleError } = useHandleError();

  return useQuery(queryKey, () => UserApi.me(), {
    enabled,
    onError: (error: AxiosError<any>) => {
      handleError(error);
    },
  });
};

const usePostUserMe = () => {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useMutation((data: PostUserMeRequestBody) => UserApi.post(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['userMe']);
      // user/profile/* 쿼리도 모두 무효화하여 캐시된 프로필 데이터 갱신
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          typeof query.queryKey[0] === 'string' &&
          query.queryKey[0].startsWith('user/profile/'),
      });
    },
    onError: (error: AxiosError<any>) =>
      snackbar.warning({ content: `${error.code} 내 정보 수정 실패` }),
  });
};

const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useMutation(
    (data: PostUserMeProfileImageRequestBody) =>
      UserApi.profileImageUpload(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userMe']);
        // user/profile/* 쿼리도 모두 무효화하여 캐시된 프로필 이미지 갱신
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            typeof query.queryKey[0] === 'string' &&
            query.queryKey[0].startsWith('user/profile/'),
        });
        snackbar.success({
          content: '프로필 이미지가 성공적으로 업데이트되었습니다.',
        });
      },
      onError: (error: AxiosError<any>) => {
        snackbar.warning({
          content: `${error.code} 프로필 이미지 업로드 실패`,
        });
      },
    },
  );
};

const useGetUserById = (userId?: number, isSearch?: boolean) => {
  const queryKey = [`user/profile/${userId}`];
  const snackbar = useSnackbar();

  return useQuery(queryKey, () => UserApi.get(userId), {
    enabled: !!userId && isSearch,
    onError: (error: AxiosError<any>) =>
      snackbar.warning({ content: `${error.code} 유저 정보 조회 실패` }),
  });
};

const useGetPartyMeOrganized = (isSearch?: boolean) => {
  const queryKey = ['party/me/organized'];
  const snackbar = useSnackbar();

  return useQuery(queryKey, () => UserApi.getPartyMeOrganized(), {
    enabled: isSearch,
    onError: (error: AxiosError<any>) =>
      snackbar.warning({ content: `${error.code} 내가 주최한 모임 조회 실패` }),
  });
};

const useGetPartyMeParticipated = (isSearch?: boolean) => {
  const queryKey = ['/party/me/participated'];
  const snackbar = useSnackbar();

  return useQuery(queryKey, () => UserApi.getPartyMeParticipated(), {
    enabled: isSearch,
    onError: (error: AxiosError<any>) =>
      snackbar.warning({ content: `${error.code} 내가 참여한 모임 조회 실패` }),
  });
};

export {
  UserApi,
  useGetUserMe,
  usePostUserMe,
  useGetUserById,
  useGetPartyMeOrganized,
  useGetPartyMeParticipated,
  useUploadProfileImage,
};
