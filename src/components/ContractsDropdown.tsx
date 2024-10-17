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

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        onContractChange(e.target.value);
      },
      [onContractChange]
    );

    return (
      <Flex flexDirection="column" width="100%">
        <FormLabel htmlFor="contract-select">Contract:</FormLabel>
        <Select
          id="contract-select"
          value={selectedContract}
          onChange={handleChange}
          autoFocus={false}
        >
          {contractOptions}
        </Select>
      </Flex>
    );
  }
);

ContractsDropdown.displayName = "ContractsDropdown";

export default ContractsDropdown;
