import { useMemo } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'

type InputProps = (
    | {
          type?: 'text' | 'password' | 'email' | 'tel' | 'url'
          value: string
          onChange: (value: string) => void
      }
    | {
          type: 'checkbox'
          value: boolean
          onChange: (value: boolean) => void
      }
) &
    Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>

export function Input(props: InputProps) {
    const onChange: JSX.GenericEventHandler<HTMLInputElement> = (e) => {
        if (props.type === 'checkbox') {
            props.onChange(e.currentTarget.value === 'true')
        } else {
            props.onChange(e.currentTarget.value)
        }
    }

    const value = useMemo(() => {
        if (props.type === 'checkbox') {
            return `${props.value}`
        } else {
            return props.value
        }
    }, [props.value])

    return (
        <input {...props} type={props.type} value={value} onChange={onChange} />
    )
}
