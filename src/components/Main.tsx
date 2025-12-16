import { GetPartyListQuery, PartyListDetail } from '@/@types/party/type';
import { useSearchModal } from '@/contexts/SearchModalContext';
import { useGetSports } from '@/hooks/api/common';
import { useGetNotificationsCount } from '@/hooks/api/notification';
import { useGetPartyList } from '@/hooks/api/party';
import { useAuth } from '@/hooks/useAuth';
import { Chip } from 'buooy-design-system';
import { Bell, ChevronDown, Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { Loading } from './common/Loading';
import { NoDataMessage } from './common/NoDataMessage';
import { Header } from './layouts/Header';
import { List } from './main/List';
import SearchModal from './main/SearchModal';

export const DEFAULT_PARAMS: GetPartyListQuery = {
  is_active: true,
  page: 1,
};

const Main = () => {
  const router = useRouter();

  const { isLoggedIn } = useAuth();
  const { isSearchModalOpen, setIsSearchModalOpen } = useSearchModal();

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

  const [currentSport, setCurrentSport] = useState(0);

  const { data: sportsData, isLoading } = useGetSports();
  const { data, fetchNextPage, hasNextPage } = useGetPartyList(params);
  const { data: notificationCountData } = useGetNotificationsCount(isLoggedIn);

  const sports = sportsData?.data ?? [];
  const notificationCount = notificationCountData?.data.count;

  const handleSportsCategoryChange = ({ id }: { id: number }) => {
    setCurrentSport(id);
    setParams({ ...params, sport_id: [id], page: 1 });
  };

  const handleClickAllSports = () => {
    setCurrentSport(0);
    setParams({ ...params, sport_id: undefined, page: 1 });
  };

  const partyList = useMemo(() => {
    return data?.pages.reduce<PartyListDetail[]>((acc, page) => {
      return acc.concat(page.data.items);
    }, []);
  }, [data]);

  const handleSearch = () => {
    setParams({
      ...params,
      ...formValues,
      page: 1,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="relative flex flex-col mx-auto">
        <div
          className="flex flex-col flex-grow"
          style={{
            background:
              'linear-gradient(rgb(255, 255, 255) 0%, rgb(250, 250, 250) 9.1%)',
          }}
        >
          <div
            className="fixed top-0 z-10 w-full bg-white"
            style={{
              maxWidth: '600px',
            }}
          >
            <Header
              left={
                <button onClick={() => router.push('/')}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/logo.svg`}
                    alt="logo"
                    width={75}
                    height={26}
                    priority
                  />
                </button>
              }
              right={
                <div className="flex items-center gap-[18px] text-g-950">
                  <div className="cursor-pointer">
                    <Search
                      size={24}
                      onClick={() => setIsSearchModalOpen(true)}
                      strokeWidth={1.5}
                    />
                  </div>
                  {isLoggedIn && (
                    <div
                      className="relative flex cursor-pointer"
                      onClick={() => router.push(`/notification`)}
                    >
                      <Bell size={24} strokeWidth={1.5} />
                      {notificationCount && notificationCount > 0 ? (
                        <div className="absolute top-0 right-0 w-[13px] h-[13px] bg-b-300 rounded-full outline outline-white flex items-center justify-center text-[9px] font-bold text-white">
                          {notificationCount}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              }
              transparent
            />
            <div className="flex gap-2 px-5 py-2 overflow-auto text-basic text-g-950">
              <div onClick={handleClickAllSports} className="cursor-pointer">
                <Chip
                  variant={!params.sport_id ? 'primary-filled' : 'gray-outline'}
                >
                  전체
                </Chip>
              </div>
              {sports.map(({ id, name }) => (
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
              ))}
            </div>
          </div>
          <div
            className="mt-[7rem] flex justify-center bg-g-50 pb-3 mx-5"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 9.1%)',
            }}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/home_${currentSport}.png`}
              alt="banner"
              width={560}
              height={160}
              priority
              className="object-cover rounded-2xl bg-g-50"
            />
            {formValues.sport_id}
          </div>
        </div>
        <div className="flex-grow">
          <div
            className="flex flex-col items-center justify-center w-full bg-g-50"
            style={{
              minHeight: 'calc(100vh - 500px)',
            }}
          >
            {partyList?.length ? (
              <div
                className="flex flex-col w-full gap-2 bg-g-50"
                style={{
                  minHeight: 'calc(100vh - 500px)',
                }}
              >
                {partyList.map((party) => (
                  <List key={party.id} data={party} />
                ))}
              </div>
            ) : (
              <NoDataMessage
                message="아직 게시물이 없어요"
                description="좋은 모임이 곧 준비될거에요"
              />
            )}
          </div>

          {hasNextPage ? (
            <div
              className={`flex flex-row items-center justify-center gap-1 pt-5 pb-8 text-lg bg-g-50 text-g-500`}
            >
              <span
                role="button"
                aria-label="button"
                onClick={() => fetchNextPage()}
              >
                더보기
              </span>
              <ChevronDown size={20} />
            </div>
          ) : (
            <div
              className={`flex flex-row items-center justify-center gap-1 pb-20 text-lg bg-g-50 text-g-500`}
            ></div>
          )}
        </div>
      </div>
      {isSearchModalOpen && (
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          setParams={setParams}
          formValues={formValues}
        />
      )}
    </>
  );
};

export default Main;
