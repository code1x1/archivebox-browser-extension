import { Dispatch, StateUpdater } from 'preact/hooks'
import { Stack } from './components/stack'
import { FcFeedIn, FcManager, FcSettings } from 'react-icons/fc'
import React from 'preact/compat'

export type Section = {
    id: string
    component: React.JSX.Element
    label: React.JSX.Element
    icon: React.JSX.Element
}

interface NavigationProps {
    onChange: Dispatch<StateUpdater<string>>
    active: string
    sections: Section[]
}

export function Navigation(props: NavigationProps) {
    const onClick = (id: string) => () => props.onChange(id)

    return (
        <ul>
            <Stack direction="row" className="mx-2">
                {props.sections.map((section) => {
                    return (
                        <li className="mx-2" style={{ 'list-style': 'none' }}>
                            <button
                                onClick={onClick(section.id)}
                                role="tab"
                                className={props.active ? 'active' : ''}
                            >
                                <Stack direction="column" className="mx-2">
                                    {section.icon}
                                    {section.label}
                                </Stack>
                            </button>
                        </li>
                    )
                })}
            </Stack>
        </ul>
    )
}
