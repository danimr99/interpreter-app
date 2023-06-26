import { TouchableOpacity, Text } from 'react-native'

const Button = ({ label, onClick }: { label: string, onClick: () => any }): JSX.Element => {
  return (
    <TouchableOpacity
      className='bg-accent justify-center items-center rounded-lg py-4'
      onPress={onClick}
    >
      <Text className='font-bold text-white'>{label}</Text>
    </TouchableOpacity>
  )
}

export default Button
