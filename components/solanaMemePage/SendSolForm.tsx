"use client"

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { Transaction, VersionedTransaction } from '@solana/web3.js'; // Import Transaction from '@solana/web3.js'

const backendUrl = 'http://localhost:3001'; // Replace with your backend URL and port

export const SendSolForm = () => {
    const [txSig, setTxSig] = useState('');
    const { connection } = useConnection();
    const { publicKey, signTransaction } = useWallet();
    const [unsignedTransaction, setUnsignedTransaction] = useState('');
    const [solAmount, setSolAmount] = useState(0);
    // const [destinationAddress, setDestinationAddress] = useState('');
    const [error, setError] = useState('');

    const link = () => {
        return txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : '';
    };

    const fetchUnsignedTransaction = async () => {
        try {
            const response = await fetch(`${backendUrl}/create-unsigned-transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ solAmount, publicKey }) // Send sol amount and destination address
            });
            const data = await response.json();
            const unsignedTransactionString = (data.unsignedTransaction)
            setUnsignedTransaction(unsignedTransactionString);
        } catch (error) {
            setError('Error fetching unsigned transaction');
        }
    };

    const sendSignedTransaction = async (signedTransaction: VersionedTransaction) => {
        try {
            const response = await fetch(`${backendUrl}/broadcast-signed-transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ signedTransaction: Buffer.from(signedTransaction.serialize()).toString("base64") }) // Serialize the signed transaction
            });

            const data = await response.json();
            if (data.success) {
                setTxSig(data.signature);
            } else {
                setError('Transaction failed: ' + data.error);
            }
        } catch (error) {
            setError('Error sending signed transaction');
        }
    };

    const handleSendSol = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (!connection || !publicKey) {
            setError('Wallet not connected');
            return;
        }

        try {
            // Deserialize the unsigned transaction string into a Transaction object
            const unsignedTransactionObj = VersionedTransaction.deserialize(Buffer.from(unsignedTransaction, 'base64'));
            const signedTransaction = await signTransaction!(unsignedTransactionObj);
            await sendSignedTransaction(signedTransaction); // Pass the signed transaction object
        } catch (error) {
            setError('Error signing transaction');
        }
    };

    return (
      <div style={{ textAlign: 'center', margin: '20px' }}>
          <input type="number" value={solAmount} onChange={(e) => setSolAmount(parseFloat(e.target.value))} placeholder="Sol Amount" />
          <br />
          {/* <input type="text" value={destinationAddress} onChange={(e) => setDestinationAddress(e.target.value)} placeholder="Destination Address" /> */}
          <br />
          <button onClick={fetchUnsignedTransaction}>Get Unsigned Transaction</button>
          <br />
          {
              unsignedTransaction && publicKey ?
                <form onSubmit={handleSendSol}>
                    <textarea value={unsignedTransaction} readOnly />
                    <br />
                    <button type="submit">Sign & Send Transaction</button>
                </form> :
                null
          }
          {
              txSig ?
                <div style={{ marginTop: '20px' }}>
                    <p style={{ marginBottom: '10px' }}>View your transaction on </p>
                    <a href={link()} style={{ textDecoration: 'none', color: '#007bff' }}>Solana Explorer</a>
                </div> :
                null
          }
          {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
};
