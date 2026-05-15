import { RouterProvider } from 'react-router';
import { MotionConfig } from 'motion/react';
import { router } from './routes';
import FloatingLkButton from '../components/FloatingLkButton';

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
      <FloatingLkButton />
    </MotionConfig>
  );
}

export default App;
