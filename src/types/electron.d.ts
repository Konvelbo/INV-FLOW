export interface IElectronAPI {
  sendNotification: (title: string, options: any) => void;
  openExternal: (url: string) => Promise<void>;
  onLoginSuccess: (callback: (data: any) => void) => () => void;
  getData: (type: string, ...params: any[]) => Promise<any>;
  actionData: (type: string, method: string, ...params: any[]) => Promise<any>;
  generatePDF: (html: string) => Promise<Uint8Array>;
  getLocale: () => Promise<string>;
  getVersion: () => Promise<string>;
  checkForUpdates: () => Promise<void>;
  startDownload: () => Promise<void>;
  quitAndInstall: () => void;
  onUpdateStatus: (callback: (status: string, info: any) => void) => () => void;
  onUpdateProgress: (callback: (progress: any) => void) => () => void;
  onInvoiceRead: (callback: (invoice: any) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
