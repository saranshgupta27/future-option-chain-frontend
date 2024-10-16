import { Box, ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import OptionChain from "./components/OptionChain";

function App() {
  const SOCKET_SERVER_URL = "https://prices.algotest.xyz/mock/updates";

  return (
    <ChakraProvider>
      <Box className="min-h-screen bg-gray-100 p-4">
        <OptionChain />
      </Box>
    </ChakraProvider>
  );
}

export default App;
