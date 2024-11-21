"use client";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "@/components/ui/spinner";
import { UserAxiosInstance } from "@/utils/Instance";
import TransactionCard from "./transaction-card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { useSearchParams } from "next/navigation";

export default function TransactionsPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const params = useSearchParams();
  const [limit] = useState<number>(30);
  const [page, setPage] = useState<number>(1);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<string>("-1");
  const status = params.get("status") || "all";
  const scenario = params.get("scenario") || "all";

  const updateQueryParams = (
    newStatus: string,
    newScenario: string,
    newSearchText: string,
    newSortOrder: string
  ) => {
    const url = new URL(window.location.href);
    if (newStatus) url.searchParams.set("status", newStatus);
    if (newScenario) url.searchParams.set("scenario", newScenario);
    if (newSortOrder) url.searchParams.set("sortOrder", newSortOrder);
    window.history.pushState({}, "", url);
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const response = await UserAxiosInstance.get(
        `/transactions/all-transactions?page=${page}&limit=${limit}&status=${status}&scenario=${scenario}&searchText=${searchText}&sort=${sortOrder}`
      );

      if (response?.data?.payload) {
        const { payload, pagination } = response.data;

        setTransactions((prev) => [...prev, ...payload]);
        setTotalTransactions(pagination?.TotalDataLength || 0);
        setHasMore(
          transactions.length + payload.length < pagination?.TotalDataLength
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTransactions([]);
    setPage(1);
    fetchTransactions();
  }, [searchText, status, scenario, sortOrder]);

  useEffect(() => {
    if (page > 1) {
      fetchTransactions();
    }
  }, [page]);

  const fetchMoreData = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="py-4 flex flex-col lg:flex-row justify-between gap-4">
          <Select
            onValueChange={(value) => {
              updateQueryParams(status, value, searchText, sortOrder);
            }}
            value={scenario}
          >
            <SelectTrigger className="p-2 border rounded">
              <SelectValue placeholder="Select Scenario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="sent">Sent Requests</SelectItem>
              <SelectItem value="received">Received Requests</SelectItem>
              <SelectItem value="accepted">Accepted Requests</SelectItem>
              <SelectItem value="acceptedBySomeone">
                Accepted by Someone
              </SelectItem>
              <SelectItem value="rejected">Rejected Requests</SelectItem>
              <SelectItem value="rejectedBySomeone">
                Rejected by Someone
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Select
            value={sortOrder}
            onValueChange={(value) => {
              setSortOrder(value);
              updateQueryParams(status, scenario, searchText, value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Ascending</SelectItem>
              <SelectItem value="-1">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="py-4">
        <InfiniteScroll
          dataLength={transactions.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className="py-4 flex justify-center">
              <Spinner show={loading} />
            </div>
          }
        >
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            {transactions?.map((item: any, index: number) => (
              <div key={index}>
                <TransactionCard transaction={item} />
              </div>
            ))}
          </div>
        </InfiniteScroll>

        {transactions.length === 0 && !loading && (
          <div className="flex flex-col lg:h-[50dvh] h-[70dvh] justify-center items-center">
            <h1 className="text-sm">No Transactions Found</h1>
          </div>
        )}
      </div>
    </div>
  );
}
