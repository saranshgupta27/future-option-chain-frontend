import { Flex, FormLabel, Select } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import React, { useMemo } from "react";
import { sortExpiries } from "../utils";

interface ExpiryDropdownProps {
  expiries: string[];
  selectedExpiry: string;
  onExpiryChange: (expiry: string) => void;
}

const ExpiryDropdown: React.FC<ExpiryDropdownProps> = React.memo(
  ({ expiries, selectedExpiry, onExpiryChange }) => {
    const sortedExpiries = useMemo(() => sortExpiries(expiries), [expiries]);

    const expiryOptions = useMemo(
      () =>
        sortedExpiries.map((expiry) => (
          <option key={expiry} value={expiry}>
            {format(parseISO(expiry), "d MMMM yyyy")}
          </option>
        )),
      [sortedExpiries]
    );

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        onExpiryChange(e.target.value);
      },
      [onExpiryChange]
    );

    return (
      <Flex flexDirection="column" width="100%">
        <FormLabel htmlFor="expiry-select">Expiry:</FormLabel>
        <Select
          id="expiry-select"
          value={selectedExpiry}
          onChange={handleChange}
          autoFocus={false}
        >
          {expiryOptions}
        </Select>
      </Flex>
    );
  }
);

ExpiryDropdown.displayName = "ExpiryDropdown";

export default ExpiryDropdown;
