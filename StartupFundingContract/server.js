const express = require("express");

const path = require("path");


const app = express();


const PORT = 3000;


// Allow JSON requests

app.use(
    express.json()
);


// Serve frontend

app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);


// Home page

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "index.html"
            )
        );

    }
);


// Test API

app.get(
    "/api/status",
    (req, res) => {

        res.json({

            success: true,

            message:
                "Startup Funding API is running"

        });

    }
);


// Application API

app.post(
    "/api/application",
    (req, res) => {

        const {
            startupName,
            amount,
            walletAddress
        } = req.body;


        if (
            !startupName ||
            !amount ||
            !walletAddress
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All fields are required"

            });

        }


        res.json({

            success: true,

            message:
                "Application received",

            data: {

                startupName,

                amount,

                walletAddress

            }

        });

    }
);


// Start server

app.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);