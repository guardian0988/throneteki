const DrawCard = require('../../../drawcard.js');

class ViserysTargaryen extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardLeftPlay: (e, player, card) => card === this
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => card.getType() === 'attachment',
                    activePromptTitle: 'Select an attachment to discard',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, attachment) {
        attachment.owner.discardCard(attachment);

        this.game.addMessage('{0} uses {1} to discard {2}', player, this, attachment);

        return true;
    }
}

ViserysTargaryen.code = '01167';

module.exports = ViserysTargaryen;
