import { ReactNode } from 'preact/compat'
import { StyleObject } from '../types/html'

interface StackProps {
    children: ReactNode[] | ReactNode
    direction: 'row' | 'row-reverse' | 'column' | 'column-reverse'
    style?: StyleObject
    className?: string
}

export function Stack(props: StackProps) {
    const style: StyleObject = {
        display: 'flex',
        'flex-direction': props.direction,
    }
    return (
        <div className={props.className} style={{ ...style, ...props.style }}>
            {props.children}
        </div>
    )
}
