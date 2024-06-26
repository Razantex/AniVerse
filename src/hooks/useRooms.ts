// import { Room } from "@/@types";
// import { useQuery } from "react-query";
// import { toast } from "react-toastify";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";

const useRooms: any = () => {
  const api = useApi();
  return useQuery(
    {
      queryKey: ["rooms"],
      queryFn: async () => {
        const response = await api.getActiveRooms();
        return response?.data;
      },
    }
    // "rooms",
    // async () => {
    //   const { data, error } = await supabaseClient
    //     .from<Room>("kaguya_rooms")
    //     .select(
    //       `
    //     *,
    //     episode:episodeId(*),
    //     users:kaguya_room_users(id),
    //     hostUser:hostUserId(*)
    //   `
    //     )
    //     .eq("visibility", "public")
    //     .order("created_at", { ascending: false });

    //   if (error) throw error;

    //   const anilistMedia = await getMedia({
    //     id_in: data.map((room) => room.mediaId),
    //   });

    //   return data.map((room) => {
    //     const media = anilistMedia.find((media) => media.id === room.mediaId);

    //     return {
    //       ...room,
    //       media,
    //     };
    //   });
    // },
    // {
    //   onError: (error: Error) => {
    //     toast.error(error.message);
    //   },
    //   refetchOnMount: true,
    //   refetchOnWindowFocus: true,
    //   refetchOnReconnect: true,
    // }
  );
};

export default useRooms;
