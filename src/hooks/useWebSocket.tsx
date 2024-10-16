import { useEffect, useRef, useCallback } from "react";
import { WebSocketMessage } from "../types";

const SOCKET_URL = "wss://prices.algotest.xyz/mock/updates";

const useWebSocket = (
  selectedContract: string,
  selectedExpiry: string,
  onMessage: (message: WebSocketMessage) => void
) => {
  const ws = useRef<WebSocket | null>(null);
  const activeSubscription = useRef<string | null>(null);

  const sendSubscription = useCallback(
    (socket: WebSocket, contract: string, expiry: string) => {
      const subscriptionMessage = {
        msg: {
          type: "subscribe",
          datatypes: ["ltp"],
          underlyings: [
            {
              underlying: contract.toUpperCase(),
              cash: true,
              options: [expiry],
            },
          ],
        },
      };
      socket.send(JSON.stringify(subscriptionMessage));
      activeSubscription.current = `${contract}-${expiry}`;
    },
    []
  );

  useEffect(() => {
    if (!selectedContract || !selectedExpiry) return;

    const connectWebSocket = () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        if (
          activeSubscription.current !== `${selectedContract}-${selectedExpiry}`
        ) {
          sendSubscription(ws.current, selectedContract, selectedExpiry);
        }
        return;
      }

      const socket = new WebSocket(SOCKET_URL);

      socket.onopen = () => {
        console.log("WebSocket connected, sending subscription");
        sendSubscription(socket, selectedContract, selectedExpiry);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error("WebSocket message parsing error:", error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
        console.log("WebSocket closed");
        ws.current = null;
        activeSubscription.current = null;
        setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
      };

      ws.current = socket;
    };

    connectWebSocket();

    return () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [selectedContract, selectedExpiry, onMessage, sendSubscription]);
};

export default useWebSocket;
