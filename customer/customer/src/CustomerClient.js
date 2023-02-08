import React, { useState, useEffect } from 'react';
import openSocket from 'socket.io-client';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const useStyles = makeStyles({
  root: {
    paddingLeft: 16,
    display: 'flex',
    alignItems: 'right',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '2px solid #2F4F4F',
    bottom: 0,
    left: 0,
    zIndex: 1
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  conversation: {
    height: '620px',
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
  message: {
    padding: 10,
    borderRadius: 5,
  },
  connect: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  }
});

const CustomerClient = () => {
  const [customerId, setCustomerId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [conversation, setConversation] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    const customerSocket = openSocket('http://localhost:8000');
    setSocket(customerSocket);

    customerSocket.on('connect', () => {
      customerSocket.emit('customerConnect', customerId);
    });

    customerSocket.on('message', (data) => {
      setConversation((prevConversation) => [...prevConversation, data]);
    });

    return () => {
      customerSocket.disconnect(customerId);
    };
  }, [customerId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('customerMessage', customerId, message);
    setConversation((prevConversation) => [...prevConversation, { from: "You", message }]);
    setMessage('');
  };

  const handleConnect = (e) => {
    e.preventDefault();
    setCustomerId(e.target.elements.inputField.value);
    setIsConnected(true);
    socket.emit('customerConnect', customerId);
  }

  return (

    <div style={{ position: 'relative' }}>
      {isConnected ? <div style={{}}>
        <Paper style={{ border: "2px solid #2F4F4F", height: '10%', backgroundColor: '#330e62' }}>
          <Typography variant="h5" style={{ color: "white", paddingTop: 8, paddingLeft: 10, paddingBottom: 8 }}>
            {customerId}
          </Typography>
        </Paper>
        <Paper style={{ backgroundColor: '#E8EAF6' }} className={classes.conversation}>
          {conversation.map((data, index) => (
            <Typography key={index} className={classes.message} variant="body2">
              {data.from}: {data.message}
            </Typography>
          ))}
        </Paper>
        <Paper component="form" className={classes.root} onSubmit={handleSubmit}>
          <InputBase
            className={classes.input}
            placeholder="Type your message here"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <IconButton type="submit" aria-label="send">
            <SendIcon />
          </IconButton>
        </Paper>
      </div> : <div style={{ display: 'grid', justifyContent: 'center', alignItems: 'center' }}>
        <form onSubmit={handleConnect}>
          <TextField id="username" label="Username" type="text" name="inputField" defaultValue={customerId} />
          <div style={{ display: 'grid', justifyContent: 'center', alignItems: 'center' }}>
            <Button variant="contained" color="primary" type="submit">
              Connect
            </Button>
          </div>
        </form>
      </div>
      }
    </div>

  );
};

export default CustomerClient;
