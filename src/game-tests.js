let _database = firebase.database();
const DefaultName = "Patatas";
let counter = 0;
let checkForDropouts = false;
let pastData;


class MitzuoGame extends React.Component{
    constructor(props){
        super(props);
    }


    render(){
        return (
            <div>
                <Cells/>
            </div>
        );
    }
}

class Cells extends React.Component{
    constructor(props){
        super(props);
        this.transitionCell = "cell cell-motion";
        this.noTransitionCell = "cell";
        this.floorWidth = 100;
        
        this.state = {
            cellsStyles: [{left:0+"vw", width:this.floorWidth+"vw"}, 
                            {left:this.floorWidth+"vw", width:this.floorWidth+"vw"},
                            {left:this.floorWidth*2+"vw", width:this.floorWidth+"vw"}],
            cellsClass: [this.transitionCell, 
                        this.transitionCell, 
                        this.transitionCell]
        };

        

        setInterval(()=>{
                this.setState((prevState)=>{
                    let resultCell1 = (parseInt(prevState.cellsStyles[0].left.replace(/vw/,""))-this.floorWidth)+"vw";
                    let resultCell2 = (parseInt(prevState.cellsStyles[1].left.replace(/vw/,""))-this.floorWidth)+"vw";
                    let resultCell3 = (parseInt(prevState.cellsStyles[2].left.replace(/vw/,""))-this.floorWidth)+"vw";

                    let classTypeCell1 = this.transitionCell;
                    let classTypeCell2 = this.transitionCell;
                    let classTypeCell3 = this.transitionCell;

                    if(parseInt(resultCell1.replace(/vw/,""))<-this.floorWidth)
                    {
                        resultCell1 = this.floorWidth+"vw";
                        classTypeCell1 = this.noTransitionCell;
                    }
                    if(parseInt(resultCell2.replace(/vw/,""))<-this.floorWidth)
                    {
                        resultCell2 = this.floorWidth+"vw";
                        classTypeCell2 = this.noTransitionCell;
                    }
                    if(parseInt(resultCell3.replace(/vw/,""))<-this.floorWidth)
                    {
                        resultCell3 = this.floorWidth+"vw";
                        classTypeCell3 = this.noTransitionCell;
                    }


                    return {cellsStyles: [{left:resultCell1, width:this.floorWidth+"vw"},
                                          {left:resultCell2, width:this.floorWidth+"vw"},
                                          {left:resultCell3, width:this.floorWidth+"vw"}],
                            cellsClass: [classTypeCell1, classTypeCell2, classTypeCell3]};
                })
            
        } ,3000);
    }
    render(){

        this.cell1 = (
            <div key="f1" className={this.state.cellsClass[0]} style={this.state.cellsStyles[0]}>
                Cell
                <Obstacle yPosition="30px"/>
                <Obstacle yPosition="200px"/>
                <div className="floor">
                    floor
                </div>
            </div>
        );
        this.cell2 = (
            <div key="f2" className={this.state.cellsClass[1]} style={this.state.cellsStyles[1]}>
                Cell
                <Obstacle yPosition="100px"/>
                <div className="floor">
                    floor
                </div>
            </div>
        );
        this.cell3 = (
            <div key="f3" className={this.state.cellsClass[2]} style={this.state.cellsStyles[2]}>
                Cell
                <Obstacle yPosition="10%"/>
                <Obstacle yPosition="20%"/>
                <Obstacle yPosition="30%"/>

                <Obstacle yPosition="40%"/>
                <Obstacle yPosition="50%"/>
                <div className="floor">
                    floor
                </div>
            </div>
        );

        this.cells=[this.cell1, 
            this.cell2,
            this.cell3];

        console.log("RENDERR!!", this.state.cellsStyles[0]);
        return(
            <div>
                <div className="game-window"> 
                    <h2>GameWindow</h2>
                    {this.cells}
                </div>
            </div>
        );
    }
}

class Obstacle extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let objStyle = {
            left: this.props.yPosition
        };
        return(
            <div>
                <div className="object" style={objStyle}></div>
            </div>
        );
    }
}


ReactDOM.render(<MitzuoGame/>, document.getElementById("app"))