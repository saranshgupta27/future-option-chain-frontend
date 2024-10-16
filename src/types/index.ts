export interface SegmentData {
  exchange: string;
  expiry: string;
  instrument_type: string;
  is_tradable: string;
  lot_size: number;
  max_qty_in_order: number;
  option_type: string;
  strike: number;
  symbol: string;
  tick_size: number;
  token: string;
  underlying: string;
}

export interface Contract {
  cash: SegmentData;
  fut: { [expiryDate: string]: SegmentData[] };
  opt: { [expiryDate: string]: SegmentData[] };
}

export interface Contracts {
  [contractName: string]: Contract;
}

export interface WebSocketMessage {
  token: string;
  close: number;
  ltp: number;
  price: number;
  timestamp: number;
}

export interface OptionStrikes {
  options: {
    [key: string]: { strike: number[] };
  };
}
