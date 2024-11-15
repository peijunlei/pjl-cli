import React, { useContext } from 'react';

import { MyContext } from '../context';
interface CounterProps {
}
function Counter(props: CounterProps) {
  const {state, setState} = useContext(MyContext);
  const { } = props;
  return (
    <div>
      Counter
    </div>
  )
}
export default Counter;
