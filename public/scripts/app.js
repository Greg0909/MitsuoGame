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

var XmasGame = function (_React$Component) {
    _inherits(XmasGame, _React$Component);

    function XmasGame(props) {
        _classCallCheck(this, XmasGame);

        var _this = _possibleConstructorReturn(this, (XmasGame.__proto__ || Object.getPrototypeOf(XmasGame)).call(this, props));

        _this.setName = _this.setName.bind(_this);
        var initialUserName = DefaultName + "_" + (Math.floor(Math.random() * 1000) + 1);
        _database.ref("Users/" + initialUserName).set(counter);

        _this.state = {
            userName: initialUserName,
            allUserNames: [initialUserName]
        };

        _database.ref('Users').on('value', function (snapshot) {
            var data = snapshot.val();
            var names = [];
            for (var k in data) {
                names.push(k);
            }_this.setState(function () {
                return {
                    allUserNames: names
                };
            });
            // console.log(data);
            if (checkForDropouts) {
                if (pastData) {
                    for (var k in pastData) {
                        if (k in data && pastData[k] == data[k]) _database.ref("Users/" + k).remove();
                    }
                }
                pastData = data;
                checkForDropouts = false;
            }
        });

        setInterval(function () {
            counter = counter % 60 + 1;
            _database.ref("Users/" + _this.state.userName).set(counter);
            if (counter % 4 == 0) checkForDropouts = true;
        }, 500);

        onbeforeunload = function onbeforeunload() {
            return _database.ref("Users/" + _this.state.userName).remove();
        };
        return _this;
    }

    _createClass(XmasGame, [{
        key: "setName",
        value: function setName(e) {
            e.preventDefault();

            var userName = e.target.elements.userName.value;
            if (userName) {
                _database.ref("Users/" + this.state.userName).remove();
                this.setState(function () {
                    return { userName: userName };
                });
                this.state.userName = userName;
                e.target.elements.userName.value = "";
                _database.ref("Users/" + userName).set(1);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            return React.createElement(
                "div",
                { style: { margin: 20 } },
                React.createElement(
                    "form",
                    { onSubmit: this.setName },
                    React.createElement("input", { type: "text", name: "userName" }),
                    React.createElement(
                        "button",
                        null,
                        "Aceptar Nombre"
                    )
                ),
                React.createElement(
                    "div",
                    { style: { display: "flex", flexWrap: "wrap" } },
                    this.state.allUserNames.map(function (name) {
                        return React.createElement(Player, { key: name, name: name, isActualUser: name == _this2.state.userName });
                    })
                )
            );
        }
    }]);

    return XmasGame;
}(React.Component);

var Player = function (_React$Component2) {
    _inherits(Player, _React$Component2);

    function Player(props) {
        _classCallCheck(this, Player);

        return _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, props));
    }

    _createClass(Player, [{
        key: "render",
        value: function render() {
            var name = this.props.name;
            var isActualUser = this.props.isActualUser;
            var redStyle = {
                color: "red"
            };
            var playerStyle = {
                // margin:20
            };
            var imageStyle = {
                height: "auto",
                width: "30%",
                position: "relative",
                left: "10%"
            };

            return React.createElement(
                "div",
                { style: playerStyle },
                React.createElement(
                    "h1",
                    { style: isActualUser ? redStyle : undefined },
                    name
                ),
                React.createElement("img", { src: "./Sprites/Player.png", style: imageStyle })
            );
        }
    }]);

    return Player;
}(React.Component);

ReactDOM.render(React.createElement(XmasGame, null), document.getElementById("app"));
