import { PartyListDetail } from '@/@types/party/type';
import { Chip } from 'buooy-design-system';
import dayjs from 'dayjs';
import { Calendar, MapPin, UsersRound } from 'lucide-react';
import { useRouter } from 'next/router';

type Props = {
  data?: PartyListDetail;
  noDataMessage?: string;
  description?: string;
  icon?: React.ReactNode;
};

export const List = ({ data }: Props) => {
  const router = useRouter();

  if (!data) {
    return;
  }

  const {
    id,
    title,
    sport_name,
    participants_info,
    gather_date,
    body,
    address,
    is_active,
  } = data;

  return (
    <div
      className="p-4 mx-5 bg-white border border-g-100 hover:cursor-pointer rounded-2xl"
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
      <h1 className="pt-2 pb-[6px] text-lg font-medium md-2 text-g-900  max-w-full truncate overflow-ellipsis">
        {title}
      </h1>
      <div className="max-w-full truncate text-basic-2 text-g-500 overflow-ellipsis">
        {body}
      </div>

      <div className="flex justify-between">
        <div className="flex w-full pt-3 text-basic text-g-400">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {dayjs(gather_date).format('YY.MM.DD')}
            <div className="w-0.5 h-0.5 mx-1.5" />
          </div>
          <div className="flex items-center justify-end gap-1">
            <UsersRound size={14} />
            {participants_info}
            <div className="w-0.5 h-0.5 mx-1.5" />
          </div>
          <div className="flex items-center gap-1 overflow-hidden">
            <MapPin size={14} />
            <span className="max-w-[200px] truncate overflow-ellipsis">
              {address}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
