import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  View,
} from "react-native";

interface ButtonsProps extends PressableProps {
  title: string;
  onLoading?: string;
  isLoading: boolean;
  textStyle?: string;
  className?: string;
}

const Buttons: React.FC<ButtonsProps> = ({
  title,
  onLoading = "Mohon Tunggu...",
  isLoading,
  textStyle = "text-white font-semibold",
  className,
  onPress,
  disabled,
  ...rest
}) => {
  const finalClassName = `${className} ${isLoading || disabled ? "opacity-70" : "opacity-100"}`;

  return (
    <Pressable
      className={finalClassName}
      onPress={onPress}
      disabled={isLoading || disabled}
      {...rest}
    >
      {isLoading ? (
        <View className="flex-row items-center justify-center">
          <ActivityIndicator className="mr-2" size="small" color="#fff" />
          <Text className={textStyle}>{onLoading}</Text>
        </View>
      ) : (
        <Text className={textStyle}>{title}</Text>
      )}
    </Pressable>
  );
};

export default Buttons;
