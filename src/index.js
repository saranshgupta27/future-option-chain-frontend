import { ChakraProvider } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Tailwind CSS

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
);
