import { Loading } from '@/components/common/Loading';
import { NoDataMessage } from '@/components/common/NoDataMessage';
import { Header } from '@/components/layouts/Header';
import { List } from '@/components/main/List';
import { useGetPartyMeOrganized } from '@/hooks/api/user';
import { ChevronLeft, FileSearch } from 'lucide-react';
import { useRouter } from 'next/router';
import React from 'react';

export const OrganizedParty = () => {
  const router = useRouter();
  const { data: partyMeOrganizationData, isLoading } = useGetPartyMeOrganized();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header
        left={<ChevronLeft size={24} onClick={() => router.back()} />}
        center={<>주최한 모임</>}
      />
      <div className="flex flex-col gap-2 mt-3 mb-20 bg-white pb-28">
        {partyMeOrganizationData?.data?.items?.length ? (
          partyMeOrganizationData.data.items.map((party) => (
            <List key={party.id} data={party} />
          ))
        ) : (
          <NoDataMessage
            icon={<FileSearch size={48} />}
            description="주최한 모임이 없어요"
            message="모임을 주최해주세요"
          />
        )}
      </div>
    </>
  );
};
