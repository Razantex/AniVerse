"use client";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import List from "@/components/shared/List";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import { useApi } from "@/hooks/useApi";
import { getTrendingMedia, searchData } from "@/mocks/queries";
import { useQuery } from "@tanstack/react-query";
import React, { ChangeEvent, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function UploadData() {
  const [query, setQuery] = useState<any>("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // const { data, isLoading } = useQuery<any>({
  //   queryKey: ["AddChapter", debouncedQuery],
  //   queryFn: async () => {
  //     if (debouncedQuery.trim() !== "") {
  //       const response = await searchData(debouncedQuery);
  //       return response.data;
  //     }
  //     const trendingResponse = await getTrendingMedia("MANGA");
  //     return trendingResponse.data;
  //   },
  // });
  const api = useApi();
  const { data, isLoading } = useQuery<any>({
    queryKey: ["AddChapter", debouncedQuery],
    queryFn: async () => {
      if (debouncedQuery.trim() !== "") {
        const response = await searchData(debouncedQuery);
        return response.data;
      }
      const trendingResponse: any = await api.getUploadedManga();
      return trendingResponse.data;
    },
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 600);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  return (
    <div>
      <div>
        <div>Hi, Username</div>
        <h1 className="font-semibold text-4xl">Upload Chapter or Edit data</h1>
      </div>
      <div>
        <div></div>
      </div>
      <div className="flex gap-4 items-center mt-8">
        <Input
          containerInputClassName="border border-white/80"
          LeftIcon={AiOutlineSearch}
          label={"Search"}
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
          containerClassName="w-full md:w-1/3 mb-8"
        />
        <div>
          <Button primary>Add other data</Button>
        </div>
      </div>
      {isLoading ? (
        <div className="mt-4">
          <ListSkeleton />
        </div>
      ) : (
        <List data={data}>
          {(data: any) => (
            <Card
              data={data}
              redirectUrl={`/panel/manga/chapters/${data.id}`}
            />
          )}
        </List>
      )}
    </div>
  );
}
