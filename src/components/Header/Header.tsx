import { Button, Group, Header, Text } from '@mantine/core';
import { useRouter } from 'next/router';

import classes from './Header.module.scss';

function HeaderComponent() {
  const router = useRouter();

  return (
    <Header height={60} px='md'>
      <Group className={classes.header}>
        <Group position='apart' sx={{ height: '100%' }}>
          <Text fw={700}>Bliphunt</Text>
        </Group>
        {/* TODO: Search Bar */}
        <Group>
          <Button
            variant='default'
            onClick={() => {
              router.push('/login');
            }}
          >
            Log in
          </Button>
          <Button
            onClick={() => {
              router.push('/register');
            }}
          >
            Sign up
          </Button>
        </Group>
      </Group>
    </Header>
  );
}

export default HeaderComponent;
