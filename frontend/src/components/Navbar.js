import { useWeb3 } from '../context/Web3Context';

export default function Navbar() {
  const { account } = useWeb3();
  return (
    <nav className="bg-blue-700 text-white p-4">
      <div className="max-w-4xl mx-auto flex justify-between">
        <h1 className="font-semibold">🩺 Insurance DApp</h1>
        {account ? (
          <span className="bg-blue-900 px-2 py-1 rounded text-sm">{account.slice(0,6)}...{account.slice(-4)}</span>
        ) : (
          <span className="text-sm">Connect wallet</span>
        )}
      </div>
    </nav>
  );
}

