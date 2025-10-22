import Toast from "react-native-toast-message";

/**
 * Show a success toast notification
 * @param text1 Primary title of the toast.
 * @param text2 Optional seconday description.
 */
export const showSuccessToast = (text1: string, text2?: string) => {
  Toast.show({
    type: "success",
    text1: text1,
    text2: text2,
    position: "top",
    visibilityTime: 3000,
  });
};

/**
 * Show an error toast notification
 * @param text1 Primary title of the toast.
 * @param text2 Optional seconday description.
 */
export const showErrorToast = (text1: string, text2?: string) => {
    Toast.show({
        type: 'error',
        text1: text1,
        text2: text2,
        position: 'top',
        visibilityTime: 4000,
    })
}