"use client";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import List from "@/components/shared/List";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import { getTrendingMedia, searchData } from "@/mocks/queries";
import { useQuery } from "@tanstack/react-query";
import React, { ChangeEvent, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function UploadData() {
  const [query, setQuery] = useState<any>("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data, isLoading } = useQuery<any>({
    queryKey: ["Add", debouncedQuery],
    queryFn: async () => {
      if (debouncedQuery.trim() !== "") {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/anime/search?query=${debouncedQuery}`
        );
        const data = await response.json();
        return data;
      }
      const trendingResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/anime`
      );
      const data = await trendingResponse.json();
      return data;
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
        <h1 className="font-semibold text-4xl">Upload Episode or Edit data</h1>
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
        <List data={data?.data}>
          {(data: any) => (
            <Card
              data={data}
              redirectUrl={`/panel/anime/episodes/${data.id}`}
            />
          )}
        </List>
      )}
    </div>
  );
}
