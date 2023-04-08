import { useState } from 'react'
import InputNumber from '../InputNumber/InputNumber'
interface Props {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  onFocusOut?: (value: number) => void
  classNameWrapper?: string
  value: string | number
  disabled: boolean
}
const QuantityController = ({
  max,
  onIncrease,
  onDecrease,
  onType,
  onFocusOut,
  classNameWrapper = '',
  value,
  disabled
}: Props) => {
  const [localValue, setLocalValue] = useState<number>(Number(value || 0))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(e.target.value)
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }
    onType && onType(_value)
    setLocalValue(_value)
  }
  const decrease = () => {
    let _value = Number(value || localValue) - 1
    if (_value < 1) {
      _value = 1
    }
    onDecrease && onDecrease(_value)
    setLocalValue(_value)
  }
  const increase = () => {
    let _value = Number(value || localValue) + 1
    if (max !== undefined)
      if (_value > max) {
        _value = max
      }
    onIncrease && onIncrease(_value)
    setLocalValue(_value)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(event.target.value))
  }
  return (
    <div className={`flex text-text-color justify-center `}>
      <button
        className={`text-[30px] mobile:text-[14px] border p-2 ${disabled ? 'bg-gray-200 cursor-default' : ''}`}
        onClick={decrease}
      >
        -
      </button>
      <InputNumber value={value || localValue} onBlur={handleBlur} onChange={handleChange}></InputNumber>
      <button
        className={`text-[30px] mobile:text-[14px] border p-2 ${disabled ? 'bg-gray-200 cursor-default' : ''}`}
        onClick={increase}
      >
        +
      </button>
    </div>
  )
}

export default QuantityController
