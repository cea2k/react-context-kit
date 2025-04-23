import React, {
    Dispatch,
    ComponentType,
    createContext,
    FunctionComponent,
    useContext,
    useState,
    Context,
  } from 'react';
  
  import { AppAction, AppState, AppContext } from './types';
  
  function createAppState<ST extends AppState>(initialValue: ST) {
    const context = createContext<AppContext<ST>>({
      state: initialValue,
      dispatch: () => null,
    });
  
    const Consumer = context.Consumer;
  
    const Provider: FunctionComponent = ({ children }) => {
      const [state, setState] = useState<ST>(initialValue);
      const dispatch: Dispatch<AppAction<ST>> = (action: AppAction<ST>) => {
        setState(prevState => {
          return {
            ...action(prevState),
            timestamp: Date.now(),
          };
        });
      };
      return (
        <context.Provider value={{ state, dispatch }}>
          {children}
        </context.Provider>
      );
    };
  
    const useAppState = () => {
      const ctx = useContext(context);
      if (!ctx) {
        throw new Error(`App State must be used within a App State Provider`);
      }
      return ctx;
    };
  
    const withAppState = <P extends object>(
      Component: ComponentType<P>
    ): FunctionComponent<P> => (props: P) => (
      <Provider>
        <Component {...props} />
      </Provider>
    );
  
    return { Consumer, Provider, useAppState, withAppState };
  }
  
  export { createAppState };
  
  /**
   * How to use it
   *  
   */
  
  interface TeamsAppState extends AppState {
    teams: TeamsRoot
  }
  
  const initialValue: TeamsAppState = {
    timestamp: Date.now(),
    teams: {
      id: 'root',
      type: 'root',
      name: 'Root',
      depth: 0,
      children: [],        
    },
  }
  
  const {
    Consumer: TeamsStateConsumer,
    Provider: TeamsStateProvider,
    useAppContext: useTeamsAppContext,
  } = createAppState<TeamsAppState>(initialValue);
  
  const {state, dispatch} = useTeamsAppContext();
  
  console.log('Teams State', state && state.teams.name);
  
  // Synchronous Action
  const actionAddTeam = (name: string, teamId: number) => 
    (state: TeamsAppState) => {
      // Modify state
      return state
    }
  
  dispatch(actionAddTeam('New Team', 0));
  
  function apiCreateTeam(name: string): Promise<Team> {
    return new Promise<Team>((resolve, reject) => {
      resolve({
        id: '111',
        name,
        depth: 1,
        type: 'teams',
        allocation: 100,
        description: name,
        strategic_value: 1000000,
      })
    })
  }
  
  // Asynchronous Action
  
  const actionAddTeamAsync = (name: string, teamId: number) => {
    apiCreateTeam(name)
      .then((team) => {
        dispatch(actionAddTeam(team.name, 0));
      });
  };
  
  actionAddTeamAsync('New Team', 0);
  
  function SomeConsumer() {
    return (
      <TeamsStateConsumer>
        {({dispatch}) => (
          <button
            onClick={() => dispatch(actionAddTeam('Some Team', 0))}>
            Dispatch Some
          </button>
        )}
      </TeamsStateConsumer>
    );
  }
  
  function SomeProvider() {
    return (
      <TeamsStateProvider>
        <SomeConsumer/>
      </TeamsStateProvider>
    );
  }