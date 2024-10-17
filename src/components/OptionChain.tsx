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
import React, { useEffect, useMemo } from "react";
import { useContracts } from "../hooks/useContracts";
import { useOptionChain } from "../hooks/useOptionChain";
import useWebSocket from "../hooks/useWebSocket";
import ContractsDropdown from "./ContractsDropdown";
import ExpiryDropdown from "./ExpiryDropdown";
import OptionRow from "./OptionRow";

const DEFAULT_CONTRACT_NAME = "banknifty";

const OptionChain: React.FC = () => {
  const {
    contracts,
    selectedContract,
    selectedExpiry,
    loading,
    error,
    fetchContractsData,
    handleContractChange,
    handleExpiryChange,
  } = useContracts(DEFAULT_CONTRACT_NAME);

  const { formattedStrikes, getOptionChain, handleWebSocketMessage } =
    useOptionChain();

  const expiries = useMemo(() => {
    if (!contracts) return [];
    return Object.keys(contracts[selectedContract]?.opt || {});
  }, [contracts, selectedContract]);

  useEffect(() => {
    fetchContractsData();
  }, [fetchContractsData]);

  useEffect(() => {
    getOptionChain(selectedContract, selectedExpiry, contracts);
  }, [getOptionChain, selectedContract, selectedExpiry, contracts]);

  useWebSocket(selectedContract, selectedExpiry, handleWebSocketMessage);

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
        height="100%"
        overflow="auto"
        position="relative"
        className="option-chain px-4 pb-4 bg-white rounded-lg shadow"
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
                {...data}
              />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default OptionChain;
