import { useCallback, useState } from "react";
import { fetchOptionChain } from "../services/api";
import { Contracts, FormattedStrike, WebSocketMessage } from "../types";

export const useOptionChain = () => {
  const [formattedStrikes, setFormattedStrikes] = useState<FormattedStrike[]>(
    []
  );
  const [activeTokens, setActiveTokens] = useState<Set<string>>(new Set());

  const getStrikeWithTokens = useCallback(
    (
      strike: number,
      callPrice: number,
      putPrice: number,
      contracts: Contracts,
      selectedContract: string,
      selectedExpiry: string
    ) => {
      const optionData =
        contracts[selectedContract]?.opt?.[selectedExpiry] || [];
      const callData = optionData.find(
        (data) => data.strike === strike && data.option_type === "CE"
      );
      const putData = optionData.find(
        (data) => data.strike === strike && data.option_type === "PE"
      );

      return {
        strike,
        callPrice,
        putPrice,
        callToken: callData?.token ?? "",
        putToken: putData?.token ?? "",
      };
    },
    []
  );

  const getOptionChain = useCallback(
    async (
      selectedContract: string,
      selectedExpiry: string,
      contracts: Contracts | null
    ) => {
      if (!selectedContract || !selectedExpiry || !contracts) return;

      try {
        const chainData = await fetchOptionChain(selectedContract);
        if (!chainData?.options?.[selectedExpiry]) return;

        const { strike, call_close, put_close } =
          chainData.options[selectedExpiry];

        const newStrikes = strike.map((strikePrice, index) =>
          getStrikeWithTokens(
            strikePrice,
            call_close[index],
            put_close[index],
            contracts,
            selectedContract,
            selectedExpiry
          )
        );

        const newActiveTokens = new Set(
          newStrikes.flatMap((strike) =>
            [strike.callToken, strike.putToken].filter(Boolean)
          )
        );

        setActiveTokens(newActiveTokens);
        setFormattedStrikes(newStrikes);
      } catch (err) {
        console.error("Failed to fetch option strikes data");
      }
    },
    [getStrikeWithTokens]
  );

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    if (!message?.ltp?.length) return;

    setFormattedStrikes((prevStrikes) => {
      const updates = new Map(
        message.ltp.map((update) => [update.token, update.ltp])
      );

      let hasChanges = false;
      const newStrikes = prevStrikes.map((strike) => {
        const newCallPrice = updates.get(strike.callToken);
        const newPutPrice = updates.get(strike.putToken);

        if (!newCallPrice && !newPutPrice) return strike;

        hasChanges = true;
        return {
          ...strike,
          callPrice: newCallPrice ?? strike.callPrice,
          putPrice: newPutPrice ?? strike.putPrice,
        };
      });

      return hasChanges ? newStrikes : prevStrikes;
    });
  }, []);

  return {
    formattedStrikes,
    getOptionChain,
    handleWebSocketMessage,
    activeTokens,
  };
};
