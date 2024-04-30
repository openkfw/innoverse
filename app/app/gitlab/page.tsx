import SkeletonIndexPage from '@/app/skeletonIndexPage';
import LoginDialog from '@/components/login/LoginDialog';

export default function SignInWithGitLab() {
  return (
    <>
      <SkeletonIndexPage />
      <LoginDialog providers={['gitlab', 'credentials']} />
    </>
  );
}
