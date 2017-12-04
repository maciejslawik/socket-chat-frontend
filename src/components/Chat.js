/**
 * @author      Maciej Sławik <maciej.slawik@bluepaprica.com>
 */
import React, {Component} from 'react';

class Chat extends Component {

  state = {
    messages: [],
    message: '',
    nickname: '',
  };

  chat = new WebSocket(process.env.REACT_APP_WEBSOCKET_HOST);

  constructor(props) {
    super(props);
    this.initChat();
  }

  initChat() {
    this.chat.onopen = function(e) {

    }.bind(this);
    this.chat.onmessage = function(e) {
      let messages = this.state.messages.slice();
      messages.push(e.data);
      this.setState({messages: messages});
    }.bind(this);
  }

  sendMessage() {
    if (this.state.message !== '' && this.state.nickname !== '') {
      this.chat.send(this.getMessageContent());
      this.setState({message: ''});
    }
  }

  getMessageContent() {
    return '<strong>' + this.state.nickname + '</strong>: ' + this.state.message;
  }

  handleNicknameChange(e) {
    this.setState({nickname: e.target.value});
  }

  handleMessageChange(e) {
    this.setState({message: e.target.value});
  }

  render() {
    return (
        <div className={'chat-window'}>
          <div className={'bar top-bar'}>
            <span>CHAT</span>
          </div>
          <div className={'chat-content'}>
            <div className={'chat-messages'}>
              {
                this.state.messages.map(function(message) {
                  return <span
                      dangerouslySetInnerHTML={{__html: message}} />;
                })
              }
            </div>
            <input className={'input message'}
                   placeholder={'message'}
                   value={this.state.message}
                   onChange={this.handleMessageChange.bind(this)}
            />
          </div>
          <div className={'bar bottom-bar'}>
            <button onClick={this.sendMessage.bind(this)} type={'button'}
                    className={'btn btn-success send'}>Send
            </button>
            <input className={'input name'}
                   placeholder={'nickname'}
                   value={this.state.nickname}
                   onChange={this.handleNicknameChange.bind(this)}/>
          </div>
        </div>
    );
  }
}

export default Chat;
