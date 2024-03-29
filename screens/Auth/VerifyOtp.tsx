import { useAlertToast } from '@hooks';
import { ResendOTPButton, ScreenContainer } from '@modules';
import { useNavigation } from '@react-navigation/native';
import { AuthState, RootState, useVerifyOtpMutation } from '@store';
import { Button, HStack, Input } from 'native-base';
import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import { StackNavProps } from '../../StackNavigation';
import { Screens } from '../../utils/constants';

export const VerifyOtp = () => {
  const [value, setValue] = useState<string[]>(Array.from({ length: 6 }));
  const ref = useRef<any>(Array.from({ length: 6 }));
  const [verifyOtp, verifyOtpResult] = useVerifyOtpMutation();
  const { token, isPasswordReset } = useSelector<RootState, AuthState>(
    (state) => state.auth
  );
  const { showErrorToast, showSuccessToast } = useAlertToast();

  const onChange = useCallback((inputIndex: number, val: string) => {
    if (isNaN(Number(val))) {
      return;
    }
    setValue((values) => {
      const newValues = [...values];
      newValues[inputIndex] = val.charAt(val.length - 1);
      return newValues;
    });
    if (val && inputIndex < 5) {
      ref.current[inputIndex + 1].focus?.();
    }
    if (!val && inputIndex > 0) {
      ref.current[inputIndex - 1].focus?.();
    }
  }, []);

  const isInputValid = value.every((elem) => !!elem);

  const buttonStyles = isInputValid ? {} : { opacity: 0.5 };

  // const dispath = useDispatch();
  const { navigate } = useNavigation<StackNavProps>();

  const onClickVerifyOtp = useCallback(async () => {
    verifyOtp({ token, otp: value.join("") });
  }, [value]);

  useEffect(() => {
    if (verifyOtpResult.isSuccess) {
      showSuccessToast("OTP verfied successfully");
      if (isPasswordReset) {
        navigate(Screens.SET_NEW_PASSWORD);
      }
    } else if (verifyOtpResult.isError) {
      //@ts-ignore
      showErrorToast(verifyOtpResult.error.data.message);
    }
  }, [verifyOtpResult.isSuccess, verifyOtpResult.isError]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScreenContainer>
        <HStack space={3} maxW="80%">
          {Array.from({ length: 6 }).map((elem, index) => {
            return (
              <Input
                type="text"
                size={"2xl"}
                variant="unstyled"
                key={index}
                style={styles.inputBox}
                width="10"
                keyboardType="numeric"
                value={value[index]}
                colorScheme={"orange"}
                ref={(e) => (ref.current[index] = e)}
                onChangeText={(val: string) => {
                  onChange(index, val);
                }}
                selection={{
                  start: value[index]?.length,
                  end: value[index]?.length,
                }}
                borderBottomWidth={2}
                borderColor={"orange.500"}
              />
            );
          })}
        </HStack>
        <ResendOTPButton />
        <Button
          w="70%"
          my="5"
          colorScheme={"orange"}
          disabled={!isInputValid}
          style={buttonStyles}
          alignSelf="center"
          onPress={onClickVerifyOtp}
          isLoading={verifyOtpResult.isLoading}
          isLoadingText="Verifying "
        >
          Verify OTP
        </Button>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputBox: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "900",
    textAlignVertical: "center",
  },
});
