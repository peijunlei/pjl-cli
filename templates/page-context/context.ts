import {createContext} from 'react';
import { MyContextProps } from './types';


export const MyContext = createContext<MyContextProps>(null);
