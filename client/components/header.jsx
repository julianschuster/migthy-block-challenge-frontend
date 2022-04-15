import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();

  return (
    <div className="header width-100 height-header bold flex-align justify-content-space-around background-white">
      <div className="flex-align cursor-pointer" onClick={() => router.push('/')} role="presentation">
        <i className="header-logo color-primary ri-landscape-fill" />
        {' '}
        Pixowlgram
      </div>
    </div>
  );
};

export { Header };
