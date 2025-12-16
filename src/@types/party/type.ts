import { components, operations } from '@/@types/backend';
import { PaginatedResponse } from '@/@types/common';

// 파티리스트
export type GetPartyListQuery =
  operations['get_party_list_api_party_list_get']['parameters']['query'];

// PartyListDetail 타입 (기존 backend.ts에서 정의)
export type PartyListDetail = components['schemas']['PartyListDetail'];

// 페이지네이션 응답 타입
export type GetPartyListResponse = PaginatedResponse<PartyListDetail>;

// 파티상세
export type GetPartyDetailParams =
  operations['get_party_details_api_party_details__party_id__get']['parameters']['path']['party_id'];
export type GetPartyDetailResponse =
  operations['get_party_details_api_party_details__party_id__get']['responses']['200']['content']['application/json'];

// 파티 참여
export type PostParticipateInPartyParams =
  operations['participate_in_party_api_party__party_id__participate_post']['parameters']['path']['party_id'];

// 파티 취소
export type PostCancelParticipateParams =
  operations['participant_change_participation_status_api_party_participants__party_id__status_change_post']['parameters']['path']['party_id'];

export type PostCancelParticipateRequestBody =
  operations['participant_change_participation_status_api_party_participants__party_id__status_change_post']['requestBody']['content']['application/json']['new_status'];

/** 파티 생성 */
export type PostPartyRequestParams =
  operations['create_party_api_party_post']['requestBody']['content']['application/json'];

export type PostPartyResponse = components['schemas']['PartyCreateResponse'];

export type PostCancelParticipate = {
  partyId: PostCancelParticipateParams;
  status: PostCancelParticipateRequestBody;
};

// 파티 수정
export type UpdatePartyRequestParams =
  operations['update_party_api_party__party_id__post']['parameters']['path'];

export type UpdatePartyRequestBody =
  operations['update_party_api_party__party_id__post']['requestBody']['content']['application/json'];

export type UpdatePartyResponse = components['schemas']['PartyUpdateInfo'];

// 파티장 - 파티승인 및 거절
export type PostChangePartyStatusParams =
  operations['organizer_change_participation_status_api_party_organizer__party_id__status_change__participation_id__post']['parameters']['path'];

export type PostChangePartyStatusRequestBody =
  operations['organizer_change_participation_status_api_party_organizer__party_id__status_change__participation_id__post']['requestBody']['content']['application/json'];

export type PostChangePartyStatus = {
  partyId: PostChangePartyStatusParams['party_id'];
  participationId: PostChangePartyStatusParams['participation_id'];
  status: PostChangePartyStatusRequestBody['new_status'];
};

export type GetPartyStatsResponse =
  components['schemas']['UserPartyStatisticsResponse'];
