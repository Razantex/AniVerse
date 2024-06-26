import BannerSwiper from "@/components/shared/BannerSwiper";
import CircleButton from "@/components/shared/CircleButton";
import DotList from "@/components/shared/DotList";
import Image from "@/components/shared/Image";
import Swiper, { SwiperProps, SwiperSlide } from "@/components/shared/Swiper";
import TextIcon from "@/components/shared/TextIcon";
import { Media } from "@/@types/anilist";
import {
  createMediaDetailsUrl,
  formatTimeDifference,
  isValidUrl,
  numberWithCommas,
} from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next-intl/client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { AiFillHeart, AiFillPlayCircle } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";
import ListSwiperSkeleton from "../skeletons/ListSwiperSkeleton";
import Description from "./Description";
import Section from "./Section";
import Skeleton, { SkeletonItem } from "./Skeleton";
import { useLocale } from "next-intl";
import BookIcon from "./BookIcon";
import YouTube from "react-youtube";
import classNames from "classnames";
import { BsFillVolumeMuteFill, BsFillVolumeUpFill } from "react-icons/bs";

interface HomeBannerProps {
  data: Media[];
  isLoading?: boolean;
  icon?: any;
}

const bannerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const transition = [0.33, 1, 0.68, 1];

const HomeBanner: React.FC<HomeBannerProps> = ({ data, isLoading, icon }) => {
  return (
    <React.Fragment>
      <BrowserView>
        {isLoading ? (
          <DesktopHomeBannerSkeleton />
        ) : (
          <DesktopHomeBanner data={data} icon={icon} />
        )}
      </BrowserView>

      <MobileView className="overflow-hidden px-4 pt-20 pb-8 md:px-12">
        {isLoading ? (
          <MobileHomeBannerSkeleton />
        ) : (
          <MobileHomeBanner data={data} />
        )}
      </MobileView>
    </React.Fragment>
  );
};

const MobileHomeBanner: React.FC<HomeBannerProps> = ({ data }) => {
  const locale = useLocale();

  return (
    <React.Fragment>
      <Swiper
        hideNavigation
        spaceBetween={10}
        breakpoints={{}}
        slidesPerView={1}
        loop
      >
        {data?.map((slide: Media, index: number) => {
          const title = getTitle(slide, locale);
          const formattedTime = formatTimeDifference(
            slide?.nextAiringEpisode?.airingAt
          );

          return (
            <SwiperSlide key={index}>
              <Link href={createMediaDetailsUrl(slide)}>
                <div className="aspect-w-16 aspect-h-9 relative rounded-md overflow-ellipsis">
                  {slide.bannerImage && (
                    <Image
                      src={slide.bannerImage}
                      alt={title as string}
                      fill
                      className="rounded-md object-cover"
                    />
                  )}

                  <div className="fixed-0 absolute flex items-end bg-gradient-to-b from-black/20 via-black/60 to-black/80">
                    <div className="p-4 max-w-full overflow-ellipsis overflow-hidden">
                      <h1 className="text-xl font-bold uppercase line-clamp-1">
                        {title}
                      </h1>
                      {slide?.nextAiringEpisode && (
                        <p className="text-base font-medium my-2  text-red-200">
                          Episode {slide?.nextAiringEpisode?.episode}:{" "}
                          {formattedTime}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-8 text-lg">
                        {slide.averageScore && (
                          <TextIcon
                            LeftIcon={MdTagFaces}
                            iconClassName="text-green-300"
                          >
                            <p>{slide.averageScore}%</p>
                          </TextIcon>
                        )}
                        <TextIcon
                          LeftIcon={AiFillHeart}
                          iconClassName="text-red-400"
                        >
                          <p>{numberWithCommas(slide.favourites)}</p>
                        </TextIcon>
                        <DotList>
                          {slide.genres &&
                            slide?.genres?.map((genre) => (
                              <span key={genre}>
                                {convert(genre, "genre", { locale })}
                              </span>
                            ))}
                        </DotList>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </React.Fragment>
  );
};

const MobileHomeBannerSkeleton = () => (
  <>
    <Skeleton>
      <SkeletonItem className="aspect-w-16 aspect-h-9 rounded-md" />
    </Skeleton>
  </>
);

const DesktopHomeBanner: React.FC<HomeBannerProps> = ({ data, icon }) => {
  const [index, setIndex] = useState<number>(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [player, setPlayer] =
    useState<ReturnType<YouTube["getInternalPlayer"]>>();
  const [isMuted, setIsMuted] = useState(true);
  const isRanOnce = useRef(false);
  const locale = useLocale();

  const activeSlide: any = useMemo(() => data?.[index], [data, index]);

  const handleSlideChange: SwiperProps["onSlideChange"] = useCallback(
    (swiper: any) => {
      swiper.loopCreate;

      setIndex(swiper.realIndex);
    },
    []
  );

  const mute = useCallback(() => {
    if (!player) return;

    player.mute();

    setIsMuted(true);
  }, [player]);

  const unMute = useCallback(() => {
    if (!player) return;

    player.unMute();

    setIsMuted(false);
  }, [player]);

  const title = useMemo(
    () => getTitle(activeSlide, locale),
    [activeSlide, locale]
  );
  const description = useMemo(
    () => getDescription(activeSlide, locale),
    [activeSlide, locale]
  );

  const formattedTime = formatTimeDifference(
    activeSlide?.nextAiringEpisode?.airingAt
  );

  useEffect(() => {
    setShowTrailer(false);
  }, [activeSlide]);

  return (
    <React.Fragment>
      <div className="group relative w-full overflow-hidden md:h-[450px] xl:h-[500px] 2xl:h-[550px]">
        <AnimatePresence>
          {isValidUrl(activeSlide?.bannerImage) && !showTrailer && (
            <motion.div
              variants={bannerVariants}
              animate="animate"
              exit="exit"
              initial="initial"
              className="h-0 w-full"
              key={title}
            >
              <Image
                src={activeSlide?.bannerImage}
                fill
                style={{ objectFit: "cover", objectPosition: "50% 35%" }}
                alt={title as string}
              />
            </motion.div>
          )}

          {activeSlide?.type === "ANIME" && activeSlide?.trailer && (
            <motion.div
              className={classNames(
                "opacity-1 absolute w-full overflow-hidden h-[300%] -top-[100%] transition-all duration-700",
                !showTrailer && "opacity-0"
              )}
            >
              <YouTube
                videoId={activeSlide.trailer}
                onReady={({ target }) => {
                  setPlayer(target);
                }}
                onPlay={({ target }) => {
                  setShowTrailer(true);

                  if (!isRanOnce.current) {
                    setIsMuted(true);
                  } else if (!isMuted) {
                    setIsMuted(false);

                    target.unMute();
                  }

                  isRanOnce.current = true;
                }}
                onPause={() => {
                  setShowTrailer(false);
                }}
                onEnd={() => {
                  setShowTrailer(false);
                }}
                onError={() => {
                  setShowTrailer(false);
                }}
                className="absolute inset-0 h-full w-full youtube-video-container"
                opts={{
                  playerVars: {
                    width: "100%",
                    height: "100%",
                    autoplay: 1,
                    modestbranding: 1,
                    controls: 0,
                    mute: 1,
                    showInfo: 0,
                    loading: "off",
                    origin: "http://localhost:3000",
                  },
                }}
                iframeClassName={classNames(
                  "absolute w-full overflow-hidden h-[300%] -top-[100%] opacity-1",
                  !showTrailer && "opacity-0"
                )}
                loading="eager"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="banner__overlay absolute inset-0 flex flex-col justify-center px-4 md:px-12"></div>

        <motion.div
          variants={bannerVariants}
          animate="animate"
          initial="initial"
          key={title}
          className="absolute left-4 top-1/2 w-full -translate-y-1/2 md:left-12 md:w-[45%] lg:left-20 xl:left-28 2xl:left-36"
          transition={{ ease: transition, duration: 1 }}
        >
          {activeSlide?.nextAiringEpisode && (
            <p className="text-xl font-semibold mb-4 text-red-300">
              Episode {activeSlide?.nextAiringEpisode?.episode}: {formattedTime}
            </p>
          )}

          <h1 className="text-2xl font-bold uppercase line-clamp-2 sm:line-clamp-3 md:text-4xl md:line-clamp-4">
            {title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-8 text-lg">
            {activeSlide?.averageScore && (
              <TextIcon LeftIcon={MdTagFaces} iconClassName="text-green-300">
                <p>{activeSlide?.averageScore}%</p>
              </TextIcon>
            )}

            <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
              <p>{numberWithCommas(activeSlide?.favourites)}</p>
            </TextIcon>

            <DotList>
              {activeSlide?.genres?.map((genre: any) => (
                <span key={genre}>{convert(genre, "genre", { locale })}</span>
              ))}
            </DotList>
          </div>
          <Description
            description={description as string}
            className="mt-2 hidden text-gray-200 md:block"
            editorClassname="overflow-ellipsis line-clamp-5"
          />
        </motion.div>

        <Link href={createMediaDetailsUrl(activeSlide)}>
          <CircleButton
            LeftIcon={icon}
            outline
            className="absolute left-2/3 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 md:block"
            iconClassName="w-16 h-16"
          />
        </Link>

        {showTrailer && player && (
          <CircleButton
            LeftIcon={isMuted ? BsFillVolumeMuteFill : BsFillVolumeUpFill}
            outline
            className="absolute bottom-20 right-12"
            iconClassName="w-6 h-6"
            onClick={isMuted ? unMute : mute}
          />
        )}

        <div className="banner__overlay--down absolute bottom-0 h-16 w-full"></div>
      </div>
      <Section className="w-full pb-12 max-w-full">
        <BannerSwiper onSlideChange={handleSlideChange} data={data} />
      </Section>
    </React.Fragment>
  );
};

const DesktopHomeBannerSkeleton = () => (
  <Skeleton className="w-full">
    <SkeletonItem
      className="relative w-full md:h-[450px] xl:h-[500px] 2xl:h-[550px]"
      container
    >
      <SkeletonItem
        className="absolute left-4 top-1/2 w-full -translate-y-1/2 md:left-12 md:w-[45%] lg:left-20 xl:left-28 2xl:left-36"
        container
      >
        <SkeletonItem className="h-12 w-5/6" />

        <SkeletonItem className="mt-2 h-6 w-4/6" />

        <SkeletonItem className="mt-4 h-32 w-full" />
      </SkeletonItem>
    </SkeletonItem>
    <SkeletonItem className="h-[370px] w-full" container>
      <ListSwiperSkeleton hasTitle={false} />
    </SkeletonItem>
  </Skeleton>
);

export default HomeBanner as typeof HomeBanner;
