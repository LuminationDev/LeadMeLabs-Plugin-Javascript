import {Server, Socket} from "node:net";

const net = require('net')
class LeadMeLabsConnection {
    private logCallback: () => void = () => {
    }
    private pauseCallback: () => void = () => {
    }
    private resumeCallback: () => void = () => {
    }
    private shutdownCallback: () => void = () => {
    }
    private detailsCallback: () => void = () => {
    }
    private actionCallback: (message: string) => void = (message: string) => {
    }

    private server: Server;
    private client: Socket;

    public connect() {
        var PIPE_NAME = "leadme_api";
        var PIPE_PATH = "\\\\.\\pipe\\" + PIPE_NAME;
        this.server = net.createServer((stream: Socket) => {
            stream.on('data', (c) => {
                this.handleMessage(c.toString().replace(/\u0000/g, ''))
            });
        });
        this.server.listen(PIPE_PATH)
    }

    public disconnect() {
        this.server.close()
    }

    public send(message: string) {
        var PIPE_NAME = "leadme_parent_api";
        var PIPE_PATH = "\\\\.\\pipe\\" + PIPE_NAME;
        if (!this.client) {
            this.client = net.connect(PIPE_PATH)
        }
        this.client.write(Buffer.from(message, 'utf16le'))
    }

    public setLogCallback(callback: () => void) {
        this.logCallback = callback
    }

    public setPauseCallback(callback: () => void) {
        this.pauseCallback = callback
    }

    public setResumeCallback(callback: () => void) {
        this.resumeCallback = callback
    }

    public setShutdownCallback(callback: () => void) {
        this.shutdownCallback = callback
    }

    public setDetailsCallback(callback: () => void) {
        this.detailsCallback = callback
    }

    public setActionCallback(callback: (message: string) => void) {
        this.actionCallback = callback
    }

    private handleMessage(message: string)
    {
        switch (message)
        {
            case "log":
                this.logCallback();
                break;
            case "pause":
                this.pauseCallback();
                break;
            case "resume":
                this.resumeCallback();
                break;
            case "shutdown":
                this.shutdownCallback();
                break;
            case "details":
                this.detailsCallback();
                break;
            case "action":
            default:
                this.actionCallback(message);
                break;
        }
    }
}

export default LeadMeLabsConnection