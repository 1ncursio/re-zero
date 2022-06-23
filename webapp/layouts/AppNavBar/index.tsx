import { MainLinks } from '@components/MainLinks';
import { UserMenu } from '@components/User';
import { Navbar } from '@mantine/core';

export default function AppNavBar({ hidden }: { hidden: boolean }) {
  return (
    <Navbar width={{ sm: 200, lg: 300 }} p="xs" hiddenBreakpoint="sm" hidden={!hidden}>
      <Navbar.Section grow mt="xs">
        <MainLinks />
      </Navbar.Section>
      <Navbar.Section>
        <UserMenu />
      </Navbar.Section>
    </Navbar>
  );
}
