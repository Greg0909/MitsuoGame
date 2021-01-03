"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _database = firebase.database();
var DefaultName = "Patatas";
var counter = 0;
var checkForDropouts = false;
var pastData = void 0;

var MitzuoGame = function (_React$Component) {
    _inherits(MitzuoGame, _React$Component);

    function MitzuoGame(props) {
        _classCallCheck(this, MitzuoGame);

        return _possibleConstructorReturn(this, (MitzuoGame.__proto__ || Object.getPrototypeOf(MitzuoGame)).call(this, props));
    }

    _createClass(MitzuoGame, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(Cells, null)
            );
        }
    }]);

    return MitzuoGame;
}(React.Component);

var Cells = function (_React$Component2) {
    _inherits(Cells, _React$Component2);

    function Cells(props) {
        _classCallCheck(this, Cells);

        var _this2 = _possibleConstructorReturn(this, (Cells.__proto__ || Object.getPrototypeOf(Cells)).call(this, props));

        _this2.transitionCell = "cell cell-motion";
        _this2.noTransitionCell = "cell";
        _this2.floorWidth = 100;

        _this2.state = {
            cellsStyles: [{ left: 0 + "vw", width: _this2.floorWidth + "vw" }, { left: _this2.floorWidth + "vw", width: _this2.floorWidth + "vw" }, { left: _this2.floorWidth * 2 + "vw", width: _this2.floorWidth + "vw" }],
            cellsClass: [_this2.transitionCell, _this2.transitionCell, _this2.transitionCell]
        };

        setInterval(function () {
            _this2.setState(function (prevState) {
                var resultCell1 = parseInt(prevState.cellsStyles[0].left.replace(/vw/, "")) - _this2.floorWidth + "vw";
                var resultCell2 = parseInt(prevState.cellsStyles[1].left.replace(/vw/, "")) - _this2.floorWidth + "vw";
                var resultCell3 = parseInt(prevState.cellsStyles[2].left.replace(/vw/, "")) - _this2.floorWidth + "vw";

                var classTypeCell1 = _this2.transitionCell;
                var classTypeCell2 = _this2.transitionCell;
                var classTypeCell3 = _this2.transitionCell;

                if (parseInt(resultCell1.replace(/vw/, "")) < -_this2.floorWidth) {
                    resultCell1 = _this2.floorWidth + "vw";
                    classTypeCell1 = _this2.noTransitionCell;
                }
                if (parseInt(resultCell2.replace(/vw/, "")) < -_this2.floorWidth) {
                    resultCell2 = _this2.floorWidth + "vw";
                    classTypeCell2 = _this2.noTransitionCell;
                }
                if (parseInt(resultCell3.replace(/vw/, "")) < -_this2.floorWidth) {
                    resultCell3 = _this2.floorWidth + "vw";
                    classTypeCell3 = _this2.noTransitionCell;
                }

                return { cellsStyles: [{ left: resultCell1, width: _this2.floorWidth + "vw" }, { left: resultCell2, width: _this2.floorWidth + "vw" }, { left: resultCell3, width: _this2.floorWidth + "vw" }],
                    cellsClass: [classTypeCell1, classTypeCell2, classTypeCell3] };
            });
        }, 3000);
        return _this2;
    }

    _createClass(Cells, [{
        key: "render",
        value: function render() {

            this.cell1 = React.createElement(
                "div",
                { key: "f1", className: this.state.cellsClass[0], style: this.state.cellsStyles[0] },
                "Cell",
                React.createElement(Obstacle, { yPosition: "30px" }),
                React.createElement(Obstacle, { yPosition: "200px" }),
                React.createElement(
                    "div",
                    { className: "floor" },
                    "floor"
                )
            );
            this.cell2 = React.createElement(
                "div",
                { key: "f2", className: this.state.cellsClass[1], style: this.state.cellsStyles[1] },
                "Cell",
                React.createElement(Obstacle, { yPosition: "100px" }),
                React.createElement(
                    "div",
                    { className: "floor" },
                    "floor"
                )
            );
            this.cell3 = React.createElement(
                "div",
                { key: "f3", className: this.state.cellsClass[2], style: this.state.cellsStyles[2] },
                "Cell",
                React.createElement(Obstacle, { yPosition: "10%" }),
                React.createElement(Obstacle, { yPosition: "20%" }),
                React.createElement(Obstacle, { yPosition: "30%" }),
                React.createElement(Obstacle, { yPosition: "40%" }),
                React.createElement(Obstacle, { yPosition: "50%" }),
                React.createElement(
                    "div",
                    { className: "floor" },
                    "floor"
                )
            );

            this.cells = [this.cell1, this.cell2, this.cell3];

            console.log("RENDERR!!", this.state.cellsStyles[0]);
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "game-window" },
                    React.createElement(
                        "h2",
                        null,
                        "GameWindow"
                    ),
                    this.cells
                )
            );
        }
    }]);

    return Cells;
}(React.Component);

var Obstacle = function (_React$Component3) {
    _inherits(Obstacle, _React$Component3);

    function Obstacle(props) {
        _classCallCheck(this, Obstacle);

        return _possibleConstructorReturn(this, (Obstacle.__proto__ || Object.getPrototypeOf(Obstacle)).call(this, props));
    }

    _createClass(Obstacle, [{
        key: "render",
        value: function render() {
            var objStyle = {
                left: this.props.yPosition
            };
            return React.createElement(
                "div",
                null,
                React.createElement("div", { className: "object", style: objStyle })
            );
        }
    }]);

    return Obstacle;
}(React.Component);

ReactDOM.render(React.createElement(MitzuoGame, null), document.getElementById("app"));
