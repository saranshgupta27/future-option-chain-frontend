# Option Chain Viewer

A real-time option chain viewer built with React, TypeScript, and WebSocket integration. This application allows users to view and track option prices for different contracts and expiry dates in real-time.

## Features

- Real-time price updates via WebSocket connection
- Support for multiple contracts (e.g., BANKNIFTY, NIFTY)
- Dynamic expiry date selection
- Clean and responsive UI with Chakra UI
- Type-safe implementation with TypeScript
- Comprehensive test coverage

## Technologies Used

- React 18
- TypeScript
- Chakra UI
- WebSocket
- Jest & React Testing Library

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/option-chain-viewer.git
cd option-chain-viewer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your configuration:
```
REACT_APP_WS_URL=wss://prices.algotest.xyz/mock/updates
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/        # React components
├── hooks/            # Custom React hooks
├── services/         # API and WebSocket services
├── types/           # TypeScript interfaces
└── utils/           # Utility functions
```

## Key Components

### Hooks

- `useContracts`: Manages the state for selected contracts and expiry dates
- `useOptionChain`: Handles fetching and formatting option chain data
- `useWebSocket`: Manages WebSocket connection for real-time price updates

### Components

- `OptionChain`: Main component that displays the option chain
- `ContractsDropdown`: Dropdown for selecting different contracts
- `ExpiryDropdown`: Dropdown for selecting expiry dates
- `OptionRow`: Individual row component for displaying strike prices and option values

## Testing

The project includes comprehensive test coverage using Jest and React Testing Library. To run the tests:

```bash
npm test
# or
yarn test
```

To run tests with coverage report:

```bash
npm test -- --coverage
# or
yarn test --coverage
```

## API Integration

The application integrates with two main endpoints:

1. Contracts API: Fetches available contracts and their details
2. Option Chain API: Fetches option chain data for selected contract
3. WebSocket Connection: Receives real-time price updates

## WebSocket Messages

The application expects WebSocket messages in the following format:

```typescript
interface WebSocketMessage {
  ltp: Array<{
    token: string;
    ltp: number;
  }>;
}
```

## State Management

The application uses React's built-in state management with custom hooks:

1. Global Contract State:
   - Selected contract
   - Selected expiry
   - Available contracts
   - Loading states
   - Error states

2. Option Chain State:
   - Formatted strikes
   - Active tokens
   - Real-time price updates

## Performance Considerations

- Memoized callbacks and values to prevent unnecessary rerenders
- Efficient WebSocket message handling
- Optimized strike price updates
- Proper cleanup of WebSocket connections

## Error Handling

The application includes comprehensive error handling for:

- Failed API requests
- WebSocket connection issues
- Invalid data formats
- Network disconnections

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Code Style

The project uses ESLint and Prettier for code formatting. To format code:

```bash
npm run lint
npm run format
# or
yarn lint
yarn format
```

## Build for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory.


## Known Issues

- WebSocket reconnection might take up to 5 seconds
- Some browsers might require CORS configuration for WebSocket connection

## Future Improvements

- Add support for more contract types
- Implement price history charts
- Add more customization options for the option chain display
- Implement user preferences storage
- Add export functionality for option chain data

## License

This project is licensed under the MIT License - see the LICENSE file for details.

