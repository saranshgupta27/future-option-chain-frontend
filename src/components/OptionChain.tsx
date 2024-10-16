import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  Container,
  Flex,
  Spinner,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import useWebSocket from "../hooks/useWebSocket";
import { fetchContracts, fetchOptionChain } from "../services/api";
import {
  Contracts,
  FormattedStrike,
  OptionStrikes,
  WebSocketMessage,
} from "../types";
import { sortExpiries } from "../utils";
import ContractsDropdown from "./ContractsDropdown";
import ExpiryDropdown from "./ExpiryDropdown";
import OptionRow from "./OptionRow";

const DEFAULT_CONTRACT_NAME = "banknifty";

const OptionChain: React.FC = () => {
  const [contracts, setContracts] = useState<Contracts | null>(null);
  const [selectedContract, setSelectedContract] = useState<string>(
    DEFAULT_CONTRACT_NAME
  );
  const [formattedStrikes, setFormattedStrikes] = useState<FormattedStrike[]>(
    []
  );
  const [selectedExpiry, setSelectedExpiry] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const activeTokensRef = useRef<Set<string>>(new Set());

  const getDefaultExpiry = useCallback(
    (contracts: Contracts, contractName: string): string => {
      const contractExpiries = contracts[contractName]?.opt || {};
      const expiryDates = sortExpiries(Object.keys(contractExpiries));
      return expiryDates[0] || "";
    },
    []
  );

  const formatStrikes = useCallback(
    (
      strikes: OptionStrikes["options"][string]["strike"],
      callClose: number[],
      putClose: number[]
    ) => {
      return strikes.map((strike, index) => ({
        strike,
        callPrice: callClose[index],
        putPrice: putClose[index],
        callToken: "",
        putToken: "",
      }));
    },
    []
  );

  const updateStrikesWithTokens = useCallback(
    (
      formattedStrikes: FormattedStrike[],
      contracts: Contracts,
      selectedContract: string,
      selectedExpiry: string
    ) => {
      activeTokensRef.current.clear();
      const strikes = contracts[selectedContract]?.opt?.[selectedExpiry] || [];
      return formattedStrikes.map((strike) => {
        const callData = strikes.find(
          (data) => data.strike === strike.strike && data.option_type === "CE"
        );
        const putData = strikes.find(
          (data) => data.strike === strike.strike && data.option_type === "PE"
        );

        if (callData) activeTokensRef.current.add(callData.token);
        if (putData) activeTokensRef.current.add(putData.token);

        return {
          ...strike,
          callToken: callData?.token || "",
          putToken: putData?.token || "",
        };
      });
    },
    []
  );

  const getOptionChain = useCallback(async () => {
    if (!selectedContract || !selectedExpiry) return;

    try {
      const chainData = await fetchOptionChain(selectedContract);
      if (chainData?.options?.[selectedExpiry]) {
        const { strike, call_close, put_close } =
          chainData.options[selectedExpiry];
        let newFormattedStrikes = formatStrikes(strike, call_close, put_close);

        if (contracts) {
          newFormattedStrikes = updateStrikesWithTokens(
            newFormattedStrikes,
            contracts,
            selectedContract,
            selectedExpiry
          );
        }

        setFormattedStrikes(newFormattedStrikes);
      }
    } catch (err) {
      setError("Failed to fetch option strikes data");
    }
  }, [
    selectedContract,
    selectedExpiry,
    contracts,
    formatStrikes,
    updateStrikesWithTokens,
  ]);

  const fetchContractsData = useCallback(async () => {
    setLoading(true);
    try {
      const contractsData = await fetchContracts();
      setContracts(contractsData);
      setSelectedExpiry(getDefaultExpiry(contractsData, DEFAULT_CONTRACT_NAME));
    } catch (err) {
      setError("Failed to fetch contracts data");
    } finally {
      setLoading(false);
    }
  }, [getDefaultExpiry]);

  const handleContractChange = useCallback(
    (contract: string) => {
      setSelectedContract(contract);
      if (contracts) {
        const newExpiry = getDefaultExpiry(contracts, contract);
        setSelectedExpiry(newExpiry);
      }
    },
    [contracts, getDefaultExpiry]
  );

  const handleExpiryChange = useCallback((expiry: string) => {
    setSelectedExpiry(expiry);
  }, []);

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    if (!message?.ltp?.length) return;
    setFormattedStrikes((prevStrikes) => {
      const updatedStrikes = prevStrikes.map((strike) => {
        const callUpdate = message.ltp.find(
          (update) => update.token === strike.callToken
        );
        const putUpdate = message.ltp.find(
          (update) => update.token === strike.putToken
        );

        if (!callUpdate && !putUpdate) return strike;

        return {
          ...strike,
          callPrice: callUpdate?.ltp ?? strike.callPrice,
          putPrice: putUpdate?.ltp ?? strike.putPrice,
        };
      });

      return updatedStrikes;
    });
  }, []);

  useEffect(() => {
    fetchContractsData();
  }, [fetchContractsData]);

  useEffect(() => {
    getOptionChain();
  }, [getOptionChain]);

  useWebSocket(selectedContract, selectedExpiry, handleWebSocketMessage);

  const expiries = useMemo(() => {
    if (!contracts) return [];
    return Object.keys(contracts[selectedContract]?.opt || {});
  }, [contracts, selectedContract]);

  if (loading) {
    return (
      <Flex
        width="100%"
        alignItems="center"
        justifyContent="center"
        gap={10}
        height="100%"
      >
        <Text fontSize="2xl">Loading Option Chain...</Text>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        width="100%"
        alignItems="center"
        justifyContent="center"
        gap={10}
        height="100%"
      >
        <Text fontSize="2xl" color="red.500">
          {error}
        </Text>
      </Flex>
    );
  }

  return (
    <Container
      maxWidth="container.md"
      padding="8"
      overflow="hidden"
      height="100%"
    >
      <Box
        className="option-chain px-4 pb-4 bg-white rounded-lg shadow"
        height="100%"
        overflow="auto"
        position="relative"
        boxShadow="rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"
      >
        <Flex gap={10} top={0} position="sticky" background="white" py="2">
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

        <Table variant="simple">
          <Thead
            top="20"
            py={2}
            position="sticky"
            background="white"
            borderTop="1px solid lightgray"
          >
            <Tr>
              <Th textAlign="right">Call Price</Th>
              <Th textAlign="center">Strike</Th>
              <Th textAlign="left">Put Price</Th>
            </Tr>
          </Thead>
          <Tbody>
            {formattedStrikes.map((data) => (
              <OptionRow
                key={`${data.strike}-${data.callToken}-${data.putToken}`}
                strike={data.strike}
                callPrice={data.callPrice}
                putPrice={data.putPrice}
                callToken={data.callToken}
                putToken={data.putToken}
              />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default OptionChain;
