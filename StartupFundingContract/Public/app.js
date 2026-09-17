let provider;

let signer;

let contract;



// ================================================
// CONTRACT ADDRESS
// ================================================

const CONTRACT_ADDRESS =
    "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B";



// ================================================
// CONTRACT ABI
// ================================================

const CONTRACT_ABI = [

    {
        inputs: [
            {
                internalType: "string",
                name: "_startupName",
                type: "string"
            },
            {
                internalType: "uint256",
                name: "_amount",
                type: "uint256"
            }
        ],

        name: "applyFunding",

        outputs: [],

        stateMutability: "nonpayable",

        type: "function"
    },


    {
        inputs: [
            {
                internalType: "uint256",
                name: "_applicationId",
                type: "uint256"
            }
        ],

        name: "approveFunding",

        outputs: [],

        stateMutability: "nonpayable",

        type: "function"
    },


    {
        inputs: [
            {
                internalType: "uint256",
                name: "_applicationId",
                type: "uint256"
            }
        ],

        name: "disburseFunds",

        outputs: [],

        stateMutability: "payable",

        type: "function"
    },


    {
        inputs: [
            {
                internalType: "uint256",
                name: "_applicationId",
                type: "uint256"
            }
        ],

        name: "getFundingStatus",

        outputs: [

            {
                internalType: "address",
                name: "startup",
                type: "address"
            },

            {
                internalType: "string",
                name: "startupName",
                type: "string"
            },

            {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
            },

            {
                internalType:
                    "enum StartupFunding.FundingStatus",
                name: "status",
                type: "uint8"
            }

        ],

        stateMutability: "view",

        type: "function"
    }

];



// ================================================
// CONNECT WALLET
// ================================================

document
    .getElementById("connectButton")
    .addEventListener(
        "click",
        connectWallet
    );



async function connectWallet() {

    try {

        if (!window.ethereum) {

            alert(
                "Please install MetaMask."
            );

            return;
        }


        provider =
            new ethers.BrowserProvider(
                window.ethereum
            );


        signer =
            await provider.getSigner();


        const address =
            await signer.getAddress();


        contract =
            new ethers.Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                signer
            );


        document
            .getElementById("walletAddress")
            .innerText =
            "Connected: " + address;


        showMessage(
            "MetaMask connected successfully."
        );

    }

    catch (error) {

        console.error(error);

        showMessage(
            "Wallet connection failed."
        );
    }
}



// ================================================
// APPLY FUNDING
// ================================================

document
    .getElementById("applyButton")
    .addEventListener(
        "click",
        applyFunding
    );



async function applyFunding() {

    try {

        if (!contract) {

            alert(
                "Connect MetaMask first."
            );

            return;
        }


        const startupName =
            document
                .getElementById("startupName")
                .value;


        const amount =
            document
                .getElementById("fundingAmount")
                .value;


        if (!startupName || !amount) {

            alert(
                "Enter startup name and amount."
            );

            return;
        }


        showMessage(
            "Submitting application..."
        );


        const amountInWei =
            ethers.parseEther(amount);


        const tx =
            await contract.applyFunding(
                startupName,
                amountInWei
            );


        showMessage(
            "Waiting for blockchain confirmation..."
        );


        await tx.wait();


        showMessage(
            "Funding application submitted!"
        );

    }

    catch (error) {

        console.error(error);

        showMessage(
            getErrorMessage(error)
        );
    }
}



// ================================================
// APPROVE FUNDING
// ================================================

document
    .getElementById("approveButton")
    .addEventListener(
        "click",
        approveFunding
    );



async function approveFunding() {

    try {

        if (!contract) {

            alert(
                "Connect MetaMask first."
            );

            return;
        }


        const id =
            document
                .getElementById("approveId")
                .value;


        if (!id) {

            alert(
                "Enter application ID."
            );

            return;
        }


        showMessage(
            "Approving application..."
        );


        const tx =
            await contract.approveFunding(
                id
            );


        await tx.wait();


        showMessage(
            "Funding approved!"
        );

    }

    catch (error) {

        console.error(error);

        showMessage(
            getErrorMessage(error)
        );
    }
}



// ================================================
// DISBURSE FUNDS
// ================================================

document
    .getElementById("disburseButton")
    .addEventListener(
        "click",
        disburseFunds
    );



async function disburseFunds() {

    try {

        if (!contract) {

            alert(
                "Connect MetaMask first."
            );

            return;
        }


        const id =
            document
                .getElementById("disburseId")
                .value;


        if (!id) {

            alert(
                "Enter application ID."
            );

            return;
        }


        const application =
            await contract.getFundingStatus(
                id
            );


        const amount =
            application[2];


        showMessage(
            "Disbursing funds..."
        );


        const tx =
            await contract.disburseFunds(
                id,
                {
                    value: amount
                }
            );


        await tx.wait();


        showMessage(
            "Funds disbursed successfully!"
        );

    }

    catch (error) {

        console.error(error);

        showMessage(
            getErrorMessage(error)
        );
    }
}



// ================================================
// GET STATUS
// ================================================

document
    .getElementById("statusButton")
    .addEventListener(
        "click",
        getFundingStatus
    );



async function getFundingStatus() {

    try {

        if (!contract) {

            alert(
                "Connect MetaMask first."
            );

            return;
        }


        const id =
            document
                .getElementById("statusId")
                .value;


        if (!id) {

            alert(
                "Enter application ID."
            );

            return;
        }


        const application =
            await contract.getFundingStatus(
                id
            );


        const startup =
            application[0];


        const startupName =
            application[1];


        const amount =
            application[2];


        const status =
            Number(application[3]);


        const statusNames = [

            "Not Applied",

            "Applied",

            "Approved",

            "Disbursed",

            "Rejected"

        ];


        document
            .getElementById("statusResult")
            .innerHTML = `

                <strong>Startup:</strong>
                ${startupName}

                <br>

                <strong>Wallet:</strong>
                ${startup}

                <br>

                <strong>Funding:</strong>
                ${ethers.formatEther(amount)}
                ETH

                <br>

                <strong>Status:</strong>
                ${statusNames[status]}

            `;

    }

    catch (error) {

        console.error(error);

        showMessage(
            getErrorMessage(error)
        );
    }
}



// ================================================
// MESSAGE
// ================================================

function showMessage(message) {

    document
        .getElementById("message")
        .innerText = message;
}



// ================================================
// ERROR
// ================================================

function getErrorMessage(error) {

    if (error?.reason) {

        return error.reason;
    }


    if (error?.shortMessage) {

        return error.shortMessage;
    }


    return "Transaction failed.";
}