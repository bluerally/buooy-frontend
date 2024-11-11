import { GetPartyListQuery, GetPartyListResponse } from '@/@types/party/type';
import { SPORTS } from '@/constants/common';
import { useGetSports } from '@/hooks/api/common';
import { useGetNotificationList } from '@/hooks/api/notification';
import { useGetPartyList } from '@/hooks/api/party';
import {
  Button,
  Checkbox,
  Chip,
  DatePicker,
  DateRangeType,
  formatter,
  Label,
  SearchInput,
  theme,
} from 'bluerally-design-system';
import dayjs from 'dayjs';
import {
  Bell,
  Calendar,
  ChevronDown,
  MapPin,
  MoveLeft,
  Search,
  UsersRound,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import qs from 'qs';
import { FormEvent, useMemo, useState } from 'react';
import { NoDataMessage } from './common/NoDataMessage';
import { BottomMenu } from './layouts/BottomMenu';
import { Footer } from './layouts/Footer';
import { Header } from './layouts/Header';

const DEFAULT_PARAMS: GetPartyListQuery = {
  is_active: true,
  page: 1,
};

const getRandomIndex = (min = 1, max = 3) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const Main = () => {
  const router = useRouter();
  const { query } = router;

  const [params, setParams] = useState<GetPartyListQuery>(DEFAULT_PARAMS);
  const [formValues, setFormValues] = useState<{
    sport_id: number[];
    search_query: string;
    gather_date_min?: string;
    gather_date_max?: string;
    is_active: boolean;
  }>({
    sport_id: [],
    search_query: '',
    gather_date_min: undefined,
    gather_date_max: undefined,
    is_active: true,
  });

  const [dates, setDates] = useState<DateRangeType>([
    formValues.gather_date_min || '',
    formValues.gather_date_max || '',
  ]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isShowResults, setIsShowResults] = useState(false);

  const imageIndex = useMemo(() => getRandomIndex(), []);

  const { data: sportsData } = useGetSports();
  const { data, fetchNextPage, hasNextPage } = useGetPartyList(params);
  const { data: notificationData } = useGetNotificationList(1);

  const sports = sportsData?.data ?? [];
  const notificationList = notificationData?.data.notifications;

  const notReadNotification = notificationList?.filter(
    ({ is_read }) => !is_read,
  );

  const handleSportsCategoryChange = ({ id }: { id: number }) => {
    setParams({ ...params, sport_id: [id], page: 1 });
  };

  const handleSportsCategoryFieldChange = (id: number) => {
    setFormValues((prev) => {
      const isSelected = prev.sport_id.includes(id);
      const newSportIds = isSelected
        ? prev.sport_id.filter((sportId) => sportId !== id)
        : [...prev.sport_id, id];

      return { ...prev, sport_id: newSportIds };
    });
  };

  const handleClickAllSports = () => {
    setParams({ ...params, sport_id: undefined, page: 1 });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isActive = e.target.checked;
    setFormValues({ ...formValues, is_active: !isActive });
  };

  const handleChangeField = ({
    value,
    name,
  }: {
    value: string | number | boolean;
    name: string;
  }) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleChangeDateRangeField = ({
    value,
    name,
  }: {
    value: DateRangeType;
    name: string;
  }) => {
    setFormValues({
      ...formValues,
      gather_date_min: value[0]
        ? dayjs(value[0]).format('YYYY-MM-DD')
        : undefined,
      gather_date_max: value[1]
        ? dayjs(value[1]).format('YYYY-MM-DD')
        : undefined,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newParams: GetPartyListQuery = {
      page: 1,
      is_active: formValues.is_active,
    };

    Object.entries(formValues).forEach(([key, value]) => {
      if (value) {
        if (key === 'gather_date_max' && typeof value === 'string') {
          newParams[key] = dayjs(value).format('YYYY-MM-DD');
        } else {
          newParams[key as keyof GetPartyListQuery] = value as any;
        }
      }
    });

    const queryString = qs.stringify(
      {
        ...newParams,
        sport_id: formValues.sport_id,
      },
      { arrayFormat: 'repeat' },
    );

    router.push({
      pathname: router.pathname,
      query: queryString,
    });

    setParams(newParams);
    setIsShowResults(true);
    setIsSearchModalOpen(false);
  };

  const partyList = useMemo(() => {
    return data?.pages.reduce<GetPartyListResponse>((acc, page) => {
      return acc.concat(page.data);
    }, []);
  }, [data]);

  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleChange = (dates: DateRangeType) => {
    setDates(dates);

    handleChangeDateRangeField({
      value: dates,
      name: 'gather_date_min',
    });
  };

  const handleBack = () => {
    setIsShowResults(false); // 검색 결과 숨기기
    setIsSearchModalOpen(false); // 서치 모달 닫기
    setParams(DEFAULT_PARAMS);
    router.push('/'); // 메인 화면으로 이동
  };

  const chips = useMemo(() => {
    return [
      query.sport_id && (
        <div className="flex gap-2" onClick={handleOpenSearchModal}>
          {query.sport_id &&
          Array.isArray(query.sport_id) &&
          query.sport_id.length > 0
            ? query.sport_id.map((id) => {
                const sport = SPORTS.find((sport) => String(sport.id) === id);
                return sport ? (
                  <Chip key={id} variant="primary-outline">
                    #{sport.name}
                  </Chip>
                ) : null;
              })
            : null}
        </div>
      ),
      query.gather_date_min && query.gather_date_max && (
        <div className="cursor-pointer" onClick={handleOpenSearchModal}>
          <Chip key="gather_date_max" variant="primary-outline">
            #{formatter.dateKR(query.gather_date_in as string)} ~
            {formatter.dateKR(query.gather_date_max as string)}
          </Chip>
        </div>
      ),
      query.is_active && (
        <div className="cursor-pointer" onClick={handleOpenSearchModal}>
          <Chip key="is_active" variant="primary-outline">
            #{query.is_active === 'true' ? '마감불포함' : '마감포함'}
          </Chip>
        </div>
      ),
    ].filter(Boolean);
  }, [query]);

  return (
    <div className="relative flex flex-col mx-auto">
      <div className={`flex flex-col flex-grow`}>
        <form
          onSubmit={handleSubmit}
          className={`${isShowResults ? 'px-4' : ''}`}
        >
          <div className="sticky top-0 z-10 bg-white border-b border-g-100">
            {!isShowResults && (
              <>
                <Header
                  right={
                    <div className={`flex items-center gap-[18px] text-g-950`}>
                      <div className="cursor-pointer">
                        <Search
                          size={24}
                          onClick={() => setIsSearchModalOpen(true)}
                        />
                      </div>
                      <div
                        className="relative flex cursor-pointer"
                        onClick={() => router.push(`/notification`)}
                      >
                        <Bell size={24} />
                        {notReadNotification &&
                          notReadNotification?.length > 0 && (
                            <div className="absolute top-0 right-0 w-[13px] h-[13px] bg-b-300 rounded-full outline outline-white flex items-center justify-center text-[9px] font-bold text-white">
                              {notReadNotification?.length}
                            </div>
                          )}
                      </div>
                    </div>
                  }
                  transparent
                />
                <div className="flex gap-2 px-5 py-[10px] text-basic text-g-950 ">
                  <div
                    onClick={handleClickAllSports}
                    className="cursor-pointer"
                  >
                    <Chip
                      variant={
                        !params.sport_id ? 'primary-filled' : 'gray-outline'
                      }
                    >
                      전체
                    </Chip>
                  </div>
                  {sports.map(({ id, name }) => {
                    return (
                      <div
                        key={id}
                        className="text-center hover:cursor-pointer"
                        onClick={() => handleSportsCategoryChange({ id })}
                      >
                        <Chip
                          variant={
                            params.sport_id?.includes(id)
                              ? 'primary-filled'
                              : 'gray-outline'
                          }
                        >
                          {name}
                        </Chip>
                      </div>
                    );
                  })}
                </div>
                <Image
                  src={`/images/home_${imageIndex}.svg`}
                  alt="buooy"
                  width={600}
                  height={320}
                  priority
                  className="object-cover w-full h-[320px] md:h-[320px] md:w-[600px] mx-auto"
                />
              </>
            )}
          </div>

          {/* 서치 모달  */}
          <div
            className={`${
              isSearchModalOpen ? 'block' : 'hidden'
            } fixed inset-0  w-[600px] min-w-96 mx-auto z-50 bg-white`}
          >
            <div className="px-5 border-b border-g-100">
              <header className="top-0 left-0 right-0 z-50">
                <div className="box-border relative flex items-center mx-auto h-14">
                  <span className="pr-3 cursor-pointer">
                    <MoveLeft
                      size={24}
                      onClick={handleBack}
                      color={theme.palette.gray['600']}
                    />
                  </span>
                  <SearchInput
                    value={formValues.search_query}
                    placeholder="검색어를 입력해주세요"
                    onChange={(e) => {
                      handleChangeField({
                        value: e.target.value,
                        name: 'search_query',
                      });
                    }}
                    width={520}
                    onClickReset={() => {
                      setFormValues({ ...formValues, search_query: '' });
                    }}
                  />
                  <span />
                </div>
              </header>
            </div>
            <div className="p-5">
              <div className="pb-8">
                <Label>스포츠</Label>
                <div className="pt-1.5 flex gap-2">
                  {sports.map(({ id, name }) => {
                    const isSelected = formValues?.sport_id.includes(id);
                    return (
                      <div
                        key={id}
                        onClick={() => {
                          handleSportsCategoryFieldChange(id);
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
                <Label>모임 날짜</Label>
                <div className="pt-1.5">
                  <DatePicker
                    name="date"
                    width="100%"
                    startYear={2000}
                    endYear={2030}
                    value={dates}
                    placeholder="YYYY-MM-DD ~ YYYY-MM-DD"
                    onChange={(dates) => handleChange(dates)}
                    isRange
                  />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Checkbox
                  checked={!formValues.is_active}
                  onChange={handleCheckboxChange}
                />
                <span className="text-g-600 text-md-2">마감된 모임 포함</span>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <Button type="submit" color="gray" width="100%">
                검색
              </Button>
            </div>
          </div>
        </form>
      </div>
      <div className="flex-grow">
        <div className="flex flex-col items-center justify-center w-full h-full bg-white">
          {isShowResults && (
            <>
              {
                <div className="px-5">
                  <header className="top-0 left-0 right-0 z-50">
                    <div className="box-border relative flex items-center mx-auto h-14">
                      <span className="pr-3 cursor-pointer">
                        <MoveLeft
                          size={24}
                          onClick={handleBack}
                          color={theme.palette.gray['600']}
                        />
                      </span>
                      <SearchInput
                        value={formValues.search_query}
                        placeholder="검색어를 입력해주세요2"
                        onChange={(e) => {
                          handleChangeField({
                            value: e.target.value,
                            name: 'search_query',
                          });
                        }}
                        width={520}
                        onClickReset={() => {
                          setFormValues({ ...formValues, search_query: '' });
                        }}
                      />
                      <span />
                    </div>
                  </header>
                </div>
              }
              <div className="flex flex-wrap justify-start w-full gap-2 px-5 m-4">
                {chips}
              </div>
            </>
          )}

          {partyList?.length ? (
            <div className="flex flex-col w-full gap-2 mt-5">
              {partyList.map(
                (
                  {
                    id,
                    title,
                    sport_name,
                    participants_info,
                    gather_date,
                    body,
                    address,
                    is_active,
                  },
                  index,
                ) => (
                  <div
                    key={index}
                    className="p-4 mx-5 border hover:cursor-pointer rounded-2xl"
                    onClick={() => router.push(`/detail/${id}`)}
                  >
                    <div className="flex gap-1">
                      <Chip variant="gray-filled" size="sm">
                        {sport_name}
                      </Chip>
                      {!is_active && (
                        <Chip variant="red-outline" size="sm">
                          마감
                        </Chip>
                      )}
                    </div>
                    <h1 className="pt-2 pb-[6px] text-lg font-medium md-2 text-g-900">
                      {title}
                    </h1>
                    <div className="text-basic-2 text-g-500 line-clamp-2">
                      {body}
                    </div>

                    <div className="flex justify-between">
                      <div className="flex w-full pt-3 text-basic text-g-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {dayjs(gather_date).format('YY.MM.DD')}
                          <div className="w-0.5 h-0.5   mx-1.5" />
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          <UsersRound size={14} />
                          {participants_info}
                          <div className="w-0.5 h-0.5 mx-1.5" />
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span className="max-w-[200px] truncate">
                            {address}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <NoDataMessage
              message="아직 게시물이 없어요"
              description="좋은 모임이 곧 준비될거에요"
            />
          )}
        </div>
        {hasNextPage && (
          <div className="flex flex-row items-center justify-center gap-1 pt-5 pb-8 text-lg bg-white text-g-500">
            <span
              role="button"
              aria-label="button"
              onClick={() => fetchNextPage()}
            >
              더보기
            </span>
            <ChevronDown size={20} />
          </div>
        )}
        <Footer />
      </div>
      <BottomMenu />
    </div>
  );
};

export default Main;
