import dayjs from "@/lib/dayjs";
import { Room } from "@/@types";
import { getTitle } from "@/utils/data";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { AiFillEye } from "react-icons/ai";
// import { GoPrimitiveDot } from "react-icons/go";
import Avatar from "./Avatar";
import DotList from "./DotList";
import Image from "./Image";
import TextIcon from "./TextIcon";
import { useLocale } from "next-intl";

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }: any) => {
  const locale = useLocale();

  const mediaTitle = useMemo(
    () => getTitle(room.media, locale),
    [room.media, locale]
  );

  console.log(room);

  return (
    <Link href={`/wwf/${room.id}`}>
      <div className="w-full h-full space-y-4">
        <div className="relative aspect-w-16 aspect-h-9">
          <Image
            src={
              room?.episode?.Anime?.bannerImage ||
              room?.episode?.Anime?.extraLarge
            }
            alt={mediaTitle}
            fill
            className="object-cover"
          />

          <div className="w-full h-full">
            <TextIcon
              // LeftIcon={GoPrimitiveDot}
              iconClassName="w-4 h-4"
              className="absolute left-2 top-2 px-2 py-0.5 rounded-md bg-red-500"
            >
              <p className="font-medium">Live</p>
            </TextIcon>

            <TextIcon
              RightIcon={AiFillEye}
              className="absolute right-2 top-2 px-2 py-0.5 rounded-md bg-black/80 font-medium"
              iconClassName="w-4 h-4"
            >
              <p>{room?.usersCount || 0}</p>
            </TextIcon>

            <p className="absolute right-2 bottom-2 rounded-md bg-black/80 px-2 py-0.5">
              {room.episode.title}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/profile/${room?.hostUser?.username}`}>
            <Avatar className="shrink-0" src={room.hostUser?.avatarUrl} />
          </Link>

          <div>
            {!room.title ? (
              <h3 className="font-semibold line-clamp-2" title={""}>
                {"mediaTitle"}
              </h3>
            ) : (
              <h3 className="font-semibold line-clamp-2" title={room.title}>
                {room.title}
              </h3>
            )}

            {room.title && (
              <h4
                className="text-gray-300 text-sm line-clamp-1"
                title={mediaTitle}
              >
                {mediaTitle}
              </h4>
            )}

            <DotList className="text-sm w-full">
              <span className="font-medium text-gray-300">
                {room?.host?.name}
              </span>
              <span className="text-gray-400">
                {dayjs(new Date(room.created_at), { locale }).fromNow()}
              </span>
            </DotList>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(RoomCard);
