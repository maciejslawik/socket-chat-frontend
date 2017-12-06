/**
 * @author      Maciej Sławik <maciej.slawik@bluepaprica.com>
 */
import React, {Component} from 'react';

class Chat extends Component {
  state = {
    messages: [],
    message: '',
    nickname: '',
    visible: true,
    maxMessages: 100,
  };

  chat = new WebSocket(process.env.REACT_APP_WEBSOCKET_HOST);

  constructor(props) {
    super(props);
    this.initChat();
  }

  initChat() {
    this.chat.onmessage = this.receiveMessages.bind(this);
  }

  receiveMessages(e) {
    let messages = this.state.messages.slice();
    let receivedMessages = JSON.parse(e.data);
    receivedMessages.forEach(function(receivedMessage) {
      this.pushMessageToMessages(messages, receivedMessage);
    }.bind(this));
    this.setState({messages: messages});
  }

  pushMessageToMessages(messages, newMessage) {
    messages.push(newMessage);
    if (messages.length > this.state.maxMessages) {
      messages.shift();
    }
  }

  sendMessage() {
    if (this.state.message !== '' && this.state.nickname !== '') {
      this.chat.send(this.getMessageContent());
      this.setState({message: ''});
    }
  }

  getMessageContent() {
    let message = {
      nickname: this.state.nickname,
      message: this.state.message,
    };
    return JSON.stringify(message);
  }

  handleNicknameChange(e) {
    this.setState({nickname: e.target.value});
  }

  handleMessageChange(e) {
    this.setState({message: e.target.value});
  }

  clearChat() {
    this.setState({messages: []});
  }

  toggleChatVisibility() {
    this.setState({visible: !this.state.visible});
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.sendMessage();
    }
  }

  render() {
    return (
        <div className={`chat-window ${this.state.visible ? '' : 'folded'}`}>
          <div onClick={this.toggleChatVisibility.bind(this)}
               className={'bar top-bar'}>
            <span>CHAT</span>
          </div>
          {this.state.visible ?
              <div className={'chat-content'}>
                <div className={'chat-messages'}>
                  {
                    this.state.messages.map(function(message, key) {
                      return <div key={key}
                                  dangerouslySetInnerHTML={{
                                    __html: '<strong>' + message.nickname +
                                    '</strong>: ' + message.message,
                                  }}/>;
                    })
                  }
                </div>
                <input className={'input message'}
                       placeholder={'message'}
                       value={this.state.message}
                       onChange={this.handleMessageChange.bind(this)}
                       onKeyPress={this.handleKeyPress.bind(this)}
                />
              </div>
              :
              null
          }
          {this.state.visible ?
              <div className={'bar bottom-bar'}>
                <button onClick={this.sendMessage.bind(this)} type={'button'}
                        className={'btn btn-success send'}>Send
                </button>
                <input className={'input name'}
                       placeholder={'nickname'}
                       value={this.state.nickname}
                       onChange={this.handleNicknameChange.bind(this)}
                       onKeyPress={this.handleKeyPress.bind(this)}
                />
                <button onClick={this.clearChat.bind(this)} type={'button'}
                        className={'btn btn-success clear'}>clear
                </button>
              </div>
              :
              null
          }
        </div>
    );
  }
}

export default Chat;
