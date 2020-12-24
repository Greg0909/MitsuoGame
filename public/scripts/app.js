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
        _this.restartGift = _this.restartGift.bind(_this);
        _this.onClickGift = _this.onClickGift.bind(_this);

        var initialUserName = DefaultName + "_" + (Math.floor(Math.random() * 1000) + 1);
        _database.ref("Users/" + initialUserName).set(counter);

        // Estados iniciales
        _this.state = {
            userName: initialUserName,
            allUserNames: [initialUserName],
            clickCount: 100,
            turno: "???"
        };

        // Borra a los usuarios que no han incrementado su contador
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

        // Cuando el turno cambia se mueve el regalo al persoanje
        // que tiene el turno. el siguiente turno es decidido de 
        // manera aleatoria por el usuario actual que tenia el 
        // turno previo.
        _database.ref('Gift/turno').on('value', function (snapshot) {

            if (_this.state.allUserNames.length > 1 && snapshot.val() == _this.state.userName) {

                var randIndex = 0;
                do {
                    randIndex = Math.floor(_this.state.allUserNames.length * Math.random());
                } while (_this.state.allUserNames[randIndex] == _this.state.userName);

                var timeoutMilliseconds = (Math.floor(Math.random() * 4) + 2) * 1000;
                setTimeout(function () {
                    if (_this.state.clickCount != 0) _database.ref("Gift/turno").set(_this.state.allUserNames[randIndex]);
                }, timeoutMilliseconds);
                console.log("timeout:", timeoutMilliseconds);
            }

            _this.setState(function () {
                return { turno: snapshot.val() };
            });
        });

        // Cuando el contador de click cambia se refreshea 
        // su state para vovler a hacer el render.
        _database.ref('Gift/count').on('value', function (snapshot) {
            _this.setState(function () {
                return { clickCount: snapshot.val() };
            });
        });

        // Cada 500 milisegundos aumenta un contador unico de cada usuario
        // como evidencia de que siguen conectados.
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
        key: "restartGift",
        value: function restartGift(e) {
            e.preventDefault();

            var inputClickCount = e.target.elements.maxClickCount.value;
            var maxClickCount = 100;
            if (inputClickCount) maxClickCount = inputClickCount;

            _database.ref("Gift/count").set(maxClickCount);
            _database.ref("Gift/turno").set("");
            _database.ref("Gift/turno").set(this.state.userName);
            this.setState(function () {
                return {
                    clickCount: maxClickCount
                };
            });
        }
    }, {
        key: "onClickGift",
        value: function onClickGift() {
            if (this.state.clickCount >= 1) _database.ref("Gift/count").set(this.state.clickCount - 1);
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
                    "form",
                    { onSubmit: this.restartGift },
                    React.createElement("input", { type: "text", name: "maxClickCount" }),
                    React.createElement(
                        "button",
                        null,
                        "Start/Restart Game"
                    )
                ),
                React.createElement(
                    "div",
                    { style: { display: "flex", flexWrap: "wrap" } },
                    this.state.allUserNames.map(function (name) {
                        return React.createElement(Player, {
                            key: name,
                            name: name,
                            isActualUser: name == _this2.state.userName,
                            clickCount: _this2.state.clickCount,
                            hasGift: name == _this2.state.turno
                        });
                    })
                ),
                this.state.userName == this.state.turno && this.state.clickCount != 0 && React.createElement(GiftButton, {
                    onClickGift: this.onClickGift,
                    clickCount: this.state.clickCount
                }),
                this.state.clickCount == 0 && React.createElement(WinMessage, { winner: this.state.turno })
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
                //marginRight:"-38%",
                width: "50%"
            };
            var imageStyle = {
                height: "auto",
                width: "100%",
                position: "relative",
                left: "10%"
            };

            return React.createElement(
                "div",
                { style: { width: "30%", margin: "20px" } },
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "h1",
                        { style: isActualUser ? redStyle : undefined },
                        name
                    )
                ),
                React.createElement(
                    "div",
                    { style: { display: "flex" } },
                    React.createElement(
                        "div",
                        { style: playerStyle },
                        React.createElement("img", { src: "./Sprites/Player.png", style: imageStyle })
                    ),
                    React.createElement(
                        "div",
                        { style: { position: "relative", width: "30%" } },
                        React.createElement(Gift, {
                            hasGift: this.props.hasGift,
                            clickCount: this.props.clickCount
                        })
                    )
                )
            );
        }
    }]);

    return Player;
}(React.Component);

var Gift = function (_React$Component3) {
    _inherits(Gift, _React$Component3);

    function Gift(props) {
        _classCallCheck(this, Gift);

        return _possibleConstructorReturn(this, (Gift.__proto__ || Object.getPrototypeOf(Gift)).call(this, props));
    }

    _createClass(Gift, [{
        key: "render",
        value: function render() {
            var imageStyle = {
                width: "100%",
                height: "auto"

            };
            var mainDivStyle = {
                position: "absolute",
                bottom: "0px"
            };

            var hasGift = this.props.hasGift;
            var giftTemplate = React.createElement(
                "div",
                { style: mainDivStyle },
                React.createElement(
                    "h2",
                    null,
                    this.props.clickCount
                ),
                React.createElement("img", { src: "./Sprites/Gift.png", style: imageStyle })
            );
            var emptyTemplate = React.createElement("div", null);
            return hasGift ? giftTemplate : emptyTemplate;
        }
    }]);

    return Gift;
}(React.Component);

var GiftButton = function (_React$Component4) {
    _inherits(GiftButton, _React$Component4);

    function GiftButton(props) {
        _classCallCheck(this, GiftButton);

        return _possibleConstructorReturn(this, (GiftButton.__proto__ || Object.getPrototypeOf(GiftButton)).call(this, props));
    }

    _createClass(GiftButton, [{
        key: "render",
        value: function render() {
            var textStyle = {
                textAlign: "center"
            };
            return React.createElement(
                "div",
                { className: "centered" },
                React.createElement(
                    "h1",
                    { style: textStyle },
                    "Click Me!!!"
                ),
                React.createElement(
                    "h1",
                    { style: textStyle },
                    this.props.clickCount,
                    " Clicks to Open"
                ),
                React.createElement("img", { onClick: this.props.onClickGift, style: { display: "block", marginLeft: "auto", marginRight: "auto" }, src: "./Sprites/Gift.png" })
            );
        }
    }]);

    return GiftButton;
}(React.Component);

var WinMessage = function (_React$Component5) {
    _inherits(WinMessage, _React$Component5);

    function WinMessage(props) {
        _classCallCheck(this, WinMessage);

        return _possibleConstructorReturn(this, (WinMessage.__proto__ || Object.getPrototypeOf(WinMessage)).call(this, props));
    }

    _createClass(WinMessage, [{
        key: "render",
        value: function render() {
            var textStyle = {
                textAlign: "center"
            };
            return React.createElement(
                "div",
                { className: "centered" },
                React.createElement(
                    "h1",
                    { style: textStyle },
                    "The Winner is"
                ),
                React.createElement(
                    "h1",
                    { style: textStyle },
                    this.props.winner,
                    " !!!"
                )
            );
        }
    }]);

    return WinMessage;
}(React.Component);

ReactDOM.render(React.createElement(XmasGame, null), document.getElementById("app"));
