import { HttpAgent } from "@dfinity/agent";

declare global {
  interface Plug {
    isConnected: () => Promise<boolean>;
    requestConnect: (options?: {
      whitelist: string[];
      host?: string;
    }) => Promise<boolean>;
    requestTransfer: (options: {
      to: string;
      amount: number;
    }) => Promise<{ transactionId: string }>;
    createActor: <T>(options: {
      canisterId: string;
      interfaceFactory?: any
    }) => Promise<any>;
    createAgent: () => Promise<HttpAgent>;
    getAgent: () => Promise<HttpAgent>;
    agent: any;
  }

  interface Window {
    ic?: {
      plug?: Plug;
    };
  }
}

export {};