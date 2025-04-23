import React from 'react';

export interface AppState {
    timestamp: number;
    [key: string]: any;
  }
  
  export type AppAction<ST extends AppState> = (state: ST) => ST;
  
  export interface AppContext<ST extends AppState> {
    state: ST;
    dispatch: React.Dispatch<AppAction<ST>>;
  }
  