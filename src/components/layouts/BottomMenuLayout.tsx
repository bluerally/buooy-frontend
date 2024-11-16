import { PropsWithChildren } from 'react';
import { BottomMenu } from './BottomMenu';
import { Footer } from './Footer';

type Props = {
  isShowFooter?: boolean;
};

export const BottomMenuLayout = ({
  isShowFooter = false,
  children,
}: PropsWithChildren & Props) => {
  return (
    <main className="flex flex-col h-screen mx-auto bg-g-0 w-full max-w-[600px]">
      <div className="flex-grow">{children}</div>
      {isShowFooter && <Footer />}
      <div className="sticky bottom-0">
        <BottomMenu />
      </div>
    </main>
  );
};
