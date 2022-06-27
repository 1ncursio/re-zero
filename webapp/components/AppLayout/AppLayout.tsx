import React, { ReactElement } from 'react';

export type AppLayoutProps = {
  children: React.ReactNode;
};

/**
 * @deprecated use `_app.tsx` instead
 */
export default function AppLayout({ children }: AppLayoutProps): ReactElement {
  return <div className="w-full min-h-full flex flex-col">{children}</div>;
}

export type HeadProps = {
  children: React.ReactNode;
};

function Head({ children }: HeadProps) {
  return <header className="bg-white h-[70px] flex items-center px-16 xl:px-4 border-b-2">{children}</header>;
}

export type ChildrenProps = {
  children: React.ReactNode;
};

function Main({ children }: ChildrenProps) {
  return <main className="flex-1 xl:w-full mt-12 xl:mt-6 pb-4">{children}</main>;
}

function Footer({ children }: ChildrenProps) {
  return <footer className="h-44 bg-blueGray-800">{children}</footer>;
}

AppLayout.Head = Head;
AppLayout.Main = Main;
AppLayout.Footer = Footer;
