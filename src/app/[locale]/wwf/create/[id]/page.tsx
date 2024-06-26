"use client";

import Button from "@/components/shared/Button";
import Description from "@/components/shared/Description";
import DotList from "@/components/shared/DotList";
import Input from "@/components/shared/Input";
import PlainCard from "@/components/shared/PlainCard";
import Section from "@/components/shared/Section";
import Select from "@/components/shared/Select";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import useCreateRoom from "@/hooks/useCreateRoom";
import useDevice from "@/hooks/useDevice";
import { Media } from "@/@types/anilist";
import { convert, getDescription, getTitle } from "@/utils/data";
import classNames from "classnames";
import React, { useCallback, useMemo, useState } from "react";
import { MdOutlineTitle } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { useLocale } from "next-intl";
import EpisodeSelector from "@/components/features/anime/EpisodeSelector";
import EpisodeCard from "@/components/features/anime/EpisodeCard";
import { useSession } from "next-auth/react";

interface CreateRoomPageProps {
  media: Media;
  episodes: any[];
}

type Visibility = "public" | "private";

const CreateRoomPage: any = ({ params }: { params: { id: string } }) => {
  const { isMobile } = useDevice();
  const [roomTitle, setRoomTitle] = useState("");
  const { VISIBILITY_MODES } = useConstantTranslation();
  const [visibility, setVisibility] = useState(
    VISIBILITY_MODES?.[0].value as "public" | "private"
  );

  const animeId = params.id;
  const api = useApi();

  const { data: media, isLoading: isLoadingMedia } = useQuery({
    queryKey: ["media", animeId],
    queryFn: async () => {
      const res = await api.getAnimeById(animeId, true);
      return res;
    },
  });

  const locale = useLocale();

  const { mutate, isPending } = useCreateRoom();

  const [chosenEpisode, setChosenEpisode] = useState<any>(media?.episode?.[0]);

  const mediaTitle = useMemo(() => getTitle(media, locale), [media, locale]);
  const mediaDescription = useMemo(
    () => getDescription(media, locale),
    [media, locale]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRoomTitle(event.target.value);
    },
    []
  );

  const { data: session } = useSession();

  console.log(isPending);
  const handleCreateRoom = useCallback(() => {
    mutate({
      episodeId: chosenEpisode.id,
      mediaId: media?.id,
      visibility,
      title: roomTitle,
      host: {
        id: session?.user?.id,
        name: session?.user?.name,
        avatar: session?.user?.profilePicture,
      },
    });
  }, [chosenEpisode, media?.id, mutate, visibility, roomTitle, session]);

  return (
    <Section className="py-20">
      {/* <Head title={t("create_page_title", { mediaTitle })} /> */}

      <h1 className="text-4xl font-semibold mb-8">Create room</h1>

      <div className="w-full flex flex-col md:flex-row gap-8 md:gap-0">
        <div className="md:w-1/3 bg-background-800 p-4 md:p-8 text-center md:text-left">
          <div className="w-[96px] mb-4 mx-auto md:mx-0">
            <PlainCard src={media?.coverImage.extraLarge} />
          </div>

          <h3 className="font-semibold text-xl">
            {mediaTitle || media?.title?.english}
          </h3>

          <DotList className="mt-2">
            {media?.genres?.map((genre: any) => (
              <span key={genre}>{convert(genre, "genre", { locale })}</span>
            ))}
          </DotList>

          <Description
            description={mediaDescription || "Updating" + "..."}
            className="mt-4 line-clamp-6 text-gray-300"
          />
        </div>
        <div className="flex flex-col justify-between md:w-2/3 bg-background-900 p-4 md:p-8 space-y-4">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                containerInputClassName="border border-white/80 p-2"
                LeftIcon={MdOutlineTitle}
                onChange={handleInputChange}
                defaultValue={roomTitle}
                placeholder="Room name"
                label={`Room name (Optional)`}
                containerClassName="w-full md:w-1/3"
              />

              <div className="space-y-2">
                <p className="font-semibold">Visibility</p>

                <Select
                  options={VISIBILITY_MODES}
                  placeholder="Pick visibility mode"
                  //   value={VISIBILITY_MODES?.find()}
                  onChange={(newValue: any) => setVisibility(newValue.value)}
                  styles={
                    {
                      control: (provided: any) => ({
                        ...provided,
                        backgroundColor: "#1a1a1a",
                        ...(!isMobile && {
                          minWidth: "12rem",
                          maxWidth: "14rem",
                        }),
                      }),
                    } as any
                  }
                />

                {visibility === "private" && (
                  <p className="italic text-sm text-gray-400">
                    Visibility mode
                  </p>
                )}
              </div>
            </div>
            <div className="overflow-hidden">
              {/* <EpisodeSelector
                episodes={media?.episode}
                // currentEpisode={media?.episode?.[0]}
              /> */}
              <EpisodeSelector
                episodes={media?.episode}
                // activeEpisode={chosenEpisode}
                onEachEpisode={(episode: any) => (
                  <button
                    key={episode.sourceEpisodeId}
                    className={classNames(
                      "rounded-md bg-background-800 col-span-1 aspect-w-2 aspect-h-1 group",
                      episode.sourceEpisodeId ===
                        chosenEpisode?.sourceEpisodeId && "text-primary-300"
                    )}
                    onClick={() => setChosenEpisode(episode)}
                  >
                    <div className="flex items-center justify-center w-full h-full group-hover:bg-white/10 rounded-md transition duration-300">
                      <p>{episode.number}</p>
                    </div>
                  </button>
                )}
                onEachEpisodeThumb={(episode: any) => (
                  <button
                    key={episode.sourceEpisodeId}
                    className={classNames(
                      "rounded-md bg-background-800 col-span-1 aspect-w-2 aspect-h-1 group",
                      episode.sourceEpisodeId ===
                        chosenEpisode?.sourceEpisodeId && "text-primary-300"
                    )}
                    onClick={() => setChosenEpisode(episode)}
                  >
                    <EpisodeCard
                      episode={{
                        number: episode.number,
                        title: episode.title,
                        thumbnail: episode.thumbnail,
                        description: episode.description,
                      }}
                      className="cursor-pointer"
                    />
                  </button>
                )}
              />
            </div>
          </div>

          <Button
            isLoading={isPending}
            className="mx-auto md:ml-auto md:mr-0"
            primary
            onClick={handleCreateRoom}
          >
            <p>Create room</p>
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default CreateRoomPage;
