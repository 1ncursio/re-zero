import { AspectRatio, Box, Center, Group, Image, Stack, Text } from '@mantine/core';
// import Image from 'next/image';
import { FC } from 'react';

const RequireLogIn: FC = () => {
  return (
    <Box sx={{ textAlign: 'center', marginTop: 180 }}>
      <AspectRatio ratio={870 / 520} sx={{ maxWidth: 600 }} mx="auto" mb="xl">
        <Image src="/assets/images/undraw_login.svg" alt="require-login" />
      </AspectRatio>
      <Text size="lg" align="center">
        로그인 후 이용해주세요.
      </Text>
    </Box>
  );
};

export default RequireLogIn;
