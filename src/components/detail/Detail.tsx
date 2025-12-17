import { PARTICIPATE_STATUS } from '@/@types/common';
import { useGetPartyCommentList } from '@/hooks/api/comment';
import { useDeleteLike, useGetLikeList, usePostLike } from '@/hooks/api/like';
import {
  useDeleteParty,
  useGetPartyDetails,
  usePostCancelParticipate,
  usePostParticipateInParty,
} from '@/hooks/api/party';
import { useGetUserMe } from '@/hooks/api/user';
import { useAuth } from '@/hooks/useAuth';
import { useCopyClipboard } from '@/hooks/useCopyClipboard';
import {
  Button,
  Chip,
  Tabs,
  theme,
  useNotification,
  useSnackbar,
} from 'buooy-design-system';
import dayjs from 'dayjs';
import {
  Calendar,
  ChevronLeft,
  Copy,
  EllipsisVerticalIcon,
  Heart,
  Info,
  MapPinIcon,
  Pencil,
  Share,
  Trash2,
  Users,
  Waves,
} from 'lucide-react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Divider } from '../common/Divider';
import { Loading } from '../common/Loading';
import { Map } from '../common/Map';
import { Header } from '../layouts/Header';
import { Comments } from './Comments';
import { PartyMember } from './PartyMember';
import { ProfileLabel } from '../common/ProfileLabel';

export const Detail = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const notification = useNotification();
  const snackbar = useSnackbar();
  const copyToClipboard = useCopyClipboard();

  const { partyId: id } = router.query;

  const partyId = typeof id === 'string' ? Number(id) : undefined;
  const isValidPartyId = router.isReady && partyId !== undefined && !isNaN(partyId);

  const { data, isLoading } = useGetPartyDetails(partyId, isValidPartyId);
  const { data: commentListData } = useGetPartyCommentList(partyId, isValidPartyId);
  const { data: currentUserData } = useGetUserMe(isLoggedIn);
  const { data: likeData } = useGetLikeList(isLoggedIn);

  const { mutate: participateInParty } = usePostParticipateInParty();
  const { mutate: cancel } = usePostCancelParticipate();
  const { mutate: addLike } = usePostLike();
  const { mutate: cancelLike } = useDeleteLike();
  const { mutate: deleteParty } = useDeleteParty();

  const [selected, setSelected] = useState('comment');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const commentList = commentListData?.data;
  const partyDetail = data?.data;
  const currentUser = currentUserData?.data;
  const likeListData = likeData?.data?.items;
  const likeList = Array.isArray(likeListData) ? likeListData : [];

  const pendingParticipants = partyDetail?.pending_participants ?? [];
  const approvedParticipants = partyDetail?.approved_participants ?? [];

  const pendingParticipantsLength =
    partyDetail?.pending_participants?.length ?? 0;
  const approvedParticipantsLength =
    partyDetail?.approved_participants?.length ?? 0;

  const isLikeParty = likeList.some(({ id }) => id === partyId);

  const isNotPartyMember = !approvedParticipants.some(
    (participant) => currentUser?.id === participant?.user_id,
  );

  const isPendingParticipants = pendingParticipants.some(
    (participant) => currentUser?.id === participant?.user_id,
  );

  const handleParticipate = () => {
    if (!partyId) return;
    notification.alert({
      type: 'confirm',
      title: '모임 참여',
      content: '모임에 참여하시겠습니까?',
      onConfirm: () =>
        participateInParty(partyId, {
          onSuccess: () => {
            snackbar.success({ content: '모임참여가 신청되었습니다.' });
          },
        }),
    });
  };

  const handleCancelParticipate = () => {
    if (!partyId) return;
    notification.alert({
      type: 'error',
      title: '모임 신청 취소',
      content: '모임 신청을 취소하시겠습니까?',
      onConfirm: () =>
        cancel(
          {
            partyId,
            status: PARTICIPATE_STATUS.CANCELLED,
          },
          {
            onSuccess: () => {
              snackbar.success({ content: '모임 신청이 취소되었습니다.' });
            },
          },
        ),
    });
  };

  const handleParticipateCancel = () => {
    if (!partyId) return;
    notification.alert({
      type: 'error',
      title: '모임 나가기',
      content: '모임에서 나가시겠습니까?',
      confirmButtonText: '나가기',
      onConfirm: () =>
        cancel(
          {
            partyId,
            status: PARTICIPATE_STATUS.CANCELLED,
          },
          {
            onSuccess: () => {
              snackbar.success({ content: '모임 나가기가 완료되었습니다.' });
            },
          },
        ),
    });
  };

  const handleAddLike = () => {
    if (!partyId) return;
    if (isLikeParty) {
      cancelLike(partyId, {
        onSuccess: () => {
          snackbar.success({ content: '관심목록에서 삭제되었습니다.' });
        },
      });
      return;
    }

    addLike(partyId, {
      onSuccess: () => {
        snackbar.success({ content: '관심목록에 추가되었습니다.' });
      },
    });
  };

  const handleTabChange = useCallback(
    (value: string) => {
      setSelected(value);
    },
    [setSelected],
  );

  const handleCopyAddress = () => {
    if (!partyDetail?.place_name.trim() && !partyDetail?.address.trim()) {
      return;
    }

    copyToClipboard({
      value:
        partyDetail?.place_name.trim() === ''
          ? partyDetail?.address
          : partyDetail?.place_name,
      alertMessage: '장소가 복사되었습니다.',
      errorMessage: '장소 복사에 실패했습니다.',
    });
  };

  const handleCopyLink = async () => {
    const currentPath = `${window.location.origin}${router.asPath}`;

    if (window.navigator.share) {
      try {
        await window.navigator.share({
          title: '내 게시물',
          url: currentPath,
        });
      } catch (error) {
        if ((error as any).name === 'AbortError') {
          return;
        }

        snackbar.warning({
          content: error instanceof Error ? error.message : String(error),
        });
      }
    } else {
      copyToClipboard({
        value: currentPath,
        alertMessage: '링크가 복사되었습니다.',
        errorMessage: '링크 복사에 실패했습니다.',
      });
    }
  };

  const handleModify = () => {
    if (!partyId) return;
    router.push(`/modify-party/${partyId}`);
  };

  const handleDelete = () => {
    if (!partyId) return;
    notification.alert({
      type: 'confirm',
      title: '모임 삭제',
      content: '모임을 삭제하시겠습니까?',
      onConfirm: () => deleteParty(String(partyId)),
    });
  };

  useEffect(() => {
    if (router.isReady && !isLoading && !data && isValidPartyId) {
      router.push('/404');
    }
  }, [router.isReady, isLoading, data, isValidPartyId, router]);

  if (!router.isReady || isLoading || !data || !partyId) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        left={
          <ChevronLeft
            size={24}
            onClick={() => router.push('/')}
            strokeWidth={1.5}
          />
        }
        right={
          <div className="flex gap-4">
            <Share size={24} onClick={handleCopyLink} strokeWidth={1.5} />
            {partyDetail?.is_user_organizer && (
              <>
                <EllipsisVerticalIcon
                  size={24}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  strokeWidth={1.5}
                />
                {isDropdownOpen && (
                  <div className="absolute right-3 text-md mt-8 border rounded-xl w-[120px] bg-g-0 text-g-950 z-50  shadow-md">
                    <div
                      onClick={handleModify}
                      className="flex items-center w-full gap-2 px-5 py-4 text-left cursor-pointer"
                    >
                      <Pencil size={16} strokeWidth={1.5} />
                      <span>수정</span>
                    </div>
                    <span
                      onClick={handleDelete}
                      className="flex items-center w-full gap-2 px-5 pb-4 text-left cursor-pointer text-error-300"
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                      삭제
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        }
      />

      <div className="flex flex-col flex-grow h-[calc(100vh-146px)]">
        <div className="p-5">
          <div className="pb-3">
            <Chip variant="gray-filled" size="sm">
              {partyDetail?.sport_name}
            </Chip>
          </div>
          <div className="max-w-[600px] ">
            <div className="text-3xl font-semibold break-words text-g-900">
              {partyDetail?.title}
            </div>
          </div>

          <div className="py-4">
            <ProfileLabel
              user={partyDetail?.organizer_profile}
              description={
                <>
                  {dayjs(partyDetail?.posted_date ?? '').format(
                    'YYYY.MM.DD HH:mm',
                  )}
                </>
              }
              size="md"
            />
          </div>

          <Divider />
          <div className="max-w-[600px] ">
            <p className="text-lg break-words py-7 text-g-950">
              {partyDetail?.body.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < partyDetail.body.split('\n').length - 1 && (
                    <br />
                  )}{' '}
                </span>
              ))}
            </p>
          </div>

          <Divider />
          <div className="py-5">
            <div className="flex items-center gap-1 text-g-600 pb-1.5">
              <Waves size={14} />
              <div className="flex items-center space-x-7 text-basic-2">
                <span>스포츠</span>
                <span>{partyDetail?.sport_name}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-g-600  pb-1.5">
              <Calendar size={14} />
              <div className="flex items-center space-x-7 text-basic-2">
                <span>모임일</span>
                <span>
                  {dayjs(partyDetail?.gather_date).format('YYYY.MM.DD')}{' '}
                  {partyDetail?.gather_time}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-g-600  pb-1.5">
              <Users size={14} />
              <div className="flex items-center space-x-7 text-basic-2">
                <span>인원수</span>
                <span>
                  {partyDetail?.current_participants}/
                  {partyDetail?.max_participants}명
                </span>
              </div>
            </div>
          </div>

          {/* 주소 */}
          <div className="text-basic-2">
            <div className="w-full h-[160px]">
              <Map address={partyDetail?.address ?? ''} />
            </div>
            <div className="flex items-center justify-between gap-1 mt-2">
              <div className="flex items-center gap-1">
                <MapPinIcon size={20} className="text-g-500" />
                <span className="text-g-600">
                  {partyDetail?.place_name.trim() === ''
                    ? partyDetail?.address
                    : partyDetail?.place_name}
                </span>
              </div>
              <Button
                variant="gray-outline"
                size="sm"
                onClick={handleCopyAddress}
              >
                <Copy size={14} className="text-g-600" />
                복사
              </Button>
            </div>
          </div>

          {/* 추가정보 */}
          {(!isNotPartyMember || partyDetail?.is_user_organizer) &&
            partyDetail?.notice && (
              <div className="px-5 py-3 mt-5 bg-g-50 text-basic-2 rounded-2xl">
                <div className="flex items-center gap-1">
                  <Info
                    size={16}
                    className="text-g-500"
                    fill={theme.palette.warning}
                    color={theme.palette.white}
                  />
                  <span className="font-semibold text-g-600">추가정보</span>
                </div>
                <div className="pt-2 text-md text-g-600">
                  {partyDetail?.notice}
                </div>
              </div>
            )}
        </div>

        <div className="bg-g-0">
          <div className="h-2 bg-g-100"></div>
          <Tabs
            onTabChange={handleTabChange}
            selected={selected}
            items={
              isLoggedIn && !isNotPartyMember
                ? [
                    {
                      label: `댓글 ${commentList?.length ?? 0}`,
                      value: 'comment',
                      content: (
                        <Comments
                          partyDetail={partyDetail}
                          partyId={partyId}
                          commentList={commentList ?? []}
                        />
                      ),
                    },
                    {
                      label: `${
                        partyDetail?.is_user_organizer ? '멤버관리' : '모임원'
                      }
            ${pendingParticipantsLength + approvedParticipantsLength}
            `,
                      value: 'party',
                      content: <PartyMember partyDetail={partyDetail} />,
                    },
                  ]
                : [
                    {
                      label: `댓글 ${commentList?.length ?? 0}`,
                      value: 'comment',
                      content: (
                        <Comments
                          partyDetail={partyDetail}
                          partyId={partyId}
                          commentList={commentList ?? []}
                        />
                      ),
                    },
                  ]
            }
          />
        </div>
      </div>

      {/* footer */}
      {isLoggedIn && !partyDetail?.is_user_organizer && (
        <div className="flex items-center gap-4 p-5 justify-between fixed bottom-0 left-0 right-0 bg-g-0 z-50 max-w-[600px] mx-auto border-t border-g-100">
          {isLikeParty ? (
            <div
              className="cursor-pointer text-error-300"
              onClick={handleAddLike}
            >
              <Heart size={28} className="fill-current" strokeWidth={1.5} />
            </div>
          ) : (
            <Heart
              size={28}
              className="cursor-pointer text-g-400"
              onClick={handleAddLike}
              strokeWidth={1.5}
            />
          )}

          {!partyDetail?.is_active && (
            <Button width="100%" size="lg" disabled>
              마감
            </Button>
          )}
          {partyDetail?.is_active &&
            isNotPartyMember &&
            !isPendingParticipants && (
              <Button width="100%" size="lg" onClick={handleParticipate}>
                신청하기
              </Button>
            )}
          {partyDetail?.is_active &&
            isNotPartyMember &&
            isPendingParticipants && (
              <Button
                variant="red-outline"
                width="100%"
                size="lg"
                onClick={handleCancelParticipate}
              >
                신청취소
              </Button>
            )}
          {partyDetail?.is_active &&
            !isNotPartyMember &&
            !isPendingParticipants && (
              <Button
                variant="gray-outline"
                width="100%"
                size="lg"
                onClick={handleParticipateCancel}
              >
                모임 나가기
              </Button>
            )}
        </div>
      )}
    </div>
  );
};
