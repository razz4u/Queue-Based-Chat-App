import React, { useState, useEffect } from 'react';
import openSocket from 'socket.io-client';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { makeStyles } from '@mui/styles';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';

const drawerWidth = 200;

const useStyles = makeStyles({
  list: {
    width: 100,
  },
  fullList: {
    width: 'auto',
  },
  root: {
    paddingLeft: 10,
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
    marginLeft: 5,
    flex: 1,
  },
  conversation: {
    height: '600px',
    paddingLeft: 10,
    marginTop:'60px',
    bottom: 0,
    left: 0,
    zIndex: 1,
    width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`
  },
  message: {
    paddingTop: 10,
    paddingBottom: 5,
    borderRadius: 5,
  }
});


const AgentClient = () => {
  const classes = useStyles();

  const [agentId, setAgentId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    const agentSocket = openSocket('http://localhost:8000');
    setSocket(agentSocket);

    agentSocket.on('connect', () => {
      agentSocket.emit('agentConnect', agentId);
    });

    agentSocket.on('connectCustomers', (users) => {
      setOnlineUsers(users)
    })
    agentSocket.on('message', (data) => {
      setCustomerId(data.from)
      setConversation((prevConversation) => [...prevConversation, data]);
    });

    return () => {
      agentSocket.disconnect();
    };
  }, [agentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('agentMessage', customerId, message);
    setConversation((prevConversation) => [...prevConversation, { from: "You_" + customerId, message }]);
    setMessage('');
  };

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
    >
      <List>
        {onlineUsers.map((user, index) => (
          <ListItem button key={index}>
            <ListItemText primary={user} onClick={() => setCustomerId(user)} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, backgroundColor: '#330e62' }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Agent
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          }
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{backgroundColor: '#330e62'}}>
        <Typography variant="h7" noWrap component="div" color={'white'}>
            Online Users
          </Typography>
        </Toolbar>
        {list()}
      </Drawer>
      <div >
        <Paper  className={classes.conversation} sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, backgroundColor: '#E8EAF6' }}>
          {conversation.filter(item => item.from === customerId || item.from === "You_" + customerId).map((item, index) => (
            <Typography key={index} className={classes.message} variant="body2">
              {item.from === "You_" + customerId ? "You" : item.from}: {item.message}
            </Typography>
          ))}
        </Paper>
        <Paper component="form" className={classes.root} sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`}} onSubmit={handleSubmit}>
          <InputBase
            className={classes.input}
            placeholder="Type your message here"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <IconButton type="submit" className={classes.iconButton} aria-label="send">
            <SendIcon />
          </IconButton>
        </Paper>
      </div>
    </div>
  );
};

export default AgentClient;