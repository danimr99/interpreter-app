import type { ReactNode } from 'react'
import { TouchableOpacity } from 'react-native'

const IconButton = ({ buttonColor = 'bg-theme/[0.5]', children, onClick }: {
  buttonColor?: string
  children: ReactNode
  onClick: () => any
}): JSX.Element => {
  return (
    <TouchableOpacity
      className={`w-10 h-10 justify-center items-center rounded-lg ${buttonColor}`}
      onPress={onClick}
    >
      {children}
    </TouchableOpacity>
  )
}

export default IconButton