import { Web3Provider } from './context/Web3Context';
import Navbar from './components/Navbar';
import BuyersList from './components/BuyersList';
import AddBuyer from './components/AddBuyer';

export default function App() {
  return (
    <Web3Provider>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="max-w-3xl mx-auto p-4 space-y-6 mt-6">
          <AddBuyer />
          <BuyersList />
        </div>
      </div>
    </Web3Provider>
  );
}
