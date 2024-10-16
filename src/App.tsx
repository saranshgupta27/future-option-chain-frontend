import { ChakraProvider } from "@chakra-ui/react";
import OptionChain from "./components/OptionChain";

function App() {
  return (
    <ChakraProvider>
      <OptionChain />
    </ChakraProvider>
  );
}

export default App;
