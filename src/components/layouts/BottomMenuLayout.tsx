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
    <main
      className=" mx-auto bg-g-0 w-full max-w-[600px] flex flex-col"
      style={{
        minHeight: 'calc(100vh - 2px)',
      }}
    >
      <div className="flex-grow">
        {children || <div className="flex-grow" />}
      </div>
      {isShowFooter && <Footer />}
      <div className="sticky bottom-0">
        <BottomMenu />
      </div>
    </main>
  );
};
