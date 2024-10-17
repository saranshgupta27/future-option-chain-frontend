import { useCallback, useState } from "react";
import { Contracts } from "../types";
import { fetchContracts } from "../services/api";
import { sortExpiries } from "../utils";

export const useContracts = (defaultContract: string = "banknifty") => {
  const [state, setState] = useState<{
    contracts: Contracts | null;
    selectedContract: string;
    selectedExpiry: string;
    loading: boolean;
    error: string | null;
  }>({
    contracts: null,
    selectedContract: defaultContract,
    selectedExpiry: "",
    loading: true,
    error: null,
  });

  const fetchContractsData = useCallback(async () => {
    try {
      const contracts = await fetchContracts();
      const firstExpiry =
        sortExpiries(Object.keys(contracts[defaultContract]?.opt || {}))[0] ||
        "";

      setState((prev) => ({
        ...prev,
        contracts,
        selectedExpiry: firstExpiry,
        loading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Failed to fetch contracts data",
        loading: false,
      }));
    }
  }, [defaultContract]);

  const handleContractChange = useCallback((contract: string) => {
    setState((prev) => {
      if (!prev.contracts) return prev;

      const expiries = Object.keys(prev.contracts[contract]?.opt || {});
      const newExpiry = sortExpiries(expiries)[0] || "";

      return {
        ...prev,
        selectedContract: contract,
        selectedExpiry: newExpiry,
      };
    });
  }, []);

  const handleExpiryChange = useCallback((expiry: string) => {
    setState((prev) => ({
      ...prev,
      selectedExpiry: expiry,
    }));
  }, []);

  return {
    ...state,
    fetchContractsData,
    handleContractChange,
    handleExpiryChange,
  };
};
