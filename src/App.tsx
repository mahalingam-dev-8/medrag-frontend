import { AppRouter } from './routes';
import { ServerWakeGate } from '@/components/ServerWakeGate';

export default function App() {
  return (
    <ServerWakeGate>
      <AppRouter />
    </ServerWakeGate>
  );
}
