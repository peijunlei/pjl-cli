

import { SetState } from './useSetState';

export interface StateProps {
  counter?: number;

}
export type MyContextProps = {
  state: StateProps;
  setState: SetState<StateProps>;
};