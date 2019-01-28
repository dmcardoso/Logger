const Server = function(){

    const port = 3003;
    const serverUrl = `http://localhost:${port}/`;

    this.getServerUrl = () => {
        return serverUrl;
    };

};

export default Server;