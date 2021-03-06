const Reducer = require('../reducer.js').Reducer;

class Fealty extends Reducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, (player, card) => {
            return card.isLoyal();
        });
    }

    setupCardAbilities() {
        this.action({
            title: 'Kneel your faction card',
            method: 'onClick'
        });
    }

    onClick(player) {
        player.kneelCard(player.faction);

        this.game.addMessage('{0} uses {1} to kneel their faction card and reduce the cost of the next loyal card by 1', player, this);
    }

    canReduce(player, card) {
        if(this.controller !== player || !player.faction.kneeled || this.abilityUsed) {
            return false;
        }

        return this.condition(player, card);
    }

    reduce(card, currentCost, spending) {
        if(this.controller.faction.kneeled && !this.abilityUsed) {
            var cost = currentCost - this.reduceBy;

            if(spending) {
                this.abilityUsed = true;
            }

            if(cost < 0) {
                cost = 0;
            }

            return cost;
        }

        return currentCost;
    }
}

Fealty.code = '01027';

module.exports = Fealty;
