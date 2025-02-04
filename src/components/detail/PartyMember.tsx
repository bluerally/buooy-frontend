import { PARTICIPATE_STATUS } from '@/@types/common';
import { GetPartyDetailResponse } from '@/@types/party/type';
import { usePostStatusChangeParticipate } from '@/hooks/api/party';
import { Badge, Button, useNotification } from 'buooy-design-system';
import { Divider } from '../common/Divider';
import { ProfileImage } from '../common/ProfileImage';

type Props = {
  partyDetail?: GetPartyDetailResponse;
};

export const PartyMember = ({ partyDetail }: Props) => {
  const { mutate: statusChange } = usePostStatusChangeParticipate();
  const notification = useNotification();

  const partyId = partyDetail?.id ?? 0;

  const pendingParticipants = (partyDetail?.pending_participants || []).map(
    (participant) => ({
      ...participant,
      approved: false,
    }),
  );

  const approvedParticipants = (partyDetail?.approved_participants || []).map(
    (participant) => ({
      ...participant,
      approved: true,
    }),
  );

  const partyList = partyDetail?.is_user_organizer
    ? [...approvedParticipants, ...pendingParticipants]
    : approvedParticipants;

  const handleConfirmParticipation = (participationId?: number) => {
    if (!participationId) {
      return;
    }

    notification.alert({
      type: 'confirm',
      title: '모임 신청 수락',
      content:
        '모임 신청을 수락하시겠습니까? 수락하면 해당 신청자가 모임원이 됩니다.',
      confirmButtonText: '수락',
      cancelButtonText: '거절',
      onConfirm: () =>
        statusChange({
          partyId,
          participationId,
          status: PARTICIPATE_STATUS.APPROVED,
        }),
    });
  };

  const handleRejectParticipation = (participationId?: number) => {
    if (!participationId) {
      return;
    }

    notification.alert({
      type: 'error',
      title: '모임 신청 거절',
      content: '모임 신청을 거절하시겠습니까?',
      cancelButtonText: '취소',
      confirmButtonText: '거절',
      onConfirm: () =>
        statusChange({
          partyId,
          participationId,
          status: PARTICIPATE_STATUS.REJECTED,
        }),
    });
  };

  const handleCancelParticipation = (participationId?: number) => {
    if (!participationId) {
      return;
    }

    notification.alert({
      type: 'error',
      title: '모임 내보내기',
      content: '해당 모임원을 내보내시겠습니까?',
      cancelButtonText: '취소',
      confirmButtonText: '내보내기',
      onConfirm: () =>
        statusChange({
          partyId,
          participationId,
          status: PARTICIPATE_STATUS.CANCELLED,
        }),
    });
  };

  return (
    <div className={`${partyDetail?.is_user_organizer ? 'mb-16' : 'mb-32'}`}>
      {partyList?.map(
        (
          {
            user_id,
            name,
            profile_picture,
            participation_id,
            is_organizer,
            approved,
          },
          index,
        ) => {
          return (
            <>
              <div key={user_id} className="flex justify-between px-5 py-4">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center min-w-14">
                        <ProfileImage image={profile_picture} size="md" />
                      </div>
                      <div className="flex flex-col">
                        <span className="cursor-pointer">{name}</span>
                      </div>
                    </div>
                  </div>
                  {is_organizer && (
                    <Badge variant="primary-outline">모임장</Badge>
                  )}
                  {!is_organizer && approved && (
                    <Badge variant="gray-outline">모임원</Badge>
                  )}
                  {!is_organizer && !approved && (
                    <Badge variant="gray-filled">신청자</Badge>
                  )}
                </div>
                <div className="flex items-center pl-6 ">
                  {partyDetail?.is_user_organizer &&
                    !is_organizer &&
                    approved && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="gray-outline"
                          onClick={() =>
                            handleCancelParticipation(participation_id)
                          }
                        >
                          내보내기
                        </Button>
                      </div>
                    )}
                  {partyDetail?.is_user_organizer && !approved && (
                    <div className="flex gap-2 pl-6 min-w-36">
                      <Button
                        size="sm"
                        variant="red-outline"
                        onClick={() =>
                          handleRejectParticipation(participation_id)
                        }
                      >
                        거절
                      </Button>
                      <Button
                        size="sm"
                        variant="primary-outline"
                        onClick={() =>
                          handleConfirmParticipation(participation_id)
                        }
                      >
                        승인
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {index !== partyList.length - 1 && <Divider />}
            </>
          );
        },
      )}
    </div>
  );
};
