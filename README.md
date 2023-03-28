

# Support Express: A Customer Service Chat Application with Wait Queue Management


![](ChatApp.png)

## Introduction

Support Express is a customer service chat application designed to streamline the support experience for both customers and agents. The application is built using modern web technologies, including React for the Agent and Customer/Client interfaces, and Node.js for the server component. With Support Express, customers can connect with an available agent through live chat and receive quick and effective support.

## Features

Waiting queue management: If all available agents are busy, customers are placed in a queue and assigned to an agent as soon as one becomes available. Customers will see a message indicating that they have been added to the queue, and will receive a notification once they are connected to an agent.

Chat management: Agents can chat with multiple customers at the same time, with the number of customers assigned to the agent set at three by default. This number is configurable via the config.js file.

High volume handling: Support Express has been designed to handle a high volume of customer inquiries, ensuring that customers receive quick and effective support.

Efficient support experience: Support Express streamlines the support experience for both customers and agents, with a user-friendly interface that makes it easy to connect and chat with an available agent.

## Technical Requirements

The application requires the following components to run:

  React for the Agent and Customer/Client interfaces
  Node.js for the server component

## Getting Started

To start using Support Express, follow these steps:

    1. Clone the repository
    2. Navigate to the root directory of the each component repository
    3. Run npm install to install the necessary dependencies
    4. Start the server by running npm start
    5. Open multiple browser tabs, one for the agent and one for each customer
    6. Enter your username in the text field to connect and start a chat
    7. Verify that messages are sending and receiving by checking both the agent and customer windows
    8. All connected customers will show up in the side bar of the agent window, with a default of three customers displayed at a time.

Testing

To test Support Express:

    1. Connect more than three customers to see the waiting queue in action
    2. Disconnect any non-queued customers to see the side bar window update with newly connected customers

Support

For any issues or concerns, please reach out to our support team through the provided contact information.
Contributing

We welcome contributions to the project. If you would like to contribute, please reach out to our team through the provided contact information.
License

