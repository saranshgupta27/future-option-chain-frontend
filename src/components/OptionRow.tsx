import { Tr } from "@chakra-ui/react";
import React from "react";
import { CallPriceCell, PutPriceCell, StrikePriceCell } from "./Cells";

interface OptionRowProps {
  strike: number;
  callPrice: number;
  putPrice: number;
  callToken: string;
  putToken: string;
}

const OptionRow: React.FC<OptionRowProps> = ({
  strike,
  callPrice,
  putPrice,
  callToken,
  putToken,
}) => {
  return (
    <Tr>
      <CallPriceCell price={callPrice} token={callToken} key={`${callPrice}`} />
      <StrikePriceCell strike={strike} />
      <PutPriceCell price={putPrice} token={putToken} />
    </Tr>
  );
};

export default React.memo(OptionRow);
