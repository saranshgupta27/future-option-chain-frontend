import { Flex, FormLabel, Select } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import React, { useCallback } from "react";
import { sortExpiries } from "../utils";

interface ExpiryDropdownProps {
  expiries: string[];
  selectedExpiry: string;
  onExpiryChange: (expiry: string) => void;
}

const ExpiryDropdown: React.FC<ExpiryDropdownProps> = ({
  expiries,
  selectedExpiry,
  onExpiryChange,
}) => {
  const sortedExpiries = sortExpiries(expiries);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onExpiryChange(e.target.value);
    },
    [onExpiryChange]
  );

  return (
    <Flex flexDirection={"column"} width={"100%"}>
      <FormLabel htmlFor="expiry-select">Expiry:</FormLabel>
      <Select id="expiry-select" value={selectedExpiry} onChange={handleChange}>
        {sortedExpiries?.map((expiry) => (
          <option key={expiry} value={expiry}>
            {format(parseISO(expiry), "d MMMM yyyy")}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

export default React.memo(ExpiryDropdown);
