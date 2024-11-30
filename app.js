require('dotenv').config();
const {Web3} = require('web3');

const web3 = new Web3(process.env.INFURA_URL);

const abi = [
    {
        "inputs": [],
        "name": "getMessage",
        "outputs": [
            { "internalType": "string", "name": "", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_message", "type": "string" }
        ],
        "name": "setMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(abi, contractAddress);

// Llave privada y cuenta
const privateKey = process.env.PRIVATE_KEY;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

async function setMessage(newMessage) {
    try {
        const tx = contract.methods.setMessage(newMessage);
        
        // Estimar el gas
        const gas = await tx.estimateGas({ from: account.address });
        
        // Establecer un gasPrice o maxFeePerGas según el tipo de transacción
        const gasPrice = await web3.eth.getGasPrice(); 

        // Aquí puedes establecer un gasLimit específico, por ejemplo, el 150% de la estimación de gas
        const gasLimit = Math.ceil(gas * 1.5);

        const txData = {
            from: account.address,
            to: contractAddress,
            data: tx.encodeABI(),
            gas: gasLimit,
            gasPrice,
        };

        // Firmar la transacción
        const signedTx = await web3.eth.accounts.signTransaction(txData, privateKey);
        
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("Transacción exitosa:", receipt.transactionHash);
    } catch (error) {
        console.error("Error al guardar el mensaje:", error);
    }
}

// Función para obtener el mensaje
async function getMessage() {
    try {
        const message = await contract.methods.getMessage().call();
        console.log("Mensaje almacenado en el contrato:", message);
    } catch (error) {
        console.error("Error al obtener el mensaje:", error);
    }
}

(async () => {
    console.log("Guardando un mensaje...");
    await setMessage("Hola desde Node.js!");
    
    console.log("Obteniendo el mensaje...");
    await getMessage();
})();
