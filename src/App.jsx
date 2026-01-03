import Calendar from './components/Calendar';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Calendar />
    </LanguageProvider>
  );
}

export default App;
