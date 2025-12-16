import {
  DeleteCommentRequest,
  GetCommentListRequestPath,
  GetCommentListResponse,
  PostCommentListResponse,
  PostCommentRequest,
  UpdateCommentRequest,
} from '@/@types/comment/type';
import requester from '@/utils/requester';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'buooy-design-system';

const CommentApi = {
  get: (partyId: GetCommentListRequestPath) => {
    return requester.get<GetCommentListResponse>(`/party/${partyId}/comment`);
  },

  post: ({ partyId, content }: PostCommentRequest) => {
    return requester.post<PostCommentListResponse>(
      `/party/${partyId}/comment`,
      { content },
    );
  },

  update: ({ partyId, commentId, content }: UpdateCommentRequest) => {
    return requester.put<PostCommentListResponse>(
      `/party/${partyId}/comment/${commentId}`,
      { content },
    );
  },
  delete: ({ partyId, commentId }: DeleteCommentRequest) => {
    return requester.delete<PostCommentListResponse>(
      `/party/${partyId}/comment/${commentId}`,
    );
  },
};

const useGetPartyCommentList = (
  partId?: GetCommentListRequestPath,
  isSearch?: boolean,
) => {
  const queryKey = ['comment-list', partId];
  const snackbar = useSnackbar();
  const isValidPartyId = partId !== undefined && !isNaN(Number(partId));

  return useQuery(queryKey, () => CommentApi.get(partId!), {
    enabled: isSearch && isValidPartyId,
    onError: (error: AxiosError<any>) =>
      snackbar.warning({ content: `${error.code}  모임 코멘트 리스트 실패` }),
  });
};

const usePostPartyComment = () => {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useMutation((data: PostCommentRequest) => CommentApi.post(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['comment-list']);
    },
    onError: (error: AxiosError<any>) =>
      snackbar.warning({ content: `${error.code} 모임 코멘트 작성 실패` }),
  });
};

const useUpdatePartyComment = () => {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useMutation((data: UpdateCommentRequest) => CommentApi.update(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['comment-list']);
    },
    onError: (error: AxiosError<any>) =>
      snackbar.warning({ content: `${error.code} 모임 코멘트 수정 실패` }),
  });
};

const useDeletePartyComment = () => {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useMutation((data: DeleteCommentRequest) => CommentApi.delete(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['comment-list']);
    },
    onError: (error: AxiosError<any>) =>
      snackbar.warning({ content: `${error.code} 모임 코멘트 수정 실패` }),
  });
};

export {
  CommentApi,
  useGetPartyCommentList,
  usePostPartyComment,
  useUpdatePartyComment,
  useDeletePartyComment,
};
