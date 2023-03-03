import { Anchor, clsx, Container, createStyles, Group, Text } from '@mantine/core';
import Link from 'next/link';

import classes from './Footer.module.scss';

const useMantineStyles = createStyles((theme) => {
  return {
    root: {
      borderTop: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
      }`
    }
  };
});

function Footer() {
  const mantineStyles = useMantineStyles();

  return (
    <div className={clsx(classes.root, mantineStyles.classes.root)}>
      <Container className={classes.content}>
        <Text fw={700}>Bliphunt</Text>

        <Group className={classes.links}>
          <Anchor component={Link} href='/terms' color='dimmed'>
            Terms of Service
          </Anchor>
          <Anchor component={Link} href='/privacy' color='dimmed'>
            Privacy
          </Anchor>
          <Anchor
            component='a'
            href='https://github.com/hparcells/bliphunt'
            target='_blank'
            color='dimmed'
          >
            Source Code
          </Anchor>
        </Group>
      </Container>
    </div>
  );
}

export default Footer;
