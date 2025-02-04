/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/api/user/auth/redirect-url/{platform}": {
    get: operations["get_social_login_redirect_url_api_user_auth_redirect_url__platform__get"];
  };
  "/api/user/auth/{platform}": {
    get: operations["social_auth_callback_api_user_auth__platform__get"];
  };
  "/api/user/auth/token": {
    post: operations["login_access_token_api_user_auth_token_post"];
  };
  "/api/user/auth/token/refresh": {
    post: operations["access_token_refresh_api_user_auth_token_refresh_post"];
  };
  "/api/user/auth/logout": {
    post: operations["logout_api_user_auth_logout_post"];
  };
  "/api/user/certificates": {
    get: operations["certificate_level_list_api_user_certificates_get"];
  };
  "/api/user/certificates/{certificate_id}/levels": {
    get: operations["get_certificate_levels_api_user_certificates__certificate_id__levels_get"];
  };
  "/api/user/party/like": {
    get: operations["get_liked_parties_api_user_party_like_get"];
  };
  "/api/user/me": {
    get: operations["get_self_profile_api_user_me_get"];
    post: operations["update_self_profile_api_user_me_post"];
  };
  "/api/user/me/profile-image": {
    post: operations["update_self_profile_image_api_user_me_profile_image_post"];
  };
  "/api/user/profile/{user_id}": {
    get: operations["get_user_profile_api_user_profile__user_id__get"];
  };
  "/api/user/test/token": {
    post: operations["get_test_access_token_api_user_test_token_post"];
  };
  "/api/user/party/stats": {
    get: operations["get_user_party_statisics_api_user_party_stats_get"];
  };
  "/api/party/sports": {
    get: operations["get_sports_list_api_party_sports_get"];
  };
  "/api/party": {
    post: operations["create_party_api_party_post"];
  };
  "/api/party/{party_id}": {
    post: operations["update_party_api_party__party_id__post"];
    /** 파티 삭제 api. */
    delete: operations["delete_party_api_party__party_id__delete"];
  };
  "/api/party/{party_id}/participate": {
    post: operations["participate_in_party_api_party__party_id__participate_post"];
  };
  "/api/party/participants/{party_id}/status-change": {
    post: operations["participant_change_participation_status_api_party_participants__party_id__status_change_post"];
  };
  "/api/party/organizer/{party_id}/status-change/{participation_id}": {
    post: operations["organizer_change_participation_status_api_party_organizer__party_id__status_change__participation_id__post"];
  };
  "/api/party/details/{party_id}": {
    get: operations["get_party_details_api_party_details__party_id__get"];
  };
  "/api/party/list": {
    get: operations["get_party_list_api_party_list_get"];
  };
  "/api/party/{party_id}/comment": {
    get: operations["get_party_comments_api_party__party_id__comment_get"];
    post: operations["post_party_comment_api_party__party_id__comment_post"];
  };
  "/api/party/{party_id}/comment/{comment_id}": {
    put: operations["change_party_comment_api_party__party_id__comment__comment_id__put"];
    delete: operations["delete_party_comment_api_party__party_id__comment__comment_id__delete"];
  };
  "/api/party/like/{party_id}": {
    post: operations["add_liked_party_api_party_like__party_id__post"];
    delete: operations["cancel_liked_party_api_party_like__party_id__delete"];
  };
  "/api/party/me/organized": {
    get: operations["get_self_organized_party_api_party_me_organized_get"];
  };
  "/api/party/me/participated": {
    get: operations["get_participated_party_api_party_me_participated_get"];
  };
  "/api/feedback": {
    post: operations["post_feedback_api_feedback_post"];
  };
  "/api/notifications": {
    get: operations["get_user_notifications_api_notifications_get"];
  };
  "/api/notifications/read": {
    post: operations["read_user_notifications_api_notifications_read_post"];
  };
  "/api/notifications/count": {
    get: operations["get_notification_count_api_notifications_count_get"];
  };
  "/admin/feedback": {
    get: operations["list_feedback_admin_feedback_get"];
  };
  "/admin/feedback/{feedback_id}": {
    get: operations["view_feedback_admin_feedback__feedback_id__get"];
  };
  "/admin/feedback/{feedback_id}/delete": {
    post: operations["delete_feedback_admin_feedback__feedback_id__delete_post"];
  };
  "/admin/users": {
    get: operations["list_users_admin_users_get"];
  };
  "/admin/users/{user_id}": {
    get: operations["view_user_admin_users__user_id__get"];
  };
  "/admin/users/{user_id}/toggle-active": {
    post: operations["toggle_user_active_admin_users__user_id__toggle_active_post"];
  };
  "/api/health": {
    get: operations["api_health_check_api_health_get"];
  };
}

export interface components {
  schemas: {
    AccessTokenRequest: {
      user_uid: string;
    };
    AccessTokenResponse: {
      access_token?: string;
      refresh_token?: string;
      user_info: components["schemas"]["UserInfo"];
      is_new_user: boolean;
    };
    Body_update_self_profile_image_api_user_me_profile_image_post: {
      profile_image?: Partial<string> & Partial<unknown>;
    };
    FeedbackRequest: {
      content: string;
    };
    HTTPValidationError: {
      detail?: components["schemas"]["ValidationError"][];
    };
    LoginResponse: {
      access_token?: string;
      refresh_token?: string;
      user_info: components["schemas"]["UserInfo"];
    };
    NotificationDto: {
      type: string;
      classification?: Partial<string> & Partial<unknown>;
      related_id?: Partial<number> & Partial<unknown>;
      message: string;
      is_global: boolean;
      id: number;
      created_at: string;
      is_read: boolean;
    };
    NotificationListDto: {
      notifications: components["schemas"]["NotificationDto"][];
      total_pages: number;
    };
    NotificationReadRequest: {
      read_notification_list: number[];
    };
    NotificationUnreadCountDto: {
      count: number;
    };
    ParticipantProfile: {
      user_id: number;
      profile_picture: string;
      name: string;
      participation_id?: Partial<number> & Partial<unknown>;
      is_organizer?: boolean;
    };
    ParticipationStatus: 0 | 1 | 2 | 3;
    PartyCommentDetail: {
      id: number;
      commenter_profile: components["schemas"]["UserSimpleProfile"];
      posted_date: string;
      content: string;
      is_writer?: Partial<boolean> & Partial<unknown>;
    };
    PartyCommentPostRequest: {
      content: string;
    };
    PartyCreateResponse: {
      party_id: number;
    };
    PartyDetail: {
      id: number;
      title: string;
      sport_name: string;
      gather_date: string;
      gather_time: string;
      price: number;
      body: string;
      organizer_profile: components["schemas"]["UserSimpleProfile"];
      posted_date: string;
      is_active: boolean;
      max_participants: number;
      current_participants: number;
      is_user_organizer?: boolean;
      pending_participants?: Partial<
        components["schemas"]["ParticipantProfile"][]
      > &
        Partial<unknown>;
      approved_participants?: Partial<
        components["schemas"]["ParticipantProfile"][]
      > &
        Partial<unknown>;
      notice?: Partial<string> & Partial<unknown>;
      place_name: string;
      place_id: Partial<number> & Partial<unknown>;
      address: string;
      longitude: number;
      latitude: number;
    };
    PartyDetailRequest: {
      title: string;
      body?: Partial<string> & Partial<unknown>;
      gather_date: string;
      gather_time: string;
      place_id?: Partial<number> & Partial<unknown>;
      place_name: string;
      address: string;
      longitude: number;
      latitude: number;
      participant_limit?: number;
      participant_cost?: number;
      sport_id: number;
      notice?: Partial<string> & Partial<unknown>;
    };
    PartyListDetail: {
      id: number;
      title: string;
      sport_name: string;
      gather_date: string;
      gather_time: string;
      price: number;
      body: string;
      organizer_profile: components["schemas"]["UserSimpleProfile"];
      posted_date: string;
      is_active: boolean;
      participants_info: string;
      is_user_organizer?: boolean;
      place_name: string;
      place_id: Partial<number> & Partial<unknown>;
      address: string;
      longitude: number;
      latitude: number;
    };
    PartyParticipationStatusChangeResponse: {
      participation_id: number;
      status: components["schemas"]["ParticipationStatus"];
    };
    PartyUpdateInfo: {
      id: number;
      title: string;
      sport_name: string;
      gather_date: string;
      gather_time: string;
      price: number;
      body: string;
      organizer_profile: components["schemas"]["UserSimpleProfile"];
      posted_date: string;
      is_active: boolean;
      updated_at: string;
      notice?: Partial<string> & Partial<unknown>;
    };
    PartyUpdateRequest: {
      title?: Partial<string> & Partial<unknown>;
      body?: Partial<string> & Partial<unknown>;
      gather_date?: Partial<string> & Partial<unknown>;
      gather_time?: Partial<string> & Partial<unknown>;
      place_id?: Partial<number> & Partial<unknown>;
      place_name?: Partial<string> & Partial<unknown>;
      address?: Partial<string> & Partial<unknown>;
      longitude?: Partial<number> & Partial<unknown>;
      latitude?: Partial<number> & Partial<unknown>;
      participant_limit?: Partial<number> & Partial<unknown>;
      participant_cost?: Partial<number> & Partial<unknown>;
      sport_id?: Partial<number> & Partial<unknown>;
      notice?: Partial<string> & Partial<unknown>;
    };
    RedirectUrlInfoResponse: {
      redirect_url: string;
    };
    SelfProfileResponse: {
      id: number;
      name: string;
      email: string;
      introduction: Partial<string> & Partial<unknown>;
      profile_image: Partial<string> & Partial<unknown>;
      interested_sports: Partial<components["schemas"]["SportInfo"][]> &
        Partial<unknown>;
    };
    SocialAuthPlatform: "google" | "kakao" | "naver";
    SportInfo: {
      id: number;
      name: string;
    };
    TestTokenInfo: {
      access_token?: string;
      refresh_token?: string;
      user_id: number;
    };
    UserInfo: {
      sns_id?: Partial<string> & Partial<unknown>;
      name?: Partial<string> & Partial<unknown>;
      email?: Partial<string> & Partial<unknown>;
      profile_image?: Partial<string> & Partial<unknown>;
    };
    UserPartyStatisticsResponse: {
      created_count: number;
      participated_count: number;
      liked_count: number;
    };
    UserProfileUpdateRequest: {
      name?: Partial<string> & Partial<unknown>;
      email?: Partial<string> & Partial<unknown>;
      introduction?: Partial<string> & Partial<unknown>;
      interested_sports_ids?: Partial<number[]> & Partial<unknown>;
    };
    UserSimpleProfile: {
      user_id: number;
      profile_picture: string;
      name: string;
    };
    ValidationError: {
      loc: (Partial<string> & Partial<number>)[];
      msg: string;
      type: string;
    };
    certificate_levels: {
      id: number;
      level: string;
    };
    certificate_name: {
      id: number;
      name: string;
    };
    parties__dto__request__RefreshTokenRequest: {
      new_status: components["schemas"]["ParticipationStatus"];
    };
    sports_name: {
      id: number;
      name: string;
    };
    users__dto__request__RefreshTokenRequest: {
      refresh_token: string;
    };
  };
}

export interface operations {
  get_social_login_redirect_url_api_user_auth_redirect_url__platform__get: {
    parameters: {
      path: {
        platform: components["schemas"]["SocialAuthPlatform"];
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["RedirectUrlInfoResponse"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  social_auth_callback_api_user_auth__platform__get: {
    parameters: {
      path: {
        platform: components["schemas"]["SocialAuthPlatform"];
      };
      query: {
        code: string;
        error?: Partial<string> & Partial<unknown>;
        error_description?: Partial<string> & Partial<unknown>;
      };
    };
    responses: {
      /** Successful Response */
      307: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  login_access_token_api_user_auth_token_post: {
    responses: {
      /** Successful Response */
      201: {
        content: {
          "application/json": components["schemas"]["AccessTokenResponse"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["AccessTokenRequest"];
      };
    };
  };
  access_token_refresh_api_user_auth_token_refresh_post: {
    responses: {
      /** Successful Response */
      201: {
        content: {
          "application/json": components["schemas"]["LoginResponse"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["users__dto__request__RefreshTokenRequest"];
      };
    };
  };
  logout_api_user_auth_logout_post: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
    };
  };
  certificate_level_list_api_user_certificates_get: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["certificate_name"][];
        };
      };
    };
  };
  get_certificate_levels_api_user_certificates__certificate_id__levels_get: {
    parameters: {
      path: {
        certificate_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["certificate_levels"][];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_liked_parties_api_user_party_like_get: {
    parameters: {
      query: {
        page?: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["PartyListDetail"][];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_self_profile_api_user_me_get: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["SelfProfileResponse"];
        };
      };
    };
  };
  update_self_profile_api_user_me_post: {
    responses: {
      /** Successful Response */
      201: {
        content: {
          "application/json": components["schemas"]["SelfProfileResponse"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserProfileUpdateRequest"];
      };
    };
  };
  update_self_profile_image_api_user_me_profile_image_post: {
    responses: {
      /** Successful Response */
      201: {
        content: {
          "application/json": components["schemas"]["SelfProfileResponse"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "multipart/form-data": components["schemas"]["Body_update_self_profile_image_api_user_me_profile_image_post"];
      };
    };
  };
  get_user_profile_api_user_profile__user_id__get: {
    parameters: {
      path: {
        user_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["SelfProfileResponse"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_test_access_token_api_user_test_token_post: {
    parameters: {
      query: {
        user_id: number;
      };
    };
    responses: {
      /** Successful Response */
      201: {
        content: {
          "application/json": components["schemas"]["TestTokenInfo"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_user_party_statisics_api_user_party_stats_get: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["UserPartyStatisticsResponse"];
        };
      };
    };
  };
  get_sports_list_api_party_sports_get: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["sports_name"][];
        };
      };
    };
  };
  create_party_api_party_post: {
    responses: {
      /** Successful Response */
      201: {
        content: {
          "application/json": components["schemas"]["PartyCreateResponse"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PartyDetailRequest"];
      };
    };
  };
  update_party_api_party__party_id__post: {
    parameters: {
      path: {
        party_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["PartyUpdateInfo"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PartyUpdateRequest"];
      };
    };
  };
  /** 파티 삭제 api. */
  delete_party_api_party__party_id__delete: {
    parameters: {
      path: {
        party_id: number;
      };
    };
    responses: {
      /** Party deleted successfully. */
      204: never;
      /** User is not the organizer. */
      403: unknown;
      /** Party not found. */
      404: unknown;
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  participate_in_party_api_party__party_id__participate_post: {
    parameters: {
      path: {
        party_id: number;
      };
    };
    responses: {
      /** Successful Response */
      201: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  participant_change_participation_status_api_party_participants__party_id__status_change_post: {
    parameters: {
      path: {
        party_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["PartyParticipationStatusChangeResponse"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["parties__dto__request__RefreshTokenRequest"];
      };
    };
  };
  organizer_change_participation_status_api_party_organizer__party_id__status_change__participation_id__post: {
    parameters: {
      path: {
        party_id: number;
        participation_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["PartyParticipationStatusChangeResponse"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["parties__dto__request__RefreshTokenRequest"];
      };
    };
  };
  get_party_details_api_party_details__party_id__get: {
    parameters: {
      path: {
        party_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["PartyDetail"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_party_list_api_party_list_get: {
    parameters: {
      query: {
        sport_id?: Partial<number[]> & Partial<unknown>;
        is_active?: Partial<boolean> & Partial<unknown>;
        gather_date_min?: Partial<string> & Partial<unknown>;
        gather_date_max?: Partial<string> & Partial<unknown>;
        search_query?: Partial<string> & Partial<unknown>;
        page?: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["PartyListDetail"][];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_party_comments_api_party__party_id__comment_get: {
    parameters: {
      path: {
        party_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["PartyCommentDetail"][];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  post_party_comment_api_party__party_id__comment_post: {
    parameters: {
      path: {
        party_id: number;
      };
    };
    responses: {
      /** Successful Response */
      201: {
        content: {
          "application/json": components["schemas"]["PartyCommentDetail"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PartyCommentPostRequest"];
      };
    };
  };
  change_party_comment_api_party__party_id__comment__comment_id__put: {
    parameters: {
      path: {
        party_id: number;
        comment_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["PartyCommentDetail"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PartyCommentPostRequest"];
      };
    };
  };
  delete_party_comment_api_party__party_id__comment__comment_id__delete: {
    parameters: {
      path: {
        party_id: number;
        comment_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  add_liked_party_api_party_like__party_id__post: {
    parameters: {
      path: {
        party_id: number;
      };
    };
    responses: {
      /** Successful Response */
      201: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  cancel_liked_party_api_party_like__party_id__delete: {
    parameters: {
      path: {
        party_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_self_organized_party_api_party_me_organized_get: {
    parameters: {
      query: {
        page?: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["PartyListDetail"][];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_participated_party_api_party_me_participated_get: {
    parameters: {
      query: {
        page?: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["PartyListDetail"][];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  post_feedback_api_feedback_post: {
    responses: {
      /** Successful Response */
      201: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["FeedbackRequest"];
      };
    };
  };
  get_user_notifications_api_notifications_get: {
    parameters: {
      query: {
        page?: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["NotificationListDto"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  read_user_notifications_api_notifications_read_post: {
    responses: {
      /** Successful Response */
      201: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["NotificationReadRequest"];
      };
    };
  };
  get_notification_count_api_notifications_count_get: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["NotificationUnreadCountDto"];
        };
      };
    };
  };
  list_feedback_admin_feedback_get: {
    parameters: {
      query: {
        page?: number;
        search?: Partial<string> & Partial<unknown>;
        page_size?: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  view_feedback_admin_feedback__feedback_id__get: {
    parameters: {
      path: {
        feedback_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  delete_feedback_admin_feedback__feedback_id__delete_post: {
    parameters: {
      path: {
        feedback_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": { [key: string]: boolean };
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  list_users_admin_users_get: {
    parameters: {
      query: {
        page?: number;
        search?: Partial<string> & Partial<unknown>;
        page_size?: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  view_user_admin_users__user_id__get: {
    parameters: {
      path: {
        user_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  toggle_user_active_admin_users__user_id__toggle_active_post: {
    parameters: {
      path: {
        user_id: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": { [key: string]: unknown };
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  api_health_check_api_health_get: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": string;
        };
      };
    };
  };
}

export interface external {}
