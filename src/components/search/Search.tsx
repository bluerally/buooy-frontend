import { GetPartyListQuery, GetPartyListResponse } from '@/@types/party/type';
import { useGetPartyList } from '@/hooks/api/party';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { Loading } from '../common/Loading';
import { Chip, formatter, SearchInput, theme } from 'bluerally-design-system';
import { NoDataMessage } from '../common/NoDataMessage';
import { List } from '../main/List';
import { useSearchModal } from '@/contexts/SearchModalContext';
import { SPORTS } from '@/constants/common';
import { ChevronDown, MoveLeft } from 'lucide-react';
import { DEFAULT_PARAMS } from '../Main';

export const Search = () => {
  const router = useRouter();
  const { query } = router;
  const { setIsSearchModalOpen } = useSearchModal();

  const [params, setParams] = useState<GetPartyListQuery>({
    is_active: query.is_active === 'true',
    page: Number(query.page) || 1,
    sport_id: Array.isArray(query.sport_id)
      ? query.sport_id.map(Number)
      : typeof query.sport_id === 'string'
      ? [Number(query.sport_id)]
      : undefined,
    search_query:
      typeof query.search_query === 'string' ? query.search_query : undefined,
    gather_date_min: query.gather_date_min
      ? String(query.gather_date_min)
      : undefined,
    gather_date_max: query.gather_date_max
      ? String(query.gather_date_max)
      : undefined,
  });

  const [searchValue, setSearchValue] = useState(params.search_query);

  const { data, isLoading, fetchNextPage, hasNextPage } =
    useGetPartyList(params);

  const partyList =
    data?.pages.reduce<GetPartyListResponse>((acc, page) => {
      return acc.concat(page.data);
    }, []) || [];

  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleBack = () => {
    router.push('/');
    setIsSearchModalOpen(false);
    setParams(DEFAULT_PARAMS);
  };

  const handleReset = () => {
    setSearchValue('');
    setParams({
      ...params,
      search_query: '',
    });
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

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col mx-auto">
      <div className={`flex flex-col flex-grow`}>
        <div className="px-5">
          <header className="top-0 left-0 right-0 z-50">
            <div className="box-border relative flex items-center mx-auto h-14">
              <span className="pr-3 cursor-pointer">
                <MoveLeft
                  size={24}
                  onClick={handleBack}
                  color={theme.palette.gray['600']}
                  strokeWidth={1.5}
                />
              </span>
              <SearchInput
                value={searchValue}
                placeholder="검색어를 입력해주세요"
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                width={520}
                onClickReset={handleReset}
              />
              <span />
            </div>
          </header>
        </div>
        <div className="flex flex-wrap justify-start w-full gap-2 px-5 m-4">
          {chips}
        </div>

        {partyList?.length ? (
          <div className="flex flex-col w-full gap-2 mt-5">
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
      <div
        className={`flex flex-row items-center justify-center gap-1 ${
          hasNextPage ? 'pt-5 pb-8' : 'pt-[80px]'
        } text-lg bg-white text-g-500`}
      >
        {hasNextPage && (
          <>
            <span
              role="button"
              aria-label="button"
              onClick={() => fetchNextPage()}
            >
              더보기
            </span>
            <ChevronDown size={20} />
          </>
        )}
      </div>
    </div>
  );
};