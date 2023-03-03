import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {
  Title,
  Container,
  Text,
  Anchor,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Checkbox
} from '@mantine/core';
import { useForm } from '@mantine/form';
import Link from 'next/link';

import { isValidEmail } from '../../util/email';

import { useAuth } from '../../hooks/auth';

import Page from '../../components/Page';

function LoginPage() {
  const router = useRouter();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);

  const [, setCookie] = useCookies(['authorization']);
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validate: {
      email: (value) => {
        return isValidEmail(value) ? null : 'Invalid email';
      },
      password: (value) => {
        if (!value) {
          return 'Password is required';
        }
        return value.length >= 8 ? null : 'Incorrect password';
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

        const user = await auth.login(form.values.email, form.values.password);
        if (user) {
          // If "Remember me" is checked.
          if (form.values.rememberMe) {
            setCookie('authorization', `${user.username}@${user.apiKey}`, {
              maxAge: 3600
            });
          }
          router.push('/feed');

          setLoading(false);
          return;
        }

        // If we are incorrect.
        form.setFieldValue('password', '');
        form.setFieldError('password', 'Incorrect password');
        setLoading(false);
      } else {
        form.validate();
      }
    })();
  }

  return (
    <Page title='Login'>
      <Container size={500} my='5em'>
        <Title align='center'>Welcome back!</Title>
        <Text color='dimmed' size='sm' align='center' mt='0.5em'>
          Do not have an account yet?{' '}
          <Anchor component={Link} href='/register' size='sm'>
            Create account
          </Anchor>
        </Text>

        <Paper withBorder shadow='md' p='xl' mt={30} radius='md'>
          <TextInput
            label='Email address'
            required
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
            name='password'
          />
          <Checkbox
            label='Remember me'
            mt='sm'
            {...form.getInputProps('rememberMe')}
            name='rememberMe'
          />

          <Button fullWidth mt='xl' onClick={handleSubmit} loading={loading} name='login'>
            Sign in
          </Button>
        </Paper>
      </Container>
    </Page>
  );
}

export default LoginPage;
