import useUserSWR from '@hooks/swr/useUserSWR';
import updateUserImage from '@lib/api/users/updateUserImage';
import updateUserProfile from '@lib/api/users/updateUserProfile';
import optimizeImage from '@lib/optimizeImage';
import { Avatar, Button, Group, Stack, TextInput, Title } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { User } from '@typings/user';
import produce from 'immer';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { z } from 'zod';

interface FormValues {
  name: string;
}

const schema = z.object({
  name: z.string().max(20, { message: '닉네임은 최대 20자입니다.' }),
});

const SettingsProfilePage = () => {
  const { data: userData, mutate: mutateUser } = useUserSWR();
  const form = useForm<FormValues>({
    schema: zodResolver(schema),
    initialValues: {
      name: '',
    },
  });

  const uploadRef = useRef<HTMLInputElement>(null);

  const disabled = useMemo(() => {
    if (!userData) return true;

    return form.values.name === userData.name;
  }, [userData, form.values.name]);

  useEffect(() => {
    if (userData) {
      form.setValues({
        name: userData.name,
      });
    }
  }, [userData]);

  const onClickUpload = useCallback(() => {
    uploadRef?.current?.click();
  }, [uploadRef]);

  const onUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const formData = new FormData();
      formData.append('image', e.target.files[0]);
      const data = await updateUserImage(formData);
      mutateUser(
        produce((user?: User) => {
          if (!user) return;

          user.image_url = data;
        }),
        false,
      );
    },
    [mutateUser],
  );

  const onSubmitProfile = useCallback(
    async ({ name }: FormValues) => {
      const data = await updateUserProfile({
        name,
      });
      mutateUser(
        produce((user?: User) => {
          if (!user) return;

          user.name = data.name;
        }),
        false,
      );
    },
    [mutateUser],
  );

  return (
    <>
      <Head>
        <title>프로필 설정 - Re:zero</title>
      </Head>
      <Title order={3}>내 프로필 설정</Title>
      <div className="flex md:flex-col">
        <div className="flex justify-center items-center md:inline-flex flex-col md:pr-0 pr-6">
          <Avatar
            src={optimizeImage(userData?.image_url)}
            sx={{ width: 128, height: 128, borderRadius: 64 }}
          />
          <input type="file" hidden ref={uploadRef} onChange={onUpload} />
          <Button variant="outline" onClick={onClickUpload}>
            이미지 변경
          </Button>
        </div>
        <form onSubmit={form.onSubmit(onSubmitProfile)}>
          <Stack>
            <TextInput
              required
              type="text"
              placeholder="닉네임 (최대 20자)"
              autoComplete="off"
              spellCheck={false}
              label="닉네임"
              {...form.getInputProps('name')}
            />
            <Group position="right">
              <Button type="submit" variant="default" disabled={disabled}>
                변경
              </Button>
            </Group>
          </Stack>
        </form>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const initialLocale = locale || 'ko';

  return {
    props: {
      ...(await serverSideTranslations(initialLocale, ['common', 'navbar'])),
    },
  };
};

export default SettingsProfilePage;
