import { useAlertToast } from '@hooks';
import { FormLabel, ScreenContainer } from '@modules';
import { useNavigation } from '@react-navigation/native';
import { useLoginMutation } from '@store';
import { Button, FormControl, Input, Link, Stack, Text, WarningOutlineIcon } from 'native-base';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { StackNavProps } from 'StackNavigation';

import { saveEntryAsJson } from '../../utils/AsyncStorage';
import { Screens } from '../../utils/constants';
import { getEncodedPassword } from '../../utils/EncodePassword';

type LoginForm = {
  email: string;
  password: string;
};

export const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm, any>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { navigate } = useNavigation<StackNavProps>();
  const [
    login,
    { isError, error, isSuccess, data: loggedinUserData, isLoading },
  ] = useLoginMutation();
  const { showErrorToast, showSuccessToast } = useAlertToast();

  useEffect(() => {
    if (isError) {
      //@ts-ignore
      showErrorToast(error.data.message);
    }
    if (isSuccess) {
      showSuccessToast("Login Success");
      if (loggedinUserData) {
        saveEntryAsJson("userData", loggedinUserData);
      }
    }
  }, [isError, isSuccess]);

  const onSubmit = useCallback(async ({ email, password }: LoginForm) => {
    await login({
      email,
      password: getEncodedPassword(password),
    }).unwrap();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScreenContainer>
        <FormControl isInvalid={!!errors.email} marginY={3}>
          <Stack mx="4">
            <FormLabel label="Email" />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  focusOutlineColor={"orange.500"}
                />
              )}
              name="email"
            />
            {errors.email?.type === "pattern" && (
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                Invalid email address
              </FormControl.ErrorMessage>
            )}
            {errors.email?.type === "required" && (
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                Email address required
              </FormControl.ErrorMessage>
            )}
          </Stack>
        </FormControl>
        <FormControl isInvalid={!!errors.password} marginY={3}>
          <Stack mx="4">
            <FormLabel label="Password" />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter password"
                  type="password"
                  focusOutlineColor={"orange.500"}
                />
              )}
              name="password"
            />
            {errors.password?.type === "required" && (
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                Password required.
              </FormControl.ErrorMessage>
            )}
          </Stack>
        </FormControl>
        <Button
          colorScheme={"orange"}
          style={styles.registerButton}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
          isLoadingText={"Logging in "}
        >
          {"Login "}
        </Button>
        {!isLoading ? (
          <Text marginTop={5} color={"orange.300"}>
            <Link
              style={styles.otherLink}
              onPress={() => navigate(Screens.REGISTER)}
              _text={{
                textDecoration: "none",
                color: "orange.500",
              }}
            >
              Not registered?. Sign-up here.
            </Link>
          </Text>
        ) : (
          <></>
        )}
        {!isLoading ? (
          <Text marginTop={3}>
            <Link
              style={styles.otherLink}
              onPress={() => navigate(Screens.CHECK_EMIAL_EXISTS)}
              _text={{
                textDecoration: "none",
                color: "orange.500",
              }}
            >
              Forgot Password?
            </Link>
          </Text>
        ) : (
          <></>
        )}
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  registerButton: {
    borderRadius: 5,
    padding: 5,
    marginTop: 20,
  },
  otherLink: {
    marginTop: 10,
  },
  image: {
    width: "50%",
    height: "20%",
    objectFit: "contain",
  },
});
