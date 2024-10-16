import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import React from "react";
import { SegmentData } from "../types";

interface ExpiryDropdownProps {
  expiries: { [segmentName: string]: SegmentData[] };
  selectedExpiry: string;
  onExpiryChange: (expiry: string) => void;
}

const ExpiryDropdown: React.FC<ExpiryDropdownProps> = ({
  expiries,
  selectedExpiry,
  onExpiryChange,
}) => {
  return (
    <FormControl className="expiry-filter">
      <FormLabel htmlFor="expiry-select">Expiry:</FormLabel>
      <Select
        id="expiry-select"
        value={selectedExpiry}
        onChange={(e) => onExpiryChange(e.target.value)}
        placeholder="Select an Expiry"
      >
        {expiries &&
          Object.keys(expiries).map((expiry) => (
            <option key={expiry} value={expiry}>
              {expiry}
            </option>
          ))}
      </Select>
    </FormControl>
  );
};

export default ExpiryDropdown;
