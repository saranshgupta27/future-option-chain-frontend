import { Td, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface PriceCellProps {
  price: number;
  token: string;
}

const CallPriceCell: React.FC<PriceCellProps> = React.memo(
  ({ price, token }) => {
    const [bgColor, setBgColor] = useState<string>("transparent");

    useEffect(() => {
      setBgColor("#daf2f9");

      const timer = setTimeout(() => {
        setBgColor("transparent");
      }, 1000);

      return () => clearTimeout(timer);
    }, [price]);

    return (
      <Td>
        <Text
          background={bgColor}
          minW={"14"}
          width={"fit-content"}
          marginLeft={"auto"}
          textAlign={"center"}
        >
          {price?.toFixed(2) || "-"}
        </Text>
      </Td>
    );
  },
  (prevProps, nextProps) => prevProps.price === nextProps.price
);

const PutPriceCell: React.FC<PriceCellProps> = React.memo(
  ({ price, token }) => {
    const [bgColor, setBgColor] = useState<string>("transparent");

    useEffect(() => {
      setBgColor("#daf2f9");

      const timer = setTimeout(() => {
        setBgColor("transparent");
      }, 1000);

      return () => clearTimeout(timer);
    }, [price]);

    return (
      <Td>
        <Text
          background={bgColor}
          minW={"14"}
          width={"fit-content"}
          marginRight={"auto"}
          textAlign={"center"}
        >
          {price?.toFixed(2) || "-"}
        </Text>
      </Td>
    );
  },
  (prevProps, nextProps) => prevProps.price === nextProps.price
);

const StrikePriceCell: React.FC<{ strike: number }> = React.memo(
  ({ strike }) => <Td style={{ textAlign: "center" }}>{strike}</Td>,
  (prevProps, nextProps) => prevProps.strike === nextProps.strike
);

CallPriceCell.displayName = "CallPriceCell";
PutPriceCell.displayName = "PutPriceCell";
StrikePriceCell.displayName = "StrikePriceCell";

export { CallPriceCell, PutPriceCell, StrikePriceCell };
