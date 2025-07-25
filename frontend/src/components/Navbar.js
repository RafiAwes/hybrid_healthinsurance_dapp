import { useWeb3 } from '../context/Web3Context';

export default function Navbar() {
  const { account, connectWallet, hasMetaMask } = useWeb3();

  return (
    <nav className="bg-indigo-600 text-white shadow px-4 py-3 flex justify-between items-center">
      <div className="font-bold text-lg">🩺 Health Insurance DApp</div>
      <div>
        {!hasMetaMask ? (
          <span className="bg-red-500 px-3 py-1 rounded">Please install MetaMask</span>
        ) : account ? (
          <span className="bg-green-600 px-3 py-1 rounded">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}
