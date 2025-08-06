// Global type declarations
declare global {
  interface Window {
    emailjs: {
      init: (publicKey: string) => Promise<void>;
      send: (serviceId: string, templateId: string, params: any, publicKey?: string) => Promise<any>;
    };
  }
}

export {};