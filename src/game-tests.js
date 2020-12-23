let _database = firebase.database();
const DefaultName = "Patatas";



class Player extends React.Component{
    constructor(props){
        super(props);
        this.setName = this.setName.bind(this);
        const initialUserName = DefaultName + "_" + (Math.floor(Math.random()*1000) +1);
        _database.ref("Users/" + initialUserName).set( 1 );
        
        this.state = {
            userName: initialUserName,
            allUserNames: [initialUserName, "UwU"]
        };

        _database.ref('Users').on('value', (snapshot) => {
            const data = snapshot.val();
            let names = [];
            for(var k in data) names.push(k);
            console.log(names);
            this.setState(()=>{return {
                allUserNames: names
            };});
        });
        window.onbeforeunload = ()=> _database.ref("Users/" + this.state.userName).remove();
    }

    setName(e){
        e.preventDefault();

        const userName = e.target.elements.userName.value;
        if(userName)
        {
            _database.ref("Users/" + this.state.userName).remove();
            this.setState(()=>{return {userName: userName};})
            e.target.elements.userName.value = "";
            _database.ref("Users/" + userName).set( 1 );
        }
    }

    render(){
        const redStyle = {
            color:"red"
        };
        return (
            <div style={{margin:20}}>
                <form onSubmit={this.setName}>
                    <input type="text" name="userName"></input>
                    <button>Aceptar Nombre</button>
                </form>
                {
                this.state.allUserNames.map((name)=>
                    <h1 key={name} style={name==this.state.userName?redStyle:undefined}>{name}</h1>
                )}
            </div>
        );
    }
}

ReactDOM.render(<Player/>, document.getElementById("app"))