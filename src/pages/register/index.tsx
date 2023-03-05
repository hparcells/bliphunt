import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import Link from 'next/link';
import { useForm } from '@mantine/form';
import { getHotkeyHandler } from '@mantine/hooks';
import axios from 'axios';

import Page from '../../components/Page';

import { useAuth } from '../../hooks/auth';

import { isValidEmail } from '../../util/email';

function Register() {
  const router = useRouter();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    },
    validate: {
      username: (value) => {
        if (!value) {
          return 'Username is required';
        }
        if (value.length > 32) {
          return 'Username must be 32 characters or less';
        }
        return value.length >= 3 ? null : 'Username must be at least 3 characters long';
      },
      email: (value) => {
        return isValidEmail(value) ? null : 'Invalid email';
      },
      password: (value) => {
        if (!value) {
          return 'Password is required';
        }
        return value.length >= 8 ? null : 'Password must be at least 8 characters long';
      },
      confirmPassword: (value, values) => {
        if (!value) {
          return 'Must confirm password';
        }
        return value === values.password ? null : 'Passwords must match';
      },
      terms: (value) => {
        return value ? null : 'Must agree';
      }
    }
  });

  useEffect(() => {
    if (auth.user) {
      router.push('/feed');

      // Just in case.
      form.reset();
    }
  }, [auth]);

  function handleSubmit(
    event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLElement> | KeyboardEvent
  ) {
    event.preventDefault();

    // Unfocus the text input.
    (document.activeElement as HTMLElement).blur();

    (async () => {
      setLoading(true);

      if (!form.isValid()) {
        // Show errors.
        form.validate();
        setLoading(false);
        return;
      }

      // Try to register.
      const response = await axios.post(
        '/api/v1/user/register',
        {
          username: form.values.username,
          email: form.values.email,
          password: form.values.password
        },
        {
          validateStatus: (status) => {
            return status < 500;
          }
        }
      );

      // If account creation failed.
      if (response.status !== 201) {
        setLoading(false);
        if (response.status === 409) {
          // If the account already exists.
          form.setErrors({ username: 'Account already exists', email: 'Account already exists' });
          return;
        }
        // If the account was't created for some other reason, like invalid email or password.
        form.setErrors({ terms: 'There was an error creating your account. Try again.' });
      }

      // Login if account creation was successful.
      const user = await auth.login(form.values.email, form.values.password);
      if (user) {
        // Redirect to feed.
        router.push('/feed');
        setLoading(false);
        return;
      }

      // Else, refresh. Something stupid happened.
      router.refresh();
    })();
  }

  return (
    <Page title='Register'>
      <Container size={500} my='5em'>
        <Title align='center'>Create an Account</Title>
        <Text color='dimmed' size='sm' align='center' mt='0.5em'>
          Already have an account?{' '}
          <Anchor component={Link} href='/login' size='sm'>
            Log in
          </Anchor>
        </Text>
        <Paper withBorder shadow='md' p='xl' mt={30} radius='md'>
          <TextInput
            label='Username'
            required
            {...form.getInputProps('username')}
            disabled={loading}
            name='username'
            onKeyDown={getHotkeyHandler([['Enter', handleSubmit]])}
          />
          <TextInput
            label='Email address'
            required
            mt='sm'
            {...form.getInputProps('email')}
            disabled={loading}
            name='email'
            onKeyDown={getHotkeyHandler([['Enter', handleSubmit]])}
          />
          <PasswordInput
            label='Password'
            required
            mt='sm'
            {...form.getInputProps('password')}
            disabled={loading}
            name='password'
            onKeyDown={getHotkeyHandler([['Enter', handleSubmit]])}
          />
          <PasswordInput
            label='Confirm password'
            required
            mt='sm'
            {...form.getInputProps('confirmPassword')}
            disabled={loading}
            name='confirmPassword'
            onKeyDown={getHotkeyHandler([['Enter', handleSubmit]])}
          />
          <Checkbox
            label={
              <span>
                I agree to the{' '}
                <Anchor component={Link} href='/terms'>
                  Terms of Service
                </Anchor>{' '}
                and{' '}
                <Anchor component={Link} href='/privacy'>
                  Privacy Policy
                </Anchor>
              </span>
            }
            mt='sm'
            {...form.getInputProps('terms')}
            name='terms'
          />
          <Button fullWidth mt='xl' onClick={handleSubmit} loading={loading} name='register'>
            Register
          </Button>
        </Paper>
        <Text mt='sm'>
          <Anchor component={Link} href='/' color='dimmed'>
            Back to home
          </Anchor>
        </Text>
      </Container>
    </Page>
  );
}

export default Register;
