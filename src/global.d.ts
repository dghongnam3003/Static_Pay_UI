declare global {
  interface Plug {
    isConnected: () => Promise<boolean>;
    requestConnect: () => Promise<boolean>;
    requestTransfer: (options: {
      to: string;
      amount: number;
    }) => Promise<{ transactionId: string }>;
  }

  interface Window {
    ic?: {
      plug?: Plug;
    };
  }
}

export {};