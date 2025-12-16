import {
  GetPartyDetailParams,
  GetPartyDetailResponse,
  GetPartyListQuery,
  GetPartyListResponse,
  GetPartyStatsResponse,
  PostCancelParticipate,
  PostChangePartyStatus,
  PostParticipateInPartyParams,
  PostPartyRequestParams,
  PostPartyResponse,
  UpdatePartyRequestBody,
  UpdatePartyResponse,
} from '@/@types/party/type';
import requester from '@/utils/requester';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'buooy-design-system';
import qs from 'qs';

const BASE_URL = '/party';

const PartyApi = {
  getAll: ({ page = 1, ...params }: GetPartyListQuery) => {
    const queryString = qs.stringify(
      { ...params, page },
      { arrayFormat: 'repeat' },
    );
    return requester.get<GetPartyListResponse>(
      `${BASE_URL}/list?${queryString}`,
    );
  },

  getDetail: (partyId?: GetPartyDetailParams) => {
    return requester.get<GetPartyDetailResponse>(
      `${BASE_URL}/details/${partyId}`,
      {},
    );
  },

  participate: (partyId: PostParticipateInPartyParams) => {
    return requester.post(`${BASE_URL}/${partyId}/participate`, undefined, {});
  },

  cancel: ({ partyId, status }: PostCancelParticipate) => {
    return requester.post(`${BASE_URL}/participants/${partyId}/status-change`, {
      new_status: status,
    });
  },
  /** 모임 생성 */
  createParty: (partyDetail: PostPartyRequestParams) => {
    return requester.post<PostPartyResponse>(`${BASE_URL}`, partyDetail, {});
  },

  updateParty: ({
    partyId,
    partyDetail,
  }: {
    partyId: string;
    partyDetail: UpdatePartyRequestBody;
  }) => {
    return requester.post<UpdatePartyResponse>(
      `${BASE_URL}/${partyId}`,
      partyDetail,
      {},
    );
  },

  statusChange: ({
    partyId,
    participationId,
    status,
  }: PostChangePartyStatus) => {
    return requester.post(
      `${BASE_URL}/organizer/${partyId}/status-change/${participationId}`,
      {
        new_status: status,
      },
    );
  },

  participantStatusChange: ({ partyId, status }: PostChangePartyStatus) => {
    return requester.post(`${BASE_URL}/participants/${partyId}/status-change`, {
      new_status: status,
    });
  },

  delete: (partyId: string) => {
    return requester.delete(`${BASE_URL}/${partyId}`);
  },

  getStats: () => {
    return requester.get<GetPartyStatsResponse>(`/user${BASE_URL}/stats`);
  },
};

const useGetPartyList = (params?: GetPartyListQuery) => {
  const snackbar = useSnackbar();

  return useInfiniteQuery(
    ['party-list', params],
    ({ pageParam = 1 }) => {
      return PartyApi.getAll({ ...params, page: pageParam });
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        // 응답 본문의 pagination에서 has_more 사용
        const { pagination } = lastPage?.data ?? {};
        return pagination?.has_more ? allPages.length + 1 : undefined;
      },
      onError: (error: AxiosError<any>) => {
        snackbar.warning({ content: `${error.code} 모임 리스트 조회 실패` });
      },
    },
  );
};

const useGetPartyDetails = (
  partyId?: GetPartyDetailParams,
  isSearch?: boolean,
) => {
  const snackbar = useSnackbar();
  const queryKey = ['party-detail', partyId];

  return useQuery(queryKey, () => PartyApi.getDetail(partyId), {
    enabled: isSearch,
    onError: (error: AxiosError<any>) =>
      snackbar.warning({ content: `${error.code} 모임 디테일 조회 실패` }),
  });
};

const usePostParticipateInParty = () => {
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation(
    (data: PostParticipateInPartyParams) => PartyApi.participate(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['party-detail']);
      },
      onError: (error: AxiosError<any>) =>
        snackbar.warning({ content: `${error.code} 모임 참여 실패` }),
    },
  );
};

const usePostCancelParticipate = () => {
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation((data: PostCancelParticipate) => PartyApi.cancel(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['party-detail']);
    },
    onError: (error: AxiosError<any>) =>
      snackbar.warning({ content: `${error.code} 모임 참여 취소 실패` }),
  });
};

/** 모임 생성 */
const usePostCreateParty = () => {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useMutation(
    (data: PostPartyRequestParams) => PartyApi.createParty(data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['party-list', data]);
      },
      onError: (error: AxiosError<any>) =>
        snackbar.warning({ content: `${error.code} 모임 생성 실패` }),
    },
  );
};

const usePostUpdateParty = (partyId: string) => {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useMutation(
    ({
      partyId,
      partyDetail,
    }: {
      partyId: string;
      partyDetail: PostPartyRequestParams;
    }) => PartyApi.updateParty({ partyId, partyDetail }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['party-detail', partyId]);
        queryClient.invalidateQueries(['party-list', data]);
      },
      onError: (error: AxiosError<any>) =>
        snackbar.warning({ content: `${error.code} 모임 수정 실패` }),
    },
  );
};

const usePostStatusChangeParticipate = () => {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useMutation(
    (data: PostChangePartyStatus) => PartyApi.statusChange(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['party-detail']);
      },
      onError: (error: AxiosError<any>) =>
        snackbar.warning({ content: `${error.code} 모임 상태 변경 실패` }),
    },
  );
};

const usePostParticipantStatusChangeParticipate = () => {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useMutation(
    (data: PostChangePartyStatus) => PartyApi.participantStatusChange(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['party-detail']);
      },
      onError: (error: AxiosError<any>) =>
        snackbar.warning({ content: `${error.code} 모임 상태 변경 실패` }),
    },
  );
};

const useDeleteParty = () => {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useMutation((partyId: string) => PartyApi.delete(partyId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['party-list']);
    },
    onError: (error: AxiosError<any>) =>
      snackbar.warning({ content: `${error.code} 모임 삭제 실패` }),
  });
};

const useGetPartyStats = (isSearch?: boolean) => {
  const snackbar = useSnackbar();
  const queryKey = ['party-stats'];

  return useQuery(queryKey, () => PartyApi.getStats(), {
    enabled: isSearch,
    onError: (error: AxiosError<any>) =>
      snackbar.warning({ content: `${error.code} 모임 stats 조회 실패` }),
  });
};

export {
  PartyApi,
  useDeleteParty,
  useGetPartyDetails,
  useGetPartyList,
  useGetPartyStats,
  usePostCancelParticipate,
  usePostCreateParty,
  usePostParticipateInParty,
  usePostStatusChangeParticipate,
  usePostParticipantStatusChangeParticipate,
  usePostUpdateParty,
};
