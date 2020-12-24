let _database = firebase.database();
const DefaultName = "Patatas";
let counter = 0;
let checkForDropouts = false;
let pastData;


class XmasGame extends React.Component{
    constructor(props){
        super(props);
        this.setName = this.setName.bind(this);
        const initialUserName = DefaultName + "_" + (Math.floor(Math.random()*1000) +1);
        _database.ref("Users/" + initialUserName).set( counter );
        
        this.state = {
            userName: initialUserName,
            allUserNames: [initialUserName]
        };

        _database.ref('Users').on('value', (snapshot) => {
            const data = snapshot.val();
            let names = [];
            for(var k in data) names.push(k);

            this.setState(()=>{return {
                allUserNames: names
            };});
           // console.log(data);
            if(checkForDropouts)
            {          
                if(pastData)
                {                 
                    for(var k in pastData)
                    {
                        if((k in data) && pastData[k]==data[k] )
                            _database.ref("Users/" + k).remove();
                    }
                }
                pastData = data;
                checkForDropouts=false;
            }
        });

        setInterval(()=>{
            counter = (counter%60)+1;
            _database.ref("Users/" + this.state.userName).set( counter );
            if(counter%4==0)
                checkForDropouts=true;
        }, 500);

        onbeforeunload = ()=> _database.ref("Users/" + this.state.userName).remove();
    }

    setName(e){
        e.preventDefault();

        const userName = e.target.elements.userName.value;
        if(userName)
        {
            _database.ref("Users/" + this.state.userName).remove();
            this.setState(()=>{return {userName: userName};})
            this.state.userName = userName;
            e.target.elements.userName.value = "";
            _database.ref("Users/" + userName).set( 1 );
        }
    }

    render(){

        return (
            <div style={{margin:20}}>
                <form onSubmit={this.setName}>
                    <input type="text" name="userName"></input>
                    <button>Aceptar Nombre</button>
                </form>
                <div style={{display: "flex", flexWrap:"wrap"}}>
                    {
                    this.state.allUserNames.map((name)=>
                        <Player key={name} name={name} isActualUser={name==this.state.userName} />
                    )}
                </div>
            </div>
        );
    }
}

class Player extends React.Component{
    constructor(props){
        super(props);

    }
    render(){
        const name = this.props.name;
        const isActualUser = this.props.isActualUser;
        const redStyle = {
            color:"red"
        };
        const playerStyle = {
           // margin:20
        }
        const imageStyle = {
            height:"auto",
            width: "30%",
            position: "relative",
            left: "10%"
        }

        return(
            <div style={playerStyle}>
                <h1 style={isActualUser?redStyle:undefined}>{name}</h1>
                <img src="./Sprites/Player.png" style={imageStyle}/>
            </div>
        );
    }


}

ReactDOM.render(<XmasGame/>, document.getElementById("app"))