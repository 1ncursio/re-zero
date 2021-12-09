import produce from 'immer';
import React, { useCallback, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { userThumbnail } from '../../assets/images';
import useUserSWR from '../../hooks/swr/useUserSWR';
import updateUserImage from '../../lib/api/users/updateUserImage';
import updateUserProfile from '../../lib/api/users/updateUserProfile';
import optimizeImage from '../../lib/optimizeImage';
import { User } from '../../typings/user';

const AccountProfile = () => {
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
    [userData, mutateUser],
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
    [userData],
  );

  return (
    <div className="lg:w-[calc(768px-2rem)] w-md mx-auto md:w-full md:px-4">
      <Helmet>
        <title>프로필 설정 | Lathello</title>
      </Helmet>
      <h2 className="text-blueGray-600 text-lg mb-6">내 프로필 설정</h2>
      <div className="flex md:flex-col">
        <div className="flex justify-center items-center md:inline-flex flex-col md:pr-0 pr-6">
          <img
            src={optimizeImage(userData?.image_url ?? userThumbnail)}
            alt="profile"
            className="rounded-full w-36 h-36 mb-4 object-cover"
          />
          <input type="file" hidden ref={uploadRef} onChange={onUpload} />
          <button
            type="button"
            onClick={onClickUpload}
            className="text-sm bg-white border border-blueGray-500 hover:border-emerald-500 text-blueGray-500 hover:text-emerald-500 py-1 px-4 mb-2 w-full"
          >
            이미지 변경
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmitProfile)}
          className="md:pl-0 pl-6 flex-1 flex flex-col gap-y-{name:string}5"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm text-blueGray-600 cursor-pointer"
            >
              닉네임
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                {...register('name', { required: true, maxLength: 20 })}
                id="name"
                placeholder="닉네임 (최대 20자)"
                autoComplete="off"
                spellCheck={false}
                className="text-sm flex-1 border-b border-blueGray-200 focus:border-blueGray-400 focus:outline-none text-blueGray-600"
              />
              {errors.name?.type === 'required' && (
                <p className="text-red-500">닉네임은 필수 항목입니다.</p>
              )}
              {errors.name?.type === 'maxLength' && (
                <p className="text-red-500">닉네임은 최대 20자입니다.</p>
              )}
              <button
                type="submit"
                disabled={disabled}
                className="text-sm bg-white border border-blueGray-500 hover:border-emerald-500 text-blueGray-500 hover:text-emerald-500 py-1 px-4 disabled:bg-blueGray-300 disabled:border-white disabled:text-white disabled:cursor-not-allowed"
              >
                변경
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountProfile;
