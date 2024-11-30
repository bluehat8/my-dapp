// Asegúrate de que MetaMask esté disponible
if (typeof window.ethereum !== 'undefined') {
    console.log("MetaMask está instalado!");
  }
  
  let web3;
  let contract;
  const contractAddress = '0x2c0AE0DE9E04951D7D487F1BC7b53F04405A3945';
  const contractABI =  [
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
  
  async function init() {
    // Conectar con MetaMask
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        // Solicitar acceso a la cuenta de MetaMask
        await window.ethereum.enable();
        console.log('Conectado a MetaMask!');
      } catch (error) {
        console.error("Acceso a MetaMask denegado");
      }
    } else {
      alert("Por favor, instala MetaMask");
      return;
    }
  
    // Instancia del contrato
    contract = new web3.eth.Contract(contractABI, contractAddress);
  }
  
  // Establecer un nuevo mensaje
  document.getElementById('setMessageBtn').addEventListener('click', async () => {
    const newMessage = document.getElementById('message').value;
    if (!newMessage) {
      alert('Por favor, ingrese un mensaje');
      return;
    }
  
    const accounts = await web3.eth.getAccounts(); // Obtener las cuentas disponibles desde MetaMask
    const sender = accounts[0]; // Usamos la primera cuenta
  
    try {
      // Enviar la transacción
      await contract.methods.setMessage(newMessage).send({ from: sender });
      console.log('Mensaje establecido correctamente');
    } catch (error) {
      console.error('Error al establecer el mensaje:', error);
    }
  });
  
  // Obtener el mensaje almacenado
  document.getElementById('getMessageBtn').addEventListener('click', async () => {
    try {
      const message = await contract.methods.getMessage().call();
      document.getElementById('storedMessage').innerText = 'Mensaje almacenado: ' + message;
    } catch (error) {
      console.error('Error al obtener el mensaje:', error);
    }
  });
  
  // Inicializar la aplicación
  window.onload = init;
  