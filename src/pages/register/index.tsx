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

  function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    (async () => {
      if (form.isValid()) {
        setLoading(true);

        // TODO:
      } else {
        form.validate();
      }
    })();

    setLoading(false);
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
            name='email'
          />
          <TextInput
            label='Email address'
            required
            mt='sm'
            {...form.getInputProps('email')}
            disabled={loading}
            name='email'
          />
          <PasswordInput
            label='Password'
            required
            mt='sm'
            {...form.getInputProps('password')}
            disabled={loading}
            name='email'
          />
          <PasswordInput
            label='Confirm password'
            required
            mt='sm'
            {...form.getInputProps('confirmPassword')}
            disabled={loading}
            name='email'
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
          />
          <Button fullWidth mt='xl' onClick={handleSubmit} loading={loading} name='register'>
            Register
          </Button>
        </Paper>
      </Container>
    </Page>
  );
}

export default Register;
