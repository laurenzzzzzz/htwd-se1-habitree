import React, { createContext, useContext, PropsWithChildren } from 'react';
import { ApplicationServices } from '../types/ApplicationServices';

const ApplicationServicesContext = createContext<ApplicationServices | null>(null);

export type ApplicationServicesProviderProps = PropsWithChildren<{
  services: ApplicationServices;
}>;

export const ApplicationServicesProvider: React.FC<ApplicationServicesProviderProps> = ({ services, children }) => {
  return (
    <ApplicationServicesContext.Provider value={services}>
      {children}
    </ApplicationServicesContext.Provider>
  );
};

export const useApplicationServices = (): ApplicationServices => {
  const context = useContext(ApplicationServicesContext);
  if (!context) {
    throw new Error('useApplicationServices must be used within an ApplicationServicesProvider');
  }
  return context;
};
