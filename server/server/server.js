const express = require('express');
const app = express();
const server = require('http').Server(app);
const config = require('./config')
const io = require('socket.io')(server, {
    cors: {
        origin:  config.ALLOWED_CLIENT.ORIGIN,
        methods: config.ALLOWED_CLIENT.METHODS
    }
});

// Keep track of customer and agent sockets
const customers = {};
let agent;
let currentUsers = [] // store current user (i.e. 3)
let waitingUsers = [] // waiting customers

// Start the server
server.listen(config.PORT||8000, () => {
    console.log(`Server started`);
});

// Handle a new socket connection
io.on('connection', socket => {

    // Handle a customer connecting
    socket.on('customerConnect', (customerId) => {
        if (customerId && customerId.length > 0) {
            customers[customerId] = socket;

            if (currentUsers.length < config.CURRENT_ACCEPT_USER) {
                currentUsers.push(customerId)
            } else {
                waitingUsers.push(customerId)
                socket.emit('message', { from: "Agent", message: "You are added to queue" })
            }
            if (agent) {
                agent.emit('connectCustomers', currentUsers)
            }
        }
    });

    // Handle an agent connecting
    socket.on('agentConnect', (agentId) => {
        agent = socket;
    });

    // Handle a message from a customer
    socket.on('customerMessage', (customerId, message) => {

        if (waitingUsers.includes(customerId)) {
            const curUser = customers[customerId]
            curUser.emit('message', { from: "Agent", message: "You are in queue, please wait" })
        } else {
            if (agent) {
                agent.emit('message', { from: customerId, message });
            } else {
                console.log(`agent is not available : ${agent}`);
            }
        }
    });

    // Handle a message from an agent
    socket.on('agentMessage', (customerId, message) => {

        // Send the message to the appropriate customer
        const customer = customers[customerId];
        if (customer) {
            customer.emit('message', { from: "Agent", message });
        } else {
            console.log(`customer is not available : ${customer}`);
        }

    });

    // Handle a customer or agent disconnecting
    socket.on('disconnect', (customerId) => {
        // Remove the socket from the customers or agents list
        for (let key of Object.keys(customers)) {
            if (customers[key].id === socket.id) {
                delete customers[key]
                if (currentUsers.includes(key)) {
                    currentUsers = currentUsers.filter(user => user !== key)
                    if (waitingUsers.length > 0) {
                        const selectedUser = waitingUsers.shift()
                        currentUsers.push(selectedUser)
                        const selectedCusSocket = customers[selectedUser]
                        selectedCusSocket.emit('message', { from: "Agent", message: "You are now connected to Agent" })
                    }
                } else {
                    waitingUsers = waitingUsers.filter(user => user !== key)
                }

                if (agent) {
                    agent.emit('connectCustomers', currentUsers)
                }
            }
        }

        if (agent === socket) {
            delete agent
        }
    });
});
