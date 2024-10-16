import { Contracts, OptionStrikes } from "../types";
import { convertKeysToLowercase } from "../utils";

const API_BASE_URL = "https://prices.algotest.xyz";

export const fetchContracts = async (): Promise<Contracts> => {
  const response = await fetch(`${API_BASE_URL}/contracts`);
  if (!response.ok) {
    throw new Error("Failed to fetch contracts");
  }
  let data = await response.json();
  data = convertKeysToLowercase(data);
  return data;
};

export const fetchOptionStrikes = async (
  contractName: string
): Promise<OptionStrikes> => {
  const response = await fetch(
    `${API_BASE_URL}/option-chain-with-ltp?underlying=${contractName}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch option chain");
  }
  let data = await response.json();
  data = convertKeysToLowercase(data);
  return data;
};
