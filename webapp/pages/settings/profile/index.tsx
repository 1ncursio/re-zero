import useUserSWR from '@hooks/swr/useUserSWR';
import updateUserImage from '@lib/api/users/updateUserImage';
import updateUserProfile from '@lib/api/users/updateUserProfile';
import { Avatar, Button, TextInput, Title } from '@mantine/core';
import { User } from '@typings/user';
import produce from 'immer';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

const SettingsProfilePage = () => {
  const { data: userData, mutate: mutateUser } = useUserSWR();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const uploadRef = useRef<HTMLInputElement>(null);

  const disabled = watch('name') === userData?.name;

  useEffect(() => {
    reset({
      name: userData?.name ?? '',
    });
  }, [userData]);

  const onClickUpload = useCallback(() => {
    uploadRef?.current?.click();
  }, [uploadRef]);

  const onUpload = useCallback(
    async (e) => {
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
    async ({ name }: { name: string }) => {
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
          <Avatar src={userData?.image_url} sx={{ width: 128, height: 128, borderRadius: 64 }} />
          <input type="file" hidden ref={uploadRef} onChange={onUpload} />
          <Button variant="outline" onClick={onClickUpload}>
            이미지 변경
          </Button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmitProfile)}
          className="md:pl-0 pl-6 flex-1 flex flex-col gap-y-{name:string}5"
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              <TextInput
                type="text"
                {...register('name', { required: true, maxLength: 20 })}
                id="name"
                placeholder="닉네임 (최대 20자)"
                autoComplete="off"
                spellCheck={false}
                label="닉네임"
                required
              />
              {errors.name?.type === 'required' && <p className="text-red-500">닉네임은 필수 항목입니다.</p>}
              {errors.name?.type === 'maxLength' && <p className="text-red-500">닉네임은 최대 20자입니다.</p>}
              <Button type="submit" variant="default" disabled={disabled}>
                변경
              </Button>
            </div>
          </div>
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
