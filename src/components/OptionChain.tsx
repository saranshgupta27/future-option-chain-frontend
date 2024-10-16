import {
  Box,
  Flex,
  Spinner,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchContracts, fetchOptionStrikes } from "../services/api";
import { Contracts, OptionStrikes } from "../types";
import ContractsDropdown from "./ContractsDropdown";
import ExpiryDropdown from "./ExpiryDropdown";
import OptionRow from "./OptionRow";

const DEFAULT_CONTRACT_NAME = "banknifty";

const OptionChain: React.FC = () => {
  const [contracts, setContracts] = useState<Contracts>({});
  const [optionChainStrikes, setOptionChainStrikes] =
    useState<OptionStrikes | null>(null);
  const [selectedExpiry, setSelectedExpiry] = useState<string>("");
  const [selectedContract, setSelectedContract] = useState<string>(
    DEFAULT_CONTRACT_NAME
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const expiries = useMemo(() => {
    return contracts[selectedContract]?.opt || {};
  }, [contracts, selectedContract]);

  const currentStrikes = useMemo(() => {
    if (optionChainStrikes?.options && selectedExpiry) {
      return optionChainStrikes.options[selectedExpiry]?.strike || [];
    }
    return [];
  }, [optionChainStrikes, selectedExpiry]);

  const getDefaultExpiry = (
    contracts: Contracts,
    contractName: string
  ): string => {
    const contractExpiries = contracts[contractName]?.opt || {};
    const expiryDates = Object.keys(contractExpiries);
    return expiryDates[0] || "";
  };

  const fetchContractsData = useCallback(async () => {
    try {
      const contractsData = await fetchContracts();
      setContracts(contractsData);
      setSelectedExpiry(getDefaultExpiry(contractsData, DEFAULT_CONTRACT_NAME));
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch contracts data");
      setLoading(false);
    }
  }, []);

  const fetchStrikesData = useCallback(async () => {
    if (!selectedContract) return;

    try {
      const optionChainStrikesData = await fetchOptionStrikes(selectedContract);
      if (optionChainStrikesData?.options) {
        setOptionChainStrikes(optionChainStrikesData);
      }
    } catch (err) {
      setError("Failed to fetch option strikes data");
    }
  }, [selectedContract]);

  useEffect(() => {
    fetchContractsData();
  }, [fetchContractsData]);

  useEffect(() => {
    fetchStrikesData();
  }, [fetchStrikesData]);

  const handleContractChange = useCallback(
    (contract: string) => {
      setSelectedContract(contract);
      setSelectedExpiry(getDefaultExpiry(contracts, contract));
    },
    [contracts]
  );

  const handleExpiryChange = useCallback((expiry: string) => {
    setSelectedExpiry(expiry);
  }, []);

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box className="option-chain p-4 bg-white rounded-lg shadow">
      <Flex gap={10}>
        <ContractsDropdown
          contracts={contracts}
          selectedContract={selectedContract}
          onContractChange={handleContractChange}
        />
        <ExpiryDropdown
          expiries={expiries}
          selectedExpiry={selectedExpiry}
          onExpiryChange={handleExpiryChange}
        />
      </Flex>

      <Table variant="simple" className="mt-4">
        <Thead>
          <Tr>
            <Th>Call Price</Th>
            <Th>Strike</Th>
            <Th>Put Price</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentStrikes.map((strike: number) => (
            <OptionRow
              key={strike}
              strike={strike}
              callPrice={0}
              putPrice={0}
            />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default OptionChain;
