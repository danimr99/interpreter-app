import type { ReactNode } from 'react'
import { TouchableOpacity } from 'react-native'

const IconButton = ({ buttonColor = 'bg-transparent', buttonShape = 'rounded-full', onClick, children }: {
  buttonColor?: string
  buttonShape?: string
  onClick: any
  children: ReactNode
}): JSX.Element => {
  return (
    <TouchableOpacity
      className={`w-10 h-10 justify-center items-center ${buttonShape} ${buttonColor}`}
      onPress={onClick}
    >
      {children}
    </TouchableOpacity>
  )
}

export default IconButton
