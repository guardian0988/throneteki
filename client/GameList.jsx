import React from 'react';
import {connect} from 'react-redux';
import _ from 'underscore';

import Avatar from './Avatar.jsx';
import * as actions from './actions';

class InnerGameList extends React.Component {
    constructor() {
        super();

        this.joinGame = this.joinGame.bind(this);
    }

    joinGame(event, game) {
        event.preventDefault();

        this.props.socket.emit('joingame', game.id);
    }

    canWatch(game) {
        return !this.props.currentGame && game.allowSpectators;
    }

    watchGame(event, game) {
        event.preventDefault();

        this.props.socket.emit('watchgame', game.id);
    }

    render() {
        var gameList = _.map(this.props.games, game => {
            var sides = _.map(game.players, player => {
                return (
                    <div className='col-md-5'>
                        <Avatar emailHash={player.emailHash} />
                        <span>{ player.name }</span>
                    </div>
                );
            });

            var gameLayout = undefined;

            if(sides.length === 2) {
                gameLayout = <div>{ sides[0] }<span className='col-md-2'><b> vs </b></span>{ sides[1] }</div>;
            } else {
                gameLayout = <div>{ sides[0] }</div>;
            }

            return (
                <div key={ game.id } className='game-row'>
                    { (this.props.currentGame || game.players.length === 2 || game.started) ?
                        null :
                        <button className='btn btn-primary pull-right' onClick={ event => this.joinGame(event, game) }>Join</button>
                    }
                    {this.canWatch(game) ?
                        <button className='btn btn-primary pull-right' onClick={event => this.watchGame(event, game)}>Watch</button> : null}
                    <div><b>{ game.name }</b></div>
                    { gameLayout }
                </div>
            );
        });

        return (
            <div className='game-list'>
                { gameList }
            </div>);
    }
}

InnerGameList.displayName = 'GameList';
InnerGameList.propTypes = {
    currentGame: React.PropTypes.object,
    games: React.PropTypes.array,
    joinGame: React.PropTypes.func,
    socket: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        currentGame: state.games.currentGame,
        socket: state.socket.socket
    };
}

const GameList = connect(mapStateToProps, actions)(InnerGameList);

export default GameList;

