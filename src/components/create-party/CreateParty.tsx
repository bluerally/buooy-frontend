import { useEffect, useState } from 'react';

import { Header } from '@/components/layouts/Header';
import { useGetSports } from '@/hooks/api/common';
import { usePostCreateParty, usePostUpdateParty } from '@/hooks/api/party';

import {
  GetPartyDetailResponse,
  PostPartyRequestParams,
} from '@/@types/party/type';
import { SPORTS } from '@/constants/common';
import { generateTimeOptions } from '@/utils';
import {
  Button,
  Chip,
  DatePicker,
  Select,
  TextArea,
  TextInput,
  formatter,
  useNotification,
} from 'buooy-design-system';
import dayjs from 'dayjs';
import { Info, Map, MapPin, X } from 'lucide-react';
import { useRouter } from 'next/router';
import SearchAddressModal from './SearchAddressModal';

const PARTICIPANT_COUNT = Array.from({ length: 29 }, (_, i) => ({
  value: i + 2,
  title: `${i + 2}명`,
}));

type Props = {
  partyDetail?: GetPartyDetailResponse;
  isModify?: boolean;
};

export const CreateParty = ({ partyDetail, isModify }: Props) => {
  const router = useRouter();

  const { partyId: id } = router.query;

  const { data: sportsData } = useGetSports();
  const { mutate: createParty } = usePostCreateParty();
  const { mutate: updateParty } = usePostUpdateParty(id as string);

  const [params, setParams] = useState<PostPartyRequestParams>({
    title: '',
    body: '',
    gather_date: '',
    gather_time: '',
    place_name: '',
    address: '',
    longitude: 0,
    latitude: 0,
    participant_limit: 2,
    participant_cost: 0,
    sport_id: 1,
    notice: '',
  });

  const [validationStatus, setValidationStatus] = useState({
    title: true,
    body: true,
    gather_date: true,
    gather_time: true,
    sport_id: true,
    participant_limit: true,
    address: true,
  });

  const [errorMessages, setErrorMessages] = useState({
    title: '',
    body: '',
    gather_date: '',
    gather_time: '',
    sport_id: '',
    participant_limit: '',
  });

  const [timeOptions, setTimeOptions] = useState(
    generateTimeOptions(params.gather_date),
  );

  const [isOpenPostcode, setIsOpenPostcode] = useState(false);

  const notification = useNotification();

  const sports = sportsData?.data ?? [];

  useEffect(() => {
    if (partyDetail) {
      const {
        title,
        body,
        gather_date,
        gather_time,
        // 주소
        address,
        // 상세주소
        place_name,
        // 추가정보
        notice,
        max_participants,
        sport_name,
        longitude,
        latitude,
      } = partyDetail;

      setParams({
        title,
        body,
        gather_date,
        gather_time,
        address,
        place_name,
        longitude,
        latitude,
        participant_limit: max_participants,
        sport_id: SPORTS.find(({ name }) => name === sport_name)?.id ?? 0,
        notice,
      });
    }
  }, [partyDetail]);

  useEffect(() => {
    setTimeOptions(generateTimeOptions(params.gather_date));
  }, [params.gather_date]);

  const handleChangeField = ({
    value,
    name,
  }: {
    value: string | number;
    name: string;
  }) => {
    // 유효성 상태를 초기화
    if (name === 'title') {
      setValidationStatus((prev) => ({ ...prev, title: true }));
      setErrorMessages((prev) => ({ ...prev, title: '' }));
    }
    if (name === 'body') {
      setValidationStatus((prev) => ({ ...prev, body: true }));
      setErrorMessages((prev) => ({ ...prev, body: '' }));
    }
    if (name === 'gather_date') {
      setValidationStatus((prev) => ({ ...prev, gather_date: true }));
      setErrorMessages((prev) => ({ ...prev, gather_date: '' }));
    }
    if (name === 'gather_time') {
      setValidationStatus((prev) => ({ ...prev, gather_time: true }));
      setErrorMessages((prev) => ({ ...prev, gather_time: '' }));
    }

    if (name === 'address') {
      setValidationStatus((prev) => ({ ...prev, address: true }));
      setErrorMessages((prev) => ({ ...prev, address: '' }));
    }
    setParams({ ...params, [name]: value });
  };

  const handleSelectAddress = (address: string) => {
    setParams({ ...params, address });
    setIsOpenPostcode(false);
  };

  const validateFields = () => {
    let isValid = true;
    const newValidationStatus = { ...validationStatus };
    const newErrorMessages = {
      title: '',
      body: '',
      gather_date: '',
      gather_time: '',
      sport_id: '',
      participant_limit: '',
    };

    if (!params.gather_date) {
      newValidationStatus.gather_date = false;
      newErrorMessages.gather_date = '일자를 입력해주세요';
      isValid = false;
    }

    if (!params.gather_time) {
      newValidationStatus.gather_time = false;
      newErrorMessages.gather_time = '모임 시작 시간을 입력해주세요';
      isValid = false;
    }

    if (!params.title.trim()) {
      newValidationStatus.title = false;
      newErrorMessages.title = '제목을 입력해주세요';
      isValid = false;
    }

    if (!params.body?.trim()) {
      newValidationStatus.body = false;
      newErrorMessages.body = '내용을 입력해주세요';
      isValid = false;
    }

    if (!params.address) {
      newValidationStatus.address = false;
      isValid = false;
    }

    setValidationStatus(newValidationStatus);
    setErrorMessages(newErrorMessages);
    return isValid;
  };

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    notification.alert({
      type: 'confirm',
      title: '모임 개설',
      content: '모임을 개설하시겠습니까?',
      onConfirm: () => {
        if (isModify) {
          updateParty(
            {
              partyId: id as string,
              partyDetail: params,
            },
            {
              onSuccess(data) {
                notification.alert({
                  type: 'alert',
                  title: '모임이 성공적으로 수정되었습니다.',
                  onConfirm: () => {
                    router.push(`/detail/${data.data.id}`);
                  },
                });
              },
            },
          );
          return;
        }

        createParty(params, {
          onSuccess: (data) => {
            notification.alert({
              type: 'alert',
              title: '모임이 성공적으로 개설되었습니다.',
              onConfirm: () => {
                router.replace(`/detail/${data.data.party_id}`);
              },
            });
          },
        });
      },
    });
  };

  return (
    <form className="relative flex flex-col min-h-screen bg-g-50">
      <Header
        left={
          <X
            className="pointer"
            onClick={() => {
              notification.alert({
                type: 'confirm',
                title: '게시물을 닫으시겠어요?',
                content: '작성중인 내용은 저장되지 않아요',
                onConfirm: () => router.push('/'),
              });
            }}
          />
        }
        center={<>모임 개설</>}
      />
      <div className="flex flex-col flex-grow">
        <>
          <div className="flex flex-col gap-4 p-5 mb-2 bg-white">
            <div className="pb-8">
              <div className="text-basic-2 text-g-600">스포츠</div>
              <div className="pt-1.5 flex gap-2">
                {sports.map(({ id, name }) => {
                  const isSelected = params.sport_id === id;
                  return (
                    <div
                      key={id}
                      onClick={() => {
                        handleChangeField({
                          value: id,
                          name: 'sport_id',
                        });
                      }}
                      className="cursor-pointer"
                    >
                      <Chip
                        variant={
                          isSelected ? 'primary-outline' : 'gray-outline'
                        }
                      >
                        {name}
                      </Chip>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="pb-8">
              <div className="text-basic-2 text-g-600">모임 날짜</div>
              <div className="pt-1.5">
                <DatePicker
                  name="gather_date"
                  width="100%"
                  placeholder={formatter.date(dayjs())}
                  startYear={2000}
                  endYear={2030}
                  value={params.gather_date}
                  onChange={(value) =>
                    handleChangeField({
                      value,
                      name: 'gather_date',
                    })
                  }
                  status={!validationStatus.gather_date ? 'error' : undefined}
                  statusMessage={errorMessages.gather_date ?? '필수값입니다.'}
                  disableBefore={
                    timeOptions.length === 0
                      ? formatter.date(dayjs().add(1, 'day'))
                      : formatter.date(dayjs())
                  }
                />
              </div>
            </div>

            <div className="pb-8">
              <div className="text-basic-2 text-g-600">모임 시작 시간</div>
              <div className="pt-1.5">
                <Select
                  name="gather_time"
                  width="100%"
                  options={!!params.gather_date ? timeOptions : []}
                  optionMaxHeight={200}
                  placeholder="00:00"
                  onSelect={(value) =>
                    handleChangeField({
                      value: value?.value ?? '',
                      name: 'gather_time',
                    })
                  }
                  selected={{
                    title: params.gather_time,
                    value: params.gather_time,
                  }}
                  status={!validationStatus.gather_time ? 'error' : undefined}
                  statusMessage={errorMessages.gather_time ?? '필수값입니다.'}
                  noOptionText="모임 날짜를 먼저 선택해주세요"
                />
              </div>
            </div>
            <div className="pb-8">
              <div className="text-basic-2 text-g-600">
                참여 인원수 (모임장 포함)
              </div>
              <div className="pt-1.5 overflow-x-auto">
                <div className="inline-flex gap-2 whitespace-nowrap">
                  {PARTICIPANT_COUNT.map(({ value, title }) => {
                    const isSelected = params.participant_limit === value;
                    return (
                      <div
                        key={value}
                        onClick={() => {
                          handleChangeField({
                            value,
                            name: 'participant_limit',
                          });
                        }}
                        className="m-1 cursor-pointer"
                      >
                        <Chip
                          key={value}
                          variant={
                            isSelected ? 'primary-outline' : 'gray-outline'
                          }
                        >
                          {title}
                        </Chip>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 flex-grow p-5 bg-white grow-[2]">
            <div>
              <div className="pb-2 text-basic-2 text-g-600">제목</div>
              <TextInput
                name="title"
                placeholder="제목을 입력해주세요"
                value={params.title}
                onChange={(e) =>
                  handleChangeField({
                    value: e.target.value,
                    name: 'title',
                  })
                }
                status={!validationStatus.title ? 'error' : undefined}
                statusMessage={errorMessages.title ?? '필수값입니다.'}
              />
            </div>
            <div>
              <div className="pb-2 text-basic-2 text-g-600">내용</div>
              <TextArea
                name="body"
                placeholder="프리다이빙 경력, 선호하는 다이빙 스팟, 보유한 장비, 관심 있는 기술 등을 알려주세요."
                className="flex-grow pt-2"
                value={params.body}
                onChange={(e) =>
                  handleChangeField({
                    value: e.target.value,
                    name: 'body',
                  })
                }
                autoHeight
                status={!validationStatus.body ? 'error' : undefined}
                statusMessage={errorMessages.body ?? '필수값입니다.'}
              />
            </div>
          </div>

          <div className="bg-white flex-1 flex-shrink basis-[1px]">
            <div className="box-border relative">
              {params.address ? (
                <div>
                  <div
                    className="flex px-5 py-3 cursor-pointer bg-g-50 text-md text-g-600"
                    onClick={() => {
                      setIsOpenPostcode(true);
                    }}
                  >
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                    </div>
                    <div>{params.address}</div>
                  </div>

                  <div className="px-5 pt-3 pb-10 border-t bg-g-50 border-g-200">
                    <div className="flex items-center pt-3 pb-1.5 text-md text-g-500">
                      <Map size={16} className="mr-1" />
                      <div>상세 주소</div>
                    </div>
                    <TextInput
                      name="place_name"
                      placeholder="상세주소를 입력해주세요"
                      value={params.place_name}
                      onChange={(e) => {
                        handleChangeField({
                          value: e.target.value,
                          name: 'place_name',
                        });
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className={`cursor-pointer text-md px-5 py-3 ${
                    !validationStatus.address
                      ? 'bg-red-50 text-error-300'
                      : 'bg-b-50 text-b-500'
                  }`}
                  onClick={() => {
                    setIsOpenPostcode(true);
                  }}
                >
                  <div className={`flex items-center`}>
                    <MapPin size={16} className="mr-1" />
                    장소
                    {!validationStatus.address && '를 선택해주세요'}
                  </div>
                </div>
              )}

              <div className="flex-1 px-5 pt-5 pb-10 bg-g-50 text-g-500">
                <div className="flex items-center pb-2.5">
                  <Info size={16} className="mr-1" />
                  <div className="text-md">추가정보</div>
                </div>
                <TextArea
                  placeholder="해당 정보는 모임을 신청한 멤버에게만 공개됩니다.
                연락처, 오픈카톡 링크,금액 등을 입력할 수 있어요."
                  value={params.notice}
                  onChange={(e) =>
                    handleChangeField({
                      value: e.target.value,
                      name: 'notice',
                    })
                  }
                />
              </div>
            </div>
          </div>
        </>
      </div>
      {isOpenPostcode && (
        <SearchAddressModal
          isOpen={isOpenPostcode}
          onClose={() => {
            setIsOpenPostcode(false);
          }}
          onSelectAddress={handleSelectAddress}
        />
      )}
      <div className="sticky bottom-0 p-5 bg-white">
        <Button width="100%" onClick={handleSave} type="submit">
          게시하기
        </Button>
      </div>
    </form>
  );
};
