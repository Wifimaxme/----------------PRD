import { RouterProvider } from 'react-router';
import { router } from './routes';
import FloatingLkButton from '../components/FloatingLkButton';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <FloatingLkButton />
    </>
  );
}

export default App;
