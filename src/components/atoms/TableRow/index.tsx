import { ReactElement } from 'react';
import style from './style.module.css';

export interface TableRowProps {
  children: ReactElement | ReactElement[];
  className?: string;
}
export default function TableRow({ children, className }: TableRowProps) {
  return <div className={`${style.row} ${className}`}>{children}</div>;
}
