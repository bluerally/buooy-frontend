import {
  GetCommentListResponse,
  PostCommentListRequestBody,
  PostCommentListResponse,
} from '@/@types/comment/type';
import {
  useDeletePartyComment,
  usePostPartyComment,
  useUpdatePartyComment,
} from '@/hooks/api/comment';
import { useRef, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { FormTextInput } from '../form/FormTextInput';
import { EllipsisVerticalIcon, SendHorizontal } from 'lucide-react';
import { Button, TextInput, formatter } from 'bluerally-design-system';
import { useGetUserMe } from '@/hooks/api/user';

interface Props {
  partyId: number;
  commentList: GetCommentListResponse;
}

export const Comments = ({ partyId, commentList }: Props) => {
  const { mutate: postComment } = usePostPartyComment();
  const { mutate: deleteComment } = useDeletePartyComment();
  const { mutate: updateComment } = useUpdatePartyComment();
  const { data } = useGetUserMe();

  const [editedCommentContent, setEditedCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<number | null>(null);

  const dropdownRef = useRef(null);

  const currentUserId = data?.data.id;

  const { control, handleSubmit, reset } =
    useForm<PostCommentListRequestBody>();

  const addComment: SubmitHandler<{ content: string }> = ({ content }) => {
    postComment({
      partyId,
      content,
    });
    reset();
  };

  const handleEdit = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(content);
  };

  const handleEditSubmit: SubmitHandler<{ content: string }> = ({
    content,
  }) => {
    if (!!editingCommentId) {
      updateComment({
        partyId,
        commentId: editingCommentId,
        content,
      });

      setEditingCommentId(null);
      setEditedCommentContent('');
    }
  };

  const handleDelete = (commentId: number) => {
    deleteComment({
      partyId,
      commentId,
    });
  };

  const handleError: SubmitErrorHandler<PostCommentListResponse> = (error) => {
    console.log(error);
  };

  const iconClick = (id: number) => {
    setIsDropdownOpen(isDropdownOpen === id ? null : id);
  };

  return (
    <>
      {commentList?.map(
        ({ id, commenter_profile, posted_date, content, is_writer }) => (
          <div
            key={id}
            className="relative flex flex-col gap-1 p-5 border-b-1 border-b-500"
          >
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1">
                <span className="text-medium text-md">
                  {commenter_profile.name}
                </span>
                <span className="text-basic text-b-500">
                  {is_writer ? '주최자' : ''}
                </span>
              </div>
              {currentUserId === commenter_profile.user_id && (
                <div
                  className="flex items-center cursor-pointer"
                  ref={dropdownRef}
                >
                  {currentUserId}
                  {id}
                  <EllipsisVerticalIcon
                    size={16}
                    className="text-g-500"
                    onClick={() => iconClick(id)}
                  />
                </div>
              )}
            </div>

            {currentUserId === id && isDropdownOpen === id && (
              <div className="absolute right-0  mt-6 border rounded-xl  w-[100px] bg-g-0 text-g-950 z-50">
                <span
                  onClick={() => handleEdit(id, content)}
                  className="block w-full p-4 text-left"
                >
                  수정
                </span>
                <span
                  onClick={() => handleDelete(id)}
                  className="block w-full px-4 pb-4 text-left"
                >
                  삭제
                </span>
              </div>
            )}

            {editingCommentId === id ? (
              <>
                <div className="font-normal text-b-950 text-md">
                  <TextInput
                    type="text"
                    value={editedCommentContent}
                    onChange={(e) => setEditedCommentContent(e.target.value)}
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outlined"
                    color="gray"
                    onClick={() => setEditingCommentId(null)}
                    width="64px"
                  >
                    취소
                  </Button>
                  <Button
                    variant="filled"
                    color="gray"
                    onClick={() =>
                      handleEditSubmit({ content: editedCommentContent })
                    }
                    width="64px"
                  >
                    등록
                  </Button>
                </div>
              </>
            ) : (
              <div className="font-normal text-b-950 text-md">{content}</div>
            )}
            <span className="text-sm font-light text-g-300">
              {formatter.dateTime(posted_date)}
            </span>
          </div>
        ),
      )}

      {/* TODO: 로그인하지 않았을때 disabled 처리 */}
      <form onSubmit={handleSubmit(addComment, handleError)} className="p-5">
        <FormTextInput
          control={control}
          name="content"
          placeholder="댓글을 입력해주세요"
        />

        <Button color="gray" type="submit" className="text-g-400">
          등록
        </Button>
      </form>
    </>
  );
};
