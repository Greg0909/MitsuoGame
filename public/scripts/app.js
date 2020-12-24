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

var Player = function (_React$Component) {
    _inherits(Player, _React$Component);

    function Player(props) {
        _classCallCheck(this, Player);

        var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, props));

        _this.setName = _this.setName.bind(_this);
        var initialUserName = DefaultName + "_" + (Math.floor(Math.random() * 1000) + 1);
        _database.ref("Users/" + initialUserName).set(counter);

        _this.state = {
            userName: initialUserName,
            allUserNames: [initialUserName, "UwU"]
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
                        if (k in data && pastData[k] == data[k]) console.log("delete:", k);
                    }
                }
                pastData = data;
                checkForDropouts = false;
            }
        });
        setInterval(function () {
            counter = counter % 60 + 1;
            _database.ref("Users/" + initialUserName).set(counter);
            if (counter % 2 == 0) checkForDropouts = true;
        }, 500);
        window.onbeforeunload = function () {
            return _database.ref("Users/" + _this.state.userName).remove();
        };
        return _this;
    }

    _createClass(Player, [{
        key: "setName",
        value: function setName(e) {
            e.preventDefault();

            var userName = e.target.elements.userName.value;
            if (userName) {
                _database.ref("Users/" + this.state.userName).remove();
                this.setState(function () {
                    return { userName: userName };
                });
                e.target.elements.userName.value = "";
                _database.ref("Users/" + userName).set(1);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var redStyle = {
                color: "red"
            };
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
                this.state.allUserNames.map(function (name) {
                    return React.createElement(
                        "h1",
                        { key: name, style: name == _this2.state.userName ? redStyle : undefined },
                        name
                    );
                })
            );
        }
    }]);

    return Player;
}(React.Component);

ReactDOM.render(React.createElement(Player, null), document.getElementById("app"));
