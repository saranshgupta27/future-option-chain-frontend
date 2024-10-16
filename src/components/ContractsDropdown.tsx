import { Flex, FormLabel, Select } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Contracts } from "../types";

interface ContractsDropdownProps {
  contracts: Contracts | null;
  selectedContract: string;
  onContractChange: (contract: string) => void;
}

const ContractsDropdown: React.FC<ContractsDropdownProps> = React.memo(
  ({ contracts, selectedContract, onContractChange }) => {
    const contractOptions = useMemo(() => {
      if (!contracts) return [];
      return Object.keys(contracts).map((contract) => (
        <option key={contract} value={contract}>
          {contract.toUpperCase()}
        </option>
      ));
    }, [contracts]);

    return (
      <Flex flexDirection={"column"} width={"100%"}>
        <FormLabel htmlFor="expiry-select">Contract:</FormLabel>
        <Select
          id="expiry-select"
          value={selectedContract}
          onChange={(e) => onContractChange(e.target.value)}
        >
          {contractOptions}
        </Select>
      </Flex>
    );
  }
);

export default ContractsDropdown;
