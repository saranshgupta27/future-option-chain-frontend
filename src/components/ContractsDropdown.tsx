import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import React from "react";
import { Contracts } from "../types";

interface ContractsDropdownProps {
  contracts: Contracts;
  selectedContract: string;
  onContractChange: (contract: string) => void;
}

const ContractsDropdown: React.FC<ContractsDropdownProps> = ({
  contracts,
  selectedContract,
  onContractChange,
}) => {
  return (
    <FormControl className="expiry-filter">
      <FormLabel htmlFor="expiry-select">Contract:</FormLabel>
      <Select
        id="expiry-select"
        value={selectedContract}
        onChange={(e) => onContractChange(e.target.value)}
        placeholder="Select a Contract"
      >
        {Object.keys(contracts).map((contract) => (
          <option key={contract} value={contract}>
            {contract.toUpperCase()}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default ContractsDropdown;
