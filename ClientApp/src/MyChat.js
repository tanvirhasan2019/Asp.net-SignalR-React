
import React, { Component } from 'react'
import * as SignalR from '@aspnet/signalr';
import authService from './components/api-authorization/AuthorizeService';


export default class MyChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            message: '',
            hubConnection: null,
            messages: [],
            New : []

        }
    }
    componentDidMount = async () => {


        console.log('ComponentDidMount Called')
       
       

        const username = 'Hasan' //window.prompt('Your name:', 'John');
        const hubConnection = new SignalR.HubConnectionBuilder().withUrl("https://localhost:44379/signalrServer")
            .configureLogging(SignalR.LogLevel.Information)
            .build();
        this.setState({ hubConnection, username }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log('Connection started!'))
                .catch(err => console.log('Error while establishing connection :('));
            this.state.hubConnection.on("LoadMessages",   async () => {
                
                console.log('SignalR Response')
                const token = await authService.getAccessToken()
                const response = await fetch('Message/GetAllMessage', {
                    headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();


                const New = data.messageList
                this.setState({ New })
                // this.setState({ loading: false })
                //setResult(data.data)

                console.log('after fetch post From SignalR', data.messageList)
                
            });


        })  

       
    }

    async FetchDataServer() {

        const token = await authService.getAccessToken()
        const response = await fetch('Message/GetAllMessage', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        this.setState({ New: data.messageList })
        // this.setState({ loading: false })
        //setResult(data.data)

        console.log('after fetch post ', data.messageList)


    }

    async sendMessage() {

        this.state
            .hubConnection.invoke("LoadMessages").catch(function (err) {
                return console.error(err.toString());
            }); 

        console.log('Submit start')

        const token = await authService.getAccessToken()
        fetch('Message/CreateMessage', {
            method: 'POST', // or 'PUT'
            headers: !token ? {} : {
                'Content-Type': 'application/json; charset=utf-8', 'Authorization': `Bearer ${token}`
            },

            body: JSON.stringify({

                'Username': "MD. TANVIR HASAN TANSHEN",
                'Messages': this.state.message

            }),
        })
            .then(response => response.json())
            .then(Response => {
                // this.setState({ value:null })
                console.log('Status', { Response })
               

            })
            .catch((error) => {
                console.log('Error')
            });
        console.log('Submit End')
    }
    render() {


        return (
            <div>
                <label>Message</label> <br />
                <input type="text" id="messageInput" onChange={(e) => {
                    
                    this.setState({ message: e.target.value })
                }} />
                <br />
                <button onClick={() => {
                    this.sendMessage();
                }}>Send Message</button>
                <br />
                Mis mensajes            
                {

                    this.state.New.map(item =>
                        <ul> {item.messages} </ul>

                )}
                
            </div>
        )
    }
}
