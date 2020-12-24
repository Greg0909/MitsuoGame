let _database = firebase.database();
const DefaultName = "Patatas";
let counter = 0;
let checkForDropouts = false;
let pastData;


class XmasGame extends React.Component{
    constructor(props){
        super(props);
        this.setName = this.setName.bind(this);
        this.restartGift = this.restartGift.bind(this);
        this.onClickGift = this.onClickGift.bind(this);

        const initialUserName = DefaultName + "_" + (Math.floor(Math.random()*1000) +1);
        _database.ref("Users/" + initialUserName).set( counter );
        
        // Estados iniciales
        this.state = {
            userName: initialUserName,
            allUserNames: [initialUserName],
            clickCount: 100,
            turno: "???"
        };

        // Borra a los usuarios que no han incrementado su contador
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

        // Cuando el turno cambia se mueve el regalo al persoanje
        // que tiene el turno. el siguiente turno es decidido de 
        // manera aleatoria por el usuario actual que tenia el 
        // turno previo.
        _database.ref('Gift/turno').on('value', (snapshot) => {

            if(this.state.allUserNames.length > 1 && snapshot.val() == this.state.userName){

                let randIndex = 0;
                do{
                    randIndex = Math.floor( this.state.allUserNames.length * Math.random() );
                }while(this.state.allUserNames[randIndex] == this.state.userName);
                
                const timeoutMilliseconds = ( Math.floor( Math.random() * 4) +2) *1000;
                setTimeout( ()=> {
                    if(this.state.clickCount!=0)
                        _database.ref("Gift/turno").set( this.state.allUserNames[randIndex] )
                }, timeoutMilliseconds);
                console.log("timeout:", timeoutMilliseconds);
            }

            this.setState(()=>{return {turno:snapshot.val()}})
        });

        // Cuando el contador de click cambia se refreshea 
        // su state para vovler a hacer el render.
        _database.ref('Gift/count').on('value', (snapshot) => {
            this.setState(()=>{return {clickCount:snapshot.val()}})
        });

        // Cada 500 milisegundos aumenta un contador unico de cada usuario
        // como evidencia de que siguen conectados.
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

    restartGift(e){
        e.preventDefault();

        const inputClickCount = e.target.elements.maxClickCount.value;
        let maxClickCount = 100;
        if(inputClickCount)
            maxClickCount = inputClickCount;

        _database.ref("Gift/count").set( maxClickCount );
        _database.ref("Gift/turno").set( "" );
        _database.ref("Gift/turno").set( this.state.userName );
        this.setState(()=>{
            return {
                clickCount: maxClickCount
            };
        });
    }

    onClickGift(){
        if( this.state.clickCount >= 1)
            _database.ref("Gift/count").set( this.state.clickCount - 1 );
    }

    render(){

        return (
            <div style={{margin:20}}>
                <form onSubmit={this.setName}>
                    <input type="text" name="userName"></input>
                    <button>Aceptar Nombre</button>
                </form>

                <form onSubmit={this.restartGift}>
                    <input type="text" name="maxClickCount"></input>
                    <button>Start/Restart Game</button>
                </form>

                <div style={{display: "flex", flexWrap:"wrap"}}>
                    {
                    this.state.allUserNames.map((name)=>
                        <Player 
                            key={name} 
                            name={name} 
                            isActualUser={name==this.state.userName} 
                            clickCount={this.state.clickCount}
                            hasGift={name==this.state.turno}
                        />
                    )}
                </div>

                { (this.state.userName==this.state.turno && 
                    this.state.clickCount!=0) && 
                    <GiftButton 
                        onClickGift={this.onClickGift} 
                        clickCount={this.state.clickCount}
                    />
                }
                { (this.state.clickCount==0) &&
                    <WinMessage winner={this.state.turno}/>
                }
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
            //marginRight:"-38%",
            width: "50%"
        }
        const imageStyle = {
            height:"auto",
            width: "100%",
            position: "relative",
            left: "10%"
        }

        return(
            <div style={{ width:"30%", margin:"20px"}}>
                <div>
                    <h1 style={isActualUser?redStyle:undefined}>{name}</h1>
                </div>
                <div style={{display:"flex"}}> 
                    <div style={playerStyle}>
                        <img src="./Sprites/Player.png" style={imageStyle}/>
                    </div>

                    <div style={{position:"relative",width:"30%"}}>
                        <Gift 
                            hasGift={this.props.hasGift} 
                            clickCount={this.props.clickCount}
                        />
                    </div>
                </div>

            </div>
        );
    }


}

class Gift extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const imageStyle = {
            width: "100%",
            height: "auto",
            
        };
        const mainDivStyle={
           position: "absolute",
           bottom: "0px"
        };

        const hasGift = this.props.hasGift;
        const giftTemplate = (
            <div style={mainDivStyle}>
                <h2>{this.props.clickCount}</h2>
                <img src="./Sprites/Gift.png" style={imageStyle}/>
            </div>
        );
        const emptyTemplate = (
            <div></div>
        );
        return hasGift ? giftTemplate:emptyTemplate;
    }
}

class GiftButton extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const textStyle={
            textAlign: "center"
        }
        return (
            <div className="centered">
                <h1 style={textStyle}>Click Me!!!</h1>
                <h1 style={textStyle}>{this.props.clickCount} Clicks to Open</h1>
                <img onClick={this.props.onClickGift} style={{display:"block",marginLeft:"auto",marginRight:"auto"}} src="./Sprites/Gift.png"></img>
            </div>
        );
    }
}

class WinMessage extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const textStyle={
            textAlign: "center"
        }
        return (
            <div className="centered">
                <h1 style={textStyle}>The Winner is</h1>
                <h1 style={textStyle}>{this.props.winner} !!!</h1>
            </div>
        );
    }
}

ReactDOM.render(<XmasGame/>, document.getElementById("app"))